import { Suspense, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { RouteLoadingState } from '@/components/ui/RouteLoadingState'
import {
  GamePage,
  HomePage,
  LeaderboardPage,
  NotFoundPage,
  SettingsPage,
  ProfilePage,
} from './lazyPages'

function lazyRoute(page: ReactNode) {
  return <Suspense fallback={<RouteLoadingState />}>{page}</Suspense>
}

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: lazyRoute(<HomePage />),
      },
      {
        path: 'game',
        element: lazyRoute(<GamePage />),
      },
      {
        path: 'profile',
        element: lazyRoute(<ProfilePage />),
      },
      {
        path: 'leaderboard',
        element: lazyRoute(<LeaderboardPage />),
      },
      {
        path: 'settings',
        element: lazyRoute(<SettingsPage />),
      },
      {
        path: '*',
        element: lazyRoute(<NotFoundPage />),
      },
    ],
  },
])
