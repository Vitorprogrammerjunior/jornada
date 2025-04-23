
import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle2, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Phase } from "@/types";

interface TimelineItemProps {
  phase: Phase;
  isLeft: boolean;
  getPhaseStatus: (phase: Phase) => { status: string; label: string; class: string };
  getPhaseProgress: (phase: Phase) => number;
  formatDate: (date: Date) => string;
  getPhaseIcon: (order: number) => React.ReactNode;
}

const TimelineItem = ({ 
  phase, 
  isLeft, 
  getPhaseStatus, 
  getPhaseProgress, 
  formatDate, 
  getPhaseIcon 
}: TimelineItemProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  
  const phaseStatus = getPhaseStatus(phase);
  const progress = getPhaseProgress(phase);
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  const variants = {
    hidden: { 
      opacity: 0, 
      x: isLeft ? -50 : 50 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.7, 
        ease: "easeOut" 
      }
    }
  };

  return (
    <div className="flex justify-center items-center relative">
      {/* Timeline node */}
      <div className={`absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10 ${
        phaseStatus.status === "active" 
          ? "bg-amber-500 animate-pulse" 
          : phaseStatus.status === "completed" 
            ? "bg-green-500" 
            : "bg-slate-200"
      }`}>
        {phaseStatus.status === "completed" ? (
          <CheckCircle2 className="h-5 w-5 text-white" />
        ) : (
          <span className="text-white font-bold">{phase.order}</span>
        )}
      </div>
      
      {/* Content */}
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={variants}
        className={`w-5/12 ${isLeft ? 'pr-16' : 'pl-16'} ${isLeft ? 'text-right' : 'text-left'}`}
      >
        <Card className={`border-l-4 ${
          phaseStatus.status === "active" 
            ? "border-l-amber-500" 
            : phaseStatus.status === "completed" 
              ? "border-l-green-500" 
              : "border-l-slate-300"
        } overflow-hidden hover:shadow-md transition-shadow duration-300`}>
          <CardHeader className={`pb-3 ${isLeft ? 'text-right' : 'text-left'}`}>
            <div className="flex items-center justify-between">
              <div className={`flex items-center ${isLeft ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                {getPhaseIcon(phase.order)}
                <CardTitle className="text-lg font-bold">
                  Fase {phase.order}: {phase.name}
                </CardTitle>
              </div>
              <div className={phaseStatus.class}>
                {phaseStatus.label}
              </div>
            </div>
            <CardDescription>{phase.description}</CardDescription>
          </CardHeader>
          <CardContent className={`${isLeft ? 'text-right' : 'text-left'}`}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="text-slate-500">Início:</span>
                </div>
                <div>{formatDate(phase.startDate)}</div>
                
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-red-600" />
                  <span className="text-slate-500">Término:</span>
                </div>
                <div>{formatDate(phase.endDate)}</div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progresso</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full rounded-full ${
                      phaseStatus.status === "active" 
                        ? "bg-amber-500" 
                        : phaseStatus.status === "completed" 
                          ? "bg-green-500" 
                          : "bg-slate-300"
                    }`}
                  />
                </div>
              </div>
              
              {phaseStatus.status === "active" && (
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Acessar Atividades
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TimelineItem;
