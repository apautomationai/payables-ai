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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";

const initialDetails = {
  fullName: "Guest",
  email: "guest@example.com",
  phone: "+1 (555) 123-4567",
  company: "Acme Corporation",
  jobTitle: "Accounts Payable Manager",
};

export default function PersonalInformationForm() {
  const [details, setDetails] = useState(initialDetails);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setDetails((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Personal information saved:", details);
    // Add logic to save details to your backend
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="https://i.pravatar.cc/150?u=guest" />
              <AvatarFallback>G</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{details.fullName}</h3>
              <p className="text-sm text-muted-foreground">{details.email}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={details.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={details.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={details.phone}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={details.company}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={details.jobTitle}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex justify-end gap-2 w-full">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
