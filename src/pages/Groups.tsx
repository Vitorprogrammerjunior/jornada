<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  Users,
  Search,
  School,
  User,
  Filter,
  Loader2,
} from "lucide-react";
=======

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
>>>>>>> f306cf60baf1dddd5e9d29b8d5f7de7a0a963508
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Users } from "lucide-react";
import GroupDetail from "@/components/groups/GroupDetail";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

<<<<<<< HEAD
const coursesMap: Record<string, string> = {
  ENG: "Engenharia",
  ADM: "Administração",
  DIR: "Direito",
  MED: "Medicina",
  PSI: "Psicologia",
};

const GroupsPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [filteredGroups, setFilteredGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const { data: groupsData, isLoading, error } = useQuery({
    queryKey: ["groups"],
    queryFn: groupService.getAllGroups,
    onSuccess: (data) => setFilteredGroups(data.groups),
    onError: (err: Error) => {
      toast({
        title: "Erro ao carregar grupos",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    document.title = "Grupos | Jornada Fluxo Digital";

    if (groupsData) {
      let results = groupsData.groups;

      if (searchTerm) {
        results = results.filter((g: any) =>
          g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          g.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedCourse !== "all") {
        results = results.filter((g: any) => g.courseId === selectedCourse);
      }

      setFilteredGroups(results);
    }
  }, [searchTerm, selectedCourse, groupsData]);

  const uniqueCourses = Array.from(
    new Set(filteredGroups.map((g) => g.courseId))
  );

  const handleOpenDetail = (group: any) => {
=======
const Groups = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [programFilter, setProgramFilter] = useState("all");

  // Fetch groups data
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      // Here you would fetch groups from your API
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: "1",
              name: "Inovadores Digitais",
              program: "Programa de Inovação",
              members: [
                { id: "1", name: "Ana Silva", role: "leader" },
                { id: "2", name: "Carlos Mendes", role: "student" },
                { id: "3", name: "Bruno Gomes", role: "student" },
              ],
              progress: 75,
              nextDelivery: "2023-06-15",
            },
            {
              id: "2",
              name: "Tech Transformers",
              program: "Programa de Tecnologia",
              members: [
                { id: "4", name: "Juliana Alves", role: "leader" },
                { id: "5", name: "Rafael Costa", role: "student" },
                { id: "6", name: "Mariana Souza", role: "student" },
              ],
              progress: 60,
              nextDelivery: "2023-06-20",
            },
            {
              id: "3",
              name: "Designers do Futuro",
              program: "Programa de Design",
              members: [
                { id: "7", name: "Fernando Lima", role: "leader" },
                { id: "8", name: "Patrícia Rocha", role: "student" },
                { id: "9", name: "Roberto Dias", role: "student" },
              ],
              progress: 40,
              nextDelivery: "2023-06-25",
            },
          ]);
        }, 1000);
      });
    },
    meta: {
      onSuccess: (data: any) => {
        console.log("Groups loaded:", data);
      },
      onError: (error: any) => {
        toast.error("Erro ao carregar grupos");
        console.error("Error loading groups:", error);
      }
    }
  });

  // Filter groups based on search query, program filter, and active tab
  const filteredGroups = groups.filter((group: any) => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProgram = programFilter === "all" || group.program === programFilter;
    const matchesTab = activeTab === "all" || 
                       (activeTab === "my" && group.members.some((m: any) => m.id === user?.id));
    return matchesSearch && matchesProgram && matchesTab;
  });

  const programs = [...new Set(groups.map((group: any) => group.program))];

  const handleGroupClick = (group: any) => {
>>>>>>> f306cf60baf1dddd5e9d29b8d5f7de7a0a963508
    setSelectedGroup(group);
  };

