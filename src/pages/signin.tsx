import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import {useAuthState, useSignInWithEmailAndPassword} from "react-firebase-hooks/auth"
import { auth } from "@/firebase";
import { Plus_Jakarta_Sans } from "next/font/google";
import { toast, Toaster } from "sonner";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";

const Pl = Plus_Jakarta_Sans({ subsets: ["latin"] });

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signin]= useSignInWithEmailAndPassword(auth);
  const [user] = useAuthState(auth);
  const router = useRouter();
  if(user){

    router.replace("/");
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await signin( email, password);

      toast.success(`signed in as ${res?.user.email}`);

    } catch (err) {
      toast.error("Unable to login, contact admin, or credentials error");
    }
  };

  return (
    <div className={`min-h-screen  flex flex-col justify-center items-center p-[5%]  ${Pl.className}`}>

      <div className=" w-full flex items-center  border border-black ">


       <div className="w-[50%]  min-h-[70vh] flex flex-col justify-between border-r border-black">
        <Image src="/img.jpg" width={400} height={600} alt="Welcome" className="aspect-[9/16] max-h-[40vh] w-full  object-cover" />
        <div className="p-8">

        <h1 className="text-5xl font-bold">Welcome, to </h1>
        <h2 className="text-4xl font-semibold">The CatchMflixx tickets <br /> system</h2>
        <span className="text-xs text-gray-600">Use your registered email and password, to start with the system</span>
        </div>

       </div>
       <form className="w-[40%] p-8 flex flex-col gap-3 bg-white" onSubmit={handleSignIn}>
        <h3 className="text-4xl">
          Let&apos; Start the show!
        </h3>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-lg font-semibold"
            >
              Email
            </label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=""
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-lg font-semibold"
            >
              Password
            </label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}

              placeholder="Enter your password"
              required
            />
          </div>
          <span className="text-xs text-gray-500 italic">By signing in to the system you agree to all our policies</span>
          <Button
            type="submit"
            className="w-fit  transition-colors"
          >
            Sign In
          </Button>
        </form>

      </div>
    </div>
  );
};

export default SignIn;
