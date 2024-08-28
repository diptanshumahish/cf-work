"use client";
import { auth } from "@/firebase";
import Link from "next/link";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { Button } from "../ui/button";
import { Plus_Jakarta_Sans } from "next/font/google";
import { toast } from "sonner";

const Pl = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function Navbar() {
  const [user] = useAuthState(auth);
  const [signout] = useSignOut(auth);

  async function signOut() {
    await signout();
    toast.success("Signed out ✅")
  }

  return (
   <div className={` ${Pl.className} fixed left-0 right-0 top-0 p-4 px-[5%] z-20`}>
     <nav className="p-2 border border-black text-black w-full bg-yellow-300">
      <div className="px-4 flex justify-between items-center">
        <Link href="/" className="text-lg font-bold">
          CatchMflixx Work tickets
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/" className="">
            Home
          </Link>
          <Link href="/" className="">
            Tickets
          </Link>
          <Link href="/newticket" className="">
            Create Ticket
          </Link>
          {!user ? (
            <Link  href="/signin" className="bg-black text-white px-4 py-2 rounded-md">
              Sign In
            </Link>
          ) : (
            <Button className="" onClick={signOut}>
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </nav>
   </div>
  );
}
