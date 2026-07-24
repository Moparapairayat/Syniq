export const RoutePath = {
  home: '/',
  game: '/game',
  profile: '/profile',
  leaderboard: '/leaderboard',
  settings: '/settings',
  achievements: '/achievements',
} as const

export type RouteKey = keyof typeof RoutePath
export type RoutePathValue = (typeof RoutePath)[RouteKey]
