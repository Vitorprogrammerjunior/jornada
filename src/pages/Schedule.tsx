import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock as ClockIcon,
  FileText,
  Flag,
  Award,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import TimelineItem from "@/components/timeline/TimelineItem";
import { Phase } from "@/types";
import { scheduleService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const SchedulePage: React.FC = () => {
  const [socketStatus, setSocketStatus] = useState<boolean>(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch phases and normalize isActive
  const {
    data: phases,
    isLoading,
    error
  } = useQuery<Phase[], Error>({
    queryKey: ["schedule"],
    queryFn: async () => {
      const res = await scheduleService.getSchedule();
      return res.phases
        .map(p => ({ ...p, isActive: Boolean(p.isActive) }))
        .sort((a, b) => a.orderNum - b.orderNum);
    },
    onError: err =>
      toast({
        title: "Erro ao carregar cronograma",
        description: err.message,
        variant: "destructive"
      })
  });

  // Determine if no phase is active
  const noActive = phases ? phases.every(p => !p.isActive) : false;

  // Determine index of the active phase
  const activeIndex = phases?.findIndex(p => p.isActive) ?? -1;

  // Socket.IO connection for real-time updates
  useEffect(() => {
    const socket: Socket = io("http://localhost:5000", { transports: ["websocket"] });
    setSocketStatus(socket.connected);
    socket.on("connect", () => setSocketStatus(true));
    socket.on("disconnect", () => setSocketStatus(false));

    socket.on("phaseUpdated", (updatedPhase: Phase) => {
      const normalized = { ...updatedPhase, isActive: Boolean(updatedPhase.isActive) };
      queryClient.setQueryData<Phase[]>(["schedule"], old =>
        old ? old.map(p => (p.id === normalized.id ? normalized : p)) : [normalized]
      );
      toast({
        title: "Cronograma atualizado",
        description: `Fase ${normalized.name} atualizada.`,
        variant: "default"
      });
    });

    return () => socket.disconnect();
  }, [queryClient, toast]);

  // Status based on index relative to active phase
  const getPhaseStatus = (phase: Phase, index: number) => {
    if (index === activeIndex) {
      return { status: "active", label: "Em andamento", class: "bg-amber-600 text-white" };
    }
    if (index < activeIndex) {
      return { status: "completed", label: "Concluída", class: "bg-green-600 text-white" };
    }
    return { status: "upcoming", label: "Não iniciada", class: "text-slate-600 border-slate-600" };
  };

  // Calculate progress only for the active phase
  const getPhaseProgress = (phase: Phase) => {
    if (!phase.isActive) return 0;
    const start = new Date(phase.startDate).getTime();
    const end = new Date(phase.endDate).getTime();
    const now = Date.now();
    const total = end - start;
    const passed = now - start;
    return Math.min(Math.max(Math.round((passed / total) * 100), 0), 100);
  };

  const formatDate = (date: Date | string) =>
    new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(
      new Date(date)
    );

  const getPhaseIcon = (order: number) => {
    switch (order) {
      case 1:
        return <Flag className="h-6 w-6 text-green-600" />;
      case 2:
        return <FileText className="h-6 w-6 text-blue-600" />;
      case 3:
        return <FileText className="h-6 w-6 text-indigo-600" />;
      case 4:
        return <FileText className="h-6 w-6 text-purple-600" />;
      case 5:
        return <Calendar className="h-6 w-6 text-red-600" />;
      case 6:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <ClockIcon className="h-6 w-6 text-slate-600" />;
    }
  };

  return (
    <MainLayout>
      {isLoading ? (
        <div className="flex justify-center items-center h-full p-6">
          <Loader2 className="h-10 w-10 text-green-600 animate-spin mb-4" />
          <p className="text-lg text-green-700">Carregando cronograma...</p>
        </div>
      ) : error ? (
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <h2 className="text-lg font-medium mb-2">Erro ao carregar o cronograma</h2>
            <p>Ocorreu um erro ao tentar obter os dados do cronograma. Por favor, tente novamente.</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
              Tentar novamente
            </Button>
          </div>
        </div>
      ) : noActive ? (
        <div className="flex justify-center items-center h-full p-6">
          <p className="text-xl text-gray-700">Temporariamente desativado, volte mais tarde</p>
        </div>
      ) : (
        <div className="p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center"
          >
            <h1 className="text-2xl font-bold text-green-800">Cronograma da Jornada</h1>
            <div className="flex items-center space-x-2">
              <Badge className="text-green-600 bg-green-100 border-green-600" variant={socketStatus ? "outline" : "destructive"}>
                {socketStatus ? "WS: Conectado" : "WS: Desconectado"}
              </Badge>
              <Badge variant="outline" className="text-green-600 bg-green-100 border-green-600">
                <ClockIcon className="h-3 w-3 mr-1 " /> Cronograma em tempo real
              </Badge>
            </div>
          </motion.div>
          <div className="relative py-8">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-500 via-blue-500 to-purple-500 rounded-full" />
            <div className="flex flex-col space-y-24">
              {phases?.map((phase, idx) => {
                const { status, label, class: statusClass } = getPhaseStatus(phase, idx);
                return (
                  <TimelineItem
                    key={phase.id}
                    phase={{ ...phase, status, label, statusClass }}
                    isLeft={idx % 2 === 0}
                    getPhaseStatus={() => ({ status, label, class: statusClass })}
                    getPhaseProgress={getPhaseProgress}
                    formatDate={formatDate}
                    getPhaseIcon={() => getPhaseIcon(phase.orderNum)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default SchedulePage;
