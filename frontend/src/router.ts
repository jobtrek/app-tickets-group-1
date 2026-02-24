import { createRouter } from '@tanstack/react-router'
import { rootRoute } from '../routes/__root'
import { indexRoute } from '../routes/index'

import { dashboardRoute } from '../routes/dashboard'
import { ticketHistoryRoute } from '../routes/ticketHistory'
import { ticketCreationRoute } from '../routes/ticket'

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  ticketHistoryRoute,
  ticketCreationRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}