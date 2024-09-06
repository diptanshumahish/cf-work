import { auth } from "@/firebase";
import { Plus_Jakarta_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { Ticket } from "@/models/ticket.model";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import ReturnStatus from "@/utils/ReturnStatus";
import { ArrowDown, ArrowUp, ArrowUpRight, Clock, PersonStanding } from "lucide-react";
import moment from "moment";

const Pl = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");


  const openTicketsCount = tickets.filter(ticket => ticket.status === "open").length;
  const inProgressTicketsCount = tickets.filter(ticket => ticket.status === "in-progress").length;
  const closedTicketsCount = tickets.filter(ticket => ticket.status === "closed").length;
  const totalTicketsCount = tickets.length;

  const fetchTickets = async () => {
    const ticketsQuery = query(
      collection(db, "tickets"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(ticketsQuery);
    const ticketsData: Ticket[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Ticket[];

    setTickets(ticketsData);
  };

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    } else {
      fetchTickets();
    }
  }, [user, router]);

  const handleCardClick = (ticketId: string) => {
    router.push(`/tickets/${encodeURIComponent(ticketId)}`);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesSearch = 
      ticket.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) || 
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleVote = async (ticketId: string, type: "upvote" | "downvote") => {
    const ticketRef = doc(db, "tickets", ticketId);
    if (type === "upvote") {
      const currentUpvotes = tickets.find(ticket => ticket.id === ticketId)?.upvotes || 0;
      await updateDoc(ticketRef, {
        upvotes: currentUpvotes + 1,
      });
    } else if (type === "downvote") {
      const currentDownvotes = tickets.find(ticket => ticket.id === ticketId)?.downvotes || 0;
      await updateDoc(ticketRef, {
        downvotes: currentDownvotes + 1,
      });
    }
    fetchTickets();
  };

  return (
    <main className={`${Pl.className} p-8 px-[5%] bg-gray-100 min-h-screen`}>
      <div className="w-full justify-between flex items-center border-b mb-4 py-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-gray-800">All Tickets posted</h1>
          <h3>Here are all the tickets raised</h3>
        </div>
        <Link className="bg-black text-white px-6 py-2 rounded-md" href="/newticket">
          Add new
        </Link>
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold">Total Tickets: {totalTicketsCount}</span>
        <div className="flex gap-4">
          <span className="text-green-600">Open: {openTicketsCount}</span>
          <span className="text-blue-600">In Progress: {inProgressTicketsCount}</span>
          <span className="text-gray-600">Closed: {closedTicketsCount}</span>
        </div>
      </div>

      <div className="mb-4 flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>

        <input
          type="text"
          placeholder="Search by assigned to or ticket number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-6">
        {filteredTickets.map((ticket) =>{
          if(ticket.createdBy===user?.email||ticket.assignedTo===user?.email){
            return   <div
            key={ticket.id}
            className={twMerge(
              ticket.status === "open" ? "bg-green-100" :
              ticket.status === "in-progress" ? "bg-blue-100" :
              ticket.status === "closed" ? "bg-gray-100" :
              "bg-yellow-50",
              "p-4 border border-black flex flex-col gap-2"
            )}
          >
            <div className="flex flex-col">
              <span className="text-xs">Title</span>
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">{ticket.title}</h2>
            </div>

            <div className="flex gap-2 flex-wrap items-center">
              <span className="flex items-center bg-white px-2 gap-1 py-1 border border-black text-sm">
                <PersonStanding size={15} /> {ticket.assignedTo}
              </span>
              <ReturnStatus status={ticket.status} />
              <span className="text-sm bg-pink-100 px-2 py-1 border border-black flex items-center gap-1">
                <Clock size={15} /> {moment(ticket.createdAt).format("h:mm a [on] Do MMMM, YYYY")}
              </span>
            </div>

            <p className="text-sm line-clamp-2 text-ellipsis text-gray-700">{ticket.description}</p>

            <div className="flex gap-2 items-center">
              <Button className="flex w-fit items-center gap-2" onClick={() => handleCardClick(ticket.id)}>
                View ticket <ArrowUpRight size={15} />
              </Button>
              <span className="text-sm"> comments ({ticket.comments.length})</span>
            </div>

            {/* <div className="flex gap-4 mt-2 items-center">
              <div className="flex flex-col items-center">
                <Button variant="ghost" onClick={() => handleVote(ticket.id, "upvote")}>
                  <ArrowUp color="green" size={20} />
                </Button>
                <span className="text-sm font-semibold">{ticket.upvotes ?? 0}</span>
              </div>

              <div className="flex flex-col items-center">
                <Button variant="ghost" onClick={() => handleVote(ticket.id, "downvote")}>
                  <ArrowDown color="red" size={20} />
                </Button>
                <span className="text-sm font-semibold">{ticket.downvotes ?? 0}</span>
              </div>
            </div> */}
            <span className="text-sm text-gray-600 italic"> this ticket was created by {ticket.createdBy}</span>
          </div>
          }else{
            return <></>
          }
        }
        
        )}
        {filteredTickets.length === 0 && <span>No results</span>}
      </div>
    </main>
  );
}
