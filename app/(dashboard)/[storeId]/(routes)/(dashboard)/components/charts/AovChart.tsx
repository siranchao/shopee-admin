'use client'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useState, useEffect } from 'react'

interface GraphData {
    name: string
    Aov: number
    revenue: number
}

interface AovProps {
    data: GraphData[]
}

export default function AovChart({ data }: AovProps) {
    const [mounted, setMounted] = useState(false);

    const formattedData = data.map((item) => ({
        name: item.name,
        Aov: item.Aov.toFixed(2),
        revenue: item.revenue.toFixed(2)
    }))


    useEffect(() => {
        setMounted(true);
    }, [])

    if(!mounted) {
        return null;
    }

    return (
        <>
            <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                    width={500}
                    height={400}
                    data={formattedData}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="name" 
                    stroke='#888888'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis  
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={value => `$${value}`}
                />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="Aov" stackId="1" stroke="#ffc658" fill="#ffc658" />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
            </ResponsiveContainer>
        </>
    )
}