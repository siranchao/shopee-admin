import Heading from "@/components/customs/Heading"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatter } from "@/lib/utils"
import { CreditCard, DollarSign, Package } from "lucide-react"
import { getTotalRevenue } from "@/actions/get-total-revenue"
import { getSalesCount } from "@/actions/get-sales-count"
import { getStockCount } from "@/actions/get-stock-count"
import { getGraphRevenue } from "@/actions/get-month-revenue"
import { getSalesPercentage } from "@/actions/get-sales-percentage"
import Overview from "@/components/charts/Overview"
import Piechart from "@/components/charts/PieChart"
import AovChart from "@/components/charts/AovChart"

import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Admin | Dashboard',
    description: 'Shopee Admin - Store Dashboard',
}

export default async function DashboardPage({ params }: { params: { storeId: string } }) {

    const totalRevenue = await getTotalRevenue(params.storeId)
    const salesCount = await getSalesCount(params.storeId)
    const productCount = await getStockCount(params.storeId)
    const graphRevenue = await getGraphRevenue(params.storeId)
    const salesPercentage = await getSalesPercentage(params.storeId)

    const aovData = graphRevenue.filter(data => data.order_count > 0).map(data => {
        return {
            name: data.name,
            Aov: data.revenue / data.order_count,
            revenue: data.revenue
        }
    })

    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <Heading title="Dashboard" desc="Overview of your store" />                   
                    <Separator />

                    <div className="grid gap-4 grid-cols-3">
                        <Card className="flex flex-col justify-between">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle  className="text-sm font-medium">
                                    Total Revenue
                                </CardTitle>

                                <DollarSign className="h-4 w-4 text-muted-foreground over" />
                            </CardHeader>
                            
                            <CardContent>
                                <div className="font-bold text-lg overflow-hidden sm:text-2xl">
                                    {formatter.format(totalRevenue)}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="flex flex-col justify-between">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle  className="text-sm font-medium">
                                    Orders Sold
                                </CardTitle>

                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            
                            <CardContent>
                                <div className="font-bold text-lg overflow-hidden sm:text-2xl">
                                    +{salesCount}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="flex flex-col justify-between">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle  className="text-sm font-medium">
                                    Products for Sale
                                </CardTitle>

                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            
                            <CardContent>
                                <div className="font-bold text-lg overflow-hidden sm:text-2xl">
                                    {productCount}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
                        <Card className="md:col-span-4">
                            <CardHeader>
                                    <CardTitle>Monthly Revenue</CardTitle>                           
                            </CardHeader>
                            <CardContent>
                                <Overview data={graphRevenue} />
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Sales Distribution</CardTitle>   
                                <CardDescription>Total revenue by each category</CardDescription>                        
                            </CardHeader>
                            <CardContent>
                                <Piechart data={salesPercentage}/>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Average Order Value (AOV)</CardTitle>  
                                <CardDescription>AOV growth vs. revenue growth</CardDescription>                           
                            </CardHeader>
                            <CardContent className="p-4">
                                <AovChart data={aovData}/>
                            </CardContent>
                        </Card>
                    </div>

                </div>       
            </div>
        </>
    )
}