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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import GroupDetail from "@/components/groups/GroupDetail";
import { groupService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

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
    setSelectedGroup(group);
    setIsDetailOpen(true);
  };

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
          </div>
        </motion.div>

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
                </div>
              ))
            )}
          </motion.div>
        )}
      </div>

      {selectedGroup && (
        <GroupDetail
          group={selectedGroup}
          courseName={coursesMap[selectedGroup.courseId] || 'Não especificado'}
          leader={selectedGroup.members.find((m: any) => m.id === selectedGroup.leaderId)}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />
      )}
    </MainLayout>
  );
};

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
