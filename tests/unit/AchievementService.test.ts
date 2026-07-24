import { describe, test, expect, beforeEach, vi } from 'vitest'
import { AchievementService } from '@/services/AchievementService'
import { GameMode } from '@/core/game/GameMode'
import type { Achievement } from '@/models/Achievement'

vi.mock('@/services/StorageService', () => {
  const storeMap = new Map<string, Achievement>()
  return {
    storageService: {
      executeTransaction: vi.fn().mockImplementation(async (_storeName, mode, callback) => {
        const mockObjStore = {
          getAll: () => Array.from(storeMap.values()),
          put: (item: Achievement) => {
            storeMap.set(item.id, item)
          },
        }
        return callback(mockObjStore)
      }),
    },
  }
})

describe('AchievementService', () => {
  let service: AchievementService

  beforeEach(() => {
    service = new AchievementService()
  })

  test('should return all 8 initial achievements', async () => {
    const list = await service.getAchievements()
    expect(list).toHaveLength(8)
    expect(list.every((a) => a.unlockedAt === null)).toBe(true)
  })

  test('should unlock first_step achievement when reaching round 2', async () => {
    const unlocked = await service.evaluateGameRun({
      round: 2,
      score: 20,
      mode: GameMode.Classic,
    })

    expect(unlocked.some((a) => a.id === 'first_step')).toBe(true)
  })

  test('should unlock century_club achievement when score is 100 or higher', async () => {
    const unlocked = await service.evaluateGameRun({
      round: 6,
      score: 110,
      mode: GameMode.Classic,
    })

    expect(unlocked.some((a) => a.id === 'century_club')).toBe(true)
  })
})
