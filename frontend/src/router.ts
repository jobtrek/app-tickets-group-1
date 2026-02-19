import { createRouter } from '@tanstack/react-router'
import { rootRoute } from '../routes/__root'
import { indexRoute } from '../routes/index'

import { dashboardRoute } from '../routes/dashboard'
import { ticketHistoryRoute } from '../routes/ticketHistory'
import { ticketInformationRoute } from '../routes/ticket.$ticketId'

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  ticketHistoryRoute,
  ticketInformationRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}