
"use client"

import { useState } from "react"
import { Area, AreaChart, Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, CartesianGrid, Brush } from "recharts"
import { dailySalesData, salesData } from "@/lib/data"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardDescription, CardHeader, CardTitle, CardContent, Card } from "../ui/card"

const chartConfig = {
    sales: {
      label: "Sales",
      color: "hsl(var(--primary))",
    },
}

const pieChartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--secondary))",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
].map(color => color.replace("hsl(","").replace(")",""));


export default function SalesChart() {
  const [chartType, setChartType] = useState("line");
  const [timeframe, setTimeframe] = useState("monthly");

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const date = timeframe === 'daily' 
        ? new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'}) 
        : data.month;

      return (
        <div className="p-2 bg-background border rounded-md shadow-lg">
          <p className="font-bold text-foreground">{`₹${data.sales.toLocaleString()}`}</p>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>
      );
    }
    return null;
  };

  const currentData = timeframe === 'daily' ? dailySalesData : salesData;


  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <CardTitle>Sales Trend</CardTitle>
          <CardDescription>
            {timeframe === 'daily' ? 'Use the brush below to zoom in on a date range.' : 'Your sales performance over the last 12 months.'}
          </CardDescription>
        </div>
        <div className="flex items-center gap-4">
            <Tabs value={timeframe} onValueChange={setTimeframe} className="w-auto">
                <TabsList>
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
            </Tabs>
            <Tabs value={chartType} onValueChange={setChartType} className="w-auto">
                <TabsList>
                    <TabsTrigger value="line">Line</TabsTrigger>
                    <TabsTrigger value="bar">Bar</TabsTrigger>
                    <TabsTrigger value="area">Area</TabsTrigger>
                    <TabsTrigger value="pie">Pie</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
            {chartType === 'line' && (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={currentData}
                        margin={{ top: 5, right: 20, left: 10, bottom: timeframe === 'daily' ? 60 : 0 }}
                    >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                        dataKey={timeframe === 'daily' ? 'date' : 'month'} 
                        tickLine={false} 
                        axisLine={false} 
                        tickMargin={8} 
                        tickFormatter={(value) => {
                            if (timeframe === 'daily' && typeof value === 'string') {
                                const date = new Date(value);
                                if (!isNaN(date.getTime())) {
                                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                }
                            }
                            return value;
                        }}
                        padding={{ left: 10, right: 10 }}
                        />
                    <YAxis 
                        tickLine={false} 
                        axisLine={false} 
                        tickMargin={8} 
                        tickFormatter={(value) => `₹${value / 1000}k`}
                    />
                    <Tooltip 
                        cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }} 
                        content={<CustomTooltip />} 
                        position={{ y: 0 }}
                    />
                    <Line
                        dataKey="sales"
                        type="monotone"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                        animationDuration={300}
                    />
                    {timeframe === 'daily' && (
                        <Brush 
                            dataKey="date" 
                            height={30} 
                            stroke="hsl(var(--primary))"
                            y={310}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                if (!isNaN(date.getTime())) {
                                    return date.toLocaleDateString('en-US', { month: 'short' });
                                }
                                return value;
                            }}
                        />
                    )}
                    </LineChart>
                </ResponsiveContainer>
            )}
            {chartType === 'bar' && (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                        data={currentData} 
                        margin={{ top: 5, right: 10, left: -10, bottom: timeframe === 'daily' ? 60 : 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                            dataKey={timeframe === 'daily' ? 'date' : 'month'}
                            tickLine={false} 
                            axisLine={false} 
                            tickMargin={8}
                            tickFormatter={(value) => {
                                if (timeframe === 'daily' && typeof value === 'string') {
                                    const date = new Date(value);
                                    if (!isNaN(date.getTime())) {
                                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                    }
                                }
                                return value;
                            }}
                             padding={{ left: 10, right: 10 }}
                        />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `₹${value / 1000}k`} />
                        <Tooltip cursor={false} content={<CustomTooltip />} position={{ y: 0 }} />
                        <Bar dataKey="sales" fill="hsl(var(--primary))" radius={2} animationDuration={300} />
                         {timeframe === 'daily' && (
                            <Brush 
                                dataKey="date" 
                                height={30} 
                                stroke="hsl(var(--primary))"
                                y={310}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    if (!isNaN(date.getTime())) {
                                        return date.toLocaleDateString('en-US', { month: 'short' });
                                    }
                                    return value;
                                }}
                            />
                        )}
                    </BarChart>
                </ResponsiveContainer>
            )}
            {chartType === 'area' && (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={currentData}
                        margin={{ top: 5, right: 20, left: 10, bottom: timeframe === 'daily' ? 60 : 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                            dataKey={timeframe === 'daily' ? 'date' : 'month'} 
                            tickLine={false} 
                            axisLine={false} 
                            tickMargin={8} 
                             tickFormatter={(value) => {
                                if (timeframe === 'daily' && typeof value === 'string') {
                                    const date = new Date(value);
                                    if (!isNaN(date.getTime())) {
                                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                    }
                                }
                                return value;
                            }}
                            padding={{ left: 10, right: 10 }}
                        />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `₹${value / 1000}k`} />
                        <Tooltip cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }} content={<CustomTooltip />} position={{ y: 0 }} />
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey="sales"
                            type="monotone"
                            fill="url(#colorSales)"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            stackId="a"
                            animationDuration={300}
                        />
                         {timeframe === 'daily' && (
                            <Brush 
                                dataKey="date" 
                                height={30} 
                                stroke="hsl(var(--primary))"
                                y={310}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    if (!isNaN(date.getTime())) {
                                        return date.toLocaleDateString('en-US', { month: 'short' });
                                    }
                                    return value;
                                }}
                            />
                        )}
                    </AreaChart>
                </ResponsiveContainer>
            )}
            {chartType === 'pie' && (
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip cursor={false} content={<ChartTooltipContent hideLabel indicator="dot" />} />
                        <Pie
                            data={salesData} // Pie chart still uses monthly for clarity
                            dataKey="sales"
                            nameKey="month"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            innerRadius={80}
                            labelLine={false}
                            paddingAngle={2}
                            animationDuration={500}
                        >
                             {salesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`hsl(${pieChartColors[index % pieChartColors.length]})`} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
