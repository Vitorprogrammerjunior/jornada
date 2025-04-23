import { useEffect, useState } from "react";
import { toast, Toaster } from 'sonner';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  User, Users, UserPlus, FileText,
  Clock, Calendar, CheckCircle2, XCircle
} from "lucide-react";

import { LeaderRequest, JoinRequest, UserRole, Phase } from "@/types";
import { userService, leaderRequestService   } from "@/services/api";
import { mockGroups, mockPhases } from "@/data/mockData";

const CoordinatorDashboard = () => {
  // ### Estados
  const [pendingUsuarios, setPendingUsuarios] = useState<any[]>([]);
  const [loadingPending, setLoadingPending] = useState(true);

  const [leaderRequests, setLeaderRequests] = useState<LeaderRequest[]>([]);
  const [loadingLeader, setLoadingLeader] = useState(true);

  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);

const [loadingLeaderReq, setLoadingLeaderReq] = useState(true);

useEffect(() => {
  const fetchLeaderRequests = async () => {
    try {
      const data = await leaderRequestService.getAllLeaderRequests();
      setLeaderRequests(data.requests);
    } catch (err) {
      console.error("Erro ao buscar solicitações de líder:", err);
    } finally {
      setLoadingLeaderReq(false);
    }
  };
  fetchLeaderRequests();
}, []);

// …

// handler recebe só o id


  // Mock de joinRequests ainda permanece, se quiser integrar depois
  // const mockJoinRequests = ...

  // ### Efeitos de carregamento
  // Usuários pendentes
  useEffect(() => {
    userService.getPendingUsers()
      .then(data => setPendingUsuarios(data.users))
      .catch(console.error)
      .finally(() => setLoadingPending(false));
  }, []);

  // Pedidos de liderança


  // Todos os usuários
  useEffect(() => {
    userService.getAllUsers()
      .then(data => setUsuarios(data.users))
      .catch(console.error)
      .finally(() => setLoadingUsuarios(false));
  }, []);

  // ### Handlers
  const handleUserApproval = async (userId: string, approve: boolean) => {
    try {
      if (approve) {
        await userService.approveUser(userId);
        toast.success("Usuário aprovado com sucesso!");
      } else {
        await userService.rejectUser(userId);
        toast.success("Usuário rejeitado com sucesso!");
      }
      setPendingUsuarios(prev => prev.filter(u => u.id !== userId));
      setUsuarios(prev => prev.map(u => u.id === userId
        ? { ...u, role: approve ? "student" : "inactive" }
        : u
      ));
    } catch (err) {
      console.error(err);
    }
  };

   // Handler recebe o objeto request
   const handleLeaderRequest = async (request: LeaderRequest, approve: boolean) => {
    try {
      if (approve) {
        await leaderRequestService.approveLeaderRequest(request.id.toString());
        toast.success("Solicitação de líder aprovada!");
      } else {
        await leaderRequestService.rejectLeaderRequest(request.id.toString());
        toast.success("Solicitação de líder rejeitada!");
      }
      // Remove da lista local
      setLeaderRequests(prev => prev.filter(r => r.id !== request.id));
    } catch (error) {
      console.error("Erro ao atualizar solicitação de líder:", error);
    }
  };
  

  // ### Auxiliares
  const currentPhase = mockPhases.find(p => p.isActive);
  const formatDate = (d: Date) =>
    format(d, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "coordinator": return <Badge className="bg-blue-600">Coordenador</Badge>;
      case "leader":      return <Badge className="bg-green-600">Líder</Badge>;
      case "student":     return <Badge className="bg-slate-600">Aluno</Badge>;
      case "pending":     return <Badge variant="outline" className="text-amber-600 border-amber-600">Pendente</Badge>;
      case "inactive":    return <Badge variant="outline" className="text-red-600 border-red-600">Inativo</Badge>;
    }
  };
  const getStatusBadge = (status: "pending" | "approved" | "rejected") => {
    if (status === "pending")  return <Badge variant="outline" className="text-amber-600 border-amber-600">Pendente</Badge>;
    if (status === "approved") return <Badge className="bg-green-600">Aprovado</Badge>;
    return <Badge variant="destructive">Rejeitado</Badge>;
  };
  const getPhaseStatus = (phase: Phase) => {
    const now = new Date();
    if (now < phase.startDate) return <Badge variant="outline" className="text-slate-600 border-slate-600">Não iniciada</Badge>;
    if (now > phase.endDate)  return <Badge variant="outline" className="text-green-600 border-green-600">Concluída</Badge>;
    return <Badge className="bg-amber-600">Em andamento</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard do Coordenador</h1>
        <span className="text-sm text-slate-500">
          {currentPhase
            ? <>Fase atual: <span className="font-medium text-blue-600">{currentPhase.name}</span></>
            : "Nenhuma fase ativa no momento"}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{loadingUsuarios ? "..." : usuarios.length}</span>
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
              <span className="text-2xl font-bold">{currentPhase?.order ?? "-"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Aprovações Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold">
                {loadingPending
                  ? "..."
                  : pendingUsuarios.length === 0 && leaderRequests.length === 0
                  ? "Nenhum"
                  : pendingUsuarios.length + leaderRequests.length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="leaders">Líderes</TabsTrigger>
          <TabsTrigger value="groups">Grupos</TabsTrigger>
          <TabsTrigger value="phases">Fases</TabsTrigger>
        </TabsList>

        {/* Users */}
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

        {/* Leader Requests */}
        <TabsContent value="leaders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Líder</CardTitle>
              <CardDescription>Alunos que solicitaram ser líderes de grupo</CardDescription>
            </CardHeader>
            <CardContent>
          {loadingLeaderReq ? (
            <p className="text-sm text-slate-500">Carregando solicitações…</p>
          ) : leaderRequests.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhuma solicitação pendente.</p>
          ) : (
            <div className="space-y-4">
              {leaderRequests.map(request => {
                const user = usuarios.find(u => u.id === request.userId.toString());
                return user ? (
                  <div
                    key={request.id}   /* chave única */
                    className="flex items-center justify-between border-b pb-3"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-green-50">
                        <User className="h-5 w-5 text-green-600" />
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
                ) : null;
              })}
            </div>
          )}
        </CardContent>
          </Card>

          {/* Lista de líderes ativos */}
          <Card>
            <CardHeader>
              <CardTitle>Líderes de Grupo</CardTitle>
              <CardDescription>Alunos que são líderes de grupo</CardDescription>
            </CardHeader>
            <CardContent>
              {usuarios.filter(u => u.role === "leader").length === 0 ? (
                <p className="text-sm text-slate-500">Nenhum líder registrado.</p>
              ) : (
                <div className="space-y-4">
                  {usuarios.filter(u => u.role === "leader").map(user => {
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
                          {group && <Badge className="bg-blue-600">Líder: {group.name}</Badge>}
                          <span className="text-xs text-slate-500">{group?.members.length || 0} membros</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Groups, Phases… iguais ao anterior */}
      </Tabs>
    </div>
  );
};

export default CoordinatorDashboard;
