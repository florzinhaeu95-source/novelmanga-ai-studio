'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Download,
  Share2,
  FileImage,
  FileText,
  Loader2,
  Check,
  Grid3x3,
  ScrollText
} from 'lucide-react'
import { getAppState } from '@/lib/storage'
import { Project } from '@/types'

export default function Export() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [exporting, setExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)
  const [previewMode, setPreviewMode] = useState<'pages' | 'scroll'>('pages')

  useEffect(() => {
    const state = getAppState()
    const foundProject = state.projects.find(p => p.id === projectId)
    if (foundProject) {
      setProject(foundProject)
      setPreviewMode(foundProject.format)
    } else {
      router.push('/dashboard')
    }
  }, [projectId, router])

  const handleExportImages = async () => {
    if (!project) return

    setExporting(true)
    setExportComplete(false)

    // Simular exportação (3 segundos)
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Em produção real, usar JSZip para criar arquivo ZIP
    alert(`Exportação concluída!\n\n${project.scenes.length} imagens prontas para download.`)

    setExporting(false)
    setExportComplete(true)

    setTimeout(() => setExportComplete(false), 3000)
  }

  const handleExportPDF = async () => {
    if (!project) return

    setExporting(true)
    setExportComplete(false)

    // Simular exportação (4 segundos)
    await new Promise(resolve => setTimeout(resolve, 4000))

    // Em produção real, usar jsPDF + html2canvas
    alert(`PDF gerado!\n\nArquivo: ${project.title}.pdf`)

    setExporting(false)
    setExportComplete(true)

    setTimeout(() => setExportComplete(false), 3000)
  }

  const handleShare = async () => {
    if (!project) return

    const shareData = {
      title: project.title,
      text: `Confira meu manhwa criado com NovelManga AI: ${project.title}`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Compartilhamento cancelado')
      }
    } else {
      // Fallback: copiar link
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para área de transferência!')
    }
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push(`/dashboard/editor/${projectId}`)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Exportar Projeto
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {project.title}
                </p>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Preview Mode Toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Preview Final
          </h2>

          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setPreviewMode('pages')}
              className={`flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center transition-all ${
                previewMode === 'pages'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Grid3x3 className="w-4 h-4 mr-2" />
              Modo Páginas
            </button>
            <button
              onClick={() => setPreviewMode('scroll')}
              className={`flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center transition-all ${
                previewMode === 'scroll'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <ScrollText className="w-4 h-4 mr-2" />
              Modo Scroll
            </button>
          </div>

          {/* Preview */}
          <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 max-h-96 overflow-y-auto">
            {previewMode === 'pages' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {project.scenes.map((scene, index) => (
                  <motion.div
                    key={scene.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-sm"
                  >
                    <img
                      src={scene.imageUrl}
                      alt={`Scene ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/70 px-2 py-0.5 rounded text-white text-xs">
                      #{index + 1}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-w-md mx-auto">
                {project.scenes.map((scene, index) => (
                  <motion.div
                    key={scene.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <img
                      src={scene.imageUrl}
                      alt={`Scene ${index + 1}`}
                      className="w-full rounded-lg shadow-sm"
                    />
                    {scene.dialogue && (
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mt-2 shadow-sm">
                        <p className="text-sm text-gray-900 dark:text-white">
                          "{scene.dialogue}"
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Opções de Exportação
          </h2>

          <div className="space-y-3">
            {/* Exportar como Imagens (ZIP) */}
            <button
              onClick={handleExportImages}
              disabled={exporting}
              className="w-full p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl flex items-center justify-between hover:shadow-lg transition-all disabled:opacity-50"
            >
              <div className="flex items-center">
                <FileImage className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Salvar como Imagens</div>
                  <div className="text-xs opacity-90">
                    Baixar {project.scenes.length} imagens em arquivo ZIP
                  </div>
                </div>
              </div>
              {exportComplete ? (
                <Check className="w-6 h-6" />
              ) : exporting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Download className="w-6 h-6" />
              )}
            </button>

            {/* Gerar PDF */}
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-between hover:shadow-lg transition-all disabled:opacity-50"
            >
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Gerar PDF</div>
                  <div className="text-xs opacity-90">
                    Criar documento PDF com todas as cenas
                  </div>
                </div>
              </div>
              {exportComplete ? (
                <Check className="w-6 h-6" />
              ) : exporting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Download className="w-6 h-6" />
              )}
            </button>

            {/* Compartilhar Online */}
            <button
              onClick={handleShare}
              className="w-full p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl flex items-center justify-between hover:shadow-lg transition-all"
            >
              <div className="flex items-center">
                <Share2 className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Compartilhar Online</div>
                  <div className="text-xs opacity-90">
                    Gerar link de compartilhamento
                  </div>
                </div>
              </div>
              <ArrowLeft className="w-6 h-6 rotate-180" />
            </button>
          </div>
        </div>

        {/* Info do Projeto */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Informações do Projeto
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500 dark:text-gray-400 mb-1">Cenas</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {project.scenes.length}
              </div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400 mb-1">Estilo</div>
              <div className="font-semibold text-gray-900 dark:text-white capitalize">
                {project.style}
              </div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400 mb-1">Formato</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {project.format === 'pages' ? 'Páginas' : 'Scroll Vertical'}
              </div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400 mb-1">Paleta</div>
              <div className="font-semibold text-gray-900 dark:text-white capitalize">
                {project.colorPalette}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
