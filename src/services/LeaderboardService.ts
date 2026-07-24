import type { ScoreEntry } from '@/models/ScoreEntry'
import { Difficulty } from '@/core/game/Difficulty'
import { leaderboardRepository } from '@/repositories/LeaderboardRepository'

const DEFAULT_DEMO_USERS: ReadonlyArray<ScoreEntry> = [
  { id: 'demo-1', playerId: 'p-1', playerName: 'SyniqMaster', score: 340, roundReached: 17, difficulty: Difficulty.Hard, timestamp: new Date() },
  { id: 'demo-2', playerId: 'p-2', playerName: 'CyberKnight', score: 285, roundReached: 14, difficulty: Difficulty.Medium, timestamp: new Date() },
  { id: 'demo-3', playerId: 'p-3', playerName: 'ShadowPulse', score: 240, roundReached: 12, difficulty: Difficulty.Medium, timestamp: new Date() },
  { id: 'demo-4', playerId: 'p-4', playerName: 'AuraHunter', score: 195, roundReached: 10, difficulty: Difficulty.Medium, timestamp: new Date() },
  { id: 'demo-5', playerId: 'p-5', playerName: 'VortexQueen', score: 160, roundReached: 9, difficulty: Difficulty.Easy, timestamp: new Date() },
  { id: 'demo-6', playerId: 'p-6', playerName: 'PixelLegend', score: 135, roundReached: 8, difficulty: Difficulty.Easy, timestamp: new Date() },
  { id: 'demo-7', playerId: 'p-7', playerName: 'NovaStriker', score: 110, roundReached: 7, difficulty: Difficulty.Easy, timestamp: new Date() },
  { id: 'demo-8', playerId: 'p-8', playerName: 'ZenithMind', score: 85, roundReached: 6, difficulty: Difficulty.Easy, timestamp: new Date() },
]

/**
 * Service orchestrating score entries, sorting tables, and maintaining a strict Top 10 unique player list.
 */
export class LeaderboardService {
  readonly #maxEntries = 10

  /**
   * Loads leaderboard entries sorted descending by score, deduplicated by playerName.
   * Auto-seeds vibrant demo users if IndexedDB is empty.
   */
  public async getTopScores(): Promise<ReadonlyArray<ScoreEntry>> {
    try {
      let allScores = await leaderboardRepository.getAll()
      
      // Auto-seed demo entries if empty
      if (allScores.length === 0) {
        for (const demoEntry of DEFAULT_DEMO_USERS) {
          await leaderboardRepository.put(demoEntry)
        }
        allScores = await leaderboardRepository.getAll()
      }

      // Deduplicate: Keep only highest score per player
      const highestScorePerPlayer = new Map<string, ScoreEntry>()
      for (const entry of allScores) {
        const existing = highestScorePerPlayer.get(entry.playerName)
        if (!existing || entry.score > existing.score) {
          highestScorePerPlayer.set(entry.playerName, entry)
        }
      }

      return Array.from(highestScorePerPlayer.values())
        .sort((a, b) => b.score - a.score || new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, this.#maxEntries)
    } catch (error) {
      console.warn('Failed to load leaderboard from IndexedDB, returning default demo list:', error)
      return DEFAULT_DEMO_USERS
    }
  }

  /**
   * Persists a score entry, replacing existing lower score for the same player if applicable.
   */
  public async addScore(entry: ScoreEntry): Promise<void> {
    try {
      const allScores = await leaderboardRepository.getAll()
      const matchingEntries = allScores.filter(
        (s) =>
          s.playerName === entry.playerName ||
          (entry.playerId && s.playerId === entry.playerId),
      )

      if (matchingEntries.length > 0) {
        const maxExistingScore = Math.max(...matchingEntries.map((s) => s.score))
        if (entry.score > maxExistingScore) {
          for (const match of matchingEntries) {
            await leaderboardRepository.delete(match.id)
          }
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
