import { createRoute } from '@tanstack/react-router';
import TicketView from 'frontend/src/pages/TicketView';
import { rootRoute } from './__root';

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => <TicketView />,
});
