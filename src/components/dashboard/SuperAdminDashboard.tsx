// src/components/dashboard/SuperAdminDashboard.tsx
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Users as UsersIcon,
  UserPlus,
  CheckCircle2,
  XCircle,
  Calendar as CalendarIcon,
} from "lucide-react";

import { userService, scheduleService } from "@/services/api";
import { User, Phase } from "@/types";

export const SuperAdminDashboard = () => {
  const queryClient = useQueryClient();

  // 1) Buscar todos os usuários
  const {
    data: users = [],
    isLoading: loadingUsers,
    error: usersError,
  } = useQuery<User[], Error>({
    queryKey: ["superadmin", "users"],
    queryFn: async () => {
      const res = await userService.getAllUsers();
      return res.users;
    },
  });

  // 2) Buscar cronograma de fases
  const {
    data: phases = [],
    isLoading: loadingPhases,
    error: phasesError,
  } = useQuery<Phase[], Error>({
    queryKey: ["superadmin", "phases"],
    queryFn: async () => {
      const res = await scheduleService.getSchedule();
      return res.phases;
    },
  });

  // 3) Mutação para iniciar fase, agora com datas
  const {
    mutate: startPhase,
    isLoading: startingPhase,
  } = useMutation({
    mutationFn: (vars: { phaseId: string; startDate: string; endDate: string }) =>
      scheduleService.updatePhase(vars.phaseId, {
        isActive: true,
        startDate: vars.startDate,
        endDate: vars.endDate,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["superadmin", "phases"] }),
  });

  // 4) Mutação para finalizar fase (mantém só toggle)
  const {
    mutate: finishPhase,
    isLoading: finishingPhase,
  } = useMutation({
    mutationFn: (phaseId: string) =>
      scheduleService.updatePhase(phaseId, { isActive: false }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["superadmin", "phases"] }),
  });

  // estado do modal de edição de datas
  const [editingPhase, setEditingPhase] = useState<Phase | null>(null);
  const [tmpStart, setTmpStart] = useState("");
  const [tmpEnd, setTmpEnd] = useState("");

  useEffect(() => {
    document.title = "SuperAdmin | Jornada Fluxo Digital";
  }, []);

  if (loadingUsers || loadingPhases)
    return <p className="p-6">Carregando…</p>;
  if (usersError)
    return <p className="p-6 text-red-600">Erro: {usersError.message}</p>;
  if (phasesError)
    return <p className="p-6 text-red-600">Erro: {phasesError.message}</p>;

  const totalUsers = users.length;
  const totalCoordinators = users.filter(u => u.role === "coordinator").length;
  const totalLeaders = users.filter(u => u.role === "leader").length;
  const totalPending = users.filter(u => u.role === "pending").length;

  const formatDateStr = (d: string) =>
    format(new Date(d), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-right" />

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader><CardTitle>Total de Usuários</CardTitle></CardHeader>
          <CardContent className="flex items-center space-x-2">
            <UsersIcon className="h-5 w-5 text-blue-600" />
            <span className="text-2xl font-bold">{totalUsers}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Coordenadores</CardTitle></CardHeader>
          <CardContent className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5 text-green-600" />
            <span className="text-2xl font-bold">{totalCoordinators}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Líderes</CardTitle></CardHeader>
          <CardContent className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-amber-600" />
            <span className="text-2xl font-bold">{totalLeaders}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pendentes</CardTitle></CardHeader>
          <CardContent className="flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <span className="text-2xl font-bold">{totalPending}</span>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="phases">Fases</TabsTrigger>
        </TabsList>

        {/* Usuários */}
        <TabsContent value="users" className="space-y-4">
          {users.map(u => (
            <div
              key={u.id}
              className="flex items-center justify-between border-b pb-3"
            >
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-slate-500">{u.email}</p>
              </div>
              <Badge
                className={
                  u.role === "superadmin" ? "bg-purple-600" :
                  u.role === "coordinator" ? "bg-blue-600" :
                  u.role === "leader"      ? "bg-green-600" :
                  u.role === "student"     ? "bg-slate-600" :
                                            "variant-outline text-amber-600 border-amber-600"
                }
              >
                {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
              </Badge>
            </div>
          ))}
        </TabsContent>

        {/* Fases */}
        <TabsContent value="phases" className="space-y-4">
          {phases.map(phase => {
            const activePhase = phases.find(p => p.isActive);
            const activeOrder = activePhase?.order ?? 0;
            let statusBadge;
            if (phase.isActive) {
              statusBadge = <Badge className="bg-amber-600">Em andamento</Badge>;
            } else if (phase.order < activeOrder) {
              statusBadge = <Badge variant="outline" className="text-green-600 border-green-600">Concluída</Badge>;
            } else {
              statusBadge = <Badge variant="outline" className="text-slate-600 border-slate-600">Não iniciada</Badge>;
            }

            return (
              <Card key={phase.id}>
                <CardHeader className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <CardTitle>{phase.order}. {phase.name}</CardTitle>
                    {statusBadge}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-sm text-slate-600">
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-4 w-4 text-blue-600" />
                    <span>Início: {formatDateStr(phase.startDate)}</span>
                  </div>
                  <div className="flex items-center space-x-1 mt-2 sm:mt-0">
                    <CalendarIcon className="h-4 w-4 text-red-600" />
                    <span>Término: {formatDateStr(phase.endDate)}</span>
                  </div>
                  <div className="mt-4 sm:mt-0 flex space-x-2">
                    {phase.isActive ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => finishPhase(phase.id)}
                        disabled={finishingPhase}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Finalizar
                      </Button>
                    ) : (
                      <Dialog
                        open={editingPhase?.id === phase.id}
                        onOpenChange={open => {
                          if (!open) setEditingPhase(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => {
                              setEditingPhase(phase);
                              setTmpStart(phase.startDate.slice(0,10));
                              setTmpEnd(phase.endDate.slice(0,10));
                            }}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Iniciar
                          </Button>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Definir datas para "{phase.name}"</DialogTitle>
                          </DialogHeader>

                          <form
                            className="space-y-4"
                            onSubmit={e => {
                              e.preventDefault();
                              if (!editingPhase) return;
                              startPhase({
                                phaseId: editingPhase.id,
                                startDate: tmpStart,
                                endDate: tmpEnd,
                              });
                              setEditingPhase(null);
                            }}
                          >
                            <div className="space-y-2">
                              <Label htmlFor="start">Data de Início</Label>
                              <Input
                                id="start"
                                name="start"
                                type="date"
                                value={tmpStart}
                                onChange={e => setTmpStart(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="end">Data de Término</Label>
                              <Input
                                id="end"
                                name="end"
                                type="date"
                                value={tmpEnd}
                                onChange={e => setTmpEnd(e.target.value)}
                                required
                              />
                            </div>

                            <DialogFooter>
                              <Button type="submit" disabled={startingPhase}>
                                {startingPhase ? "Aguarde..." : "Confirmar"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminDashboard;
