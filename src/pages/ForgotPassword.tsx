
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { CheckCircle2, AlertCircle } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
});

type FormValues = z.infer<typeof formSchema>;

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Recuperar Senha | Jornada Fluxo Digital";
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success
      setIsSubmitted(true);
    } catch (err) {
      setError("Ocorreu um erro ao processar sua solicitação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600">Jornada Fluxo Digital</h1>
          <p className="mt-2 text-slate-600">Recupere sua senha</p>
        </div>
        
        <div className="w-full max-w-md space-y-6 rounded-lg border bg-white p-8 shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Esqueceu sua senha?</h1>
            <p className="text-sm text-slate-500">
              Digite seu email para receber as instruções de recuperação
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isSubmitted ? (
            <div className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">
                  As instruções de recuperação foram enviadas para o seu email.
                  Verifique sua caixa de entrada.
                </AlertDescription>
              </Alert>
              
              <div className="text-center">
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-800"
                >
                  Voltar para o login
                </Link>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Instruções"}
                </Button>

                <div className="text-center text-sm">
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    Voltar para o login
                  </Link>
                </div>
              </form>
            </Form>
          )}
        </div>
        
        <div className="text-center text-sm text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Jornada Fluxo Digital. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
