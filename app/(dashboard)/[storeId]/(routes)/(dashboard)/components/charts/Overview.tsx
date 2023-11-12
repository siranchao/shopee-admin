'use client'
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from 'recharts';
import { useState, useEffect } from 'react'

interface GraphData {
    name: string
    revenue: number
    order_count: number
}

interface OverviewProps {
    data: GraphData[]
}

export default function Overview({ data }: OverviewProps) {
    const [mounted, setMounted] = useState(false);
    
    const formattedData = data.map((item) => ({
        name: item.name,
        revenue: item.revenue.toFixed(2),
        order_count: item.order_count
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
                <BarChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="name" 
                        stroke='#888888'
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis  
                        stroke='#8884d8'
                        yAxisId="left" 
                        orientation="left"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={value => `$${value}`}
                    />
                    <YAxis  
                        stroke='#82ca9d'
                        yAxisId="right" 
                        orientation="right"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" fill='#8884d8' radius={[4, 4, 0, 0]}/>
                    <Bar yAxisId="right" dataKey="order_count" fill='#82ca9d' radius={[4, 4, 0, 0]}/>
                </BarChart>
            </ResponsiveContainer>
        </>
    )
}