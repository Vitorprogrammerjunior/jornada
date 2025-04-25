import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ChevronRight, Calendar, FileText, UserPlus, Award } from "lucide-react";
import { mockPhases } from "@/data/mockData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const LandingPage: React.FC = () => {
  useEffect(() => {
    document.title = "Jornada Fluxo Digital";
  }, []);

  const formatDate = (date: Date) =>
    format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  const features = [
    { title: "Formação de Grupos", description: "Forme grupos de trabalho com colegas para desenvolver seu projeto.", icon: UserPlus },
    { title: "Submissão de Trabalhos", description: "Envie resumos, artigos e apresentações nas datas determinadas.", icon: FileText },
    { title: "Feedback Detalhado", description: "Receba avaliações e notas para melhorar seu trabalho.", icon: CheckCircle },
    { title: "Reconhecimento", description: "Os melhores trabalhos recebem destaque e certificados.", icon: Award },
  ];

  // Animation variants
  const heroVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20, duration: 1 } },
  };
  const featureVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };
  const timelineVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Left: Title */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={heroVariants}
            className="text-xl font-bold text-blue-600"
          >
            Jornada Fluxo Digital
          </motion.h1>

          {/* Center: Logo */}
          <Link to="/">
            <motion.img
              layoutId="logo"
              src="/Logo_UNIVC.png"
              alt="Logo UNIVC"
              className="h-12 w-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.8 } }}
            />
          </Link>

          {/* Right: Buttons */}
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline">Entrar</Button>
              </motion.div>
            </Link>
            <Link to="/register">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button>Cadastrar</Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-5xl font-extrabold mb-6"
            initial="hidden"
            animate="visible"
            variants={heroVariants}
          >
            Jornada Fluxo Digital
          </motion.h2>
          <motion.p
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1.2 } }}
          >
            Uma experiência acadêmica completa para desenvolvimento de projetos,
            com acompanhamento e avaliação por etapas.
          </motion.p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link to="/register">
                <Button className="bg-white text-blue-600 w-full sm:w-auto">
                  Participar Agora
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link to="/login">
                <Button variant="outline" className="border-white text-white">
                  Já tenho uma conta
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={featureVariants}
          >
            <h2 className="text-3xl font-bold text-slate-900">Como Funciona</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
              A Jornada Fluxo Digital é um processo estruturado para o desenvolvimento
              de projetos acadêmicos, com fases bem definidas e feedback constante.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="border-2 border-slate-200 hover:border-blue-200 rounded-lg"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={featureVariants}
              >
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto bg-blue-100 text-blue-600 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={timelineVariants}
          >
            <h2 className="text-3xl font-bold text-slate-900">Cronograma</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
              Acompanhe as datas importantes da Jornada Fluxo Digital
            </p>
          </motion.div>
          <div className="max-w-3xl mx-auto border rounded-lg overflow-hidden">
            <div className="bg-blue-600 text-white py-3 px-4 flex justify-between items-center">
              <span className="text-sm">Fase</span>
              <span className="text-sm">Período</span>
            </div>
            <div className="divide-y">
              {mockPhases.map((phase, idx) => (
                <motion.div
                  key={idx}
                  className="p-4 flex justify-between items-center hover:bg-slate-50"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={timelineVariants}
                >
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
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl font-bold text-slate-900 mb-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={heroVariants}
          >
            Pronto para participar?
          </motion.h2>
          <motion.p
            className="text-slate-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1, transition: { duration: 0.8 } }}
            viewport={{ once: true }}
          >
            Junte-se à Jornada Fluxo Digital e desenvolva projetos junto com outros estudantes.
            Cadastre-se agora para começar sua jornada.
          </motion.p>
          <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
            <Link to="/register">
              <Button size="lg" className="px-8 py-6">
                Criar Conta <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        className="bg-slate-900 text-slate-400 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1 } }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Jornada Fluxo Digital</h3>
              <p className="text-sm">
                Plataforma de desenvolvimento de projetos acadêmicos com acompanhamento e avaliação por etapas.
              </p>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Cadastro</Link></li>
                <li><Link to="/schedule" className="hover:text-white transition-colors">Cronograma</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Contato</h3>
              <p className="text-sm">
                Para mais informações entre em contato com a coordenação.
              </p>
              <p className="text-sm mt-2">Email: contato@jornadafluxodigital.com</p>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Jornada Fluxo Digital. Todos os direitos reservados.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;
