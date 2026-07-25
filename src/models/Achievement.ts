export type AchievementCategory = 'beginner' | 'mastery' | 'speed' | 'score'
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface Achievement {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly icon: string
  readonly category: AchievementCategory
  readonly rarity?: AchievementRarity
  readonly unlockedAt: string | null
}
