
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Login | Jornada Fluxo Digital";
  }, []);

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-600">Jornada Fluxo Digital</h1>
          <p className="mt-2 text-slate-600">Faça login para acessar o sistema</p>
        </div>
        
        <LoginForm />
        
        <div className="text-center text-sm text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Jornada Fluxo Digital. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
