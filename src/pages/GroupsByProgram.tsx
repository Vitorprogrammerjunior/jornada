
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Users, 
  Search, 
  GraduationCap, 
  Book, 
  User 
} from "lucide-react";
import { mockGroups, mockUsers } from "@/data/mockData";
import { Input } from "@/components/ui/input";

// Mock data for courses
const mockCourses = [
  { id: "1", name: "Engenharia de Software" },
  { id: "2", name: "Ciência da Computação" },
  { id: "3", name: "Sistemas de Informação" },
  { id: "4", name: "Engenharia Civil" },
  { id: "5", name: "Administração" },
  { id: "6", name: "Medicina" },
  { id: "7", name: "Direito" },
  { id: "8", name: "Psicologia" }
];

// Extended mock data for groups to include course information
const extendedMockGroups = mockGroups.map(group => ({
  ...group,
  courseId: Math.floor(Math.random() * mockCourses.length) + 1,
  periodSemester: Math.floor(Math.random() * 10) + 1,
}));

const GroupsByProgram = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Grupos por Curso | Jornada Fluxo Digital";
  }, []);

  // Redirect if user is not a coordinator
  if (user?.role !== "coordinator") {
    return (
      <MainLayout>
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="text-xl font-medium text-green-800">Acesso não autorizado</h2>
          <p className="mt-2 text-green-700">
            Esta página é exclusiva para coordenadores.
          </p>
        </div>
      </MainLayout>
    );
  }

  // Filter groups based on course and search term
  const filteredGroups = extendedMockGroups.filter(group => {
    const course = mockCourses.find(c => c.id === String(group.courseId));
    const groupName = group.name.toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    const courseMatch = !selectedCourse || String(group.courseId) === selectedCourse;
    const searchMatch = !searchTerm || groupName.includes(searchTermLower);
    
    return courseMatch && searchMatch;
  });

  // Group the filtered groups by course
  const groupsByCourse = filteredGroups.reduce((acc, group) => {
    const courseId = String(group.courseId);
    if (!acc[courseId]) {
      acc[courseId] = [];
    }
    acc[courseId].push(group);
    return acc;
  }, {} as Record<string, typeof extendedMockGroups>);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-800">Grupos por Curso Superior</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar grupos..."
                className="pl-8 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setSelectedCourse(value === "all" ? null : value)}>
            <div className="bg-white rounded-lg shadow p-2">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-2">
                <TabsTrigger value="all" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
                  Todos
                </TabsTrigger>
                {mockCourses.map(course => (
                  <TabsTrigger 
                    key={course.id} 
                    value={course.id}
                    className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
                  >
                    {course.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-6">
              <div className="grid gap-6">
                {mockCourses.map(course => {
                  const courseGroups = groupsByCourse[course.id] || [];
                  if (courseGroups.length === 0) return null;
                  
                  return (
                    <Card key={course.id} className="border-green-100">
                      <CardHeader className="bg-green-50 border-b border-green-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-green-700" />
                            <CardTitle className="text-lg text-green-800">{course.name}</CardTitle>
                          </div>
                          <Badge className="bg-green-700">{courseGroups.length} grupos</Badge>
                        </div>
                        <CardDescription>Lista de grupos formados por alunos deste curso</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-green-50">
                              <TableHead>Grupo</TableHead>
                              <TableHead>Período</TableHead>
                              <TableHead>Líder</TableHead>
                              <TableHead>Membros</TableHead>
                              <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {courseGroups.map(group => {
                              const leader = mockUsers.find(u => u.id === group.leaderId);
                              return (
                                <TableRow key={group.id} className="hover:bg-green-50">
                                  <TableCell className="font-medium">{group.name}</TableCell>
                                  <TableCell>{group.periodSemester}º período</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-1">
                                      <User className="h-4 w-4 text-green-600" />
                                      <span>{leader?.name}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-1">
                                      <Users className="h-4 w-4 text-green-600" />
                                      <span>{group.members.length}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button variant="outline" size="sm" className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800">
                                      Ver Detalhes
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {mockCourses.map(course => (
              <TabsContent key={course.id} value={course.id} className="mt-6">
                <Card className="border-green-100">
                  <CardHeader className="bg-green-50 border-b border-green-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-green-700" />
                        <CardTitle className="text-lg text-green-800">{course.name}</CardTitle>
                      </div>
                      <Badge className="bg-green-700">
                        {(groupsByCourse[course.id] || []).length} grupos
                      </Badge>
                    </div>
                    <CardDescription>Lista de grupos formados por alunos deste curso</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-green-50">
                          <TableHead>Grupo</TableHead>
                          <TableHead>Período</TableHead>
                          <TableHead>Líder</TableHead>
                          <TableHead>Membros</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(groupsByCourse[course.id] || []).length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                              Nenhum grupo encontrado para este curso.
                            </TableCell>
                          </TableRow>
                        ) : (
                          (groupsByCourse[course.id] || []).map(group => {
                            const leader = mockUsers.find(u => u.id === group.leaderId);
                            return (
                              <TableRow key={group.id} className="hover:bg-green-50">
                                <TableCell className="font-medium">{group.name}</TableCell>
                                <TableCell>{group.periodSemester}º período</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <User className="h-4 w-4 text-green-600" />
                                    <span>{leader?.name}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4 text-green-600" />
                                    <span>{group.members.length}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button variant="outline" size="sm" className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800">
                                    Ver Detalhes
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default GroupsByProgram;
