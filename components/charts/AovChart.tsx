'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

    useEffect(() => {
        setMounted(true);
    }, [])

    if(!mounted) {
        return null;
    }

    return (
        <>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data} width={500} height={400}>
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
                        tickFormatter={value => `$${value}`}
                    />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="Aov" stroke='#8884d8' activeDot={{ r: 4 }}/>
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" strokeDasharray="5 5"/>
                </LineChart>
            </ResponsiveContainer>
        </>
    )
}