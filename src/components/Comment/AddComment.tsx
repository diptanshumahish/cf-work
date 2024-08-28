import { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/firebase";
import { Toaster, toast } from "sonner";
import { Button } from "../ui/button";

interface AddCommentProps {
  ticketId: string;
  currentUser: string;
}

export default function AddComment({ ticketId, currentUser }: AddCommentProps) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!ticketId) {
      toast.error("Ticket ID is missing. Cannot add comment.");
      setLoading(false);
      return;
    }

    try {
      const ticketRef = doc(db, "tickets", ticketId);

      await updateDoc(ticketRef, {
        comments: arrayUnion({
          author: currentUser,
          content: comment,
          createdAt: new Date().toISOString(),
        }),
      });

      toast.success("Comment added successfully!");
      setComment("");
    } catch (error) {
      toast.error("Error adding comment. Please try again.");
      console.error("Error updating document: ", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="mt-6">
      <Toaster />
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 font-semibold mb-2">
            Add a Comment
          </label>
          <textarea
            id="comment"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"

          disabled={loading}
        >
          {loading ? "Adding Comment..." : "Add Comment"}
        </Button>
      </form>
    </div>
  );
}
