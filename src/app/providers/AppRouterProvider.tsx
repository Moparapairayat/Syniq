import { RouterProvider } from 'react-router-dom'
import { appRouter } from '@/routes/AppRoutes'

export function AppRouterProvider() {
  return <RouterProvider router={appRouter} />
}
