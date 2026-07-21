import type { ScoreEntry } from '@/models/ScoreEntry'
import { leaderboardRepository } from '@/repositories/LeaderboardRepository'

/**
 * Service orchestrating score entries, sorting tables, and maintaining a strict Top 10 unique player list.
 */
export class LeaderboardService {
  readonly #maxEntries = 10

  /**
   * Loads leaderboard entries sorted descending by score, deduplicated by playerName.
   */
  public async getTopScores(): Promise<ReadonlyArray<ScoreEntry>> {
    try {
      const allScores = await leaderboardRepository.getAll()
      
      // Deduplicate: Keep only highest score per player
      const highestScorePerPlayer = new Map<string, ScoreEntry>()
      for (const entry of allScores) {
        const existing = highestScorePerPlayer.get(entry.playerName)
        if (!existing || entry.score > existing.score) {
          highestScorePerPlayer.set(entry.playerName, entry)
        }
      }

      return Array.from(highestScorePerPlayer.values())
        .sort((a, b) => b.score - a.score || b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, this.#maxEntries)
    } catch (error) {
      console.warn('Failed to load leaderboard from IndexedDB:', error)
      return []
    }
  }

  /**
   * Persists a score entry, replacing existing lower score for the same player if applicable.
   */
  public async addScore(entry: ScoreEntry): Promise<void> {
    try {
      const allScores = await leaderboardRepository.getAll()
      const existingEntry = allScores.find((s) => s.playerName === entry.playerName)

      if (existingEntry) {
        if (entry.score > existingEntry.score) {
          // Delete lower score entry and put new higher score entry
          await leaderboardRepository.delete(existingEntry.id)
          await leaderboardRepository.put(entry)
        }
      } else {
        await leaderboardRepository.put(entry)
      }
    } catch (error) {
      console.error('Failed to update leaderboard logs:', error)
    }
  }
}

export const leaderboardService = new LeaderboardService()
