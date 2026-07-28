import type { Achievement } from '@/models/Achievement'
import { storageService } from './StorageService'
import { GameMode } from '@/core/game/GameMode'

export const INITIAL_ACHIEVEMENTS: ReadonlyArray<Omit<Achievement, 'unlockedAt'>> = [
  {
    id: 'memory_apprentice',
    title: 'Memory Apprentice',
    description: 'Reach Round 5 in Classic Mode',
    icon: '🥇',
    category: 'beginner',
    rarity: 'rare',
  },
  {
    id: 'memory_master',
    title: 'Memory Master',
    description: 'Reach Round 10 in Classic Mode',
    icon: '🏆',
    category: 'mastery',
    rarity: 'epic',
  },
  {
    id: 'century_club',
    title: 'Century Club',
    description: 'Score 100+ points in a single run',
    icon: '🔥',
    category: 'score',
    rarity: 'epic',
  },
  {
    id: 'reverse_genius',
    title: 'Reverse Genius',
    description: 'Reach Round 5 in Reverse Mode',
    icon: '🔄',
    category: 'mastery',
    rarity: 'epic',
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Reach Round 5 in Speed Rush Mode',
    icon: '⚡',
    category: 'speed',
    rarity: 'rare',
  },
  {
    id: 'time_warrior',
    title: 'Time Warrior',
    description: 'Reach Round 5 in Time Attack Mode',
    icon: '⏱️',
    category: 'speed',
    rarity: 'rare',
  },
  {
    id: 'titan_mind',
    title: 'Cognitive Titan',
    description: 'Reach a sequence length of 15',
    icon: '👑',
    category: 'mastery',
    rarity: 'legendary',
  },
  {
    id: 'score_legend',
    title: 'Score Legend',
    description: 'Score 200+ points in a single run',
    icon: '💎',
    category: 'score',
    rarity: 'legendary',
  },
]

export interface EvaluationContext {
  round: number
  score: number
  mode: GameMode
}

export class AchievementService {
  readonly #storeName = 'achievements'

  public async getAchievements(): Promise<ReadonlyArray<Achievement>> {
    try {
      const stored = await storageService.getAll<Achievement>(this.#storeName)

      const storedMap = new Map<string, Achievement>(
        (stored || []).map((item) => [item.id, item]),
      )

      return INITIAL_ACHIEVEMENTS.map((def) => {
        const existing = storedMap.get(def.id)
        return {
          ...def,
          unlockedAt: existing ? existing.unlockedAt : null,
        }
      })
    } catch {
      return INITIAL_ACHIEVEMENTS.map((def) => ({ ...def, unlockedAt: null }))
    }
  }

  public async evaluateGameRun(
    ctx: EvaluationContext,
  ): Promise<ReadonlyArray<Achievement>> {
    const achievements = await this.getAchievements()
    const newlyUnlocked: Achievement[] = []
    const now = new Date().toISOString()

    for (const ach of achievements) {
      if (ach.unlockedAt) continue

      let isConditionMet = false

      if (
        ach.id === 'memory_apprentice' &&
        ctx.mode === GameMode.Classic &&
        ctx.round >= 5
      ) {
        isConditionMet = true
      } else if (
        ach.id === 'memory_master' &&
        ctx.mode === GameMode.Classic &&
        ctx.round >= 10
      ) {
        isConditionMet = true
      } else if (ach.id === 'century_club' && ctx.score >= 100) {
        isConditionMet = true
      } else if (
        ach.id === 'reverse_genius' &&
        ctx.mode === GameMode.Reverse &&
        ctx.round >= 5
      ) {
        isConditionMet = true
      } else if (
        ach.id === 'speed_demon' &&
        ctx.mode === GameMode.SpeedRush &&
        ctx.round >= 5
      ) {
        isConditionMet = true
      } else if (
        ach.id === 'time_warrior' &&
        ctx.mode === GameMode.TimeAttack &&
        ctx.round >= 5
      ) {
        isConditionMet = true
      } else if (ach.id === 'titan_mind' && ctx.round >= 15) {
        isConditionMet = true
      } else if (ach.id === 'score_legend' && ctx.score >= 200) {
        isConditionMet = true
      }

      if (isConditionMet) {
        const unlockedItem: Achievement = { ...ach, unlockedAt: now }
        try {
          await storageService.put(this.#storeName, unlockedItem)
          newlyUnlocked.push(unlockedItem)
        } catch (err) {
          console.error(`Failed to persist unlocked achievement ${ach.id}:`, err)
        }
      }
    }

    return newlyUnlocked
  }
}

export const achievementService = new AchievementService()
