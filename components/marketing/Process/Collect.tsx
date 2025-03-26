"use client"
import { Card,  CardContent } from "@/components/ui/card"
import { TestimonialFeed } from "./testimonial-feed"
import Image from "next/image"
export function Collect() {
    return (
        <Card className="h-full relative bg-transparent   border-none  ">
            <CardContent >   
                <TestimonialFeed />
            </CardContent>
        </Card>
    )
}