"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import {
  CircuitBoard,
  Network,
  GraduationCap,
  Microscope,
  Building2,
  Lightbulb,
  Briefcase,
  Award,
  BookMarked,
  Dna,
  Braces,
  Sparkles,
  Brain,
  Zap,
  Layers,
  Cpu,
  Globe,
  Rocket,
} from "lucide-react"

const Cronograma  =() => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const [showJourney, setShowJourney] = useState(false)
  const [isSelecting, setIsSelecting] = useState(true)

  useEffect(() => {
    if (selectedArea) {
      setTimeout(() => {
        setShowJourney(true)
      }, 1200)
    } else {
      setShowJourney(false)
    }
  }, [selectedArea])

  const handleSelectArea = (area: string) => {
    setIsSelecting(false)
    setShowJourney(false)
    setSelectedArea(area)
  }

  const handleReset = () => {
    setShowJourney(false)
    setTimeout(() => {
      setSelectedArea(null)
      setIsSelecting(true)
    }, 500)
  }

  const areas = [
    {
      id: "saude",
      nome: "Saúde",
      icone: <Dna className="h-full w-full" />,
      cor: "bg-emerald-500",
      corTexto: "text-emerald-500",
      corBorda: "border-emerald-300",
      corFundo: "bg-emerald-900/30",
      corGradiente: "from-emerald-600 to-emerald-400",
    },
    {
      id: "engenharia",
      nome: "Engenharia",
      icone: <CircuitBoard className="h-full w-full" />,
      cor: "bg-emerald-500",
      corTexto: "text-emerald-500",
      corBorda: "border-emerald-300",
      corFundo: "bg-emerald-900/30",
      corGradiente: "from-emerald-600 to-emerald-400",
    },
    {
      id: "humanas",
      nome: "Ciências Humanas",
      icone: <Network className="h-full w-full" />,
      cor: "bg-emerald-500",
      corTexto: "text-emerald-500",
      corBorda: "border-emerald-300",
      corFundo: "bg-emerald-900/30",
      corGradiente: "from-emerald-600 to-emerald-400",
    },
  ]

  const cronogramas = {
    saude: [
      {
        titulo: "Fundamentos Biológicos",
        descricao: "Bases moleculares e celulares dos sistemas vivos",
        icone: <Dna className="h-8 w-8 text-emerald-400" />,
        duracao: "2 semestres",
      },
      {
        titulo: "Sistemas Integrados",
        descricao: "Estudo avançado dos sistemas corporais e suas interações",
        icone: <Microscope className="h-8 w-8 text-emerald-400" />,
        duracao: "2 semestres",
      },
      {
        titulo: "Prática Clínica",
        descricao: "Aplicação do conhecimento em ambientes controlados",
        icone: <Brain className="h-8 w-8 text-emerald-400" />,
        duracao: "4 semestres",
      },
      {
        titulo: "Imersão Hospitalar",
        descricao: "Experiência prática em ambientes de saúde reais",
        icone: <Building2 className="h-8 w-8 text-emerald-400" />,
        duracao: "2 semestres",
      },
      {
        titulo: "Pesquisa Avançada",
        descricao: "Desenvolvimento de projeto científico inovador",
        icone: <Sparkles className="h-8 w-8 text-emerald-400" />,
        duracao: "1 semestre",
      },
      {
        titulo: "Certificação Profissional",
        descricao: "Finalização e preparação para o mercado",
        icone: <GraduationCap className="h-8 w-8 text-emerald-400" />,
        duracao: "1 semestre + especialização",
      },
    ],
    engenharia: [
      {
        titulo: "Fundamentos Técnicos",
        descricao: "Matemática avançada, física e computação",
        icone: <Braces className="h-8 w-8 text-emerald-400" />,
        duracao: "2 semestres",
      },
      {
        titulo: "Sistemas Complexos",
        descricao: "Modelagem, simulação e análise de sistemas",
        icone: <Cpu className="h-8 w-8 text-emerald-400" />,
        duracao: "2 semestres",
      },
      {
        titulo: "Especialização Técnica",
        descricao: "Aprofundamento em tecnologias específicas",
        icone: <Layers className="h-8 w-8 text-emerald-400" />,
        duracao: "4 semestres",
      },
      {
        titulo: "Laboratório de Inovação",
        descricao: "Desenvolvimento de protótipos e soluções",
        icone: <Lightbulb className="h-8 w-8 text-emerald-400" />,
        duracao: "2 semestres",
      },
      {
        titulo: "Imersão Industrial",
        descricao: "Experiência prática em ambiente empresarial",
        icone: <Rocket className="h-8 w-8 text-emerald-400" />,
        duracao: "1 semestre",
      },
      {
        titulo: "Projeto Integrador",
        descricao: "Solução completa para problema real",
        icone: <GraduationCap className="h-8 w-8 text-emerald-400" />,
        duracao: "1 semestre",
      },
    ],
    humanas: [
      {
        titulo: "Bases Conceituais",
        descricao: "Fundamentos filosóficos e metodológicos",
        icone: <BookMarked className="h-8 w-8 text-emerald-400" />,
        duracao: "2 semestres",
      },
      {
        titulo: "Métodos de Análise",
        descricao: "Ferramentas para investigação social e cultural",
        icone: <Zap className="h-8 w-8 text-emerald-400" />,
        duracao: "2 semestres",
      },
      {
        titulo: "Estudos Especializados",
        descricao: "Aprofundamento em áreas específicas",
        icone: <Globe className="h-8 w-8 text-emerald-400" />,
        duracao: "4 semestres",
      },
      {
        titulo: "Pesquisa Aplicada",
        descricao: "Desenvolvimento de projetos em contextos reais",
        icone: <Network className="h-8 w-8 text-emerald-400" />,
        duracao: "2 semestres",
      },
      {
        titulo: "Imersão Profissional",
        descricao: "Experiência prática em organizações",
        icone: <Briefcase className="h-8 w-8 text-emerald-400" />,
        duracao: "1 semestre",
      },
      {
        titulo: "Síntese e Contribuição",
        descricao: "Produção acadêmica de impacto social",
        icone: <Award className="h-8 w-8 text-emerald-400" />,
        duracao: "1 semestre",
      },
    ],
  }

  const getAreaInfo = () => {
    return areas.find((a) => a.id === selectedArea) || areas[0]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      <div className="relative w-full h-screen">
        {/* Partículas de fundo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-emerald-400 opacity-20"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                x: [null, Math.random() * window.innerWidth],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              style={{
                width: `${Math.random() * 10 + 2}px`,
                height: `${Math.random() * 10 + 2}px`,
              }}
            />
          ))}
        </div>

        {/* Linhas de grade futuristas */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-full h-full border-t border-l border-emerald-500/10 grid grid-cols-6 grid-rows-6">
            {[...Array(36)].map((_, i) => (
              <div key={i} className="border-b border-r border-emerald-500/10" />
            ))}
          </div>
        </div>

        {/* Título principal */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="absolute top-10 left-0 right-0 text-center z-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-400 mb-2 tracking-tight">JORNADA ACADÊMICA</h1>
          <p className="text-lg text-emerald-200/80 max-w-xl mx-auto px-4">
            {isSelecting
              ? "Selecione uma área para iniciar sua trajetória"
              : selectedArea && !showJourney
                ? `Preparando sua jornada em ${getAreaInfo().nome}...`
                : `Explore os seis estágios da jornada em ${getAreaInfo().nome}`}
          </p>
        </motion.div>

        {/* Seleção de áreas */}
        <AnimatePresence>
          {isSelecting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 px-4">
                {areas.map((area) => (
                  <motion.div
                    key={area.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center"
                  >
                    <motion.button
                      onClick={() => handleSelectArea(area.id)}
                      className={`w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${area.corGradiente} flex items-center justify-center 
                      shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-emerald-300/30 relative overflow-hidden`}
                      whileHover={{
                        boxShadow: "0 0 30px rgba(16, 185, 129, 0.6)",
                        borderColor: "rgba(16, 185, 129, 0.8)",
                      }}
                    >
                      {/* Efeito de brilho */}
                      <motion.div
                        className="absolute inset-0 bg-emerald-300/30"
                        animate={{
                          opacity: [0, 0.5, 0],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "loop",
                        }}
                      />
                      <div className="w-12 h-12 md:w-16 md:h-16 text-white relative z-10">{area.icone}</div>
                    </motion.button>
                    <motion.p
                      className="mt-4 text-lg font-medium text-emerald-300"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {area.nome}
                    </motion.p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ícone selecionado animado */}
        <AnimatePresence>
          {selectedArea && !isSelecting && !showJourney && (
            <motion.div
              initial={{ scale: 1, y: 0 }}
              animate={{ scale: [1, 1.5, 1.2], y: [-50, 0] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 1.5, times: [0, 0.5, 1] }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                className={`w-40 h-40 bg-gradient-to-br ${getAreaInfo().corGradiente} rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden`}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(16, 185, 129, 0.3)",
                    "0 0 60px rgba(16, 185, 129, 0.6)",
                    "0 0 20px rgba(16, 185, 129, 0.3)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                {/* Efeito de pulso */}
                <motion.div
                  className="absolute inset-0 bg-emerald-300/20 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                />

                {/* Efeito de rotação */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-emerald-300/30 border-t-emerald-300"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />

                <div className="w-24 h-24 text-white relative z-10">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    {getAreaInfo().icone}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cronograma da jornada */}
        <AnimatePresence>
          {selectedArea && showJourney && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-y-auto"
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
              >
                {cronogramas[selectedArea].map((etapa, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className="h-full"
                  >
                    <Card
                      className={`h-full border border-emerald-500/30 bg-gray-900/80 backdrop-blur-sm hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 overflow-hidden relative`}
                    >
                      {/* Borda brilhante */}
                      <motion.div
                        className="absolute inset-0 border-2 border-emerald-400/0 rounded-lg"
                        animate={{
                          borderColor: ["rgba(52, 211, 153, 0)", "rgba(52, 211, 153, 0.3)", "rgba(52, 211, 153, 0)"],
                        }}
                        transition={{
                          duration: 2,
                          delay: index * 0.2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "loop",
                        }}
                      />

                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div
                            className={`mr-4 p-3 rounded-full ${getAreaInfo().corFundo} border border-emerald-500/30`}
                          >
                            {etapa.icone}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-emerald-300">{etapa.titulo}</h3>
                            <p className="text-sm text-emerald-100/60">{etapa.duracao}</p>
                          </div>
                        </div>
                        <p className="text-emerald-100/80">{etapa.descricao}</p>
                        <div
                          className={`h-1 w-full mt-4 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400`}
                        ></div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              <motion.button
                onClick={handleReset}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-10 px-8 py-3 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-medium backdrop-blur-sm transition-all duration-300 border border-emerald-500/30 hover:border-emerald-500/50 relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Efeito de brilho no hover */}
                <motion.div
                  className="absolute inset-0 bg-emerald-400/0 group-hover:bg-emerald-400/10"
                  animate={{
                    opacity: [0, 0.2, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                />
                Escolher outra área
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
export default Cronograma;