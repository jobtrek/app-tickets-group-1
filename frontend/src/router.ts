import { createRouter } from '@tanstack/react-router'
import { rootRoute } from '../routes/__root'
import { indexRoute } from '../routes/index'

import { dashboardRoute } from '../routes/dashboard'
import { ticketHistoryRoute } from '../routes/ticketHistory'
import { ticketViewRoute } from '../routes/ticket'
import { ticketCreationRoute } from '../routes/createTicket'

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  ticketHistoryRoute,
  ticketViewRoute,
  ticketCreationRoute
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}