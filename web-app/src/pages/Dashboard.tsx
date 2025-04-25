import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '../components/ui/chart';
import PiechartComponent from '../_components/Dashboard/Piechart';
import { BarChartComponent } from '../_components/Dashboard/Barchart';
import FetchDealersOnDashboard from '../_components/Dashboard/DealerDashboard';
const chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
    desktop: {
        label: 'Credit',
        color: 'hsl(var(--chart-1))',
    },
    mobile: {
        label: 'Payment',
        color: 'hsl(var(--chart-2))',
    },
} satisfies ChartConfig;

export default function Dashboard() {
    return (
        <div className="flex justify-start items-start w-full lg:p-10 font-work flex-col lg:gap-y-10">
            <div className="flex justify-start items-center lg:gap-x-10">
                <div className="max-w-[450px] max-h-[450px] min-w-[300px] min-h-[300px] duration-300 transition">
                    <GradientChartComponent />
                </div>
                <div className="max-w-[450px] max-h-[450px] min-w-[300px] min-h-[300px]">
                    <PiechartComponent />
                </div>
                <div className="max-w-[450px] max-h-[450px] min-w-[300px] min-h-[300px]">
                    <BarChartComponent />
                </div>
            </div>
            <div className="flex justify-center items-center lg:p-10 overflow-x-hidden">
                <FetchDealersOnDashboard />
            </div>
            <div className="flex justify-center items-center w-full">
                <h6 className="mt-10 text-sm text-stone-500 text-center cursor-none">
                    Powered by n<strong className="text-lg text-violet-500">X</strong>tribe &copy; 2025
                </h6>
            </div>
        </div>
    );
}

const GradientChartComponent = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>Showing total orders for the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <defs>
                            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey="mobile"
                            type="natural"
                            fill="url(#fillMobile)"
                            fillOpacity={0.4}
                            stroke="var(--color-mobile)"
                            stackId="a"
                        />
                        <Area
                            dataKey="desktop"
                            type="natural"
                            fill="url(#fillDesktop)"
                            fillOpacity={0.4}
                            stroke="var(--color-desktop)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            January - June 2025
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};
