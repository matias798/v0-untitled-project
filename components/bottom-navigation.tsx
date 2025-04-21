"use client"

import { Home, BookOpen, BookText, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Home, label: "Inicio" },
    { href: "/aprender", icon: BookOpen, label: "Aprender" },
    { href: "/ejercicios", icon: BookText, label: "Ejercicios" },
    { href: "/perfil", icon: User, label: "Perfil" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-colors",
                isActive
                  ? "text-blue-500 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400",
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
