import { describe, test, expect, beforeEach, vi } from 'vitest'
import { leaderboardService } from '@/services/LeaderboardService'
import { leaderboardRepository } from '@/repositories/LeaderboardRepository'
import { Difficulty } from '@/core/game/Difficulty'
import type { ScoreEntry } from '@/models/ScoreEntry'

// Mock LeaderboardRepository
vi.mock('@/repositories/LeaderboardRepository', () => {
  let mockStore: ScoreEntry[] = []
  return {
    leaderboardRepository: {
      getAll: vi.fn().mockImplementation(async () => mockStore),
      put: vi.fn().mockImplementation(async (item: ScoreEntry) => {
        mockStore.push(item)
      }),
      delete: vi.fn().mockImplementation(async (id: string) => {
        mockStore = mockStore.filter((s) => s.id !== id)
      }),
    },
  }
})

describe('LeaderboardService', () => {
  beforeEach(() => {
    // Reset mock store before each run
    vi.mocked(leaderboardRepository.getAll).mockImplementation(async () => [])
  })

  test('should record and fetch score entries sorted by highest values', async () => {
    const list: ScoreEntry[] = []
    vi.mocked(leaderboardRepository.getAll).mockImplementation(async () => list)
    vi.mocked(leaderboardRepository.put).mockImplementation(async (item: ScoreEntry) => {
      list.push(item)
    })

    await leaderboardService.addScore({
      id: '1',
      playerId: 'player1',
      playerName: 'Alice',
      score: 1500,
      roundReached: 5,
      difficulty: Difficulty.Easy,
      timestamp: new Date(),
    })

    await leaderboardService.addScore({
      id: '2',
      playerId: 'player2',
      playerName: 'Bob',
      score: 3000,
      roundReached: 8,
      difficulty: Difficulty.Easy,
      timestamp: new Date(),
    })

    const scores = await leaderboardService.getTopScores()
    expect(scores.length).toBe(2)
    expect(scores[0].playerName).toBe('Bob') // Bob has higher score (3000)
    expect(scores[1].playerName).toBe('Alice') // Alice has lower score (1500)
  })

  test('should limit top scores list to maximum 10 entries', async () => {
    const list: ScoreEntry[] = Array.from({ length: 15 }, (_, i) => ({
      id: `${i}`,
      playerId: `player${i}`,
      playerName: `Player ${i}`,
      score: i * 100,
      roundReached: 3,
      difficulty: Difficulty.Easy,
      timestamp: new Date(),
    }))

    vi.mocked(leaderboardRepository.getAll).mockImplementation(async () => list)

    const topScores = await leaderboardService.getTopScores()
    expect(topScores.length).toBe(10)
    expect(topScores[0].score).toBe(1400) // Highest score in list
    expect(topScores[9].score).toBe(500) // 10th score
  })

  test('should delete all existing lower entries for the same player when a higher score is achieved', async () => {
    let list: ScoreEntry[] = [
      { id: '1', playerId: 'p1', playerName: 'Charlie', score: 100, roundReached: 2, difficulty: Difficulty.Easy, timestamp: new Date() },
      { id: '2', playerId: 'p1', playerName: 'Charlie', score: 200, roundReached: 3, difficulty: Difficulty.Easy, timestamp: new Date() },
    ]

    vi.mocked(leaderboardRepository.getAll).mockImplementation(async () => list)
    vi.mocked(leaderboardRepository.delete).mockImplementation(async (id: string) => {
      list = list.filter((s) => s.id !== id)
    })
    vi.mocked(leaderboardRepository.put).mockImplementation(async (item: ScoreEntry) => {
      list.push(item)
    })

    await leaderboardService.addScore({
      id: '3',
      playerId: 'p1',
      playerName: 'Charlie',
      score: 500,
      roundReached: 6,
      difficulty: Difficulty.Medium,
      timestamp: new Date(),
    })

    expect(list.length).toBe(1)
    expect(list[0].id).toBe('3')
    expect(list[0].score).toBe(500)
  })
})
