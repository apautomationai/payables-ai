"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Checkbox } from "@workspace/ui/components/checkbox";

const initialSettings = {
  platformName: "Sledge",
  defaultCurrency: "USD",
  timeZone: "UTC-5",
  dateFormat: "MM/DD/YYYY",
  autoProcessInvoices: true,
  sendEmailNotifications: true,
  fileStorage: "local",
  maxFileSize: 10,
  supportedFileTypes: "PDF, PNG, JPG, JPEG, TIFF",
  emailProcessingRules:
    "Process emails from: invoices@getsledge.com, billing@getsledge.com"
};

export default function PlatformSettingsForm() {
  const [settings, setSettings] = useState(initialSettings);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setSettings((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string) => (value: string) => {
    setSettings((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (id: string) => (checked: boolean) => {
    setSettings((prev) => ({ ...prev, [id]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Platform settings saved:", settings);
    // Add logic to save settings to your backend
  };

  const handleReset = () => {
    setSettings(initialSettings);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Platform Configuration</CardTitle>
          <CardDescription>
            Configure core platform settings and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input
                id="platformName"
                value={settings.platformName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultCurrency">Default Currency</Label>
              <Select
                value={settings.defaultCurrency}
                onValueChange={handleSelectChange("defaultCurrency")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeZone">Time Zone</Label>
              <Select
                value={settings.timeZone}
                onValueChange={handleSelectChange("timeZone")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                  <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Date Format</Label>
              <Select
                value={settings.dateFormat}
                onValueChange={handleSelectChange("dateFormat")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="autoProcessInvoices"
                checked={settings.autoProcessInvoices}
                onCheckedChange={handleCheckboxChange("autoProcessInvoices")}
              />
              <Label htmlFor="autoProcessInvoices">
                Automatically process incoming invoices
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendEmailNotifications"
                checked={settings.sendEmailNotifications}
                onCheckedChange={handleCheckboxChange("sendEmailNotifications")}
              />
              <Label htmlFor="sendEmailNotifications">
                Send email notifications for new invoices
              </Label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 w-full">
            <Button variant="outline" onClick={handleReset} type="button">
              Reset to Defaults
            </Button>
            <Button type="submit">Save Platform Settings</Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
