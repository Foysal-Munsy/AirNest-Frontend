"use client";
import AddTicketModal from "@/components/add-ticket-modal";
import DeleteModal from "@/components/delete-modal";
import { getTickets, updateTicketStatus } from "@/lib/dashboard_actions";
import { ChevronDown, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export type Ticket = {
  id: number;
  subject: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

const statuses = ["OPEN", "IN_PROGRESS", "CLOSED", "CANCELLED"];
const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    getTickets(selectedStatus, selectedPriority).then(setTickets);

    const statusPopover = document.getElementById("status-popover");
    const handleStatusToggle = (e: Event) => {
      const toggleEvent = e as ToggleEvent;
      setIsStatusOpen(toggleEvent.newState === "open");
    };

    const priorityPopover = document.getElementById("priority-popover");
    const handlePriorityToggle = (e: Event) => {
      const toggleEvent = e as ToggleEvent;
      setIsPriorityOpen(toggleEvent.newState === "open");
    };

    statusPopover?.addEventListener("toggle", handleStatusToggle);
    priorityPopover?.addEventListener("toggle", handlePriorityToggle);

    return () => {
      statusPopover?.removeEventListener("toggle", handleStatusToggle);
      priorityPopover?.removeEventListener("toggle", handlePriorityToggle);
    };
  }, [selectedStatus, selectedPriority]);

  const handleStatusFilter = (status: string | undefined) => {
    setSelectedStatus(status);
    const popover = document.getElementById("status-popover");
    popover?.hidePopover();
  };

  const handlePriorityFilter = (priority: string | undefined) => {
    setSelectedPriority(priority);
    const popover = document.getElementById("priority-popover");
    popover?.hidePopover();
  };

  const handleTicketCreated = (newTicket: Ticket) => {
    setTickets((prev) => [...prev, newTicket]);
  };

  const handleTicketDeleted = (ticketId: number) => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId));
  };

  const handleStatusChange = async (ticketId: number, newStatus: string) => {
    try {
      await updateTicketStatus(ticketId, newStatus);
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
        )
      );
      toast.success("Ticket status updated successfully");
    } catch {
      toast.error("Failed to update ticket status");
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Support Tickets</h2>
            <p className="text-gray-500 mt-2">
              Manage and track your support tickets
            </p>
          </div>
          <div>
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <button
              className="btn"
              onClick={() =>
                (
                  document.getElementById(
                    "add_ticket_modal"
                  ) as HTMLDialogElement
                ).showModal()
              }
            >
              <Plus className="size-4" />
              Add ticket
            </button>
            <AddTicketModal onTicketCreated={handleTicketCreated} />
          </div>
        </div>

        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="table table-zebra border border-violet-50">
            <thead>
              <tr className="*:text-violet-400/80">
                <th className="w-16">#</th>
                <th>Subject</th>
                <th>Description</th>
                <th className="w-32">
                  <button
                    className="btn btn-ghost p-0"
                    popoverTarget="priority-popover"
                    style={{ anchorName: "--priority-anchor" }}
                  >
                    Priority
                    <ChevronDown
                      className={`transition-transform duration-200 ${
                        isPriorityOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <ul
                    popover="auto"
                    id="priority-popover"
                    style={{ positionAnchor: "--priority-anchor" }}
                    className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm mt-1"
                  >
                    <li>
                      <button onClick={() => handlePriorityFilter(undefined)}>
                        ALL
                      </button>
                    </li>
                    {priorities.map((priority) => (
                      <li key={priority}>
                        <button onClick={() => handlePriorityFilter(priority)}>
                          {priority}
                        </button>
                      </li>
                    ))}
                  </ul>
                </th>
                <th className="w-36">
                  <button
                    className="btn btn-ghost p-0"
                    popoverTarget="status-popover"
                    style={{ anchorName: "--status-anchor" }}
                  >
                    Status
                    <ChevronDown
                      className={`transition-transform duration-200 ${
                        isStatusOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <ul
                    popover="auto"
                    id="status-popover"
                    style={{ positionAnchor: "--status-anchor" }}
                    className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm mt-1"
                  >
                    <li>
                      <button onClick={() => handleStatusFilter(undefined)}>
                        ALL
                      </button>
                    </li>
                    {statuses.map((status) => (
                      <li key={status}>
                        <button onClick={() => handleStatusFilter(status)}>
                          {status.replace("_", " ")}
                        </button>
                      </li>
                    ))}
                  </ul>
                </th>
                <th className="w-40">Created</th>
                <th className="w-40"></th>
              </tr>
            </thead>
            <tbody>
              {tickets && tickets.length > 0 ? (
                tickets.map((ticket: Ticket, index: number) => (
                  <tr key={ticket.id}>
                    <td className="font-semibold">{index + 1}</td>
                    <td className="font-semibold">
                      <Link
                        href={`/dashboard/tickets/${ticket.id}`}
                        className="hover:underline cursor-pointer flex items-center gap-1"
                      >
                        {ticket.subject}
                        <ExternalLink size={14} />
                      </Link>
                    </td>
                    <td>
                      <div
                        className="max-w-md truncate"
                        title={ticket.description}
                      >
                        {ticket.description}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm ${getPriorityBadge(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td>
                      <select
                        className={`select select-bordered select-sm w-full max-w-xs ${getStatusBadge(
                          ticket.status
                        )}`}
                        value={ticket.status}
                        onChange={(e) =>
                          handleStatusChange(ticket.id, e.target.value)
                        }
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="text-sm">{formatDate(ticket.createdAt)}</td>
                    <td>
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() =>
                          (
                            document.getElementById(
                              `delete_ticket_modal_${ticket.id}`
                            ) as HTMLDialogElement
                          ).showModal()
                        }
                      >
                        Delete
                      </button>
                      <DeleteModal
                        ticketId={ticket.id}
                        ticketSubject={ticket.subject}
                        onTicketDeleted={handleTicketDeleted}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-8 text-base-content/60"
                  >
                    No tickets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
