import { useState, useEffect, FormEvent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { groupService } from "@/services/api";

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [availableGroups, setAvailableGroups] = useState<any[]>([]);
  const [myGroup, setMyGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        // 1) pega todos os grupos (já vem com members)
        const { groups } = await groupService.getAllGroups();

        // 2) detecta em qual (se houver) estou como membro
        const joined = groups.find((g: any) =>
          g.members.some((m: any) => m.id === user.id)
        );

        if (joined) {
          setMyGroup(joined);

          // exibe modal só uma vez por grupo
          const key = `joined_${joined.id}`;
          if (!localStorage.getItem(key)) {
            setShowModal(true);
            localStorage.setItem(key, "true");
          }
        } else {
          // 3) senão, filtra por curso e período do aluno
          const filtered = groups.filter((g: any) =>
            g.courseId === user.course_id &&
            g.periodSemester === user.period_semester
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

    fetch();
  }, [user.id, user.course_id, user.period_semester]);

  const joinGroup = async (groupId: string) => {
    try {
      await groupService.requestJoinGroup(groupId);
      toast({ title: "Solicitação enviada", description: "Aguarde aprovação do líder." });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  // Se já participei de um grupo
  if (myGroup) {
    return (
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Seu Grupo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{myGroup.name}</p>
            <p className="text-sm text-slate-600">{myGroup.description}</p>
            <p className="text-xs text-slate-500">
              Curso: {myGroup.courseId} | Período: {myGroup.periodSemester}º
            </p>
          </CardContent>
        </Card>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogHeader>
            <DialogTitle>Parabéns!</DialogTitle>
          </DialogHeader>
          <DialogContent>
            <p>Seja bem-vindo ao grupo “{myGroup.name}” 🎉</p>
            <DialogFooter>
              <Button onClick={() => setShowModal(false)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Senão, mostra grupos disponíveis
  return (
    <div className="p-6 space-y-4">
      {availableGroups.length === 0 ? (
        <p>Não há grupos disponíveis no seu curso e período.</p>
      ) : (
        availableGroups.map((g) => (
          <Card key={g.id} className="border shadow-sm">
            <div className="h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-t" />
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle className="capitalize">{g.name}</CardTitle>
                  <CardDescription>{g.description}</CardDescription>
                </div>
                <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">
                  {g.members.length} membro{g.members.length !== 1 ? "s" : ""}
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-slate-700">
              <p>Curso: {g.courseId}</p>
              <p>Período: {g.periodSemester}º</p>
              <p>Líder: {g.leaderName}</p>
              <div className="mt-2 text-right">
                <Button
                  size="sm"
                  className="bg-green-600 text-white"
                  onClick={() => joinGroup(g.id)}
                >
                  Entrar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default StudentDashboard;
