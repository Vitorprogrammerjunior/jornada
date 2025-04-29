import { useState, useEffect, FormEvent } from "react";
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
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { groupService, submissionService, groupRequestService } from "@/services/api";
import { mockPhases, getCurrentPhase } from "@/data/mockData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

  const currentPhase = getCurrentPhase();
  const groupMembers = userGroup?.members ?? [];
  const groupSubmissions = userGroup?.submissions ?? [];

  const hasSubmission = (phaseId: string) =>
    groupSubmissions.some((s: any) => s.phaseId === phaseId);

  const formatDate = (date: Date) =>
    format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { groups } = await groupService.getAllGroups();
        console.log("🔄 All groups:", groups);
        const myGroup = groups.find((g: any) => g.leaderId === user.id);
        console.log("👑 My group:", myGroup);
        if (myGroup) {
          setUserGroup(myGroup);
          const { requests } = await groupRequestService.getJoinRequestsByGroup(
            myGroup.id
          );
          console.log("📝 Pending requests:", requests);
          setPendingRequests(requests);
        }
        setPhases(mockPhases);
      } catch (err) {
        console.error(err);
        toast({ title: "Erro", description: "Não foi possível carregar dados.", variant: "destructive" });
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
      toast({ title: "Sucesso", description: "Grupo criado!" });
    } catch {
      toast({ title: "Erro", description: "Falha ao criar grupo.", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  const handleFileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const commentInput = form.elements.namedItem("comment") as HTMLTextAreaElement;
    const file = fileInput.files?.[0];
    if (!file) return toast({ title: "Erro", description: "Selecione um PDF.", variant: "destructive" });
    const formData = new FormData();
    formData.append("file", file);
    formData.append("phaseId", currentPhase.id);
    formData.append("groupId", userGroup.id);
    formData.append("comment", commentInput.value);
    try {
      await submissionService.submitFile(formData);
      toast({ title: "Sucesso", description: "Entrega enviada!" });
    } catch {
      toast({ title: "Erro", description: "Falha ao enviar entrega.", variant: "destructive" });
    }
  };

  const handleRespondRequest = async (requestId: string, action: "approved" | "rejected") => {
    try {
      await groupRequestService.respondJoinRequest(userGroup.id, requestId, action);
      toast({ title: "Sucesso", description: `Solicitação ${action === "approved" ? "aprovada" : "rejeitada"}` });
      const { requests } = await groupRequestService.getJoinRequestsByGroup(userGroup.id);
      console.log("📝 Updated requests:", requests);
      setPendingRequests(requests);
    } catch {
      toast({ title: "Erro", description: "Falha ao responder.", variant: "destructive" });
    }
  };

  if (isLoading) return <p>Carregando...</p>;

  if (!userGroup) {
    return (
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
              <Input
                type="number"
                min={1}
                value={periodSemester}
                onChange={e => setPeriodSemester(+e.target.value)}
                required
              />
              <Button type="submit" className="w-full" disabled={isCreating}>
                {isCreating ? "Criando..." : "Criar Grupo"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{userGroup.name}</CardTitle>
              <CardDescription>{userGroup.description}</CardDescription>
            </div>
            <Badge className="bg-blue-600">{groupMembers.length} membros</Badge>
          </div>
        </CardHeader>
      </Card>

      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Solicitações Pendentes</CardTitle>
            <CardDescription>Gerencie quem quer entrar no grupo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingRequests.map(req => (
              <div key={req.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{req.name}</p>
                  <p className="text-xs text-slate-500">{req.email}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleRespondRequest(req.id, "approved")}>Aceitar</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleRespondRequest(req.id, "rejected")}>Rejeitar</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {phases.map(phase => {
          const isCurrent = phase.id === currentPhase.id;
          return (
            <Card key={phase.id}>
              <CardContent className="flex justify-between items-center">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    <span>{phase.order}. {phase.name}</span>
                    {isCurrent && <Badge className="bg-amber-600">Atual</Badge>}
                  </div>
                  <p className="text-sm text-slate-500">
                    {formatDate(new Date(phase.startDate))} — {formatDate(new Date(phase.endDate))}
                  </p>
                </div>
                {isCurrent && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Upload className="w-4 h-4 mr-2" />
                        {hasSubmission(phase.id) ? "Já enviado" : "Enviar entrega"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Enviar entrega</DialogTitle>
                        <DialogDescription>Fase: {phase.name}</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleFileSubmit} className="space-y-4 py-4">
                        <Label htmlFor="file-upload">Arquivo (PDF)</Label>
                        <input id="file-upload" name="file" type="file" accept=".pdf" className="block mt-1" required />
                        <Label htmlFor="comment">Comentário (opcional)</Label>
                        <Textarea id="comment" name="comment" />
                        <DialogFooter>
                          <Button type="submit" disabled={hasSubmission(phase.id)}>Enviar</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LeaderDashboard;
