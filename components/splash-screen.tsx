"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          delay: 0.2,
        }}
        className="relative w-32 h-32 mb-6"
      >
        <Image src="/logo.svg" alt="DanishLearner Logo" fill priority />
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-4xl font-bold text-blue-500 mb-2"
      >
        DanishLearner
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="text-lg text-gray-600 dark:text-gray-300"
      >
        Fra nul til B2
      </motion.p>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: 1.5,
          delay: 1,
          ease: "easeInOut",
        }}
        className="w-48 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-rose-400 rounded-full mt-8"
      />
    </div>
  )
}
