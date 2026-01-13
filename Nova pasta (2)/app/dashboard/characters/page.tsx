'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Upload,
  Sparkles,
  Trash2,
  Eye,
  User,
} from 'lucide-react'
import { addCharacter, getAppState, generateId, getPlaceholderImage, updateLimits } from '@/lib/storage'
import { Character } from '@/types'

export default function Characters() {
  const router = useRouter()
  const [characters, setCharacters] = useState<Character[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    physicalDescription: '',
    clothing: '',
    personality: '',
    referenceImage: '',
  })

  useEffect(() => {
    const state = getAppState()
    setCharacters(state.characters)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, referenceImage: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerateCharacter = async () => {
    if (!formData.name || !formData.physicalDescription) {
      alert('Preencha pelo menos o nome e a descrição física!')
      return
    }

    setLoading(true)

    // Simular geração de IA (3 segundos)
    await new Promise(resolve => setTimeout(resolve, 3000))

    const newCharacter: Character = {
      id: generateId(),
      name: formData.name,
      physicalDescription: formData.physicalDescription,
      clothing: formData.clothing,
      personality: formData.personality,
      referenceImage: formData.referenceImage,
      generatedImage: getPlaceholderImage(512, 768, formData.name),
      createdAt: Date.now(),
      variations: [],
    }

    addCharacter(newCharacter)
    const state = getAppState()
    updateLimits({ imagesGenerated: state.limits.imagesGenerated + 1 })
    
    setCharacters([...characters, newCharacter])
    setFormData({
      name: '',
      physicalDescription: '',
      clothing: '',
      personality: '',
      referenceImage: '',
    })
    setShowForm(false)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
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
                  Personagens
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {characters.length} criados
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium text-sm"
            >
              {showForm ? 'Cancelar' : 'Novo'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Formulário de Criação */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-lg"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
              Criar Novo Personagem
            </h2>

            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome do Personagem *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Kaito Yukimura"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Descrição Física */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição Física *
                </label>
                <textarea
                  name="physicalDescription"
                  value={formData.physicalDescription}
                  onChange={handleInputChange}
                  placeholder="Ex: Cabelo preto curto e espetado, olhos azuis penetrantes, altura média (1.75m), corpo atlético..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Roupas/Estilo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Roupas e Estilo
                </label>
                <textarea
                  name="clothing"
                  value={formData.clothing}
                  onChange={handleInputChange}
                  placeholder="Ex: Usa sempre jaqueta de couro preta, camiseta branca básica, calça jeans rasgada e botas de combate..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Personalidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Personalidade
                </label>
                <textarea
                  name="personality"
                  value={formData.personality}
                  onChange={handleInputChange}
                  placeholder="Ex: Calmo e analítico, mas feroz em batalha. Protetor dos amigos, desconfiado com estranhos..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Upload de Referência */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Imagem de Referência (opcional)
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex-1 flex items-center justify-center px-4 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-purple-500 transition-colors">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formData.referenceImage ? 'Imagem carregada!' : 'Clique para fazer upload'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.referenceImage && (
                    <img
                      src={formData.referenceImage}
                      alt="Referência"
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                  )}
                </div>
              </div>

              {/* Botão Gerar */}
              <button
                onClick={handleGenerateCharacter}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                    Gerando com IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Gerar Personagem com IA
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Galeria de Personagens */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Galeria de Personagens
          </h2>

          {characters.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center">
              <User className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhum personagem criado
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Crie seu primeiro personagem para usar nos seus projetos!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {characters.map((character, index) => (
                <motion.div
                  key={character.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 relative">
                    <img
                      src={character.generatedImage || getPlaceholderImage(512, 768, character.name)}
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <button className="bg-black/50 backdrop-blur-sm p-2 rounded-lg hover:bg-black/70 transition-colors">
                        <Eye className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate">
                      {character.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {character.physicalDescription}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
