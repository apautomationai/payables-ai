"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import client from "@/lib/axios-client";
import { useRouter } from "next/navigation";

interface OnboardingFlowProps {
    integrations: Array<{
        name: string;
        status: string;
        metadata?: {
            startReading?: string;
        };
    }>;
}

type OnboardingStep = "gmail" | "gmail-config" | "quickbooks" | "complete";

export default function OnboardingFlow({ integrations }: OnboardingFlowProps) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<OnboardingStep>("gmail");
    const [isCompleting, setIsCompleting] = useState(false);
    const [isSavingDate, setIsSavingDate] = useState(false);
    const [date, setDate] = useState<Date | undefined>(new Date());

    const gmailIntegration = integrations.find((i) => i.name === "gmail");
    const quickbooksIntegration = integrations.find((i) => i.name === "quickbooks");

    const isGmailConnected = gmailIntegration?.status === "success";
    const isGmailConfigured = gmailIntegration?.metadata?.startReading;
    const isQuickBooksConnected = quickbooksIntegration?.status === "success";

    const dateString = useMemo(() => (date ? date.toISOString().split("T")[0] : ""), [date]);

    useEffect(() => {
        // Auto-advance to next step when integration is connected
        if (currentStep === "gmail" && isGmailConnected) {
            setCurrentStep("gmail-config");
        } else if (currentStep === "gmail-config" && isGmailConfigured) {
            setCurrentStep("quickbooks");
        } else if (currentStep === "quickbooks" && isQuickBooksConnected) {
            setCurrentStep("complete");
        }
    }, [isGmailConnected, isGmailConfigured, isQuickBooksConnected, currentStep]);

    const handleConnectGmail = async () => {
        try {
            // Set a cookie to track onboarding mode
            document.cookie = "onboarding_mode=true; path=/; max-age=600"; // 10 minutes

            const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/google/auth`;
            const res: any = await client.get(url);
            if (res.url) {
                window.location.href = res.url;
            }
        } catch (error) {
            toast.error("Failed to connect Gmail");
        }
    };

    const handleSaveGmailDate = async () => {
        if (!date) {
            toast.error("Please select a date");
            return;
        }

        setIsSavingDate(true);
        try {
            await client.patch("api/v1/settings/update-start", {
                name: "gmail",
                startReading: dateString,
            });
            toast.success("Start date saved successfully!");
            router.refresh();
            setCurrentStep("quickbooks");
        } catch (error) {
            toast.error("Failed to save date");
        } finally {
            setIsSavingDate(false);
        }
    };

    const handleConnectQuickBooks = async () => {
        try {
            // Set a cookie to track onboarding mode
            document.cookie = "onboarding_mode=true; path=/; max-age=600"; // 10 minutes

            const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/quickbooks/auth`;
            const res: any = await client.get(url);
            if (res.url) {
                window.location.href = res.url;
            }
        } catch (error) {
            toast.error("Failed to connect QuickBooks");
        }
    };

    const handleCompleteOnboarding = async () => {
        setIsCompleting(true);
        try {
            await client.post("api/v1/users/complete-onboarding");
            toast.success("Welcome! Your account is all set up.");
            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            toast.error("Failed to complete onboarding");
            setIsCompleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold">Welcome! Let's Get Started</CardTitle>
                    <CardDescription className="text-base mt-2">
                        Connect your accounts to start processing invoices automatically
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <StepIndicator
                            label="Gmail"
                            isActive={currentStep === "gmail"}
                            isCompleted={isGmailConnected}
                        />
                        <div className="h-0.5 w-12 bg-gray-300 dark:bg-gray-600" />
                        <StepIndicator
                            label="Configure"
                            isActive={currentStep === "gmail-config"}
                            isCompleted={!!isGmailConfigured}
                        />
                        <div className="h-0.5 w-12 bg-gray-300 dark:bg-gray-600" />
                        <StepIndicator
                            label="QuickBooks"
                            isActive={currentStep === "quickbooks"}
                            isCompleted={isQuickBooksConnected}
                        />
                        <div className="h-0.5 w-12 bg-gray-300 dark:bg-gray-600" />
                        <StepIndicator
                            label="Done"
                            isActive={currentStep === "complete"}
                            isCompleted={false}
                        />
                    </div>

                    {/* Gmail Step */}
                    {currentStep === "gmail" && (
                        <div className="space-y-4">
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-semibold">Connect Your Gmail Account</h3>
                                <p className="text-muted-foreground">
                                    We'll automatically process invoices from your email
                                </p>
                            </div>
                            <div className="flex justify-center">
                                <Button
                                    size="lg"
                                    onClick={handleConnectGmail}
                                    className="w-full max-w-sm"
                                    disabled={isGmailConnected}
                                >
                                    {isGmailConnected ? (
                                        <>
                                            <CheckCircle2 className="mr-2 h-5 w-5" />
                                            Gmail Connected
                                        </>
                                    ) : (
                                        "Connect Gmail"
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Gmail Configuration Step */}
                    {currentStep === "gmail-config" && (
                        <div className="space-y-4">
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-semibold">Configure Gmail Start Date</h3>
                                <p className="text-muted-foreground">
                                    Select the date from which to start processing emails
                                </p>
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="rounded-md border"
                                />
                                <Button
                                    size="lg"
                                    onClick={handleSaveGmailDate}
                                    className="w-full max-w-sm"
                                    disabled={!date || isSavingDate}
                                >
                                    {isSavingDate ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Continue"
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* QuickBooks Step */}
                    {currentStep === "quickbooks" && (
                        <div className="space-y-4">
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-semibold">Connect QuickBooks</h3>
                                <p className="text-muted-foreground">
                                    Sync your accounting data for better invoice processing
                                </p>
                            </div>
                            <div className="flex justify-center">
                                <Button
                                    size="lg"
                                    onClick={handleConnectQuickBooks}
                                    className="w-full max-w-sm"
                                    disabled={isQuickBooksConnected}
                                >
                                    {isQuickBooksConnected ? (
                                        <>
                                            <CheckCircle2 className="mr-2 h-5 w-5" />
                                            QuickBooks Connected
                                        </>
                                    ) : (
                                        "Connect QuickBooks"
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Complete Step */}
                    {currentStep === "complete" && (
                        <div className="space-y-4">
                            <div className="text-center space-y-2">
                                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                                <h3 className="text-xl font-semibold">You're All Set!</h3>
                                <p className="text-muted-foreground">
                                    Both Gmail and QuickBooks are connected. You're ready to start processing invoices.
                                </p>
                            </div>
                            <div className="flex justify-center">
                                <Button
                                    size="lg"
                                    onClick={handleCompleteOnboarding}
                                    className="w-full max-w-sm"
                                    disabled={isCompleting}
                                >
                                    {isCompleting ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Setting up...
                                        </>
                                    ) : (
                                        "Go to Dashboard"
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function StepIndicator({
    label,
    isActive,
    isCompleted,
}: {
    label: string;
    isActive: boolean;
    isCompleted: boolean;
}) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className={`rounded-full p-2 ${isCompleted
                    ? "bg-green-500 text-white"
                    : isActive
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-500"
                    }`}
            >
                {isCompleted ? (
                    <CheckCircle2 className="h-6 w-6" />
                ) : (
                    <Circle className="h-6 w-6" />
                )}
            </div>
            <span
                className={`text-sm font-medium ${isActive || isCompleted
                    ? "text-foreground"
                    : "text-muted-foreground"
                    }`}
            >
                {label}
            </span>
        </div>
    );
}
