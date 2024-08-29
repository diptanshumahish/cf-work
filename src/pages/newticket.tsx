import { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import {  toast } from "sonner";
import { Plus_Jakarta_Sans } from "next/font/google";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
const Pl = Plus_Jakarta_Sans({ subsets: ["latin"] });


export default function NewTicket() {
  const router = useRouter();
  const [user] = useAuthState(auth);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {

    setLoading(true);

    try {
      await addDoc(collection(db, "tickets"), {
        title, // Add title to the Firestore document
        description,
        assignedTo,
        createdBy: user?.email || "Anonymous",
        status: "open",
        createdAt: new Date().toISOString(),
        comments: [],
      });

      toast.success("Ticket created successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Error creating ticket. Please try again.");
      console.error("Error adding document: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={` px-[5%] pt-[5%] ${Pl.className} bg-gray-100`}>

     <div className="   border border-black flex bg-white">
     <div className="flex flex-col justify-end w-[70%] p-8">
     <div className="flex flex-col gap-1 py-4">
     <h1 className="text-5xl font-bold">Raise a  New Ticket</h1>
     <span className="text-xs text-gray-500 italic">Raise a ticket, for your otheer employees, make sure to assign the correct person.</span>
     </div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit} action={`https://formsubmit.co/${assignedTo}`} method="POST">
        <div className="flex flex-col gap-2">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="title">
            Title
          </label>
          <input type="hidden" name="_subject" value="New ticket has been assigned to you"></input>
          <Input
            type="text"
            id="title"
            name="ticket-title"
            placeholder="Your title goes here"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">
            Description
          </label>
          <Textarea
            id="description"
            placeholder="add the description of the ticket here"
            name="ticket-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="assignedTo">
            Assign To
          </label>
          <Input

            type="email"
            id="assignedTo"
            name="ticket-assigned-to"
            placeholder="test@gmail.com"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            required
          />
          <input type="hidden" name="_captcha" value="false"></input>
        </div>
        <input type="text" className="hidden" value={user?.email??""} name="assigned-by" />

        <Button
          type="submit"

          disabled={loading}
        >
          {loading ? "Creating..." : "Create Ticket"}
        </Button>
        <p className="text-xs text-gray-500 italic ">Be respectful your fellow empolyees and the company policies while creating tickets</p>
      </form>
     </div>
     <Image className="w-[30%] h-full object-cover border-l border-black" src="/i2.jpg" height={400} width={300} alt="new ticket"  />
     </div>
    </div>
  );
}
