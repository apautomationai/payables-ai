import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <Card className="min-w-5xl mx-auto">
          <CardHeader>
            <CardTitle>Landing Page</CardTitle>
            <CardDescription>
              This is the landing page for Payables AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Payables AI is a platform for automating invoice processing and
              payment.
            </p>
          </CardContent>
          <CardFooter>
            <Button>Get Started</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
