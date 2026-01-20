import { getMessages } from "@/lib/dashboard_actions";

type Message = {
  id: number;
  message: string;
  ticketId: number;
  senderId: number;
  sentAt: string;
};

export default async function Chats() {
  const messages = await getMessages();
  console.log(messages);

  return <div>Chats</div>;
}
