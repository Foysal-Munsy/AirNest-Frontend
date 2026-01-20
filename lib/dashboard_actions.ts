"use server";
import axios from "axios";
import { cookies } from "next/headers";

async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value;
}

export async function getTickets(status?: string, priority?: string) {
  const token = await getAccessToken();

  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (priority) params.append("priority", priority);

  const url = `${
    process.env.NEXT_PUBLIC_API_ENDPOINT
  }/support/tickets?${params.toString()}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getMessages() {
  const token = await getAccessToken();

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/support/messages`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data;
}

export async function createTicket(ticketData: {
  subject: string;
  description: string;
  priority?: string;
}) {
  const token = await getAccessToken();

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/support/tickets`,
    ticketData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

export async function deleteTicket(ticketId: number) {
  const token = await getAccessToken();

  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/support/tickets/${ticketId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function updateTicketStatus(ticketId: number, status: string) {
  const token = await getAccessToken();

  const response = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/support/tickets/${ticketId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

export async function getTicketById(ticketId: number) {
  const token = await getAccessToken();

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/support/tickets/${ticketId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function sendMessage(ticketId: number, message: string) {
  const token = await getAccessToken();

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/support/tickets/${ticketId}/messages`,
    { message },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
