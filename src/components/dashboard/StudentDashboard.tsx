import React, { useState, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { groupService, userService } from "@/services/api";
import { Crown } from "lucide-react";

// Framer Motion alias
const MotionDiv = motion.div;

// Animation variants
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [availableGroups, setAvailableGroups] = useState<any[]>([]);
  const [myGroup, setMyGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Request leadership stub
  const requestLeadership = async () => {
    try {
      // implementar lógica de solicitação de liderança
      await userService.requestLeader();
      toast({ title: "Solicitação de liderança enviada", description: "Aguarde aprovação." });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { groups } = await groupService.getAllGroups();
        const joined = groups.find((g: any) =>
          g.members.some((m: any) => m.id === user.id)
        );
        if (joined) {
          setMyGroup(joined);
          const modalKey = `joined_${joined.id}`;
          if (!localStorage.getItem(modalKey)) {
            setShowModal(true);
            localStorage.setItem(modalKey, "true");
          }
        } else {
          const filtered = groups.filter((g: any) =>
            g.courseId === user.course_id && g.periodSemester === user.period_semester
          );
          setAvailableGroups(filtered);
        }
      } catch (err) {
        console.error(err);
        toast({
          title: "Erro",
          description: "Não foi possível carregar grupos.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id, user.course_id, user.period_semester, toast]);

  const joinGroup = async (groupId: string) => {
    try {
      await groupService.requestJoinGroup(groupId);
      toast({ title: "Solicitação enviada", description: "Aguarde aprovação do líder." });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  };

  const leaveGroup = async () => {
    if (!myGroup) return;
    const confirmLeave = window.confirm("Tem certeza que deseja sair do grupo?");
    if (!confirmLeave) return;
    try {
      await groupService.leaveGroup(myGroup.id);
      toast({ title: "Saída bem-sucedida", description: "Você saiu do grupo." });
      setMyGroup(null);
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  };

  if (loading) {
    return <p className="p-6 text-center">Carregando...</p>;
  }

  // Se já faz parte de um grupo
  if (myGroup) {
    const leader = myGroup.members.find((m: any) => m.role === 'leader') || {};

    return (
      <MotionDiv
        className="p-6 space-y-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Welcome Card */}
        <MotionDiv variants={item}>
          <Card className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Crown className="text-yellow-300" /> Seu Grupo
              </CardTitle>
              <CardDescription className="opacity-80">
                Bem-vindo ao grupo {myGroup.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">Descrição:</p>
              <p className="mb-4">{myGroup.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-white/90">Curso</p>
                  <p className="font-medium">{myGroup.courseId}</p>
                </div>
                <div>
                  <p className="text-sm text-white/90">Período</p>
                  <p className="font-medium">{myGroup.periodSemester}º</p>
                </div>
                <div className="col-span-full">
                  <p className="text-sm text-white/90">Líder</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Crown className="text-yellow-300" />
                    <span className="font-medium">{leader.name}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                
                <Button variant="destructive" onClick={leaveGroup}>
                  Sair do Grupo
                </Button>
              </div>
            </CardContent>
          </Card>
        </MotionDiv>

        {/* Membros do Grupo Section */}
        <MotionDiv variants={item}>
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Membros do Grupo</CardTitle>
              <Badge className="bg-blue-600 text-white px-3 py-0.5 text-xs">
                {myGroup.members.length}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {myGroup.members.map((m: any) => (
                  <div key={m.id} className="flex flex-col items-center space-y-2">
                    <Avatar>
                      <AvatarImage src={m.avatarUrl} alt={m.name} />
                      <AvatarFallback>{m.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{m.name}</span>
                    <Badge variant="outline" className="capitalize">
                      {m.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </MotionDiv>

        {/* Welcome Dialog */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogHeader>
            <DialogTitle>Parabéns!</DialogTitle>
          </DialogHeader>
          <DialogContent>
            <p>Seja bem-vindo ao grupo “{myGroup.name}” 🎉</p>
          </DialogContent>
          <DialogFooter>
            <Button onClick={() => setShowModal(false)}>Fechar</Button>
          </DialogFooter>
        </Dialog>
      </MotionDiv>
    );
  }

  // Se ainda não faz parte
  return (
    <MotionDiv
      className="p-6 space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {availableGroups.length === 0 ? (
        <MotionDiv variants={item}>
          
          <p className="text-center">Nenhum grupo disponível.</p>
        </MotionDiv>
      ) : (
        availableGroups.map((g) => {
          const leader = g.members.find((m: any) => m.role === 'leader') || {};
          return (
            <MotionDiv
              key={g.id}
              variants={item}
              className="transition-transform hover:scale-105"
            >

<Button variant="outline" className="w-full mb-5" onClick={requestLeadership}>
                  Solicitar Liderança
                </Button>
              {/* Custom Styled Card */}
              <Card className="bg-green-600 text-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 space-y-3 relative">
                  {/* Crown if leader */}
                  
                  <div className="absolute -top-3 -right-3 text-yellow-300">
                    <Crown size={32} />
                  </div>
                  {/* Tags */}
                  <div className="flex gap-2 text-xs">
                    
                    <Badge className="bg-green-800">Grupo</Badge>
                    <Badge className="bg-green-800">{g.members.length} membro{g.members.length !== 1 && 's'}</Badge>
                  </div>
                  {/* Title */}
                  <h3 className="text-3xl font-bold capitalize">{g.name}</h3>
                  {/* Leader */}
                  <div className="flex items-center gap-2">
                    <Crown size={16} className="text-yellow-300" />
                    <span className="font-medium">{leader.name}</span>
                  </div>
                  {/* Members list */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {g.members.map((m: any) => (
                      <Badge key={m.id} className="bg-white text-green-700">
                        {m.name}
                      </Badge>
                    ))}
                  </div>
                  {/* Description */}
                  <p className="opacity-90">{g.description}</p>
                  {/* Button */}
                  <Button
                    className="w-full bg-white text-green-600 hover:bg-gray-100 mt-4"
                    onClick={() => joinGroup(g.id)}
                  >
                    Solicitar Entrada
                  </Button>
                </div>
              </Card>
            </MotionDiv>
          );
        })
      )}
    </MotionDiv>
  );
};

export default StudentDashboard;