
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Star, 
  BarChart3, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  TrendingUp,
  FileText,
  Users,
  User,
  School
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockGroups, mockSubmissions, mockPhases } from "@/data/mockData";
import { motion } from "framer-motion";

const ResultsPage = () => {
  const [groups, setGroups] = useState([]);
  const [topGroups, setTopGroups] = useState([]);

  useEffect(() => {
    document.title = "Resultados | Jornada Fluxo Digital";
    
    // Get groups with submissions
    const groupsWithSubmissions = mockGroups.map(group => {
      const submissions = mockSubmissions.filter(sub => sub.groupId === group.id);
      
      // Calculate average grade
      const totalGrade = submissions.reduce((sum, sub) => sum + (sub.grade || 0), 0);
      const avgGrade = submissions.length > 0 ? Math.round(totalGrade / submissions.length) : 0;
      
      // Calculate on-time percentage
      const onTimeSubmissions = submissions.filter(sub => {
        const phase = mockPhases.find(p => p.id === sub.phaseId);
        return phase && sub.submittedAt <= phase.endDate;
      });
      
      const onTimePercentage = submissions.length > 0 
        ? Math.round((onTimeSubmissions.length / submissions.length) * 100) 
        : 0;
      
      return {
        ...group,
        courseId: group.id.includes("1") ? "ENG" : group.id.includes("2") ? "ADM" : "DIR",
        submissions,
        avgGrade,
        onTimePercentage,
        totalScore: avgGrade * 0.7 + onTimePercentage * 0.3, // Weighted score
      };
    });
    
    // Sort by total score
    const sortedGroups = [...groupsWithSubmissions].sort((a, b) => b.totalScore - a.totalScore);
    setGroups(sortedGroups);
    
    // Get top 3 groups
    setTopGroups(sortedGroups.slice(0, 3));
  }, []);

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBadge = (score) => {
    if (score >= 90) return <Badge className="bg-green-600">Excelente</Badge>;
    if (score >= 75) return <Badge className="bg-blue-600">Bom</Badge>;
    if (score >= 60) return <Badge className="bg-amber-600">Regular</Badge>;
    return <Badge className="bg-red-600">Precisa melhorar</Badge>;
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center"
        >
          <h1 className="text-2xl font-bold text-green-800">Resultados da Jornada</h1>
          <Badge className="bg-green-50 border-green-200 text-green-800 px-3 py-1">
            <Users className="h-4 w-4 mr-1" />
            {groups.length} grupos avaliados
          </Badge>
        </motion.div>
        
        {/* Top performing groups */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="flex items-center text-xl font-semibold mb-4 text-green-700">
            <Award className="h-5 w-5 mr-2" />
            Melhores grupos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topGroups.map((group, index) => (
              <motion.div 
                key={group.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className={`overflow-hidden border-t-4 ${
                  index === 0 
                    ? "border-t-yellow-500" 
                    : index === 1 
                      ? "border-t-slate-400" 
                      : "border-t-amber-700"
                }`}>
                  <div className={`h-1 ${
                    index === 0 
                      ? "bg-gradient-to-r from-yellow-300 to-yellow-500" 
                      : index === 1 
                        ? "bg-gradient-to-r from-slate-300 to-slate-500" 
                        : "bg-gradient-to-r from-amber-500 to-amber-700"
                  }`}></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          {index === 0 && <Star className="h-5 w-5 text-yellow-500 mr-1" />}
                          {index === 1 && <Star className="h-5 w-5 text-slate-400 mr-1" />}
                          {index === 2 && <Star className="h-5 w-5 text-amber-700 mr-1" />}
                          {group.name}
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <School className="h-3 w-3 mr-1" />
                          {group.courseId === "ENG" ? "Engenharia" : 
                           group.courseId === "ADM" ? "Administração" : "Direito"}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className={`text-2xl font-bold ${getScoreColor(group.totalScore)}`}>
                          {Math.round(group.totalScore)}
                        </div>
                        <div className="text-xs text-slate-500">pontos</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div className="flex items-center">
                        <BarChart3 className="h-4 w-4 text-blue-600 mr-1" />
                        <span className="text-slate-600">Nota média:</span>
                      </div>
                      <div className="font-medium">{group.avgGrade}/100</div>
                      
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-slate-600">Entregas no prazo:</span>
                      </div>
                      <div className="font-medium">{group.onTimePercentage}%</div>
                      
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-purple-600 mr-1" />
                        <span className="text-slate-600">Membros:</span>
                      </div>
                      <div className="font-medium">{group.members.length}</div>
                      
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-amber-600 mr-1" />
                        <span className="text-slate-600">Entregas:</span>
                      </div>
                      <div className="font-medium">{group.submissions.length}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* All groups table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="flex items-center text-xl font-semibold mb-4 text-green-700">
            <TrendingUp className="h-5 w-5 mr-2" />
            Classificação completa
          </h2>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Desempenho dos grupos</CardTitle>
              <CardDescription>
                Pontuação baseada em 70% nota média e 30% entregas no prazo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Pos.</TableHead>
                    <TableHead>Grupo</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead className="text-center">Nota média</TableHead>
                    <TableHead className="text-center">No prazo</TableHead>
                    <TableHead className="text-center">Pontuação</TableHead>
                    <TableHead className="text-right">Classificação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groups.map((group, index) => (
                    <TableRow key={group.id} className={index < 3 ? "bg-green-50" : ""}>
                      <TableCell className="font-medium">
                        {index === 0 ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">1</span>
                        ) : index === 1 ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-700">2</span>
                        ) : index === 2 ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-700">3</span>
                        ) : (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-600">{index + 1}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{group.name}</div>
                        <div className="text-xs text-slate-500">{group.members.length} membros</div>
                      </TableCell>
                      <TableCell>
                        {group.courseId === "ENG" ? "Engenharia" : 
                         group.courseId === "ADM" ? "Administração" : "Direito"}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="inline-flex items-center space-x-1">
                          {group.avgGrade >= 90 ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : group.avgGrade < 60 ? (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          ) : null}
                          <span className={getScoreColor(group.avgGrade)}>{group.avgGrade}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="inline-flex items-center space-x-1">
                          {group.onTimePercentage >= 90 ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : group.onTimePercentage < 60 ? (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          ) : null}
                          <span className={getScoreColor(group.onTimePercentage)}>{group.onTimePercentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className={`font-bold ${getScoreColor(group.totalScore)}`}>
                          {Math.round(group.totalScore)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {getScoreBadge(group.totalScore)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default ResultsPage;
