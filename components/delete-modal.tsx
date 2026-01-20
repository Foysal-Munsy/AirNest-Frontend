"use client";
import { deleteTicket } from "@/lib/dashboard_actions";
import { useState } from "react";
import toast from "react-hot-toast";

interface DeleteModalProps {
  ticketId: number;
  ticketSubject: string;
  onTicketDeleted: (ticketId: number) => void;
}

export default function DeleteModal({
  ticketId,
  ticketSubject,
  onTicketDeleted,
}: DeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTicket(ticketId);
      toast.success("Ticket deleted successfully");
      onTicketDeleted(ticketId);
      (
        document.getElementById(
          `delete_ticket_modal_${ticketId}`
        ) as HTMLDialogElement
      )?.close();
    } catch (error) {
      toast.error("Failed to delete ticket. Please try again.");
      console.error("Error deleting ticket:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    (
      document.getElementById(
        `delete_ticket_modal_${ticketId}`
      ) as HTMLDialogElement
    )?.close();
  };

  return (
    <dialog id={`delete_ticket_modal_${ticketId}`} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm Deletion</h3>
        <p className="py-4">
          Are you sure you want to delete the ticket{" "}
          <span className="font-semibold">&quot;{ticketSubject}&quot;</span>?
          This action cannot be undone.
        </p>
        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={handleCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="btn btn-error"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
