import axios from 'axios';

export interface TicketApi {
  title: string;
  description: string;
  image: string;
  level: string | null;
  created_at: string;
}

export type SavedTicketApi = TicketApi & {
  id_ticket: number;
  id_status: number;
  id_user: number;
};

const API_URL = 'http://localhost:3001/api/tickets';

export const handleClickSaveButton = async (ticket: FormData) => {
  const payload = {
    title: ticket.get('title'),
    description: ticket.get('description'),
    image: ticket.get('attachement') || null,
    level: ticket.get('level'),
    created_at: ticket.get('date'),
  };
  const postResponse = await axios.post(API_URL, payload);
  const getResponse = await axios.get(API_URL);

  const createdTicket = postResponse.data;
  const allTickets = getResponse.data;

  return { createdTicket, allTickets };
};

// export const fetchTasks = async (): Promise<SavedTicketApi[]> => {
//   const data = await RequestData<SavedTicketApi[]>(API_URL, 'GET');
//   return data;
// };

// export const deleteTasksViaAPI = async (taskid: number): Promise<void> => {
//   try {
//     const response = await fetch(`${API_URL}/${taskid}`, {
//       method: 'DELETE',
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to delete task: ${response.statusText}`);
//     }
//   } catch (error) {
//     console.error('Delete Request Failed:', error);
//     throw error;
//   }
// };

// export const updateTask = async (task: SavedApiTask): Promise<SavedTicketApi> => {
//   const updateBody = {
//     title: task.title,
//     content: task.content,
//     due_date: task.due_date,
//     done: Boolean(task.done),
//   };

//   const response = await RequestData<{ success: boolean; data: SavedApiTask }>(
//     `${API_URL}/${task.id}`,
//     'PATCH',
//     updateBody,
//   );

//   return response.data;
// };

// export const deleteAllTasksViaAPI = async (): Promise<void> => {
//   const deleteUrl = `${API_URL}`;
//   await RequestData<unknown>(deleteUrl, 'DELETE');
// };
