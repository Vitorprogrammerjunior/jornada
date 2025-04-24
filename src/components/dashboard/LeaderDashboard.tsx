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
import {
  Upload,
  FileUp,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  groupService,
  submissionService,
  // scheduleService, // se for usar API em vez do mock
} from "@/services/api";
import { mockPhases, getCurrentPhase } from "@/data/mockData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const coursesMap: Record<string, string> = {
  ENG: "Engenharia",
  ADM: "Administração",
  DIR: "Direito",
  MED: "Medicina",
  PSI: "Psicologia",
};

const LeaderDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Estado do grupo
  const [userGroup, setUserGroup] = useState<any>(null);
  const [isLoadingGroup, setIsLoadingGroup] = useState(true);

  // Form de criação
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [periodSemester, setPeriodSemester] = useState<number>(1);
  const [isCreating, setIsCreating] = useState(false);

  // Fases (pode vir de API)
  const [phases, setPhases] = useState<typeof mockPhases>([]);
  const currentPhase = getCurrentPhase();

  // Membros e join-requests
  const groupMembers = userGroup?.members ?? [];
  const pendingRequests = userGroup
    ? userGroup.joinRequests?.filter((r: any) => r.status === "pending")
    : [];

  // Submissions
  const groupSubmissions = userGroup?.submissions ?? [];

  // formatação de data
  const formatDate = (d: Date) => format(d, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  // ------------------------
  // Montagem: buscar grupo + fases
  // ------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1) carregar grupos e encontrar o seu
        const { groups } = await groupService.getAllGroups();
        const myGroup = groups.find((g: any) => g.leaderId === user.id);
        if (myGroup) {
          setUserGroup(myGroup);
        }
        // 2) carregar fases (mock ou API)
        // const { phases: apiPhases } = await scheduleService.getSchedule();
        // setPhases(apiPhases);
        setPhases(mockPhases);
      } catch {
        // erros já tratados no handleResponse
      } finally {
        setIsLoadingGroup(false);
      }
    };
    fetchData();
  }, [user.id]);

  // ------------------------
  // Criar grupo
  // ------------------------
  const handleCreateGroup = async (e: FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const { group } = await groupService.createGroup({
        name,
        description,
        courseId,
        periodSemester,
      });
      setUserGroup(group);
      toast.success("Grupo criado com sucesso!");
    } catch {
      // erro já notificado
    } finally {
      setIsCreating(false);
    }
  };

  // ------------------------
  // Enviar submissão de fase
  // ------------------------
  const handleFileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const commentInput = form.elements.namedItem("comment") as HTMLTextAreaElement;
    const file = fileInput.files?.[0];
    if (!file) {
      toast.error("Por favor, selecione um PDF.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("phaseId", currentPhase.id);
    formData.append("groupId", userGroup.id);
    formData.append("comment", commentInput.value);

    try {
      await submissionService.submitFile(formData);
      toast.success("Entrega enviada com sucesso!");
      // opcional: atualizar groupSubmissions no estado
    } catch {
      // handleResponse já dispara toast
    }
  };

  // ------------------------
  // Progressão e status de envio
  // ------------------------
  const calculatePhaseProgress = (phase: any) => {
    const now = Date.now();
    const start = new Date(phase.startDate).getTime();
    const end = new Date(phase.endDate).getTime();
    if (now < start) return 0;
    if (now > end) return 100;
    return Math.round(((now - start) / (end - start)) * 100);
  };
  const hasSubmission = (phaseId: string) =>
    groupSubmissions.some((s: any) => s.phaseId === phaseId);

  // ------------------------
  // Render
  // ------------------------
  if (isLoadingGroup) {
    return <p>Carregando...</p>;
  }

  // Form de criação
  if (!userGroup) {
    return (
      <div className="p-6">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Criar Grupo</CardTitle>
            <CardDescription>
              Crie seu grupo para participar da Jornada Fluxo Digital
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <Label>Nome do Grupo</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Curso</Label>
                <Input
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Período</Label>
                <Input
                  type="number"
                  min={1}
                  value={periodSemester}
                  onChange={(e) => setPeriodSemester(+e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={isCreating} className="w-full">
                {isCreating ? "Criando..." : "Criar Grupo"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dashboard de fases e submissão
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{userGroup.name}</CardTitle>
              <CardDescription>{userGroup.description}</CardDescription>
            </div>
            <Badge className="bg-blue-600">
              {groupMembers.length} membros
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Lista de fases */}
      <div className="space-y-4">
        {phases.map((phase) => {
          const isCurrent = phase.id === currentPhase.id;
          return (
            <Card key={phase.id}>
              <CardContent className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {phase.order}. {phase.name}
                    {isCurrent && (
                      <Badge className="ml-2 bg-amber-600">Atual</Badge>
                    )}
                  </p>
                  <p className="text-sm text-slate-500">
                    {formatDate(new Date(phase.startDate))} —{" "}
                    {formatDate(new Date(phase.endDate))}
                  </p>
                </div>
                {isCurrent && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button leftIcon={<Upload />}>
                        {hasSubmission(phase.id)
                          ? "Já enviado"
                          : "Enviar entrega"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Enviar entrega</DialogTitle>
                        <DialogDescription>
                          Fase: {phase.name} (até{" "}
                          {formatDate(new Date(phase.endDate))})
                        </DialogDescription>
                      </DialogHeader>

                      <form
                        onSubmit={handleFileSubmit}
                        className="space-y-4 py-4"
                      >
                        <div>
                          <Label htmlFor="file-upload">Arquivo (PDF)</Label>
                          <input
                            id="file-upload"
                            name="file"
                            type="file"
                            accept=".pdf"
                            className="block mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="comment">
                            Comentário (opcional)
                          </Label>
                          <Textarea id="comment" name="comment" />
                        </div>
                        <DialogFooter>
                          <Button
                            type="submit"
                            disabled={hasSubmission(phase.id)}
                          >
                            Enviar
                          </Button>
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
