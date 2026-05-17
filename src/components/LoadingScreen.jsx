import React from 'react'
import { motion } from 'framer-motion'

const LoadingScreen = ({ mini = false }) => {
  if (mini) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          className="w-8 h-8 border-2 border-fin-accent/30 border-t-fin-accent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-fin-dark z-50 flex flex-col items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-fin-accent/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Logo */}
        <div className="relative mb-8">
          <motion.div
            className="w-24 h-24 rounded-2xl bg-gradient-to-br from-fin-accent to-fin-purple flex items-center justify-center"
            animate={{
              boxShadow: [
                '0 0 20px rgba(0, 212, 255, 0.3)',
                '0 0 60px rgba(0, 212, 255, 0.6)',
                '0 0 20px rgba(0, 212, 255, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-4xl font-bold text-white">F</span>
          </motion.div>

          {/* Orbiting dots */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: i === 0 ? '#00d4ff' : i === 1 ? '#7c3aed' : '#f43f5e',
                top: '50%',
                left: '50%',
              }}
              animate={{
                x: [0, Math.cos(i * 2.09) * 60, 0],
                y: [0, Math.sin(i * 2.09) * 60, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <motion.h1
          className="text-4xl font-bold mb-2 fin-gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          FinAnalytics
        </motion.h1>

        <motion.p
          className="text-white/50 text-sm mb-8 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Initializing Financial Intelligence Engine...
        </motion.p>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-fin-accent via-fin-purple to-fin-rose"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
          />
        </div>

        <motion.p
          className="text-white/30 text-xs mt-4 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Designed, Created and Developed by Anshuman Jha
        </motion.p>
        <motion.p
          className="text-white/20 text-xs mt-1 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Brainchild of Anshuman Kr Jha
        </motion.p>
      </motion.div>
    </div>
  )
}

export default LoadingScreen
