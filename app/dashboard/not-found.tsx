import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <h2 className="mt-2 text-xl font-semibold">Page Not Found</h2>
        <p className="mt-4 text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <Button asChild className="mt-8">
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}

