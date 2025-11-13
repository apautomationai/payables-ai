"use client";

import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";

interface InvoiceTrendChartProps {
    dateRange: string;
}

// Mock data - you'll need to fetch this from your API
const generateMockData = (range: string) => {
    if (range === "monthly") {
        return [
            { name: "Week 1", invoices: 12, amount: 24500 },
            { name: "Week 2", invoices: 19, amount: 38200 },
            { name: "Week 3", invoices: 15, amount: 29800 },
            { name: "Week 4", invoices: 22, amount: 45600 },
        ];
    } else {
        return [
            { name: "Jan", invoices: 45, amount: 89000 },
            { name: "Feb", invoices: 52, amount: 105000 },
            { name: "Mar", invoices: 48, amount: 96000 },
            { name: "Apr", invoices: 61, amount: 122000 },
            { name: "May", invoices: 55, amount: 110000 },
            { name: "Jun", invoices: 67, amount: 134000 },
        ];
    }
};

export default function InvoiceTrendChart({ dateRange }: InvoiceTrendChartProps) {
    const data = generateMockData(dateRange);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Invoice Trends</CardTitle>
                <p className="text-sm text-muted-foreground capitalize">{dateRange}</p>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="name"
                            stroke="#9ca3af"
                            style={{ fontSize: "12px" }}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            style={{ fontSize: "12px" }}
                            yAxisId="left"
                        />
                        <YAxis
                            stroke="#9ca3af"
                            style={{ fontSize: "12px" }}
                            yAxisId="right"
                            orientation="right"
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1f2937",
                                border: "1px solid #374151",
                                borderRadius: "8px",
                            }}
                        />
                        <Legend />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="invoices"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ fill: "#3b82f6", r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Invoice Count"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="amount"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ fill: "#10b981", r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Total Amount ($)"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
