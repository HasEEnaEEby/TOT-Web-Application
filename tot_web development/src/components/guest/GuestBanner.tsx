import { Alert, AlertDescription } from "../ui/alert";
import { Clock } from "lucide-react";

export function GuestBanner() {
  return (
    <Alert className="mb-4">
      <Clock className="h-4 w-4" />
      <AlertDescription>
        You're in Guest Mode. Session expires in <span className="font-medium" id="timer">3:00:00</span>. 
        <a href="/sign-up" className="ml-2 text-primary hover:underline">Create an account</a> for unlimited access.
      </AlertDescription>
    </Alert>
  );
}