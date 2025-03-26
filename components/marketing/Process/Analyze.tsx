"use client"
import { Card,  CardContent, CardFooter } from "@/components/ui/card"
import { TestimonialFeed } from "./testimonial-feed"
import Image from "next/image"
import { Ripple } from "@/components/magicui/ripple"
import { useState } from "react"
import { useEffect } from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart } from "recharts"
export function Analyze() {
    const [stage, setStage] = useState<"analyzing" | "chart">("analyzing")

  useEffect(() => {
    // Show analyzing state for 3 seconds, then transition to chart
    const chartTimer = setTimeout(() => {
      setStage("chart")
    }, 5000)

    return () => {
      clearTimeout(chartTimer)
    }
  }, [])

  const sentimentData = [
    { sentiment: "positive", count: 275, fill: "var(--color-positive)" },
    { sentiment: "neutral", count: 120, fill: "var(--color-neutral)" },
    { sentiment: "negative", count: 45, fill: "var(--color-negative)" },
  ]

  const chartConfig = {
    count: {
      label: "Reviews",
    },
    positive: {
      label: "Positive",
      color: "hsl(142, 76%, 36%)", // Green
    },
    neutral: {
      label: "Neutral",
      color: "hsl(215, 16%, 47%)", // Gray-blue
    },
    negative: {
      label: "Negative",
      color: "hsl(346, 84%, 61%)", // Red
    },
  }

  const totalReviews = sentimentData.reduce((acc, curr) => acc + curr.count, 0)     
    return (
        <Card className="h-full relative   border-none bg-transparent  ">
           
            <CardContent className="p-0 border-none">   
            <div className="mb-6 text-left gap-2">
        <h2 className="text-3xl font-bold">2. Analyze</h2>
        <p className="text-muted-foreground text-xl">Analyze the data to get insights on your customers</p>
      </div>
      {stage === "analyzing" && (
            <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg  bg-background">
      <p className="z-10 whitespace-pre-wrap text-center text-4xl font-medium tracking-tighter text-white">
        Analyzing
      </p>
      <Ripple />
    </div>
    )}

{stage === "chart" && (
        <>
         
          <CardContent className="flex-1 pb-0">
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie data={sentimentData} dataKey="count" nameKey="sentiment" innerRadius={60} strokeWidth={5}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                              {totalReviews.toLocaleString()}
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                              Reviews
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>

          <CardFooter className="flex-col gap-2 text-sm">   
            <div className="flex items-center gap-2 font-medium leading-none">
                Positive sentiment up by 8.3% this month <TrendingUp className="h-4 w-4 text-green-500" />  
            </div>
            <div className="leading-none text-muted-foreground">Based on customer reviews from the last 30 days</div>
          </CardFooter>

        </>
      )}


            </CardContent>
        </Card>
    )
}