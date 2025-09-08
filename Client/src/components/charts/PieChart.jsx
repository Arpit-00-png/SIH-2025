import React from 'react'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const PieChart = ({ data }) => {
  let chartData = Array.isArray(data) ? [...data] : []

  if (chartData.length === 1) {
    const v = Math.max(0, Math.min(100, Number(chartData[0].value) || 0))
    chartData = [
      { ...chartData[0], value: v },
      { name: 'Other', value: 100 - v, color: '#e2e8f0' }
    ]
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={30}
          outerRadius={60}
          paddingAngle={2}
          dataKey="value"
          isAnimationActive={false}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

export default PieChart 