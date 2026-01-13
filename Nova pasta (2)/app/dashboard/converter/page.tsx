'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Sparkles,
  X,
  Palette,
  Book,
  Grid3x3,
  ScrollText,
  Loader2
} from 'lucide-react'
import { getAppState, generateId, getPlaceholderImage, addProject, updateLimits } from '@/lib/storage'
import { Character, Scene, Project } from '@/types'

export default function Converter() {
  const router = useRouter()
  const [novelText, setNovelText] = useState('')
  const [projectTitle, setProjectTitle] = useState('')
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([])
  const [characters, setCharacters] = useState<Character[]>([])
  const [style, setStyle] = useState<'manhwa' | 'manga' | 'webtoon'>('manhwa')
  const [format, setFormat] = useState<'pages' | 'scroll'>('scroll')
  const [colorPalette, setColorPalette] = useState('vibrant')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const state = getAppState()
    setCharacters(state.characters)
  }, [])

  const toggleCharacter = (characterId: string) => {
    if (selectedCharacters.includes(characterId)) {
      setSelectedCharacters(selectedCharacters.filter(id => id !== characterId))
    } else {
      setSelectedCharacters([...selectedCharacters, characterId])
    }
  }

  const convertToScenes = (text: string): Scene[] => {
    // Dividir texto em parágrafos
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0)
    
    // Criar cenas (simplificado - pode ser mais inteligente)
    const scenes: Scene[] = []
    
    paragraphs.forEach((paragraph, index) => {
      // Detectar diálogos (texto entre aspas)
      const dialogueMatch = paragraph.match(/"([^"]+)"/)
      const dialogue = dialogueMatch ? dialogueMatch[1] : ''
      
      // Texto descritivo (sem diálogos)
      const descriptiveText = paragraph.replace(/"[^"]+"/g, '').trim()
      
      const scene: Scene = {
        id: generateId(),
        imageUrl: getPlaceholderImage(800, 1200, `Scene ${index + 1}`),
        text: descriptiveText,
        dialogue,
        prompt: `${style} style illustration: ${descriptiveText.substring(0, 200)}`,
        angle: 'medium',
        expression: 'neutral',
        characterIds: selectedCharacters,
        order: index,
      }
      
      scenes.push(scene)
    })
    
    return scenes
  }

  const handleConvert = async () => {
    if (!novelText.trim()) {
      alert('Cole o texto da novel primeiro!')
      return
    }

    if (!projectTitle.trim()) {
      alert('Dê um título ao projeto!')
      return
    }

    setLoading(true)

    // Simular processamento de IA (4 segundos)
    await new Promise(resolve => setTimeout(resolve, 4000))

    const scenes = convertToScenes(novelText)
    
    const project: Project = {
      id: generateId(),
      title: projectTitle,
      thumbnail: scenes[0]?.imageUrl || getPlaceholderImage(800, 600, projectTitle),
      scenes,
      characters: characters.filter(c => selectedCharacters.includes(c.id)),
      style,
      format,
      colorPalette,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    addProject(project)
    
    const state = getAppState()
    updateLimits({ 
      imagesGenerated: state.limits.imagesGenerated + scenes.length 
    })

    setLoading(false)
    router.push(`/dashboard/editor/${project.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Converter Novel
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Transforme texto em manhwa/webtoon
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Título do Projeto */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Título do Projeto *
          </label>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            placeholder="Ex: A Jornada do Herói - Capítulo 1"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Texto da Novel */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <Book className="w-4 h-4 mr-2" />
            Cole o Texto da Novel *
          </label>
          <textarea
            value={novelText}
            onChange={(e) => setNovelText(e.target.value)}
            placeholder={`Cole aqui o texto da sua novel...\n\nDica: Separe parágrafos com linhas em branco para melhor divisão de cenas.`}
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {novelText.split('\n\n').filter(p => p.trim()).length} parágrafos • 
            Aproximadamente {novelText.split('\n\n').filter(p => p.trim()).length} cenas
          </p>
        </div>

        {/* Seleção de Personagens */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Selecione os Personagens
          </label>
          
          {characters.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 dark:text-gray-400 mb-3">
                Você ainda não criou nenhum personagem
              </p>
              <button
                onClick={() => router.push('/dashboard/characters')}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600"
              >
                Criar Personagem
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {characters.map((character) => (
                <motion.button
                  key={character.id}
                  onClick={() => toggleCharacter(character.id)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all ${
                    selectedCharacters.includes(character.id)
                      ? 'bg-purple-500 border-purple-500 text-white'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <img
                    src={character.generatedImage || getPlaceholderImage(64, 64, character.name)}
                    alt={character.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium">{character.name}</span>
                  {selectedCharacters.includes(character.id) && (
                    <X className="w-4 h-4" />
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Configurações de Estilo */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
            Configurações de Estilo
          </h3>

          <div className="space-y-4">
            {/* Estilo Visual */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estilo Visual
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['manhwa', 'manga', 'webtoon'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s as any)}
                    className={`py-3 rounded-xl font-medium text-sm capitalize transition-all ${
                      style === s
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Formato */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Formato de Leitura
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setFormat('pages')}
                  className={`py-3 rounded-xl font-medium text-sm flex items-center justify-center space-x-2 transition-all ${
                    format === 'pages'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                  <span>Páginas</span>
                </button>
                <button
                  onClick={() => setFormat('scroll')}
                  className={`py-3 rounded-xl font-medium text-sm flex items-center justify-center space-x-2 transition-all ${
                    format === 'scroll'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <ScrollText className="w-4 h-4" />
                  <span>Scroll Vertical</span>
                </button>
              </div>
            </div>

            {/* Paleta de Cores */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Palette className="w-4 h-4 mr-2" />
                Paleta de Cores
              </label>
              <select
                value={colorPalette}
                onChange={(e) => setColorPalette(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="vibrant">Vibrante (Colorido)</option>
                <option value="dark">Escuro (Sombrio)</option>
                <option value="pastel">Pastel (Suave)</option>
                <option value="monochrome">Monocromático (P&B)</option>
                <option value="neon">Neon (Cyberpunk)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Botão Converter */}
        <button
          onClick={handleConvert}
          disabled={loading || !novelText.trim() || !projectTitle.trim()}
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Convertendo em Cenas...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Converter em Manhwa
            </>
          )}
        </button>
      </main>
    </div>
  )
}
