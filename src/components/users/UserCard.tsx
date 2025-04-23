
import { User } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserCardProps {
  user: User;
  roleBadge: React.ReactNode;
  isApprovalNeeded?: boolean;
}

const UserCard = ({ user, roleBadge, isApprovalNeeded = false }: UserCardProps) => {
  const handleApprove = (userId: string) => {
    alert(`Usuário ${userId} aprovado com sucesso!`);
  };

  const handleReject = (userId: string) => {
    alert(`Usuário ${userId} rejeitado.`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12 border-2 border-green-100">
          <AvatarImage src={`https://avatars.dicebear.com/api/initials/${user.name.replace(/\s+/g, '-')}.svg`} />
          <AvatarFallback className="bg-green-100 text-green-700">
            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg">{user.name}</CardTitle>
          <CardDescription className="text-sm">{user.email}</CardDescription>
        </div>
        <div className="ml-auto">
          {roleBadge}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Criado em:</span>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          {user.courseId && (
            <div className="flex justify-between">
              <span className="text-slate-500">Curso:</span>
              <span>{user.courseId}</span>
            </div>
          )}
          {user.periodSemester && (
            <div className="flex justify-between">
              <span className="text-slate-500">Período:</span>
              <span>{user.periodSemester}° Semestre</span>
            </div>
          )}
          {user.groupId && (
            <div className="flex justify-between">
              <span className="text-slate-500">Grupo:</span>
              <span>{user.groupId}</span>
            </div>
          )}
          
          {isApprovalNeeded && (
            <div className="flex justify-between mt-4 pt-2 border-t">
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
                onClick={() => handleReject(user.id)}
              >
                Rejeitar
              </Button>
              <Button 
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleApprove(user.id)}
              >
                Aprovar
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
