'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  RefreshCw,
  Download,
  Grid3x3,
  ScrollText,
  GripVertical,
  Save,
  X,
  Loader2
} from 'lucide-react'
import { getAppState, updateProject, getPlaceholderImage, updateLimits } from '@/lib/storage'
import { Project, Scene } from '@/types'

export default function Editor() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'carousel' | 'scroll'>('carousel')
  const [editingScene, setEditingScene] = useState<Scene | null>(null)
  const [draggedScene, setDraggedScene] = useState<number | null>(null)
  const [regenerating, setRegenerating] = useState(false)

  useEffect(() => {
    const state = getAppState()
    const foundProject = state.projects.find(p => p.id === projectId)
    if (foundProject) {
      setProject(foundProject)
    } else {
      router.push('/dashboard')
    }
  }, [projectId, router])

  const handlePrevScene = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(currentSceneIndex - 1)
    }
  }

  const handleNextScene = () => {
    if (project && currentSceneIndex < project.scenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1)
    }
  }

  const handleEditScene = (scene: Scene) => {
    setEditingScene({ ...scene })
  }

  const handleSaveEdit = () => {
    if (!project || !editingScene) return

    const updatedScenes = project.scenes.map(s =>
      s.id === editingScene.id ? editingScene : s
    )

    const updatedProject = { ...project, scenes: updatedScenes }
    setProject(updatedProject)
    updateProject(projectId, { scenes: updatedScenes })
    setEditingScene(null)
  }

  const handleRegenerateScene = async (sceneId: string) => {
    if (!project) return

    setRegenerating(true)

    // Simular regeneração (3 segundos)
    await new Promise(resolve => setTimeout(resolve, 3000))

    const updatedScenes = project.scenes.map(s =>
      s.id === sceneId
        ? { ...s, imageUrl: getPlaceholderImage(800, 1200, `Regenerated ${Date.now()}`) }
        : s
    )

    const updatedProject = { ...project, scenes: updatedScenes }
    setProject(updatedProject)
    updateProject(projectId, { scenes: updatedScenes })

    const state = getAppState()
    updateLimits({ imagesGenerated: state.limits.imagesGenerated + 1 })

    setRegenerating(false)
  }

  const handleDeleteScene = (sceneId: string) => {
    if (!project) return
    if (!confirm('Deletar esta cena?')) return

    const updatedScenes = project.scenes.filter(s => s.id !== sceneId)
    const updatedProject = { ...project, scenes: updatedScenes }
    setProject(updatedProject)
    updateProject(projectId, { scenes: updatedScenes })

    if (currentSceneIndex >= updatedScenes.length) {
      setCurrentSceneIndex(Math.max(0, updatedScenes.length - 1))
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedScene(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedScene === null || !project) return

    if (draggedScene !== index) {
      const scenes = [...project.scenes]
      const draggedItem = scenes[draggedScene]
      scenes.splice(draggedScene, 1)
      scenes.splice(index, 0, draggedItem)

      // Atualizar ordem
      const reorderedScenes = scenes.map((s, i) => ({ ...s, order: i }))
      setProject({ ...project, scenes: reorderedScenes })
      setDraggedScene(index)
    }
  }

  const handleDragEnd = () => {
    if (project) {
      updateProject(projectId, { scenes: project.scenes })
    }
    setDraggedScene(null)
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const currentScene = project.scenes[currentSceneIndex]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {project.title}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {project.scenes.length} cenas
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode(viewMode === 'carousel' ? 'scroll' : 'carousel')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={viewMode === 'carousel' ? 'Modo Scroll' : 'Modo Carousel'}
              >
                {viewMode === 'carousel' ? (
                  <ScrollText className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Grid3x3 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
              <button
                onClick={() => router.push(`/dashboard/export/${projectId}`)}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium text-sm flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {viewMode === 'carousel' ? (
          /* Modo Carousel */
          <div className="space-y-6">
            {/* Navegação de Cenas */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevScene}
                disabled={currentSceneIndex === 0}
                className="p-3 bg-white dark:bg-gray-800 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>

              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Cena {currentSceneIndex + 1}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  de {project.scenes.length}
                </div>
              </div>

              <button
                onClick={handleNextScene}
                disabled={currentSceneIndex === project.scenes.length - 1}
                className="p-3 bg-white dark:bg-gray-800 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Cena Atual */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSceneIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg"
              >
                {/* Imagem */}
                <div className="aspect-[2/3] bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 relative">
                  <img
                    src={currentScene.imageUrl}
                    alt={`Scene ${currentSceneIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {regenerating && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-2" />
                        <p>Regenerando...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Texto e Controles */}
                <div className="p-6 space-y-4">
                  {currentScene.dialogue && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        "{currentScene.dialogue}"
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentScene.text}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditScene(currentScene)}
                      className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium text-sm flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleRegenerateScene(currentScene.id)}
                      disabled={regenerating}
                      className="flex-1 py-3 bg-purple-500 text-white rounded-xl font-medium text-sm flex items-center justify-center hover:bg-purple-600 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerar
                    </button>
                    <button
                      onClick={() => handleDeleteScene(currentScene.id)}
                      className="py-3 px-4 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          /* Modo Scroll - Grid de todas as cenas */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.scenes.map((scene, index) => (
              <motion.div
                key={scene.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-move ${
                  draggedScene === index ? 'opacity-50' : ''
                }`}
              >
                <div className="aspect-[2/3] bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 relative">
                  <img
                    src={scene.imageUrl}
                    alt={`Scene ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-lg">
                    <span className="text-white text-xs font-bold">#{index + 1}</span>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm p-1 rounded-lg">
                    <GripVertical className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {scene.text}
                  </p>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditScene(scene)}
                      className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-xs flex items-center justify-center hover:bg-blue-600"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleRegenerateScene(scene.id)}
                      className="py-2 px-3 bg-purple-500 text-white rounded-lg flex items-center justify-center hover:bg-purple-600"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteScene(scene.id)}
                      className="py-2 px-3 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Edição */}
      <AnimatePresence>
        {editingScene && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setEditingScene(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Editar Cena
                </h2>
                <button
                  onClick={() => setEditingScene(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prompt da Imagem
                  </label>
                  <textarea
                    value={editingScene.prompt}
                    onChange={(e) => setEditingScene({ ...editingScene, prompt: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Texto Descritivo
                  </label>
                  <textarea
                    value={editingScene.text}
                    onChange={(e) => setEditingScene({ ...editingScene, text: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Diálogo
                  </label>
                  <input
                    type="text"
                    value={editingScene.dialogue}
                    onChange={(e) => setEditingScene({ ...editingScene, dialogue: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ângulo
                    </label>
                    <select
                      value={editingScene.angle}
                      onChange={(e) => setEditingScene({ ...editingScene, angle: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="wide">Amplo</option>
                      <option value="medium">Médio</option>
                      <option value="close">Fechado</option>
                      <option value="extreme-close">Muito Fechado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Expressão
                    </label>
                    <select
                      value={editingScene.expression}
                      onChange={(e) => setEditingScene({ ...editingScene, expression: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="neutral">Neutro</option>
                      <option value="happy">Feliz</option>
                      <option value="sad">Triste</option>
                      <option value="angry">Bravo</option>
                      <option value="surprised">Surpreso</option>
                      <option value="scared">Assustado</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold flex items-center justify-center hover:shadow-lg transition-all"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Salvar Alterações
                  </button>
                  <button
                    onClick={() => setEditingScene(null)}
                    className="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
