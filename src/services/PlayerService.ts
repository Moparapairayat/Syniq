import type { PlayerProfile } from '@/models/Player'
import { playerRepository } from '@/repositories/PlayerRepository'

/**
 * Handles coordination of player configurations and statistical telemetry updates.
 */
export class PlayerService {
  readonly #defaultId = 'local_user'

  /**
   * Loads the existing default player profile from storage, creating it if missing.
   */
  public async getOrCreateProfile(): Promise<PlayerProfile> {
    try {
      const profile = await playerRepository.get(this.#defaultId)
      if (profile) return profile

      const newProfile: PlayerProfile = {
        id: this.#defaultId,
        name: 'Player 1',
        createdAt: new Date(),
        gamesPlayed: 0,
        highestScore: 0,
        highestLevel: 0,
      }
      await playerRepository.put(newProfile)
      return newProfile
    } catch (error) {
      console.warn('Failed to load profile from IndexedDB, using fallback:', error)
      return {
        id: this.#defaultId,
        name: 'Player 1 (Fallback)',
        createdAt: new Date(),
        gamesPlayed: 0,
        highestScore: 0,
        highestLevel: 0,
      }
    }
  }

  /**
   * Recalculates stats when a game session completes.
   */
  public async updateStats(score: number, level: number): Promise<PlayerProfile> {
    const profile = await this.getOrCreateProfile()
    const updatedProfile: PlayerProfile = {
      ...profile,
      gamesPlayed: profile.gamesPlayed + 1,
      highestScore: Math.max(profile.highestScore, score),
      highestLevel: Math.max(profile.highestLevel, level),
    }
    await playerRepository.put(updatedProfile)
    return updatedProfile
  }

  /**
   * Saves a new name for the local player profile.
   */
  public async renamePlayer(newName: string): Promise<PlayerProfile> {
    const profile = await this.getOrCreateProfile()
    const updatedProfile: PlayerProfile = {
      ...profile,
      name: newName.trim() || 'Player 1',
    }
    await playerRepository.put(updatedProfile)
    return updatedProfile
  }
}

export const playerService = new PlayerService()
