'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Trash2, Database, Info } from 'lucide-react'
import { useState } from 'react'

export default function Settings() {
  const router = useRouter()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleClearData = () => {
    if (confirm('Tem certeza? Todos os dados serão perdidos permanentemente!')) {
      localStorage.clear()
      alert('Dados limpos! Você será redirecionado para o login.')
      router.push('/')
    }
  }

  const getStorageSize = () => {
    let total = 0
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length
      }
    }
    return (total / 1024).toFixed(2) + ' KB'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Configurações
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Informações do App */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2 text-blue-500" />
            Sobre o App
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Nome:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                NovelManga AI Studio
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Versão:</span>
              <span className="font-medium text-gray-900 dark:text-white">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                Progressive Web App
              </span>
            </div>
          </div>
        </motion.div>

        {/* Armazenamento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2 text-purple-500" />
            Armazenamento Local
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                Espaço utilizado:
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {getStorageSize()}
              </span>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center justify-center"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Limpar Todos os Dados
              </button>
            </div>
          </div>
        </motion.div>

        {/* Informações Técnicas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Informações Técnicas
          </h2>
          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <p>• Todos os dados são armazenados localmente no seu dispositivo</p>
            <p>• Nenhuma informação é enviada para servidores externos</p>
            <p>• Use este app como PWA instalando-o na tela inicial</p>
            <p>• Limpar o cache do navegador irá apagar todos os dados</p>
          </div>
        </motion.div>
      </main>

      {/* Modal de Confirmação */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowClearConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              ⚠️ Atenção!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Esta ação irá deletar permanentemente:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-2">
              <li>• Todos os projetos criados</li>
              <li>• Todos os personagens</li>
              <li>• Todas as configurações</li>
              <li>• Histórico de uso</li>
            </ul>
            <p className="text-red-500 font-semibold mb-6">
              Esta ação não pode ser desfeita!
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleClearData}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                Sim, Limpar Tudo
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
