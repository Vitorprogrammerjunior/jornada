
import { useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import CoordinatorDashboard from "@/components/dashboard/CoordinatorDashboard";
import LeaderDashboard from "@/components/dashboard/LeaderDashboard";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { GraduationCap, Settings } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Dashboard | Jornada Fluxo Digital";
  }, []);

  // Render appropriate dashboard based on user role
  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case "coordinator":
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-green-800">Dashboard do Coordenador</h1>
              <div className="flex gap-2">
                <Button asChild variant="outline" className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
                  <Link to="/groups-by-program">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Grupos por Curso
                  </Link>
                </Button>
                <Button asChild variant="outline" className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
                  <Link to="/configure-site">
                    <Settings className="mr-2 h-4 w-4" />
                    Configurar Site
                  </Link>
                </Button>
              </div>
            </div>
            <CoordinatorDashboard />
          </>
        );
      case "leader":
        return <LeaderDashboard />;
      case "student":
        return <StudentDashboard />;
      default:
        return (
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-xl font-medium text-green-800">Acesso não disponível</h2>
            <p className="mt-2 text-green-700">
              Seu perfil atual não possui acesso ao painel de controle. Entre em contato com o coordenador.
            </p>
          </div>
        );
    }
  };

  return (
    <MainLayout>
      {renderDashboard()}
    </MainLayout>
  );
};

export default Dashboard;
