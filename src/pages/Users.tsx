
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Users, 
  Search, 
  Shield, 
  GraduationCap, 
  UserCog
} from "lucide-react";
import { mockUsers } from "@/data/mockData";
import { motion } from "framer-motion";
import UserCard from "@/components/users/UserCard";
import { userService } from "@/services/api";

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  useEffect(() => {
    const results = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  const coordinators = filteredUsers.filter(u => u.role === "coordinator");
  const leaders      = filteredUsers.filter(u => u.role === "leader");
  const students     = filteredUsers.filter(u => u.role === "student");
  const pendings     = filteredUsers.filter(u => u.role === "pending");

  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAllUsers();
        setUsers(data.users);
        setFilteredUsers(data.users);
            // Converte createdAt (string) em Date
     const usersWithDates = data.users.map((u: any) => ({
      ...u,
       createdAt: new Date(u.createdAt)
     }));
     setUsers(usersWithDates);
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);
  

  // Helper function to render role badge
  const getRoleBadge = (role) => {
    switch (role) {
      case "coordinator":
        return <Badge className="bg-blue-600">Coordenador</Badge>;
      case "leader":
        return <Badge className="bg-green-600">Líder</Badge>;
      case "student":
        return <Badge className="bg-slate-600">Aluno</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-amber-600 border-amber-600">Pendente</Badge>;
      default:
        return null;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center"
        >
          <h1 className="text-2xl font-bold text-green-800">Gerenciamento de Usuários</h1>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar usuários..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        <Tabs defaultValue="all">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                <Users className="mr-2 h-4 w-4" />
                Todos ({filteredUsers.length})
              </TabsTrigger>
              <TabsTrigger value="coordinators">
  <Shield className="mr-2 h-4 w-4" />
  Coordenadores ({loadingUsers ? "…" : coordinators.length})
</TabsTrigger>
<TabsTrigger value="leaders">
  <UserCog className="mr-2 h-4 w-4" />
  Líderes ({loadingUsers ? "…" : leaders.length})
</TabsTrigger>

<TabsTrigger value="students">
           <GraduationCap className="mr-2 h-4 w-4" />
            Alunos ({loadingUsers ? "…" : students.length})
         </TabsTrigger>
          <TabsTrigger value="pending">            <User className="mr-2 h-4 w-4" />
            Pendentes ({loadingUsers ? "…" : pendings.length})
          </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="all">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredUsers.map((user) => (
                <motion.div key={user.id} variants={item}>
                  <UserCard user={user} roleBadge={getRoleBadge(user.role)} />
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
          
         {/* Coordenadores */}
<TabsContent value="coordinators">
  {loadingUsers ? (
    <p className="text-sm text-slate-500">Carregando...</p>
  ) : coordinators.length === 0 ? (
    <p className="text-sm text-slate-500">Nenhum líder cadastrado</p>
  ) : (
    <motion.div variants={container} initial="hidden" animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {coordinators.map(user => (
        <motion.div key={user.id} variants={item}>
          <UserCard user={user} roleBadge={getRoleBadge(user.role)} />
        </motion.div>
      ))}
    </motion.div>
  )}
</TabsContent>

{/* Líderes */}
<TabsContent value="leaders">
  {loadingUsers ? (
    <p className="text-sm text-slate-500">Carregando...</p>
  ) : leaders.length === 0 ? (
    <p className="text-sm text-slate-500">Nenhum líder cadastrado</p>
  ) : (
    <motion.div variants={container} initial="hidden" animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {leaders.map(user => (
        <motion.div key={user.id} variants={item}>
          <UserCard user={user} roleBadge={getRoleBadge(user.role)} />
        </motion.div>
      ))}
    </motion.div>
  )}
</TabsContent>

          
<TabsContent value="students">
          {loadingUsers ? (
            <p className="text-sm text-slate-500">Carregando usuários...</p>
          ) : students.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhum aluno cadastrado</p>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map(user => (
                <motion.div key={user.id} variants={item}>
                  <UserCard user={user} roleBadge={getRoleBadge(user.role)} />
               </motion.div>
              ))}
            </motion.div>
         )}
        </TabsContent>

        {/* Pendentes */}
        <TabsContent value="pending">
          {loadingUsers ? (
            <p className="text-sm text-slate-500">Carregando usuários...</p>
          ) : pendings.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhum usuário pendente</p>
          ) : (
          <motion.div variants={container} initial="hidden" animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendings.map(user => (
                <motion.div key={user.id} variants={item}>
                  <UserCard user={user}
                            roleBadge={getRoleBadge(user.role)}
                            isApprovalNeeded={true} />
                </motion.div>
              ))}
            </motion.div>
         )}
        </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default UsersPage;
