import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Atualizado: removido confirmPassword, adicionados role, courseId e periodSemester
const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.enum(["aluno", "coordenador"], { 
    errorMap: () => ({ message: "Selecione uma função" }) 
  }),
  courseId: z.string().min(1, "Selecione um curso"),
  periodSemester: z
    .number({ invalid_type_error: "Semestre deve ser um número" })
    .min(1, "Semestre inválido")
});

type FormValues = z.infer<typeof formSchema>;

const RegisterForm = () => {
  const { register: registerUser, error } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "aluno",
      courseId: "",
      periodSemester: 1,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await registerUser(data);
      navigate("/dashboard");
    } catch (error) {
      // O erro é tratado pelo AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 rounded-lg border bg-white p-8 shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Criar Conta</h1>
        <p className="text-sm text-slate-500">
          Crie sua conta para participar da Jornada Fluxo Digital
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="seu.email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Função</FormLabel>
                <FormControl>
                  <select {...field} className="input">
                    <option value="aluno">Aluno</option>
                    <option value="coordenador">Coordenador</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Curso</FormLabel>
                <FormControl>
                  <select {...field} className="input">
                    <option value="">Selecione um curso</option>
                    <option value="ENG">Engenharia</option>
                    <option value="ADM">Administração</option>
                    <option value="MED">Medicina</option>
                    {/* Adicione mais opções conforme necessário */}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="periodSemester"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semestre</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Digite o semestre"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Criando conta..." : "Criar Conta"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-slate-600">Já tem uma conta? </span>
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Faça login
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;