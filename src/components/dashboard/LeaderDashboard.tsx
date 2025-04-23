
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  UserPlus, 
  FileText, 
  Users, 
  Clock, 
  Calendar,
  Upload,
  CheckCircle2, 
  XCircle,
  FileUp
} from "lucide-react";
import { toast, Toaster } from 'sonner';
import { 
  mockUsers, 
  mockGroups, 
  mockPhases, 
  mockJoinRequests,
  mockSubmissions,
  getCurrentPhase,
  getUserById
} from "@/data/mockData";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label"
import { JoinRequest, Submission } from "@/types";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { groupService } from "@/services/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";


const coursesMap: Record<string,string> = {
  "ENG": "Engenharia",
  "ADM": "Administração",
  "DIR": "Direito",
  "MED": "Medicina",
  "PSI": "Psicologia"
};

const LeaderDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userGroup, setUserGroup] = useState<any>(
    () => user && mockGroups.find(g => g.leaderId === user.id)
  );
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [periodSemester, setPeriodSemester] = useState<number>(1);
  const [isCreating, setIsCreating] = useState(false);
  
  
  const currentPhase = getCurrentPhase();
  // Depois de obter userGroup...
  const groupMembers = userGroup?.members ?? [];
  const pendingRequests = userGroup
  ? mockJoinRequests.filter(req => req.groupId === userGroup.id && req.status === "pending")
  : [];


  // Get group submissions
  const groupSubmissions = userGroup 
    ? mockSubmissions.filter(sub => sub.groupId === userGroup.id) 
    : [];
  
  // Format date function
  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };
  
  // Handle join request
  const handleJoinRequest = (request: JoinRequest, approve: boolean) => {
    alert(`Solicitação ${approve ? 'aprovada' : 'rejeitada'} com sucesso!`);
  };
  
  // Handle submission
  const handleSubmission = (submission: Submission) => {
    alert("Envio de trabalho realizado com sucesso!");
  };
 
  
  // Calculate phase progress
  const calculatePhaseProgress = (phase: { startDate: Date, endDate: Date }) => {
    const now = new Date();
    const start = new Date(phase.startDate);
    const end = new Date(phase.endDate);
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end.getTime() - start.getTime();
    const current = now.getTime() - start.getTime();
    
    return Math.round((current / total) * 100);
  };
  
  // Check if submission exists for a phase
  const hasSubmission = (phaseId: string) => {
    return groupSubmissions.some(sub => sub.phaseId === phaseId);
  };
  
  // Get submission for a phase
  const getSubmission = (phaseId: string): Submission | undefined => {
    return groupSubmissions.find(sub => sub.phaseId === phaseId);
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
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
      // handleResponse já dispara toast de erro
    } finally {
      setIsCreating(false);
    }
  };

  if (!userGroup) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Criar Grupo</CardTitle>
              <CardDescription>
                Crie seu grupo para participar da Jornada Fluxo Digital
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleCreateGroup}>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Nome do Grupo</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Digite o nome do grupo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Descrição</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o foco do seu grupo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Curso</label>
                  <Select
                    value={courseId}
                    onValueChange={(v) => setCourseId(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(coursesMap).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Período</label>
                  <Input
                    type="number"
                    min={1}
                    value={periodSemester}
                    onChange={(e) => setPeriodSemester(+e.target.value)}
                    placeholder="Ex: 5"
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
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard do Líder</h1>
        <div className="flex items-center">
          <span className="text-sm text-slate-500 mr-2">
            {currentPhase ? (
              <>Fase atual: <span className="font-medium text-blue-600">{currentPhase.name}</span></>
            ) : (
              "Nenhuma fase ativa no momento"
            )}
          </span>
          <Badge className="bg-green-600">Líder de Grupo</Badge>
        </div>
      </div>

      {/* Group Info Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{userGroup.name}</CardTitle>
              <CardDescription className="mt-1">{userGroup.description}</CardDescription>
            </div>
            <Badge className="bg-blue-600">
              {groupMembers.length} membros
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current Phase Progress */}
            {currentPhase && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-700">
                    Progresso da Fase Atual
                  </span>
                  <span className="text-slate-500">
                    {calculatePhaseProgress(currentPhase)}%
                  </span>
                </div>
                <Progress value={calculatePhaseProgress(currentPhase)} className="h-2" />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Início: {formatDate(currentPhase.startDate)}</span>
                  <span>Término: {formatDate(currentPhase.endDate)}</span>
                </div>
              </div>
            )}

            {/* Submission Status for Current Phase */}
            {currentPhase && (
              <div className="mt-4">
                {hasSubmission(currentPhase.id) ? (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-600">Entrega Realizada</AlertTitle>
                    <AlertDescription className="text-green-600">
                      Sua entrega para a fase {currentPhase.name} foi realizada em{' '}
                      {formatDate(getSubmission(currentPhase.id)?.submittedAt as Date)}.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="bg-amber-50 border-amber-200">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-600">Entrega Pendente</AlertTitle>
                    <AlertDescription className="text-amber-600">
                      Você ainda não realizou a entrega para a fase {currentPhase.name}.
                      A data limite é {formatDate(currentPhase.endDate)}.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="mt-4 flex justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button disabled={hasSubmission(currentPhase.id)}>
                        <Upload className="h-4 w-4 mr-2" />
                        {hasSubmission(currentPhase.id) ? 'Já Entregue' : 'Enviar Entrega'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Enviar Entrega</DialogTitle>
                        <DialogDescription>
                          Envie o arquivo para a fase {currentPhase.name}.
                          Somente arquivos PDF são aceitos.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <form onSubmit={hasSubmission}>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="file">Arquivo</Label>
                            <div className="flex items-center justify-center w-full">
                              <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <FileUp className="w-8 h-8 mb-3 text-blue-600" />
                                  <p className="mb-2 text-sm text-blue-600 font-medium">
                                    Clique para selecionar um arquivo
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    PDF (MAX. 10MB)
                                  </p>
                                </div>
                                <input id="file-upload" type="file" className="hidden" accept=".pdf" />
                              </label>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="comment">Comentários (opcional)</Label>
                            <Textarea id="comment" placeholder="Comentários sobre a entrega..." />
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Enviando...' : 'Enviar Entrega'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Group Management */}
      <Tabs defaultValue="members">
        <TabsList className="mb-4">
          <TabsTrigger value="members">Membros</TabsTrigger>
          <TabsTrigger value="requests">Solicitações</TabsTrigger>
          <TabsTrigger value="submissions">Entregas</TabsTrigger>
        </TabsList>
        
        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Membros do Grupo</CardTitle>
              <CardDescription>
                Gerencie os membros do seu grupo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupMembers.map(member => (
                  <div key={member.id} className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-blue-50">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-slate-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {member.id === userGroup.leaderId ? (
                        <Badge className="bg-green-600">Líder</Badge>
                      ) : (
                        <Badge variant="outline" className="text-blue-600 border-blue-600">Membro</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Entrada</CardTitle>
              <CardDescription>
                Alunos que solicitaram entrar no seu grupo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhuma solicitação pendente.</p>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map(request => {
                    const requestUser = getUserById(request.userId);
                    return requestUser ? (
                      <div key={request.id} className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 rounded-full bg-blue-50">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{requestUser.name}</p>
                            <p className="text-sm text-slate-500">{requestUser.email}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
                            onClick={() => handleJoinRequest(request, false)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeitar
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleJoinRequest(request, true)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Aprovar
                          </Button>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Código de Convite</CardTitle>
              <CardDescription>
                Compartilhe este código para alunos entrarem no seu grupo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="bg-blue-50 text-blue-800 font-mono text-lg p-3 rounded-md">
                  {userGroup.id.slice(0, 6).toUpperCase()}
                </div>
                <Button variant="outline">
                  Copiar Código
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Submissions Tab */}
        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Entregas</CardTitle>
              <CardDescription>
                Todas as entregas realizadas pelo grupo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {groupSubmissions.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhuma entrega realizada.</p>
              ) : (
                <div className="space-y-4">
                  {groupSubmissions.map(submission => {
                    const phase = mockPhases.find(p => p.id === submission.phaseId);
                    return phase ? (
                      <div key={submission.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{phase.name}</h3>
                            <p className="text-sm text-slate-500">
                              Enviado em {formatDate(submission.submittedAt)}
                            </p>
                          </div>
                          <div className="flex items-center">
                            {submission.grade ? (
                              <Badge className={submission.grade >= 70 ? "bg-green-600" : "bg-amber-600"}>
                                Nota: {submission.grade}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-amber-600 border-amber-600">
                                Aguardando Avaliação
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-4 flex flex-col sm:flex-row sm:justify-between text-sm">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-1 text-blue-600" />
                            <a href={submission.fileUrl} className="text-blue-600 hover:underline">
                              Ver Arquivo
                            </a>
                          </div>
                          
                          {submission.feedback && (
                            <div className="mt-2 sm:mt-0">
                              <p className="font-medium text-slate-700">Feedback:</p>
                              <p className="text-slate-600">{submission.feedback}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Próximas Entregas</CardTitle>
              <CardDescription>
                Fases futuras e datas de entrega
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPhases
                  .filter(phase => new Date(phase.startDate) > new Date() || phase.isActive)
                  .sort((a, b) => a.order - b.order)
                  .map(phase => (
                    <div key={phase.id} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{phase.order}. {phase.name}</p>
                        <p className="text-sm text-slate-500">{phase.description}</p>
                      </div>
                      <div className="text-sm text-slate-500">
                        {phase.isActive ? (
                          <Badge className="bg-amber-600">Em Andamento</Badge>
                        ) : (
                          <span>Inicia em: {formatDate(phase.startDate)}</span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaderDashboard;
