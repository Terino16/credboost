"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { ReactNode, ComponentType } from "react"

import { useIsMobile } from "@/hooks/use-mobile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const chartData = [
  { date: "2023-01-01", reviews: 12, rating: 4.2 },
  { date: "2023-01-15", reviews: 18, rating: 4.3 },
  { date: "2023-02-01", reviews: 25, rating: 4.1 },
  { date: "2023-02-15", reviews: 22, rating: 4.4 },
  { date: "2023-03-01", reviews: 30, rating: 4.5 },
  { date: "2023-03-15", reviews: 28, rating: 4.3 },
  { date: "2023-04-01", reviews: 35, rating: 4.2 },
  { date: "2023-04-15", reviews: 42, rating: 4.4 },
  { date: "2023-05-01", reviews: 38, rating: 4.6 },
  { date: "2023-05-15", reviews: 45, rating: 4.5 },
  { date: "2023-06-01", reviews: 50, rating: 4.3 },
  { date: "2023-06-15", reviews: 48, rating: 4.4 },
  { date: "2023-07-01", reviews: 55, rating: 4.5 },
  { date: "2023-07-15", reviews: 60, rating: 4.6 },
  { date: "2023-08-01", reviews: 58, rating: 4.7 },
  { date: "2023-08-15", reviews: 65, rating: 4.5 },
  { date: "2023-09-01", reviews: 70, rating: 4.4 },
  { date: "2023-09-15", reviews: 68, rating: 4.6 },
  { date: "2023-10-01", reviews: 75, rating: 4.7 },
  { date: "2023-10-15", reviews: 80, rating: 4.5 },
  { date: "2023-11-01", reviews: 78, rating: 4.6 },
  { date: "2023-11-15", reviews: 85, rating: 4.8 },
  { date: "2023-12-01", reviews: 90, rating: 4.7 },
  { date: "2023-12-15", reviews: 88, rating: 4.6 },
  { date: "2024-01-01", reviews: 95, rating: 4.5 },
  { date: "2024-01-15", reviews: 100, rating: 4.7 },
  { date: "2024-02-01", reviews: 98, rating: 4.8 },
  { date: "2024-02-15", reviews: 105, rating: 4.6 },
  { date: "2024-03-01", reviews: 110, rating: 4.7 },
  { date: "2024-03-15", reviews: 108, rating: 4.9 },
  { date: "2024-04-01", reviews: 115, rating: 4.8 },
  { date: "2024-04-15", reviews: 120, rating: 4.7 },
  { date: "2024-05-01", reviews: 118, rating: 4.6 },
  { date: "2024-05-15", reviews: 125, rating: 4.8 },
  { date: "2024-06-01", reviews: 130, rating: 4.7 },
  { date: "2024-06-15", reviews: 128, rating: 4.9 },
]

const chartConfig = {
  reviews: {
    label: "Reviews",
    color: "hsl(var(--chart-1))",
  },
  rating: {
    label: "Avg. Rating",
    color: "hsl(var(--chart-2))",
    valueFormatter: (value: number) => `${value.toFixed(1)}/5`,
    scale: {
      type: "linear",
      min: 0,
      max: 5,
    },
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-15")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Review Performance</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">Track your reviews and ratings over time</span>
          <span className="@[540px]/card:hidden">Reviews and ratings</span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              Last 3 months
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              Last 30 days
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              Last 7 days
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="@[767px]/card:hidden flex w-40" aria-label="Select a value">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillReviews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-reviews)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-reviews)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillRating" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-rating)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-rating)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area dataKey="reviews" type="natural" fill="url(#fillReviews)" stroke="var(--color-reviews)" />
            <Area
              dataKey="rating"
              type="natural"
              fill="url(#fillRating)"
              stroke="var(--color-rating)"
              yAxisId="rating"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

