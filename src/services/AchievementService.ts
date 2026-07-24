import type { Achievement } from '@/models/Achievement'
import { storageService } from './StorageService'
import { GameMode } from '@/core/game/GameMode'

export const INITIAL_ACHIEVEMENTS: ReadonlyArray<Omit<Achievement, 'unlockedAt'>> = [
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Complete Round 1 in any mode',
    icon: '🔰',
    category: 'beginner',
  },
  {
    id: 'memory_apprentice',
    title: 'Memory Apprentice',
    description: 'Reach Round 5 in Classic Mode',
    icon: '🥇',
    category: 'beginner',
  },
  {
    id: 'memory_master',
    title: 'Memory Master',
    description: 'Reach Round 10 in Classic Mode',
    icon: '🏆',
    category: 'mastery',
  },
  {
    id: 'century_club',
    title: 'Century Club',
    description: 'Score 100+ points in a single run',
    icon: '🔥',
    category: 'score',
  },
  {
    id: 'reverse_genius',
    title: 'Reverse Genius',
    description: 'Reach Round 5 in Reverse Mode',
    icon: '🔄',
    category: 'mastery',
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Reach Round 5 in Speed Rush Mode',
    icon: '⚡',
    category: 'speed',
  },
  {
    id: 'time_warrior',
    title: 'Time Warrior',
    description: 'Reach Round 5 in Time Attack Mode',
    icon: '⏱️',
    category: 'speed',
  },
  {
    id: 'titan_mind',
    title: 'Cognitive Titan',
    description: 'Reach a sequence length of 15',
    icon: '👑',
    category: 'mastery',
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
      const stored = await storageService.executeTransaction<Achievement[]>(
        this.#storeName,
        'readonly',
        (store) => store.getAll(),
      )
      
      const storedMap = new Map<string, Achievement>(
        (stored || []).map((item) => [item.id, item])
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

  public async evaluateGameRun(ctx: EvaluationContext): Promise<ReadonlyArray<Achievement>> {
    const achievements = await this.getAchievements()
    const newlyUnlocked: Achievement[] = []
    const now = new Date().toISOString()

    for (const achievement of achievements) {
      if (achievement.unlockedAt) continue // Already unlocked

      let unlock = false

      if (achievement.id === 'first_step' && ctx.round >= 2) {
        unlock = true
      } else if (achievement.id === 'memory_apprentice' && ctx.mode === GameMode.Classic && ctx.round >= 5) {
        unlock = true
      } else if (achievement.id === 'memory_master' && ctx.mode === GameMode.Classic && ctx.round >= 10) {
        unlock = true
      } else if (achievement.id === 'century_club' && ctx.score >= 100) {
        unlock = true
      } else if (achievement.id === 'reverse_genius' && ctx.mode === GameMode.Reverse && ctx.round >= 5) {
        unlock = true
      } else if (achievement.id === 'speed_demon' && ctx.mode === GameMode.SpeedRush && ctx.round >= 5) {
        unlock = true
      } else if (achievement.id === 'time_warrior' && ctx.mode === GameMode.TimeAttack && ctx.round >= 5) {
        unlock = true
      } else if (achievement.id === 'titan_mind' && ctx.round >= 15) {
        unlock = true
      }

      if (unlock) {
        const updated: Achievement = { ...achievement, unlockedAt: now }
        newlyUnlocked.push(updated)
        await storageService.executeTransaction(
          this.#storeName,
          'readwrite',
          (store) => store.put(updated),
        ).catch(() => undefined)
      }
    }

    return newlyUnlocked
  }
}

export const achievementService = new AchievementService()
