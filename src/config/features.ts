/**
 * Feature flag configuration for toggling extra features during progress demos.
 * Set flags to `false` to present a strictly syllabus-focused Simon game to instructors.
 */
export const FEATURES = {
  SHOW_DAILY_CHALLENGE: false,
  SHOW_BADGE_SYSTEM: false,
} as const
