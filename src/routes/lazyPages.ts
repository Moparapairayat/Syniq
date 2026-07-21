import { lazy } from 'react'

export const HomePage = lazy(() => import('@/pages/HomePage'))
export const GamePage = lazy(() => import('@/pages/GamePage'))
export const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage'))
export const SettingsPage = lazy(() => import('@/pages/SettingsPage'))
export const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
export const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
