export interface Achievement {
  id: string
  title: string
  description: string
  xp: number
  unlocked: boolean
  progress?: number
}
