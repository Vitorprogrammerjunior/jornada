
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Users, 
  UserPlus, 
  FileText, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  XCircle 
} from "lucide-react";
import { 
  mockUsers, 
  mockGroups, 
  mockPhases, 
  mockJoinRequests, 
  mockLeaderRequests 
} from "@/data/mockData";
import { toast, Toaster } from 'sonner';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LeaderRequest, JoinRequest, UserRole, Phase } from "@/types";
import { useEffect, useState } from "react";
import { userService } from "@/services/api"; // ajuste o path se for diferen

const CoordinatorDashboard = () => {
  // Filter users by role
  const [pendingUsuarios, setPendingUsuarios] = useState<any[]>([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const leaderUsers = mockUsers.filter(user => user.role === "leader");
  const studentUsers = mockUsers.filter(user => user.role === "student");
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);


  useEffect(() => {
    const fetchPendingUsuarios = async () => {
      try {
        const data = await userService.getPendingUsers();
        setPendingUsuarios(data.users);
      } catch (error) {
        console.error("Erro ao buscar usuários pendentes:", error);
      } finally {
        setLoadingPending(false);
      }
    };
  
    fetchPendingUsuarios();
  }, []);
  
  const handleUserApproval = async (userId: string, approve: boolean) => {
    try {
      if (approve) {
        await userService.approveUser(userId);
        toast.success("Usuário aprovado com sucesso!");
      } else {
        await userService.rejectUser(userId);
        toast.success("Usuário rejeitado com sucesso!");
      }
      setPendingUsuarios((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Erro ao atualizar status do usuário:", error);
    }
  };
  
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await userService.getAllUsers();
        setUsuarios(data.users);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      } finally {
        setLoadingUsuarios(false);
      }
    };
  
    fetchUsuarios();
  }, []);
  
  // Get current phase
  const currentPhase = mockPhases.find(phase => phase.isActive);
  
  // Format date function
  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };
  
  // Helper function to render role badge
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "coordinator":
        return <Badge className="bg-blue-600">Coordenador</Badge>;
      case "leader":
        return <Badge className="bg-green-600">Líder</Badge>;
      case "student":
        return <Badge className="bg-slate-600">Aluno</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-amber-600 border-amber-600">Pendente</Badge>;
      case "inactive":
        return <Badge variant="outline" className="text-red-600 border-red-600">Inativo</Badge>;
      default:
        return null;
    }
  };
  
  // Render status badge for requests
  const getStatusBadge = (status: "pending" | "approved" | "rejected") => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-amber-600 border-amber-600">Pendente</Badge>;
      case "approved":
        return <Badge className="bg-green-600">Aprovado</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejeitado</Badge>;
      default:
        return null;
    }
  };
  
  // Helper function to display phase status
  const getPhaseStatus = (phase: Phase) => {
    const now = new Date();
    if (now < phase.startDate) {
      return <Badge variant="outline" className="text-slate-600 border-slate-600">Não iniciada</Badge>;
    } else if (now > phase.endDate) {
      return <Badge variant="outline" className="text-green-600 border-green-600">Concluída</Badge>;
    } else {
      return <Badge className="bg-amber-600">Em andamento</Badge>;
    }
  };
  
  // Handle leader request
  const handleLeaderRequest = (request: LeaderRequest, approve: boolean) => {
    alert(`Solicitação de líder ${approve ? 'aprovada' : 'rejeitada'} com sucesso!`);
  };
  
  // Handle join request
  const handleJoinRequest = (request: JoinRequest, approve: boolean) => {
    alert(`Solicitação de entrada no grupo ${approve ? 'aprovada' : 'rejeitada'} com sucesso!`);
  };
  
  // Handle user approval

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard do Coordenador</h1>
        <span className="text-sm text-slate-500">
          {currentPhase ? (
            <>Fase atual: <span className="font-medium text-blue-600">{currentPhase.name}</span></>
          ) : (
            "Nenhuma fase ativa no momento"
          )}
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{loadingUsuarios ? '...' : usuarios.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Grupos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">{mockGroups.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Fase Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-amber-600" />
              <span className="text-2xl font-bold">{currentPhase ? currentPhase.order : "-"}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
  <CardHeader className="pb-2">
    <CardTitle className="text-sm font-medium text-slate-500">
      Aprovações Pendentes
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex items-center space-x-2">
      <FileText className="h-5 w-5 text-red-600" />
      <span className="text-2xl font-bold">
        {loadingPending
          ? "..."
          : pendingUsuarios.length === 0
          ? "Nenhum"
          : pendingUsuarios.length}
      </span>
    </div>
  </CardContent>
</Card>

      </div>

      {/* Main Content */}
      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="leaders">Líderes</TabsTrigger>
          <TabsTrigger value="groups">Grupos</TabsTrigger>
          <TabsTrigger value="phases">Fases</TabsTrigger>
        </TabsList>
        
        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
        <Card>
  <CardHeader>
    <CardTitle>Usuários Pendentes</CardTitle>
    <CardDescription>
      Novos usuários aguardando aprovação
    </CardDescription>
  </CardHeader>
  <CardContent>
    {loadingPending ? (
      <p className="text-sm text-slate-500">Carregando usuários pendentes...</p>
    ) : pendingUsuarios.length === 0 ? (
      <p className="text-sm text-slate-500">Nenhum usuário pendente.</p>
    ) : (
      <div className="space-y-4">
        {pendingUsuarios.map((user) => (
          <div key={user.id} className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-blue-50">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
                onClick={() => handleUserApproval(user.id, false)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Rejeitar
              </Button>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleUserApproval(user.id, true)}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Aprovar
              </Button>
            </div>
          </div>
        ))}
      </div>
    )}
  </CardContent>
</Card>

          
          <Card>
  <CardHeader>
    <CardTitle>Todos os Usuários</CardTitle>
    <CardDescription>
      Lista de todos os usuários registrados
    </CardDescription>
  </CardHeader>
  <CardContent>
    {loadingUsuarios ? (
      <p className="text-sm text-slate-500">Carregando usuários...</p>
    ) : usuarios.length === 0 ? (
      <p className="text-sm text-slate-500">Nenhum usuário encontrado.</p>
    ) : (
      <div className="space-y-4">
        {usuarios.map((user) => (
          <div key={user.id} className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-blue-50">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                onClick={() => alert(`Editar usuário ${user.name}`)}
              >
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
                onClick={() => alert(`Excluir usuário ${user.name}`)}
              >
                Excluir
              </Button>
            </div>
          </div>
        ))}
      </div>
    )}
  </CardContent>
</Card>

        </TabsContent>
        
        {/* Leaders Tab */}
        <TabsContent value="leaders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Líder</CardTitle>
              <CardDescription>
                Alunos que solicitaram ser líderes de grupo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockLeaderRequests.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhuma solicitação pendente.</p>
              ) : (
                <div className="space-y-4">
                  {mockLeaderRequests.map(request => {
                    const user = mockUsers.find(u => u.id === request.userId);
                    return user ? (
                      <div key={request.id} className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 rounded-full bg-green-50">
                            <User className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div>
                            {getStatusBadge(request.status)}
                            <span className="ml-2 text-xs text-slate-500">
                              Solicitado em {formatDate(request.requestedAt)}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
                              onClick={() => handleLeaderRequest(request, false)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Rejeitar
                            </Button>
                            <Button 
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleLeaderRequest(request, true)}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Aprovar
                            </Button>
                          </div>
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
              <CardTitle>Líderes de Grupo</CardTitle>
              <CardDescription>
                Alunos que são líderes de grupo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {leaderUsers.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhum líder registrado.</p>
              ) : (
                <div className="space-y-4">
                  {leaderUsers.map(user => {
                    const group = mockGroups.find(g => g.leaderId === user.id);
                    return (
                      <div key={user.id} className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 rounded-full bg-green-50">
                            <User className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {group && (
                            <Badge className="bg-blue-600">
                              Líder: {group.name}
                            </Badge>
                          )}
                          <span className="text-xs text-slate-500">
                            {group?.members.length || 0} membros
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Groups Tab */}
        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Entrada em Grupo</CardTitle>
              <CardDescription>
                Alunos que solicitaram entrar em um grupo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockJoinRequests.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhuma solicitação pendente.</p>
              ) : (
                <div className="space-y-4">
                  {mockJoinRequests.map(request => {
                    const user = mockUsers.find(u => u.id === request.userId);
                    const group = mockGroups.find(g => g.id === request.groupId);
                    return user && group ? (
                      <div key={request.id} className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 rounded-full bg-blue-50">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-slate-500">
                              Solicitou entrada em <strong>{group.name}</strong>
                            </p>
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
              <CardTitle>Grupos Ativos</CardTitle>
              <CardDescription>
                Todos os grupos da jornada
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockGroups.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhum grupo registrado.</p>
              ) : (
                <div className="space-y-4">
                  {mockGroups.map(group => {
                    const leader = mockUsers.find(u => u.id === group.leaderId);
                    return (
                      <div key={group.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-lg">{group.name}</h3>
                            <p className="text-sm text-slate-500">{group.description}</p>
                          </div>
                          <Badge className="bg-green-600">
                            {group.members.length} membros
                          </Badge>
                        </div>
                        
                        <div className="mt-4">
                          <p className="text-sm font-medium text-slate-700">Líder:</p>
                          <div className="flex items-center mt-1">
                            <div className="p-1 rounded-full bg-green-50">
                              <User className="h-4 w-4 text-green-600" />
                            </div>
                            <span className="ml-2 text-sm">{leader?.name}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <p className="text-sm font-medium text-slate-700">Membros:</p>
                          <div className="mt-2 space-y-1">
                            {group.members.map(member => (
                              <div key={member.id} className="flex items-center">
                                <div className="p-1 rounded-full bg-blue-50">
                                  <User className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="ml-2 text-sm">{member.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Phases Tab */}
        <TabsContent value="phases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cronograma de Fases</CardTitle>
              <CardDescription>
                Gerenciamento das fases da jornada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPhases.map(phase => (
                  <div key={phase.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium text-lg">
                            {phase.order}. {phase.name}
                          </h3>
                          <div className="ml-3">
                            {getPhaseStatus(phase)}
                          </div>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          {phase.description}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          Editar Datas
                        </Button>
                        {phase.isActive ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-amber-600 border-amber-200 hover:border-amber-300 hover:bg-amber-50"
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Encerrar Fase
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-green-600 border-green-200 hover:border-green-300 hover:bg-green-50"
                            disabled={phase.order !== (currentPhase ? currentPhase.order + 1 : 1)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Iniciar Fase
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-slate-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-blue-600" />
                        <span>Início: {formatDate(phase.startDate)}</span>
                      </div>
                      <div className="flex items-center mt-1 sm:mt-0">
                        <Calendar className="h-4 w-4 mr-1 text-red-600" />
                        <span>Término: {formatDate(phase.endDate)}</span>
                      </div>
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

export default CoordinatorDashboard;
