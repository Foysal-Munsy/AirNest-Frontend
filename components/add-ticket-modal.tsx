"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createTicket } from "@/lib/dashboard_actions";
import { Ticket } from "@/app/dashboard/tickets/page";
import toast from "react-hot-toast";

const ticketSchema = z.object({
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(255, "Subject must be less than 255 characters"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
});

type TicketFormData = z.infer<typeof ticketSchema>;

interface AddTicketModalProps {
  onTicketCreated?: (ticket: Ticket) => void;
}

export default function AddTicketModal({
  onTicketCreated,
}: AddTicketModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      priority: "LOW",
    },
  });

  const onSubmit = async (data: TicketFormData) => {
    try {
      const response = await createTicket(data);
      toast.success("Ticket created successfully!");

      if (onTicketCreated) {
        onTicketCreated(response);
      }

      reset();
      // Close the modal
      const modal = document.getElementById(
        "add_ticket_modal"
      ) as HTMLDialogElement;
      modal?.close();
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError.response?.data?.message || "Failed to create ticket"
      );
    }
  };

  return (
    <dialog id="add_ticket_modal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <h3 className="font-bold text-lg mb-4">Create New Ticket</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Subject Field */}
          <div className="form-control">
            <label className="label mb-1">
              <span className="label-text font-medium text-black">Subject</span>
            </label>
            <input
              type="text"
              placeholder="Enter ticket subject"
              className={`input input-bordered w-full ${
                errors.subject ? "input-error" : ""
              }`}
              {...register("subject")}
            />
            {errors.subject && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.subject.message}
                </span>
              </label>
            )}
          </div>

          {/* Description Field */}
          <div className="form-control">
            <label className="label mb-1">
              <span className="label-text font-medium text-black">
                Description
              </span>
            </label>
            <br />
            <textarea
              placeholder="Describe your issue"
              className={`textarea textarea-bordered h-24 w-full ${
                errors.description ? "textarea-error" : ""
              }`}
              {...register("description")}
            />
            {errors.description && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.description.message}
                </span>
              </label>
            )}
          </div>

          {/* Priority Field */}
          <div className="form-control">
            <label className="label mb-1">
              <span className="label-text font-medium text-black">
                Priority
              </span>
            </label>
            <select
              className={`select select-bordered w-full ${
                errors.priority ? "select-error" : ""
              }`}
              {...register("priority")}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
            {errors.priority && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.priority.message}
                </span>
              </label>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn btn-primary ml-auto block"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Ticket"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
