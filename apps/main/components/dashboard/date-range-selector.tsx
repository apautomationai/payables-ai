"use client";

import React from "react";
import { Button } from "@workspace/ui/components/button";
import { Calendar } from "lucide-react";

export type DateRangeType = "monthly" | "all-time" | "custom";

interface DateRangeSelectorProps {
    selectedRange: DateRangeType;
    onRangeChange: (range: DateRangeType) => void;
}

export default function DateRangeSelector({
    selectedRange,
    onRangeChange,
}: DateRangeSelectorProps) {
    return (
        <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-2">
                <Button
                    variant={selectedRange === "monthly" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onRangeChange("monthly")}
                >
                    Monthly
                </Button>
                <Button
                    variant={selectedRange === "all-time" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onRangeChange("all-time")}
                >
                    All Time
                </Button>
            </div>
        </div>
    );
}
