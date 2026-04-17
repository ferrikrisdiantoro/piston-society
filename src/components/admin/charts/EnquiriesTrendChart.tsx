'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface Props {
  data: { date: string; count: number }[]
}

export function EnquiriesTrendChart({ data }: Props) {
  if (data.length === 0) {
    return <EmptyState message="No enquiry data yet" />
  }
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#94A3B8' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: '#94A3B8' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }}
          labelStyle={{ color: '#1E293B', fontWeight: 600 }}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#2563EB"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5, fill: '#2563EB' }}
          name="Enquiries"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="h-[220px] flex items-center justify-center text-[#94A3B8] text-sm">
      {message}
    </div>
  )
}
