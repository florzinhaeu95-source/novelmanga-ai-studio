import { AppState, Project, Character, Limits } from '@/types'

const STORAGE_KEY = 'novelmanga_data'

export const getAppState = (): AppState => {
  if (typeof window === 'undefined') return getDefaultState()
  
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return getDefaultState()
    return JSON.parse(data)
  } catch {
    return getDefaultState()
  }
}

export const saveAppState = (state: AppState) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const getDefaultState = (): AppState => {
  const now = Date.now()
  const resetDate = new Date()
  resetDate.setMonth(resetDate.getMonth() + 1)
  resetDate.setDate(1)
  resetDate.setHours(0, 0, 0, 0)

  return {
    projects: [],
    characters: [],
    limits: {
      imagesGenerated: 420,
      maxImages: 500,
      charactersCreated: 16,
      maxCharacters: 20,
      activeProjects: 3,
      maxProjects: 5,
      resetDate: resetDate.getTime(),
    },
  }
}

export const updateLimits = (limits: Partial<Limits>) => {
  const state = getAppState()
  state.limits = { ...state.limits, ...limits }
  saveAppState(state)
}

export const addProject = (project: Project) => {
  const state = getAppState()
  state.projects.push(project)
  state.limits.activeProjects = state.projects.length
  saveAppState(state)
}

export const updateProject = (projectId: string, updates: Partial<Project>) => {
  const state = getAppState()
  const index = state.projects.findIndex(p => p.id === projectId)
  if (index !== -1) {
    state.projects[index] = { ...state.projects[index], ...updates, updatedAt: Date.now() }
    saveAppState(state)
  }
}

export const deleteProject = (projectId: string) => {
  const state = getAppState()
  state.projects = state.projects.filter(p => p.id !== projectId)
  state.limits.activeProjects = state.projects.length
  saveAppState(state)
}

export const addCharacter = (character: Character) => {
  const state = getAppState()
  state.characters.push(character)
  state.limits.charactersCreated = state.characters.length
  saveAppState(state)
}

export const updateCharacter = (characterId: string, updates: Partial<Character>) => {
  const state = getAppState()
  const index = state.characters.findIndex(c => c.id === characterId)
  if (index !== -1) {
    state.characters[index] = { ...state.characters[index], ...updates }
    saveAppState(state)
  }
}

export const deleteCharacter = (characterId: string) => {
  const state = getAppState()
  state.characters = state.characters.filter(c => c.id !== characterId)
  state.limits.charactersCreated = state.characters.length
  saveAppState(state)
}

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const getPlaceholderImage = (width: number = 800, height: number = 600, text: string = '') => {
  return `https://placehold.co/${width}x${height}/2D1B69/FFF?text=${encodeURIComponent(text || 'Gerando...')}`
}
