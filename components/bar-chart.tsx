"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart";
import { Calendar } from "lucide-react";

const chartData = [
  { month: "January", appointments: 186, doctors: 80 },
  { month: "February", appointments: 305, doctors: 200 },
  { month: "March", appointments: 237, doctors: 120 },
  { month: "April", appointments: 73, doctors: 190 },
  { month: "May", appointments: 209, doctors: 130 },
  { month: "June", appointments: 214, doctors: 140 },
];

const chartConfig = {
  appointments: {
    label: "appointments",
    color: "#2563eb",
    icon: Calendar
  },
  doctors: {
    label: "doctors",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export function BarChartComponent() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="appointments"
          fill="var(--color-appointments)"
          radius={4}
        />
        <Bar dataKey="doctors" fill="var(--color-doctors)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
