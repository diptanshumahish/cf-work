import { Check, InfoIcon } from "lucide-react";
import { Plus_Jakarta_Sans } from "next/font/google";
import React from "react";
const Pl = Plus_Jakarta_Sans({ subsets: ["latin"] });

interface Props{
    status:string;
}


export default function  ReturnStatus({status}:Props){
    switch (status) {
        case "in-progress":

            return <span className={` bg-orange-200 text-sm px-2 py-1 text-blue-950 border border-blue-950 flex w-fit items-center gap-2 ${Pl.className} `}> in progress</span>
        case "open":
            return  <span className={` bg-blue-300 text-sm px-2 py-1 text-blue-950 border border-blue-950 flex w-fit items-center gap-2 ${Pl.className} `}> <InfoIcon size={15} />  open</span>
        case "closed":
            return   <span className={` bg-green-300 text-sm px-2 py-1 text-blue-950 border border-blue-950 flex w-fit items-center gap-2 ${Pl.className} `}>
                <Check size={15}/> closed
            </span>

        default:
            return <></>;
    }
}
