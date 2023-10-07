'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GraphData {
    name: string
    Aov: number
    order_count: number
}

interface AovProps {
    data: GraphData[]
}

export default function AovChart({ data }: AovProps) {

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
                        stroke='#ff7300'
                        yAxisId="right" 
                        orientation="right"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="Aov" stroke='#8884d8' activeDot={{ r: 4 }}/>
                    <Line yAxisId="right" type="monotone" dataKey="order_count" stroke="#ff7300" strokeDasharray="5 5"/>
                </LineChart>
            </ResponsiveContainer>
        </>
    )
}