<<<<<<< HEAD
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-full p-6">
          <Loader2 className="h-10 w-10 text-green-600 animate-spin mb-4" />
          <p className="text-lg text-green-700">Carregando grupos...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="bg-red-50 border-red-200 rounded-lg p-4 text-red-800">
            <h2 className="text-lg font-medium mb-2">Erro ao carregar os grupos</h2>
            <p>Ocorreu um erro ao tentar obter os dados dos grupos.</p>
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
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-800">Grupos por Curso</h1>
          <div className="flex space-x-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Buscar grupos..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-48">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrar por curso" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os cursos</SelectItem>
                {Object.entries(coursesMap).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
=======
  const handleCreateGroup = (formData: any) => {
    console.log("Creating group:", formData);
    toast.success("Grupo criado com sucesso!");
    setIsDialogOpen(false);
  };

  return (
    <MainLayout requiredRoles={["coordinator", "leader", "student"]}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Users className="h-6 w-6 mr-2 text-green-600" />
            <h1 className="text-2xl font-bold text-slate-800">Grupos</h1>
>>>>>>> f306cf60baf1dddd5e9d29b8d5f7de7a0a963508
          </div>

<<<<<<< HEAD
        {filteredGroups.length === 0 ? (
          <div className="bg-slate-50 border-slate-200 rounded-lg p-8 text-center">
            <Users className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h2 className="text-xl font-medium text-slate-700 mb-2">Nenhum grupo encontrado</h2>
            <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50" onClick={() => { setSearchTerm(""); setSelectedCourse("all"); }}>
              Limpar filtros
            </Button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 gap-8">
            {selectedCourse !== "all" ? (
              <>
                <div className="flex items-center space-x-2 mb-2">
                  <School className="h-5 w-5 text-green-700" />
                  <h2 className="text-xl font-semibold text-green-700">{coursesMap[selectedCourse]}</h2>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{filteredGroups.length} grupos</Badge>
                </div>
                <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGroups.map((group) => (
                    <motion.div key={group.id} variants={item}>
                      <GroupCard group={group} onOpenDetail={() => handleOpenDetail(group)} coursesMap={coursesMap} />
                    </motion.div>
                  ))}
                </motion.div>
              </>
            ) : (
              uniqueCourses.map((courseId) => (
                <div key={courseId}>
                  <div className="flex items-center space-x-2 mb-4">
                    <School className="h-5 w-5 text-green-700" />
                    <h2 className="text-xl font-semibold text-green-700">{coursesMap[courseId]}</h2>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{filteredGroups.filter(g => g.courseId === courseId).length} grupos</Badge>
                  </div>
                  <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {filteredGroups.filter(g => g.courseId === courseId).map((group) => (
                      <motion.div key={group.id} variants={item}>
                        <GroupCard group={group} onOpenDetail={() => handleOpenDetail(group)} coursesMap={coursesMap} />
                      </motion.div>
                    ))}
                  </motion.div>
=======
          {user?.role === "coordinator" && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Criar Grupo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Grupo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Grupo</Label>
                    <Input id="name" placeholder="Digite o nome do grupo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="program">Programa</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um programa" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.map((program) => (
                          <SelectItem key={program} value={program}>
                            {program}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => handleCreateGroup({ name: "Novo Grupo", program: "Programa de Inovação" })}>
                    Criar Grupo
                  </Button>
>>>>>>> f306cf60baf1dddd5e9d29b8d5f7de7a0a963508
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

<<<<<<< HEAD
      {selectedGroup && (
        <GroupDetail
          group={selectedGroup}
          courseName={coursesMap[selectedGroup.courseId] || 'Não especificado'}
          leader={selectedGroup.members.find((m: any) => m.id === selectedGroup.leaderId)}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />
      )}
=======
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="md:w-1/3">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Buscar grupos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Select 
                    value={programFilter}
                    onValueChange={(value) => setProgramFilter(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Programa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Programas</SelectItem>
                      {programs.map((program) => (
                        <SelectItem key={program} value={program}>
                          {program}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full">
                    <TabsTrigger value="all" className="flex-1">
                      Todos
                    </TabsTrigger>
                    <TabsTrigger value="my" className="flex-1">
                      Meus Grupos
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-green-600"></div>
                  </div>
                ) : filteredGroups.length > 0 ? (
                  <div className="space-y-2 mt-2">
                    {filteredGroups.map((group: any) => (
                      <div
                        key={group.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-slate-50 ${
                          selectedGroup?.id === group.id ? "border-green-500 bg-green-50" : ""
                        }`}
                        onClick={() => handleGroupClick(group)}
                      >
                        <h3 className="font-medium">{group.name}</h3>
                        <p className="text-sm text-slate-500">{group.program}</p>
                        <div className="text-xs text-slate-400 mt-1">
                          {group.members.length} membros
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    Nenhum grupo encontrado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="md:w-2/3">
            {selectedGroup ? (
              <GroupDetail group={selectedGroup} />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="p-8 text-center text-slate-500">
                  <Users className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                  <p>Selecione um grupo para visualizar os detalhes</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
>>>>>>> f306cf60baf1dddd5e9d29b8d5f7de7a0a963508
    </MainLayout>
  );
};

<<<<<<< HEAD
const GroupCard = ({ group, onOpenDetail, coursesMap }: any) => {
  const leader = group.members.find((m: any) => m.id === group.leaderId);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      <div className="h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg">{group.name}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">{group.description}</CardDescription>
          </div>
          <Badge className="bg-green-600">{group.members.length} membros</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">Informações do curso:</h4>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-slate-500">Curso:</span>
              <span>{coursesMap[group.courseId]}</span>
              <span className="text-slate-500">Período:</span>
              <span>{group.periodSemester}° Semestre</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">Líder:</h4>
            {leader ? (
              <div className="flex items-center">
                <div className="p-1 rounded-full bg-green-50">
                  <User className="h-4 w-4 text-green-600" />
                </div>
                <span className="ml-2 text-sm">{leader.name}</span>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Nenhum líder cadastrado</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-slate-50 flex justify-between pt-3">
        <div className="text-xs text-slate-500">
          Criado em {new Date(group.createdAt).toLocaleDateString('pt-BR')}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-green-700"
          onClick={onOpenDetail}
        >
          <UserPlus className="h-3 w-3 mr-1" />
          Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GroupsPage;
=======
export default Groups;
>>>>>>> f306cf60baf1dddd5e9d29b8d5f7de7a0a963508
