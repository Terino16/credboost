"use client"
import { Card, CardContent, CardFooter, } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { ActChart } from "./ActChart"

export function Act() {


    
    return (
        <Card className="h-full relative   border-none bg-transparent  ">
           
            <CardContent className="p-0 border-none">   
            <div className="mb-6 text-left gap-2">
        <h2 className="text-3xl font-bold">3. Act</h2>
        <p className="text-muted-foreground text-xl">Act on the insights to improve your business</p>
      </div>


      <ActChart />
      


         

          <CardFooter className="flex-col gap-2 text-sm">   
            <div className="flex items-center gap-2 font-medium leading-none">
                Positive sentiment up by 8.3% this month <TrendingUp className="h-4 w-4 text-green-500" />  
            </div>
            <div className="leading-none text-muted-foreground">Based on customer reviews from the last 30 days</div>
          </CardFooter>


            </CardContent>
        </Card>
    )
}