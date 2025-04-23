
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
  SearchIcon,
  CheckCircle2, 
  Clock3
} from "lucide-react";
import { 
  mockUsers, 
  mockGroups, 
  mockPhases, 
  getCurrentPhase,
  mockSubmissions
} from "@/data/mockData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [groupCodeInput, setGroupCodeInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get user's group
  const userGroup = user && user.groupId 
    ? mockGroups.find(group => group.id === user.groupId) 
    : null;
  
  // Get current phase
  const currentPhase = getCurrentPhase();
  
  // Format date function
  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };
  
  // Filter groups for search
  const filteredGroups = searchQuery 
    ? mockGroups.filter(group => 
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockGroups;
  
  // Request to join group
  const requestToJoinGroup = (groupId: string) => {
    alert(`Solicitação para entrar no grupo enviada com sucesso! Aguarde a aprovação do líder.`);
  };
  
  // Join with code
  const joinWithCode = () => {
    if (groupCodeInput.length < 5) {
      alert("Por favor, insira um código válido");
      return;
    }
    
    alert(`Solicitação com código ${groupCodeInput} enviada com sucesso! Aguarde a aprovação do líder.`);
    setGroupCodeInput("");
  };
  
  // Request leader role
  const requestLeaderRole = () => {
    alert(`Solicitação para se tornar líder enviada com sucesso! Aguarde a aprovação do coordenador.`);
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
  
  // Get group submissions
  const groupSubmissions = userGroup 
    ? mockSubmissions.filter(sub => sub.groupId === userGroup.id) 
    : [];

  // If user doesn't have a group, show group joining options
  if (!userGroup) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Encontrar Grupo</h1>
          <div className="flex items-center">
            <Button 
              variant="outline" 
              className="mr-2"
              onClick={requestLeaderRole}
            >
              Solicitar Ser Líder
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Entrar em um Grupo</CardTitle>
            <CardDescription>
              Participe de um grupo existente para a Jornada Fluxo Digital
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Entrar com Código de Convite</h3>
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Digite o código do grupo" 
                    value={groupCodeInput}
                    onChange={(e) => setGroupCodeInput(e.target.value)}
                  />
                  <Button onClick={joinWithCode}>Entrar</Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  className="pl-10"
                  placeholder="Buscar grupos por nome ou descrição"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <h3 className="font-medium">Grupos Disponíveis</h3>
              
              {filteredGroups.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhum grupo encontrado.</p>
              ) : (
                <div className="space-y-4">
                  {filteredGroups.map(group => {
                    const leader = mockUsers.find(user => user.id === group.leaderId);
                    return (
                      <div key={group.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{group.name}</h3>
                            <p className="text-sm text-slate-500">{group.description}</p>
                            {leader && (
                              <p className="text-sm mt-1">
                                <span className="text-slate-600">Líder:</span> {leader.name}
                              </p>
                            )}
                          </div>
                          <Badge className="bg-blue-600">
                            {group.members.length} membros
                          </Badge>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => requestToJoinGroup(group.id)}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Solicitar Entrada
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get group leader
  const groupLeader = mockUsers.find(u => u.id === userGroup.leaderId);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard do Aluno</h1>
        <div className="flex items-center">
          <span className="text-sm text-slate-500 mr-2">
            {currentPhase ? (
              <>Fase atual: <span className="font-medium text-blue-600">{currentPhase.name}</span></>
            ) : (
              "Nenhuma fase ativa no momento"
            )}
          </span>
          <Badge className="bg-blue-600">Membro do Grupo</Badge>
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
              {userGroup.members.length} membros
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Group Leader */}
            <div>
              <p className="text-sm font-medium text-slate-700">Líder do Grupo:</p>
              {groupLeader && (
                <div className="flex items-center mt-1">
                  <div className="p-2 rounded-full bg-green-50">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="ml-2">{groupLeader.name}</span>
                </div>
              )}
            </div>

            {/* Current Phase Progress */}
            {currentPhase && (
              <div className="space-y-2 mt-4">
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
                {groupSubmissions.some(sub => sub.phaseId === currentPhase.id) ? (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-600">Entrega Realizada</AlertTitle>
                    <AlertDescription className="text-green-600">
                      Seu grupo já realizou a entrega para a fase atual.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="bg-amber-50 border-amber-200">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-600">Entrega Pendente</AlertTitle>
                    <AlertDescription className="text-amber-600">
                      Seu grupo ainda não realizou a entrega para a fase atual.
                      Consulte o líder do grupo para mais informações.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Group Info and Submissions */}
      <Tabs defaultValue="members">
        <TabsList className="mb-4">
          <TabsTrigger value="members">Membros</TabsTrigger>
          <TabsTrigger value="phases">Fases</TabsTrigger>
          <TabsTrigger value="submissions">Entregas</TabsTrigger>
        </TabsList>
        
        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Membros do Grupo</CardTitle>
              <CardDescription>
                Todos os participantes do seu grupo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userGroup.members.map(member => (
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
          
          <Card>
            <CardHeader>
              <CardTitle>Solicitar Papel de Líder</CardTitle>
              <CardDescription>
                Solicite para se tornar um líder de grupo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Líderes de grupo podem criar novos grupos, gerenciar membros e são responsáveis pelas entregas.
                Sua solicitação será analisada pelo coordenador.
              </p>
              <Button 
                variant="outline"
                onClick={requestLeaderRole}
              >
                Solicitar Papel de Líder
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Phases Tab */}
        <TabsContent value="phases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cronograma da Jornada</CardTitle>
              <CardDescription>
                Fases e datas importantes da Jornada Fluxo Digital
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPhases.map(phase => {
                  const isActive = phase.isActive;
                  const isPast = new Date(phase.endDate) < new Date();
                  const isFuture = new Date(phase.startDate) > new Date();
                  
                  return (
                    <div 
                      key={phase.id} 
                      className={`flex justify-between items-center p-3 border rounded-md ${
                        isActive ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div>
                        <p className="font-medium">{phase.order}. {phase.name}</p>
                        <p className="text-sm text-slate-500">{phase.description}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="mb-1">
                          {isActive && (
                            <Badge className="bg-blue-600">Atual</Badge>
                          )}
                          {isPast && !isActive && (
                            <Badge variant="outline" className="text-green-600 border-green-600">Concluída</Badge>
                          )}
                          {isFuture && (
                            <Badge variant="outline" className="text-slate-600 border-slate-600">Futura</Badge>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">
                          <div>{formatDate(phase.startDate)} a {formatDate(phase.endDate)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Submissions Tab */}
        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Entregas do Grupo</CardTitle>
              <CardDescription>
                Histórico de entregas realizadas pelo seu grupo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {groupSubmissions.length === 0 ? (
                <p className="text-sm text-slate-500">Seu grupo ainda não realizou nenhuma entrega.</p>
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
              <CardTitle>Prazos de Entrega</CardTitle>
              <CardDescription>
                Próximas entregas e respectivos prazos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPhases
                  .filter(phase => new Date(phase.endDate) >= new Date())
                  .sort((a, b) => a.order - b.order)
                  .map(phase => {
                    const daysLeft = Math.ceil(
                      (new Date(phase.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    );
                    const submission = groupSubmissions.find(s => s.phaseId === phase.id);
                    
                    return (
                      <div key={phase.id} className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <p className="font-medium">{phase.order}. {phase.name}</p>
                          <p className="text-sm text-slate-500">Prazo: {formatDate(phase.endDate)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {submission ? (
                            <Badge className="bg-green-600">Entregue</Badge>
                          ) : (
                            <div className="flex items-center">
                              <Clock3 className="h-4 w-4 mr-1 text-amber-600" />
                              <span className="text-amber-600 text-sm">{daysLeft} dias restantes</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
