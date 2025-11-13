"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { DashboardMetrics } from "@/lib/types";

interface InvoiceStatusChartProps {
    metrics: DashboardMetrics;
    dateRange: string;
}

const COLORS = {
    pending: "#fbbf24", // yellow
    approved: "#34d399", // green
    rejected: "#f87171", // red
};

export default function InvoiceStatusChart({
    metrics,
    dateRange,
}: InvoiceStatusChartProps) {
    const data = [
        { name: "Pending", value: metrics.pendingThisMonth, color: COLORS.pending },
        { name: "Approved", value: metrics.approvedThisMonth, color: COLORS.approved },
        { name: "Rejected", value: metrics.rejectedThisMonth, color: COLORS.rejected },
    ].filter((item) => item.value > 0);

    const total = data.reduce((sum, item) => sum + item.value, 0);

    if (total === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Invoice Status Distribution</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[300px]">
                    <p className="text-muted-foreground">No invoice data available</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Invoice Status Distribution</CardTitle>
                <p className="text-sm text-muted-foreground capitalize">{dateRange}</p>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                                `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                            }
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
