
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/api";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  groupId?: string; // Added groupId as optional property
  createdAt: Date;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: string | null; // Added missing error property
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null, // Initialize error as null
  login: async () => {},
  register: async () => {},
  logout: () => {},
  forgotPassword: async () => {},
});

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Add error state
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Simulate checking the token with the backend
          try {
            const data = await authService.getCurrentUser();
            setUser(data.user);
            setError(null); // Clear any previous errors
          } catch (error) {
            // If token is invalid, remove it
            localStorage.removeItem("token");
            setUser(null);
            console.error("Error verifying token:", error);
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null); // Reset error state before attempting login
      const data = await authService.login(email, password);
      
      if (data.success) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        toast.success("Login realizado com sucesso!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Erro ao fazer login. Verifique suas credenciais.");
      toast.error("Erro ao fazer login. Verifique suas credenciais.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      setError(null); // Reset error state before attempting registration
      const data = await authService.register(userData);
      
      if (data.success) {
        toast.success("Cadastro realizado com sucesso!");
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Register error:", error);
      setError(error.message || "Erro ao realizar cadastro. Por favor, tente novamente.");
      toast.error("Erro ao realizar cadastro. Por favor, tente novamente.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setError(null);
    toast.info("Você foi desconectado");
    navigate("/login");
  };

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.forgotPassword(email);
      toast.success("Email de recuperação enviado. Verifique sua caixa de entrada.");
    } catch (error: any) {
      console.error("Forgot password error:", error);
      setError(error.message || "Erro ao solicitar recuperação de senha.");
      toast.error("Erro ao solicitar recuperação de senha.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
