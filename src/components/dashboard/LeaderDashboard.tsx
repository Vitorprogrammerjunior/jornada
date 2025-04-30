import React, { useState, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Upload, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { groupService, submissionService, groupRequestService } from "@/services/api";
import { mockPhases, getCurrentPhase } from "@/data/mockData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Animation variants
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const LeaderDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [userGroup, setUserGroup] = useState<any>(null);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [phases, setPhases] = useState(mockPhases);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [periodSemester, setPeriodSemester] = useState<number>(1);
  const [score, setScore] = useState<number>(0);

  const currentPhase = getCurrentPhase();
  const members = userGroup?.members ?? [];
  const submissions = userGroup?.submissions ?? [];

  const hasSubmission = (phaseId: string) => submissions.some((s: any) => s.phaseId === phaseId);
  const formatDate = (date: Date) => format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  // Use phases as tasks
  const tasks = phases.map(phase => ({
    id: phase.id,
    title: `${phase.order}. ${phase.name}`,
    description: `${formatDate(new Date(phase.startDate))} — ${formatDate(new Date(phase.endDate))}`,
    done: hasSubmission(phase.id),
    isCurrent: phase.id === currentPhase.id,
    action: () => console.log(`open-phase-${phase.id}`)
  }));

  useEffect(() => {
    setScore(Math.floor(Math.random() * 1000));
    const fetchData = async () => {
      try {
        const { groups } = await groupService.getAllGroups();
        const myGroup = groups.find((g: any) => g.leaderId === user.id);
        if (myGroup) {
          setUserGroup(myGroup);
          const { requests } = await groupRequestService.getJoinRequestsByGroup(myGroup.id);
          setPendingRequests(requests);
        }
        setPhases(mockPhases);
      } catch (err) {
        console.error(err);
        toast({ title: 'Erro', description: 'Não foi possível carregar dados.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user.id, toast]);

  const handleCreateGroup = async (e: FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const { group } = await groupService.createGroup({ name, description, courseId, periodSemester });
      setUserGroup(group);
      toast({ title: 'Sucesso', description: 'Grupo criado!' });
    } catch {
      toast({ title: 'Erro', description: 'Falha ao criar grupo.', variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleFileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem('file') as HTMLInputElement;
    const commentInput = form.elements.namedItem('comment') as HTMLTextAreaElement;
    const file = fileInput.files?.[0];
    if (!file) return toast({ title: 'Erro', description: 'Selecione um PDF.', variant: 'destructive' });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('phaseId', currentPhase.id);
    formData.append('groupId', userGroup.id);
    formData.append('comment', commentInput.value);
    try {
      await submissionService.submitFile(formData);
      toast({ title: 'Sucesso', description: 'Entrega enviada!' });
    } catch {
      toast({ title: 'Erro', description: 'Falha ao enviar entrega.', variant: 'destructive' });
    }
  };

  const handleRespondRequest = async (requestId: string, action: 'approved' | 'rejected') => {
    try {
      await groupRequestService.respondJoinRequest(userGroup.id, requestId, action);
      toast({ title: 'Sucesso', description: `Solicitação ${action === 'approved' ? 'aprovada' : 'rejeitada'}` });
      const { requests } = await groupRequestService.getJoinRequestsByGroup(userGroup.id);
      setPendingRequests(requests);
    } catch {
      toast({ title: 'Erro', description: 'Falha ao responder.', variant: 'destructive' });
    }
  };

  if (isLoading) return <p>Carregando...</p>;
  if (!userGroup) return (
    <div className="p-6">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Criar Grupo</CardTitle>
          <CardDescription>Preencha os dados do seu grupo</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateGroup} className="space-y-4">
            <Label>Nome</Label>
            <Input value={name} onChange={e => setName(e.target.value)} required />
            <Label>Descrição</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} required />
            <Label>Curso</Label>
            <Input value={courseId} onChange={e => setCourseId(e.target.value)} required />
            <Label>Período</Label>
            <Input type="number" min={1} value={periodSemester} onChange={e => setPeriodSemester(+e.target.value)} required />
            <Button type="submit" className="w-full" disabled={isCreating}>{isCreating ? 'Criando...' : 'Criar Grupo'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <motion.div className="p-6 space-y-6" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item}>
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white relative overflow-hidden">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <motion.div className="absolute -top-2 -right-2 text-yellow-300" animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Crown size={24} />
                </motion.div>
              </div>
              <div>
                <CardTitle className="text-xl">Olá, {user.name}!</CardTitle>
                <p className="opacity-80">Bem-vindo ao seu Dashboard</p>
                <Badge className="mt-2 bg-yellow-400 text-black">Pontuação: {score}</Badge>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Members */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Membros do Grupo <Badge  className="bg-blue-600 text-white px-3 py-0.5 text-xs">{members.length}</Badge></CardTitle>
            
          </CardHeader>
          <CardContent>
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4" variants={container}>
              {members.map(m => (
                <motion.div key={m.id} variants={item} className="hover:shadow-xl transition-shadow rounded-lg">
                  <CardContent className="flex flex-col items-center text-center p-4">
                    <Avatar className="mb-2">
                      <AvatarImage src={m.avatarUrl} alt={m.name} />
                      <AvatarFallback>{m.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-medium">{m.name}</h3>
                    <Badge variant="outline" className="mt-1">{m.role}</Badge>
                    <Progress value={m.progress} className="w-full mt-3" />
                    <p className="mt-1 text-sm">{m.progress}% concluído</p>
                  </CardContent>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Solicitações Pendentes</CardTitle>
              <CardDescription>Gerencie solicitações de entrada</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingRequests.map(req => (
                <div key={req.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{req.name}</p>
                    <p className="text-xs text-slate-500">{req.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleRespondRequest(req.id, 'approved')}>Aceitar</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleRespondRequest(req.id, 'rejected')}>Rejeitar</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Phases as Tasks */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Fases da Jornada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.map(t => (
              <motion.div key={t.id} variants={item} className={`flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 ${t.isCurrent ? 'border-2 border-indigo-500 bg-gray-50' : 'bg-white'}`} whileHover={{ scale: 1.02 }}>
                <div>
                  <h4 className="font-medium">{t.title}</h4>
                  <p className="text-sm opacity-80">{t.description}</p>
                </div>
                <Button size="sm" variant={t.done ? 'secondary' : 'primary'} onClick={t.action}>
                  {t.done ? 'Concluída' : 'Ir'}
                </Button>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default LeaderDashboard;
