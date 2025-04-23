
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Plus, Clock } from "lucide-react";
import { toast } from "sonner";

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events", selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""],
    queryFn: async () => {
      // Here you would fetch events from your backend API
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: "1",
              title: "Reunião de Abertura",
              date: "2023-06-15",
              time: "09:00",
              duration: 60,
              type: "meeting",
              description: "Reunião de abertura da jornada digital"
            },
            {
              id: "2",
              title: "Workshop de Ideação",
              date: "2023-06-15",
              time: "14:00",
              duration: 120,
              type: "workshop",
              description: "Workshop para geração de ideias inovadoras"
            },
            {
              id: "3",
              title: "Entrega do Primeiro Protótipo",
              date: "2023-06-15",
              time: "23:59",
              duration: 0,
              type: "deadline",
              description: "Data limite para entrega do primeiro protótipo"
            },
            {
              id: "4",
              title: "Feedback de Mentores",
              date: "2023-06-20",
              time: "10:00",
              duration: 90,
              type: "feedback",
              description: "Sessão de feedback com mentores do programa"
            }
          ]);
        }, 1000);
      });
    },
    meta: {
      onError: (error: any) => {
        toast.error("Erro ao carregar eventos");
        console.error("Error loading events:", error);
      }
    }
  });

  const filteredEvents = selectedDate
    ? events.filter((event: any) => event.date === format(selectedDate, "yyyy-MM-dd"))
    : [];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "workshop":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "deadline":
        return "bg-red-100 text-red-700 border-red-200";
      case "feedback":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <CalendarIcon className="h-6 w-6 mr-2 text-green-600" />
            <h1 className="text-2xl font-bold text-slate-800">Cronograma</h1>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Adicionar Evento
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Calendário</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                locale={ptBR}
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Eventos para {selectedDate && format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-green-600"></div>
                </div>
              ) : filteredEvents.length > 0 ? (
                <div className="space-y-4">
                  {filteredEvents.map((event: any, index: number) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border ${getEventTypeColor(event.type)}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm mt-1">{event.description}</p>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-3 w-3 mr-1" />
                          {event.time}
                          {event.duration > 0 && ` (${event.duration} min)`}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  Nenhum evento agendado para esta data
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Schedule;
