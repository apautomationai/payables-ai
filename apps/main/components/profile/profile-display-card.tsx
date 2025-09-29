import React from 'react';
// 1. Import icons for a more visual display
import { Mail, Phone, Building2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";

// Define the shape of the user data prop
type UserData = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  businessName?: string | null;
  avatarUrl?: string | null;
};

type ProfileDisplayCardProps = {
  user: UserData;
  onEdit: () => void; // Function to trigger edit mode
};

// 2. A new helper component for displaying details with icons
const DetailItem = ({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: React.ElementType, 
  label: string, 
  value: string | null | undefined 
}) => (
  <div className="flex items-center gap-4">
    <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value || "Not provided"}</span>
    </div>
  </div>
);

export function ProfileDisplayCard({ user, onEdit }: ProfileDisplayCardProps) {
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  const fallback = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30 p-6 border-b">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-background">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={fullName} />
            <AvatarFallback className="text-xl">{fallback}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{fullName}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Mail className="h-4 w-4" />
              <span>{user.email || 'No email provided'}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <CardTitle className="mb-4 text-lg font-semibold">Contact Details</CardTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <DetailItem icon={Phone} label="Phone Number" value={user.phone} />
          <DetailItem icon={Building2} label="Business Name" value={user.businessName} />
        </div>
      </CardContent>

      <CardFooter className="bg-muted/30 p-6 flex justify-end">
        <Button onClick={onEdit}>Edit Profile</Button>
      </CardFooter>
    </Card>
  );
}