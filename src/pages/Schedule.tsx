
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
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

const SchedulePage = () => {
  const [currentDate] = useState(new Date());
  const { toast } = useToast();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['schedule'],
    queryFn: scheduleService.getSchedule,
    select: (data) => data.phases.sort((a: Phase, b: Phase) => a.order - b.order),
    onError: (err: Error) => {
      toast({
        title: "Erro ao carregar cronograma",
        description: err.message,
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    document.title = "Cronograma | Jornada Fluxo Digital";
  }, []);

  // Get phase status
  const getPhaseStatus = (phase: Phase) => {
    const phaseStartDate = new Date(phase.startDate);
    const phaseEndDate = new Date(phase.endDate);
    
    if (currentDate < phaseStartDate) {
      return { status: "upcoming", label: "Não iniciada", class: "text-slate-600 border-slate-600" };
    } else if (currentDate > phaseEndDate) {
      return { status: "completed", label: "Concluída", class: "text-green-600 border-green-600" };
    } else {
      return { status: "active", label: "Em andamento", class: "bg-amber-600" };
    }
  };

  // Calculate phase progress
  const getPhaseProgress = (phase: Phase) => {
    const phaseStatus = getPhaseStatus(phase).status;
    const phaseStartDate = new Date(phase.startDate);
    const phaseEndDate = new Date(phase.endDate);
    
    if (phaseStatus === "upcoming") return 0;
    if (phaseStatus === "completed") return 100;
    
    // Phase is active, calculate progress
    const total = phaseEndDate.getTime() - phaseStartDate.getTime();
    const current = currentDate.getTime() - phaseStartDate.getTime();
    return Math.min(Math.round((current / total) * 100), 100);
  };

  // Format date
  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date(date));
  };
  
  // Get phase icon
  const getPhaseIcon = (order: number) => {
    switch (order) {
      case 1: return <Flag className="h-6 w-6 text-green-600" />;
      case 2: return <FileText className="h-6 w-6 text-blue-600" />;
      case 3: return <FileText className="h-6 w-6 text-indigo-600" />;
      case 4: return <FileText className="h-6 w-6 text-purple-600" />;
      case 5: return <Calendar className="h-6 w-6 text-red-600" />;
      case 6: return <Award className="h-6 w-6 text-amber-600" />;
      default: return <Clock className="h-6 w-6 text-slate-600" />;
    }
  };

  // Find active phase
  const activePhase = data?.find(phase => getPhaseStatus(phase).status === "active");

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-full p-6">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-green-600 animate-spin mb-4" />
            <p className="text-lg text-green-700">Carregando cronograma...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <h2 className="text-lg font-medium mb-2">Erro ao carregar o cronograma</h2>
            <p>Ocorreu um erro ao tentar obter os dados do cronograma. Por favor, tente novamente.</p>
            <Button 
              variant="outline" 
              className="mt-4 border-red-300 text-red-700 hover:bg-red-100"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center"
        >
          <h1 className="text-2xl font-bold text-green-800">Cronograma da Jornada</h1>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 border-green-200 text-green-800">
              <Clock className="h-3 w-3 mr-1" />
              Fase atual: {activePhase?.name || "Nenhuma"}
            </Badge>
          </div>
        </motion.div>

        <div className="relative py-8">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-500 via-blue-500 to-purple-500 rounded-full"></div>
          
          <div className="flex flex-col space-y-24">
            {data?.map((phase, index) => (
              <TimelineItem 
                key={phase.id} 
                phase={phase} 
                isLeft={index % 2 === 0}
                getPhaseStatus={getPhaseStatus}
                getPhaseProgress={getPhaseProgress}
                formatDate={formatDate}
                getPhaseIcon={getPhaseIcon}
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SchedulePage;