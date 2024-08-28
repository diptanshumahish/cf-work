import Navbar from "@/components/common/Navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
const Pl = Plus_Jakarta_Sans({ subsets: ["latin"] });


export default function App({ Component, pageProps }: AppProps) {
  return <>
  <Toaster/>
  <Navbar/>
 <section className="mt-[64px]"> <Component className={`bg-gray-100  ${Pl.className}`}  {...pageProps} /></section></>;
}
