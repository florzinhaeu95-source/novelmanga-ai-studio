'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Plus, 
  LogOut, 
  Sun, 
  Moon, 
  Users, 
  Image as ImageIcon, 
  FolderOpen,
  Calendar,
  Settings,
  Sparkles
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { getAppState } from '@/lib/storage'
import { Project, Limits } from '@/types'

export default function Dashboard() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [limits, setLimits] = useState<Limits | null>(null)

  useEffect(() => {
    setMounted(true)
    // Verificar autenticação
    const isAuth = localStorage.getItem('novelmanga_auth')
    if (isAuth !== 'true') {
      router.push('/')
      return
    }

    // Carregar dados
    const state = getAppState()
    setProjects(state.projects)
    setLimits(state.limits)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('novelmanga_auth')
    router.push('/')
  }

  const getDaysUntilReset = () => {
    if (!limits) return 0
    const now = Date.now()
    const diff = limits.resetDate - now
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const getProgressColor = (current: number, max: number) => {
    const percentage = (current / max) * 100
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  if (!mounted || !limits) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-2 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  NovelManga AI
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Studio</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {/* Limites Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Limites Mensais
            </h2>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-1" />
              Reset em {getDaysUntilReset()} dias
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Imagens Geradas */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Imagens
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {limits.imagesGenerated}/{limits.maxImages}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getProgressColor(limits.imagesGenerated, limits.maxImages)}`}
                  style={{ width: `${(limits.imagesGenerated / limits.maxImages) * 100}%` }}
                />
              </div>
            </div>

            {/* Personagens */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-pink-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Personagens
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {limits.charactersCreated}/{limits.maxCharacters}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getProgressColor(limits.charactersCreated, limits.maxCharacters)}`}
                  style={{ width: `${(limits.charactersCreated / limits.maxCharacters) * 100}%` }}
                />
              </div>
            </div>

            {/* Projetos */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <FolderOpen className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Projetos
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {limits.activeProjects}/{limits.maxProjects}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getProgressColor(limits.activeProjects, limits.maxProjects)}`}
                  style={{ width: `${(limits.activeProjects / limits.maxProjects) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Projetos Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Meus Projetos
          </h2>

          {projects.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center">
              <FolderOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhum projeto ainda
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Crie seu primeiro projeto para começar a converter novels em manhwa!
              </p>
              <button
                onClick={() => router.push('/dashboard/new-project')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                Criar Projeto
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => router.push(`/dashboard/project/${project.id}`)}
                >
                  <div className="aspect-video bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 relative">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-white">
                      {project.scenes.length} cenas
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {project.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span className="capitalize">{project.style} • {project.format === 'pages' ? 'Páginas' : 'Scroll'}</span>
                      <span>{new Date(project.updatedAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex flex-col items-center space-y-1 text-primary-500"
            >
              <FolderOpen className="w-6 h-6" />
              <span className="text-xs font-medium">Projetos</span>
            </button>

            <button
              onClick={() => router.push('/dashboard/characters')}
              className="flex flex-col items-center space-y-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Users className="w-6 h-6" />
              <span className="text-xs">Personagens</span>
            </button>

            <button
              onClick={() => router.push('/dashboard/new-project')}
              className="relative -top-4"
            >
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 rounded-full shadow-lg">
                <Plus className="w-8 h-8 text-white" />
              </div>
            </button>

            <button
              onClick={() => router.push('/dashboard/converter')}
              className="flex flex-col items-center space-y-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Sparkles className="w-6 h-6" />
              <span className="text-xs">Converter</span>
            </button>

            <button
              onClick={() => router.push('/dashboard/settings')}
              className="flex flex-col items-center space-y-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs">Config</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
