"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { productSalesData } from "@/lib/data"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

const chartConfig = {
    sales: {
      label: "Sales",
    },
    "cnc-machining": { label: "CNC Machining", color: "hsl(var(--chart-1))" },
    "injection-molding": { label: "Injection Molding", color: "hsl(var(--chart-2))" },
    "pcb-assembly": { label: "PCB Assembly", color: "hsl(var(--chart-3))" },
    "textiles": { label: "Textiles", color: "hsl(var(--chart-4))" },
    "automotive-parts": { label: "Automotive", color: "hsl(var(--chart-5))" },
    "electronics": { label: "Electronics", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig

export default function TopProductsChart() {
  return (
    <Card className="h-full">
        <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Your best-selling products this month.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productSalesData} layout="vertical" margin={{ left: 10, right: 30 }}>
                    <XAxis type="number" dataKey="sales" hide />
                    <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    width={100}
                    />
                    <Tooltip cursor={false} content={<ChartTooltipContent />} />
                    <Bar dataKey="sales" radius={4} />
                </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
    </Card>
  )
}
