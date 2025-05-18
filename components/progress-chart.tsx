"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from "@/components/ui/chart"

interface ProgressChartProps {
  percentage: number
  label: string
  color: string
}

export function ProgressChart({ percentage, label, color }: ProgressChartProps) {
  const [chartData, setChartData] = useState([
    { name: "Completed", value: 0 },
    { name: "Remaining", value: 100 },
  ])

  useEffect(() => {
    // Animate the chart
    setChartData([
      { name: "Completed", value: percentage },
      { name: "Remaining", value: 100 - percentage },
    ])
  }, [percentage])

  return (
    <Card className="p-4 h-[200px] flex flex-col items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            <Cell key="cell-0" fill={color} />
            <Cell key="cell-1" fill="#333" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold">{percentage}%</div>
        <div className="text-sm text-gray-400">{label}</div>
      </div>
    </Card>
  )
}
