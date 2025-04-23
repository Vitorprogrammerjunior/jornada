
import React from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

type MainLayoutProps = {
  children: React.ReactNode;
  requiredRoles?: string[];
};

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  requiredRoles = ["coordinator", "leader", "student"] 
}) => {
  const { user, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
          <p className="text-sm text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (!requiredRoles.includes(user.role)) {
    // Pending users can see a limited version
    if (user.role === "pending") {
      return (
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex flex-1 flex-col">
            <div className="flex h-16 items-center border-b px-6">
              <h1 className="text-xl font-semibold text-slate-800">
                Aguardando Aprovação
              </h1>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-medium">Conta Pendente</h2>
                <p className="text-slate-600">
                  Sua conta está aguardando aprovação pelo coordenador. Você terá acesso 
                  completo ao sistema assim que sua conta for aprovada.
                </p>
              </div>
            </div>
          </div>
          <Toaster />
        </div>
      );
    }
    
    // Inactive users are redirected to login
    return <Navigate to="/login" replace />;
  }

  // Render layout with sidebar
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default MainLayout;
