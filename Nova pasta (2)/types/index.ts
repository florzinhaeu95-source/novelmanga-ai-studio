export interface Character {
  id: string
  name: string
  physicalDescription: string
  clothing: string
  personality: string
  referenceImage?: string
  generatedImage?: string
  createdAt: number
  variations: string[]
}

export interface Scene {
  id: string
  imageUrl: string
  text: string
  dialogue: string
  prompt: string
  angle: string
  expression: string
  characterIds: string[]
  order: number
}

export interface Project {
  id: string
  title: string
  thumbnail: string
  scenes: Scene[]
  characters: Character[]
  style: 'manhwa' | 'manga' | 'webtoon'
  format: 'pages' | 'scroll'
  colorPalette: string
  createdAt: number
  updatedAt: number
}

export interface Limits {
  imagesGenerated: number
  maxImages: number
  charactersCreated: number
  maxCharacters: number
  activeProjects: number
  maxProjects: number
  resetDate: number
}

export interface AppState {
  projects: Project[]
  characters: Character[]
  limits: Limits
  currentProject?: Project
}
