import { createRoute } from '@tanstack/react-router';
import axios from 'axios';
import TicketView from '../src/pages/TicketView';
import { rootRoute } from './__root';

// On définit l'URL ici ou on l'importe de votre fichier API
const API_URL = 'http://localhost:3001/api/tickets';

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  // Le loader récupère les données avant le rendu
  loader: async () => {
    const response = await axios.get(API_URL);
    console.log(response);

    return response.data; // Supposons que c'est un tableau de tickets
  },
  component: DashboardPage,
});

function DashboardPage() {
  // On récupère les données du loader
  const tickets = dashboardRoute.useLoaderData();
  console.log(tickets);

  // Si vous voulez afficher le PREMIER ticket ou une liste,
  // il faut adapter ici. Voici pour le premier ticket par exemple :
  const ticket = tickets[tickets.length - 1];

  if (!ticket) return <div>Aucun ticket trouvé.</div>;

  return (
    <TicketView
      id={ticket.id_ticket}
      title={ticket.title}
      description={ticket.description}
      date={ticket.created_at}
      level={ticket.level}
    />
  );
}
