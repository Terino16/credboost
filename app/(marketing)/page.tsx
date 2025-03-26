import Image from "next/image"; 
import { Hero } from "@/components/marketing/Hero/Hero";
import { WhyUs } from "@/components/marketing/WhyUs";
import { Process } from "@/components/marketing/Process/Process";
export default function Home() {
  return (
    <>
    <Hero />
    <Process />
    </>
  );
}
