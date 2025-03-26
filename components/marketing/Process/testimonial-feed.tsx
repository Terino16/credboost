"use client"

import { cn } from "@/lib/utils"
import { AnimatedList } from "@/components/magicui/animated-list"
import { Star, User } from "lucide-react"
interface Testimonial {
  name: string
  product: string
  rating: number
  time: string
  review: string
  colorIndex: number
}

// Array of background colors for avatars
const avatarColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-amber-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-cyan-500",
]

// Sample testimonial data
let testimonials = [
  {
    name: "Ravi Kumar",
    product: "Wireless Headphones",
    rating: 5,
    time: "just now",
    review: "Absolutely amazing product! Worth every penny.",
    colorIndex: 0,
  },
  {
    name: "Sarah Johnson",
    product: "Smart Watch",
    rating: 4,
    time: "2m ago",
    review: "Great quality and very user-friendly.",
    colorIndex: 1,
  },
  {
    name: "Michael Chen",
    product: "Fitness Tracker",
    rating: 5,
    time: "5m ago",
    review: "Exceeded my expectations! Highly recommend.",
    colorIndex: 2,
  },
  {
    name: "Priya Patel",
    product: "Bluetooth Speaker",
    rating: 3,
    time: "8m ago",
    review: "Good product but could be better.",
    colorIndex: 3,
  },
  {
    name: "David Wilson",
    product: "Wireless Earbuds",
    rating: 5,
    time: "12m ago",
    review: "Perfect sound quality and comfortable fit!",
    colorIndex: 4,
  },
  {
    name: "Emma Rodriguez",
    product: "Phone Case",
    rating: 4,
    time: "15m ago",
    review: "Very stylish and provides good protection.",
    colorIndex: 5,
  },
]

// Duplicate testimonials and assign different color indices
testimonials = Array.from({ length: 5 }, (_, groupIndex) =>
  testimonials.map((item, i) => ({
    ...item,
    colorIndex: (groupIndex * testimonials.length + i) % avatarColors.length,
  })),
).flat()

const TestimonialItem = ({ name, rating, time, review, colorIndex }: Testimonial) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4 ",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] ",
      )}
    >
      <div className="flex flex-row items-center gap-3 ">
        <div
          className={cn("flex size-10 items-center justify-center rounded-full text-white ", avatarColors[colorIndex])}
        >
          <User className="h-5 w-5" />
        </div>
        <div className="flex flex-col overflow-hidden ">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
            <span className="text-sm sm:text-base">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm  dark:text-white/80">"{review}"</p>
          <div className="mt-1 flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn("h-4 w-4", i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")}
              />
            ))}
          </div>
        </div>
      </div>
    </figure>
  )
}

export function TestimonialFeed({
  className,
}: {
  className?: string
}) {
  return (
    <div className={cn("relative flex h-[500px] w-full flex-col overflow-hidden p-2", className)}>
       
      <div className="mb-6 text-left gap-2">
        <h2 className="text-3xl font-bold">1. Collect</h2>
        <p className="text-muted-foreground text-xl">See what people are saying about your products</p>
      </div>

      <AnimatedList delay={1000}>
        {testimonials.map((item, idx) => (
          <TestimonialItem {...item} key={idx} />
        ))}
      </AnimatedList>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
    </div>
  )
}

