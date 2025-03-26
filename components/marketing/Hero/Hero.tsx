import { Particles } from "@/components/magicui/particles";
import Image from "next/image";
import Link from "next/link"    
import { Button } from "@/components/ui/button"
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { IntroductionBadge } from "@/components/marketing/Hero/IntroductionBadge";
 
export function Hero() {

  return (
    <div className="relative min-h-screen h-full flex flex-col items-center justify-center w-full overflow-hidden">

        {/* {Navabr} */}
        <div className="w-full sticky top-4 z-10 px-4 py-4">
  <div className="flex justify-between items-center  w-full   
    max-w-6xl mx-auto">
    <Link href="/">
      <span className="text-2xl font-bold">CredBoost</span>
    </Link>
    <div className="flex items-center gap-4">
      <Link href="/onboarding">
      <RainbowButton >Sign Up</RainbowButton>
      </Link>
    </div>
  </div>
</div>

   

    {/* Background Image */}
    <div className="absolute inset-0 z-0">
      <Image src="/bg.png" alt="Dark cloudy sky background" fill priority className="object-cover" />
    </div>
    
    <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-black/40 to-black pointer-events-none"></div>


    {/* Particles/Stars Effect with glowing/dimming and center fade */}
    <Particles
      className="absolute inset-0 z-[2]"
      quantity={180}
      staticity={30}
      ease={70}
      size={0.6}
      color="#ffffff"
      glowIntensity={0.4}
      fadeCenter={true}
      fadeIntensity={2}
    />
    
    
    {/* Content Container - Adjusted padding-top to account for navbar */}
    <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 text-center text-white mt-20 md:mt-20  lg:mt-32">
    <IntroductionBadge />
    <span className="pointer-events-none whitespace-pre-wrap leading-tight bg-gradient-to-b from-white to-gray-300/80 bg-clip-text text-center text-5xl  md:text-7xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-500/10">
    Boost Your Credibility <br /> with <span className="text-white">CredBoost</span>
    </span>
      <p className="text-sm md:text-lg max-w-2xl text-zinc-300 mt-4">
        Managing your Product Reviews has never been easier. Never miss a review again with CredBoost
      </p>
      <div className="flex items-center justify-center gap-8 mt-4">    
      <Button className="mt-4 px-6 py-3 ">
        Start Your Journey
      </Button>

      <Button variant="outline" className="mt-4 px-6 py-3 ">
        Know More
      </Button>
      </div>

      <div className="mt-16 border-4 border-zinc-500/30 rounded-xl  ">
      <Image src="/dashboard.png" alt="Dark cloudy sky background"  priority width={780} height={780} className="w-full h-full z-50 rounded-lg  " />
      </div>
     
    </div>


    </div>
  );
}