import { describe, test, expect, beforeEach, vi } from 'vitest'
import { DailyStreakService } from '@/services/DailyStreakService'

// Mock StorageService
vi.mock('@/services/StorageService', () => {
  let mockStore: { id: string; data: unknown } | null = null
  return {
    storageService: {
      executeTransaction: vi.fn().mockImplementation(async (_storeName, _mode, callback) => {
        const mockObjStore = {
          get: () => mockStore,
          put: (item: { id: string; data: unknown }) => {
            mockStore = item
          },
        }
        return callback(mockObjStore)
      }),
    },
  }
})

describe('DailyStreakService', () => {
  let service: DailyStreakService

  beforeEach(() => {
    service = new DailyStreakService()
  })

  test('should return local date string in YYYY-MM-DD format', () => {
    const todayStr = service.getTodayDateString()
    expect(todayStr).toMatch(/^\d{4}-\d{2}-\d{2}$/)

    const yesterdayStr = service.getYesterdayDateString()
    expect(yesterdayStr).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  test('should generate deterministic daily seed sequence', () => {
    const seq1 = service.generateDailySeedSequence(10)
    const seq2 = service.generateDailySeedSequence(10)

    expect(seq1).toHaveLength(10)
    expect(seq1).toEqual(seq2)
  })

  test('should start streak at 1 on initial record play', async () => {
    const streak = await service.recordPlayToday(false)
    expect(streak.currentStreak).toBe(1)
    expect(streak.highestStreak).toBe(1)
    expect(streak.lastPlayDate).toBe(service.getTodayDateString())
  })
})
