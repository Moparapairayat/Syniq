import { storageService } from './StorageService'
import { SimonColor } from '@/core/game/SimonColor'

export interface DailyStreakData {
  readonly currentStreak: number
  readonly highestStreak: number
  readonly lastPlayDate: string
  readonly lastDailyCompletedDate: string | null
}

export class DailyStreakService {
  readonly #storeName = 'settings'
  readonly #key = 'daily_streak_data'

  public getTodayDateString(): string {
    const now = new Date()
    return now.toISOString().split('T')[0]
  }

  public getYesterdayDateString(): string {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return yesterday.toISOString().split('T')[0]
  }

  public async getStreakData(): Promise<DailyStreakData> {
    try {
      const stored = await storageService.executeTransaction<{ id: string; data: DailyStreakData } | undefined>(
        this.#storeName,
        'readonly',
        (store) => store.get(this.#key),
      )
      if (stored && stored.data) {
        return this.#validateAndCleanStreak(stored.data)
      }
    } catch {
      // Fallback
    }

    return {
      currentStreak: 0,
      highestStreak: 0,
      lastPlayDate: '',
      lastDailyCompletedDate: null,
    }
  }

  public async recordPlayToday(isDailyCompleted: boolean = false): Promise<DailyStreakData> {
    const current = await this.getStreakData()
    const today = this.getTodayDateString()
    const yesterday = this.getYesterdayDateString()

    let newStreak = current.currentStreak
    if (current.lastPlayDate === today) {
      // Already played today
    } else if (current.lastPlayDate === yesterday) {
      newStreak += 1
    } else {
      newStreak = 1
    }

    const highest = Math.max(current.highestStreak, newStreak)
    const updated: DailyStreakData = {
      currentStreak: newStreak,
      highestStreak: highest,
      lastPlayDate: today,
      lastDailyCompletedDate: isDailyCompleted ? today : current.lastDailyCompletedDate,
    }

    await storageService.executeTransaction(
      this.#storeName,
      'readwrite',
      (store) => store.put({ id: this.#key, data: updated }),
    ).catch(() => undefined)

    return updated
  }

  public generateDailySeedSequence(length: number = 20): SimonColor[] {
    const seedStr = this.getTodayDateString()
    let hash = 0
    for (let i = 0; i < seedStr.length; i++) {
      hash = seedStr.charCodeAt(i) + ((hash << 5) - hash)
    }

    const colors = [SimonColor.Green, SimonColor.Red, SimonColor.Blue, SimonColor.Yellow]
    const sequence: SimonColor[] = []

    let state = Math.abs(hash)
    for (let i = 0; i < length; i++) {
      state = (state * 1664525 + 1013904223) % 4294967296
      const colorIndex = Math.abs(state) % colors.length
      sequence.push(colors[colorIndex])
    }

    return sequence
  }

  #validateAndCleanStreak(data: DailyStreakData): DailyStreakData {
    const today = this.getTodayDateString()
    const yesterday = this.getYesterdayDateString()

    if (data.lastPlayDate === today || data.lastPlayDate === yesterday) {
      return data
    }

    return {
      ...data,
      currentStreak: 0,
    }
  }
}

export const dailyStreakService = new DailyStreakService()
