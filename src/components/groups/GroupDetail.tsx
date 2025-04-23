import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Clock, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Group, User as UserType } from "@/types";

interface GroupDetailProps {
  group: Group & { courseId: number; periodSemester: number };
  courseName: string;
  leader: UserType | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const GroupDetail: React.FC<GroupDetailProps> = ({
  group,
  courseName,
  leader,
  isOpen,
  onClose,
}) => {
  // Format date function
  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-green-800 flex items-center gap-2">
            <span>{group.name}</span>
            <Badge className="bg-green-700 ml-2">{group.members.length} membros</Badge>
          </DialogTitle>
          <DialogDescription className="text-green-600">
            {group.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Card className="bg-green-50 border-green-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-green-700" />
                <div>
                  <h3 className="font-medium text-green-800">Curso</h3>
                  <p className="text-sm text-green-600">{courseName}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-700" />
                <div>
                  <h3 className="font-medium text-green-800">Período</h3>
                  <p className="text-sm text-green-600">{group.periodSemester}º período</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-700" />
                <div>
                  <h3 className="font-medium text-green-800">Criado em</h3>
                  <p className="text-sm text-green-600">{formatDate(group.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <h3 className="font-medium text-green-800 mb-3 flex items-center gap-2">
            <User className="h-5 w-5 text-green-700" />
            Líder do Grupo
          </h3>
          
          <Card className="bg-green-50 border-green-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-green-200 text-green-700">
                    {leader ? leader.name.substring(0, 2).toUpperCase() : "??"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-green-800">{leader?.name || "Sem líder"}</p>
                  <p className="text-sm text-green-600">{leader?.email || "Email não disponível"}</p>
                </div>
                <Badge className="ml-auto bg-green-700">Líder</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <h3 className="font-medium text-green-800 mb-3">Membros do Grupo</h3>
          <div className="grid gap-3">
            {group.members.length === 0 ? (
              <Card className="bg-green-50 border-green-100">
                <CardContent className="p-4 text-center text-green-600">
                  Nenhum membro neste grupo ainda.
                </CardContent>
              </Card>
            ) : (
              group.members.map(member => (
                <Card key={member.id} className="bg-green-50 border-green-100">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-green-200 text-green-700">
                          {member.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-green-800">{member.name}</p>
                        <p className="text-sm text-green-600">{member.email}</p>
                      </div>
                      <Badge className="ml-auto bg-green-500">Membro</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupDetail;