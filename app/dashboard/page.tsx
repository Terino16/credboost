import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"

// Define the correct type for your data
type TableData = {
  id: number
  header: string
  type: string
  status: string
  rating: string
  date: string
  reviewer: string
  target?: string
  limit?: string
}

const data: TableData[] = [
  {
    id: 1,
    header: "Review 1",
    type: "Type A",
    status: "Active",
    rating: "4.5",
    date: "2024-03-24",
    reviewer: "John Doe",
  },
  {
    id: 2,
    header: "Review 2",
    type: "Type B",
    status: "Pending",
    rating: "3.0",
    date: "2024-03-24",
    reviewer: "Jane Smith",
    target: "Target A",
    limit: "100",
  }
]

export default function DashboardPage() {
  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </>
  )
}

