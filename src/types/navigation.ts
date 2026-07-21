import type { RoutePathValue } from '@/routes/routePaths'

export interface NavigationItem {
  readonly label: string
  readonly path: RoutePathValue
}
