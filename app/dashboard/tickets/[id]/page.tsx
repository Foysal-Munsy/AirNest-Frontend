"use client";
import { getTicketById, sendMessage } from "@/lib/dashboard_actions";
import { ArrowLeft, BadgeInfo, Send } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";

type Message = {
  id: number;
  message: string;
  senderId: number;
  sentAt: string;
};

type TicketDetails = {
  id: number;
  subject: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
};

export default function TicketChat({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [ticket, setTicket] = useState<TicketDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadTicketData = async () => {
    try {
      setIsLoading(true);
      const data = await getTicketById(Number(id));
      setTicket(data);
      setMessages(data.messages || []);
    } catch {
      toast.error("Failed to load ticket details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTicketData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isTicketClosed = () => {
    return ticket?.status === "CLOSED";
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    const optimisticMessage: Message = {
      id: Date.now(),
      message: newMessage,
      senderId: 0, // Current user
      sentAt: new Date().toISOString(),
    };

    // Optimistically update UI
    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");
    setIsSending(true);

    try {
      const response = await sendMessage(Number(id), newMessage);

      // Replace optimistic message with real one
      setMessages((prev) =>
        prev.map((msg) => (msg.id === optimisticMessage.id ? response : msg))
      );

      toast.success("Message sent");
    } catch {
      // Remove optimistic message on error
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessage.id)
      );
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      URGENT: "badge-error",
      HIGH: "badge-error",
      MEDIUM: "badge-warning",
      LOW: "badge-info",
    };
    return badges[priority as keyof typeof badges] || "badge-neutral";
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      OPEN: "badge-info",
      IN_PROGRESS: "badge-warning",
      CLOSED: "badge-success",
      CANCELLED: "badge-neutral",
    };
    return badges[status as keyof typeof badges] || "badge-neutral";
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-xl mb-4">Ticket not found</p>
        <Link href="/dashboard/tickets" className="btn btn-primary">
          Back to Tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-base-100 mb-4">
        <div className="flex items-center gap-4 mb-1">
          <Link
            href="/dashboard/tickets"
            className="btn btn-ghost btn-sm btn-circle"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold flex-1">{ticket.subject}</h1>
        </div>
        <p className="text-sm text-base-content/60 mb-4 ml-12">
          {ticket.description}
        </p>
        <div className="flex gap-2 ml-12">
          <span
            className={`badge badge-sm ${getPriorityBadge(ticket.priority)}`}
          >
            {ticket.priority}
          </span>
          <span
            className={`badge badge-sm badge-soft ${getStatusBadge(
              ticket.status
            )}`}
          >
            {ticket.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-secondary rounded-2xl">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-base-content/60 py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="chat chat-start">
                <div className="chat-image avatar">
                  <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-semibold">
                    {message.senderId}
                  </div>
                </div>
                <div className="chat-bubble bg-base-100 text-base-content shadow-sm">
                  {message.message}
                </div>
                <div className="chat-footer opacity-50 text-xs mt-1">
                  {formatTime(message.sentAt)}
                </div>
              </div>
            ))
          )}
          {isTicketClosed() && (
            <div className="text-center py-4">
              <div className="badge badge-info rounded-lg py-4 px-2">
                <BadgeInfo/>
                The ticket is closed. Cannot send new messages.
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-base-100 p-4">
        <form
          onSubmit={handleSendMessage}
          className="max-w-4xl mx-auto flex gap-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={
              isTicketClosed() ? "Ticket is closed" : "Type your message..."
            }
            className="input input-bordered flex-1"
            disabled={isSending || isTicketClosed()}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!newMessage.trim() || isSending || isTicketClosed()}
          >
            {isSending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
