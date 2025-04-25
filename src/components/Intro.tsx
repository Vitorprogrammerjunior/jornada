import { useEffect, useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import Header from '@/pages/LandingPage'

// Messages to display in sequence
const messages = [
  'Seja bem-vindo à Jornada de Inovação Científica UNIVC',
  'Aqui o futuro começa !!!',
]

// Container fade variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
  exit: { opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } },
}

// Logo pop-in and position transition
const logoVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 20, delay: 0.3 } },
  exit: { scale: 0.3, opacity: 1, transition: { duration: 1, ease: 'easeInOut' } },
}

// Messages fade variants
const messageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
}

export function Intro({ onFinish }: { onFinish: () => void }) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    // 0: show nothing
    // 1: show first message
    // 2: show second message
    // 3: exit
    const timers = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 500 + 2000),
      setTimeout(() => setStage(3), 500 + 2000 + 2000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <LayoutGroup>
      <Header />
      <AnimatePresence onExitComplete={onFinish}>
        {stage < 3 && (
          <motion.div
            key="intro"
            className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[999]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.img
              layoutId="logo"
              src="public\Logo_UNIVC.png"
              alt="Logo UNIVC"
              className="w-40 h-40 mb-6"
              variants={logoVariants}
            />

            <div className="text-center space-y-4">
              <motion.p
                variants={messageVariants}
                initial="hidden"
                animate={stage >= 1 ? 'visible' : 'hidden'}
                className="font-mono font-bold text-2xl"
              >
                {messages[0]}
              </motion.p>
              <motion.p
                variants={messageVariants}
                initial="hidden"
                animate={stage >= 2 ? 'visible' : 'hidden'}
                className="font-mono font-bold text-2xl"
              >
                {messages[1]}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  )
}
