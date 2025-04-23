
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ChevronRight, Calendar, FileText, UserPlus, Award } from "lucide-react";
import { mockPhases } from "@/data/mockData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const LandingPage = () => {
  useEffect(() => {
    document.title = "Jornada Fluxo Digital";
  }, []);

  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const features = [
    {
      title: "Formação de Grupos",
      description: "Forme grupos de trabalho com colegas para desenvolver seu projeto.",
      icon: UserPlus,
    },
    {
      title: "Submissão de Trabalhos",
      description: "Envie resumos, artigos e apresentações nas datas determinadas.",
      icon: FileText,
    },
    {
      title: "Feedback Detalhado",
      description: "Receba avaliações e notas para melhorar seu trabalho.",
      icon: CheckCircle,
    },
    {
      title: "Reconhecimento",
      description: "Os melhores trabalhos recebem destaque e certificados.",
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600">Jornada Fluxo Digital</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button>Cadastrar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Jornada Fluxo Digital</h1>
            <p className="text-xl mb-8">
              Uma experiência acadêmica completa para desenvolvimento de projetos,
              com acompanhamento e avaliação por etapas.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto">
                  Participar Agora
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="border-white text-white hover:bg-blue-700 w-full sm:w-auto">
                  Já tenho uma conta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Como Funciona</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
              A Jornada Fluxo Digital é um processo estruturado para o desenvolvimento
              de projetos acadêmicos, com fases bem definidas e feedback constante.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 border-slate-200 hover:border-blue-200 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto bg-blue-100 text-blue-600 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Cronograma</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
              Acompanhe as datas importantes da Jornada Fluxo Digital
            </p>
          </div>

          <div className="max-w-3xl mx-auto border rounded-lg overflow-hidden">
            <div className="bg-blue-600 text-white py-3 px-4 text-center flex justify-between items-center">
              <span className="text-sm">Fase</span>
              <span className="text-sm">Período</span>
            </div>
            
            <div className="divide-y">
              {mockPhases.map((phase, index) => (
                <div key={index} className="p-4 flex justify-between items-center hover:bg-slate-50">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <span className="text-sm font-medium">{phase.order}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{phase.name}</h4>
                      <p className="text-xs text-slate-500">{phase.description}</p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-blue-600" />
                    <span>{formatDate(phase.startDate)} - {formatDate(phase.endDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Pronto para participar?</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Junte-se à Jornada Fluxo Digital e desenvolva projetos junto com outros estudantes.
            Cadastre-se agora para começar sua jornada.
          </p>
          <Link to="/register">
            <Button className="px-8 py-6" size="lg">
              Criar Conta
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Jornada Fluxo Digital</h3>
              <p className="text-sm">
                Plataforma de desenvolvimento de projetos acadêmicos com acompanhamento 
                e avaliação por etapas.
              </p>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/login" className="hover:text-white transition-colors">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-white transition-colors">Cadastro</Link>
                </li>
                <li>
                  <Link to="/schedule" className="hover:text-white transition-colors">Cronograma</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Contato</h3>
              <p className="text-sm">
                Para mais informações entre em contato com a coordenação.
              </p>
              <p className="text-sm mt-2">
                Email: contato@jornadafluxodigital.com
              </p>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Jornada Fluxo Digital. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
