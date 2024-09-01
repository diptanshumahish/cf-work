import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Ticket } from "@/models/ticket.model";
import { auth, db } from "@/firebase";
import AddComment from "@/components/Comment/AddComment";
import ChangeStatus from "@/components/Status/ChangeStatus";
import { useAuthState } from "react-firebase-hooks/auth";
import { Toaster, toast } from "sonner";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, PersonStanding } from "lucide-react";
import ReturnStatus from "@/utils/ReturnStatus";
import { Button } from "@/components/ui/button";
const Pl = Plus_Jakarta_Sans({ subsets: ["latin"] });


export default function TicketDetails() {
  const router = useRouter();
  const { ticketId } = router.query;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // State for edit mode

  const fetchTicket = async () => {
    if (ticketId) {
      const ticketDoc = await getDoc(doc(db, "tickets", decodeURIComponent(ticketId.toString()) as string));
      if (ticketDoc.exists()) {
        const ticketData = ticketDoc.data() as Ticket;
        setTicket(ticketData);
        setTitle(ticketData.title);
        setDescription(ticketData.description);
        setAssignedTo(ticketData.assignedTo);
      } else {
        console.log("No such document!");
      }
    }
  };
  useEffect(() => {


    fetchTicket();
  }, [ticketId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateDoc(doc(db, "tickets", ticketId as string), {
        title,
        description,
        assignedTo,
      });
      toast.success("Ticket updated successfully!");
      setTicket((prev) => (prev ? { ...prev, title, description, assignedTo } : null));
      setIsEditMode(false); // Exit edit mode after updating
    } catch (error) {
      toast.error("Error updating ticket. Please try again.");
      console.error("Error updating document: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (!ticket) {
    return <main className="h-screen bg-gray-100 w-screen flex flex-col items-center justify-center">
      <h2>Loading</h2>
      <Loader2 className="animate-spin" />
     </main>
  }

  return (
    <main className={` ${Pl.className} bg-gray-100 p-8 px-[5%]`}>
      <Toaster />
      <div className="mb-4 flex flex-col gap-4">
        <span>Ticket id {decodeURIComponent(ticketId?.toString()!)}</span>


        {user?.email === ticket.createdBy && <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" onCheckedChange={()=> setIsEditMode((prev) => !prev) } />
      <Label htmlFor="airplane-mode">Edit mode</Label>
        </div>}


      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold capitalize">
            <span className="text-sm font-medium">Ticket title</span>
          <input
            type="text"
            className={`w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500 ${!isEditMode ? 'p-0  border-none' : 'bg-gray-100'}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!isEditMode}
          />
        </h1>
        <form onSubmit={handleUpdate} className="mb-4">
          <div className="">
            <label className="block text-sm text-gray-700 font-semibold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className={`w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500 ${!isEditMode ? ' border-none p-0' : 'bg-gray-100 p-2'}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={!isEditMode} // Disable textarea when not in edit mode
            />
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-700 font-semibold mb-2" htmlFor="assignedTo">
              Assigned To
            </label>
            <input
              type="text"
              id="assignedTo"
              className={`w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500 ${!isEditMode ? ' border-none p-0' : 'bg-gray-100 '}`}
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              required
              disabled={!isEditMode} // Disable input when not in edit mode
            />
          </div>

          {isEditMode && (
            <Button
              type="submit"

              disabled={loading}
            >
              {loading ? "Updating" : "Update Ticket"}
            </Button>
          )}
        </form>
        <hr />

        <p className="text-gray-600 flex flex-col mb-2  ">
         <span className="flex items-center gap-1"><PersonStanding/> <strong>Created By </strong></span> <span className=" text-black "> {ticket.createdBy}</span>
        </p>
        <p className="text-gray-600 mb-4">
          <strong>Status:</strong> <ReturnStatus status={ticket.status} />
          {user?.email === ticket.createdBy && <ChangeStatus onS={()=>{fetchTicket()}} ticketId={ticketId as string} currentStatus={ticket.status} />}
        </p>

        {ticket.comments.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Comments</h2>
            <ul className="space-y-2">
              {ticket.comments.map((comment, index) => (
                <li key={index} className="bg-gray-100 p-2 border border-gray-600">
                  <p className="text-gray-800">
                    <strong>{comment.author} |   <span className="text-sm font-normal">at {new Date(comment.createdAt).toLocaleString()}</span></strong>
                  </p>
                  <p>
                    {comment.content}
                  </p>

                </li>
              ))}
            </ul>
          </div>
        )}

        {ticket.status !== "closed" ? (

          <AddComment ticketId={ticketId?.toString() ?? ""} currentUser={user?.email??""} createdUser={ticket.createdBy}  />


         ) :<span>✅ This ticket has been closed</span> }

      </div>
    </main>
  );
}
