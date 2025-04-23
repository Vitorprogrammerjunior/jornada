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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/services/api";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [groupCodeInput, setGroupCodeInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRequestingLeader, setIsRequestingLeader] = useState(false);

  // Get user's group
  const userGroup = user && user.groupId
    ? mockGroups.find(group => group.id === user.groupId)
    : null;

  // Get current phase
  const currentPhase = getCurrentPhase();

  // Format date helper
  const formatDate = (date: Date) =>
    format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  // Filter groups for search
  const filteredGroups = searchQuery
    ? mockGroups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockGroups;

  // Request to join group (continua mock)
  const requestToJoinGroup = (groupId: string) => {
    alert("Solicitação para entrar no grupo enviada com sucesso! Aguarde a aprovação do líder.");
  };

  // Join with code (continua mock)
  const joinWithCode = () => {
    if (groupCodeInput.length < 5) {
      alert("Por favor, insira um código válido");
      return;
    }
    alert(`Solicitação com código ${groupCodeInput} enviada com sucesso! Aguarde a aprovação do líder.`);
    setGroupCodeInput("");
  };

  // === NOVO: request leader via API ===
  const requestLeaderRole = async () => {
    setIsRequestingLeader(true);
    try {
      await userService.requestLeader();
      toast({
        title: "Solicitação enviada",
        description: "O coordenador receberá sua solicitação em breve.",
        
      });
    } catch (err: any) {
      toast({
        title: "Falha ao solicitar",
        description: err.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsRequestingLeader(false);
    }
  };
  // ====================================

  // Calculate phase progress
  const calculatePhaseProgress = (phase: { startDate: Date, endDate: Date }) => {
    const now = new Date();
    const start = new Date(phase.startDate);
    const end = new Date(phase.endDate);
    if (now < start) return 0;
    if (now > end) return 100;
    return Math.round(((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100);
  };

  // Get group submissions
  const groupSubmissions = userGroup
    ? mockSubmissions.filter(sub => sub.groupId === userGroup.id)
    : [];

  // If user doesn't have a group, show join/create UI
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
              disabled={isRequestingLeader}
            >
              {isRequestingLeader ? "Enviando..." : "Solicitar Ser Líder"}
            </Button>
          </div>
        </div>

        {/* ... restante do JSX de busca de grupos ... */}
      </div>
    );
  }

  // Get group leader
  const groupLeader = mockUsers.find(u => u.id === userGroup.leaderId);

  return (
    <div className="p-6 space-y-6">
      {/* ... resto do seu dashboard do aluno ... */}

      {/* Tab de solicitar papel de líder */}
      <TabsContent value="members" className="space-y-4">
        {/* ... lista de membros ... */}

        <Card>
          <CardHeader>
            <CardTitle>Solicitar Papel de Líder</CardTitle>
            <CardDescription>
              Solicite para se tornar um líder de grupo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Líderes de grupo podem criar novos grupos, gerenciar membros e são
              responsáveis pelas entregas. Sua solicitação será analisada pelo
              coordenador.
            </p>
            <Button
              variant="outline"
              onClick={requestLeaderRole}
              disabled={isRequestingLeader}
            >
              {isRequestingLeader ? "Enviando..." : "Solicitar Papel de Líder"}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
      {/* ... abas fases e entregas ... */}
    </div>
  );
};

export default StudentDashboard;