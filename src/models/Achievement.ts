export type AchievementCategory = 'beginner' | 'mastery' | 'speed' | 'score'

export interface Achievement {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly icon: string
  readonly category: AchievementCategory
  readonly unlockedAt: string | null
}
