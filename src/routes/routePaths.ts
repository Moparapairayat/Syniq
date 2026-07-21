export const RoutePath = {
  home: '/',
  game: '/game',
  profile: '/profile',
  leaderboard: '/leaderboard',
  settings: '/settings',
} as const

export type RouteKey = keyof typeof RoutePath
export type RoutePathValue = (typeof RoutePath)[RouteKey]
