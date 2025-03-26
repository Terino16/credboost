"use client"

export function WhyUs() {
  return (
    <div className="relative min-h-screen h-full flex flex-col items-center justify-start w-full overflow-hidden bg-black pt-24 ">
        
        <div className="max-w-7xl mx-auto w-full px-4">
        <div className="w-full flex flex-col items-left justify-center h-full mb-12">
        <span className="pointer-events-none whitespace-pre-wrap  text-center text-7xl font-semibold leading-none text-slate-100/80">
        Collect, Analyze, and Act
        </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <WhyUsCard />
            <WhyUsCard />
            <WhyUsCard />
            <WhyUsCard />

        </div>
        </div>
        
   
     
    </div>
  );
}



export function WhyUsCard() {
    return (
        <div className="flex flex-col items-center justify-center">
            <h2 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold">
                Why Us
            </h2>
        </div>
    )   
}