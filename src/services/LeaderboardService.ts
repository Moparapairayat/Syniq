import type { ScoreEntry } from '@/models/ScoreEntry'
import { leaderboardRepository } from '@/repositories/LeaderboardRepository'

/**
 * Service orchestrating score entries, sorting tables, and maintaining a strict Top 10 list.
 */
export class LeaderboardService {
  readonly #maxEntries = 10

  /**
   * Loads leaderboard entries sorted descending by score and recent date.
   */
  public async getTopScores(): Promise<ReadonlyArray<ScoreEntry>> {
    try {
      const allScores = await leaderboardRepository.getAll()
      return [...allScores]
        .sort(
          (a, b) => b.score - a.score || b.timestamp.getTime() - a.timestamp.getTime(),
        )
        .slice(0, this.#maxEntries)
    } catch (error) {
      console.warn('Failed to load leaderboard from IndexedDB:', error)
      return []
    }
  }

  /**
   * Persists a score entry, cleaning up lower entries to keep the Top 10 list strict.
   */
  public async addScore(entry: ScoreEntry): Promise<void> {
    try {
      const topScores = await this.getTopScores()

      if (topScores.length < this.#maxEntries) {
        await leaderboardRepository.put(entry)
        return
      }

      const lowestScoreEntry = topScores[topScores.length - 1]
      if (entry.score > lowestScoreEntry.score) {
        await leaderboardRepository.put(entry)
        await leaderboardRepository.delete(lowestScoreEntry.id)
      }
    } catch (error) {
      console.error('Failed to update leaderboard logs:', error)
    }
  }
}

export const leaderboardService = new LeaderboardService()
