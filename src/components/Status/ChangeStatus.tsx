import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Toaster, toast } from "sonner";

interface ChangeStatusProps {
  ticketId: string;
  currentStatus: string;
  onS:()=>void;
}

const statusOptions = ["open", "in-progress", "closed"];

export default function ChangeStatus({ ticketId, currentStatus,onS }: ChangeStatusProps) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);

    try {
      const ticketRef = doc(db, "tickets", ticketId);

      await updateDoc(ticketRef, {
        status: newStatus,
      });

      toast.success(`Ticket status changed to ${newStatus}`);
      onS();

    } catch (error) {
      toast.error("Error changing status. Please try again.");
      console.error("Error updating document: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <Toaster />
      <label htmlFor="status" className="block text-gray-700 font-semibold mb-2">
        Change Ticket Status
      </label>
      <select
        id="status"
        value={status}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
        disabled={loading}
      >
        {statusOptions.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
