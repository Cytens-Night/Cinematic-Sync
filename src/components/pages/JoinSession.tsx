import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { validateSession, joinSession } from "@/lib/session";
import { useAuth } from "@/supabase/auth";

export default function JoinSession() {
  const [sessionId, setSessionId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleJoinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!sessionId.trim()) {
      setError("Please enter a session ID");
      return;
    }

    if (!pin.trim()) {
      setError("Please enter a PIN");
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join a session",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      // Validate session
      const isValid = await validateSession(sessionId, pin);

      if (!isValid) {
        setError("Invalid session ID or PIN");
        return;
      }

      // Join session
      await joinSession(sessionId, user.id, user.email || "Anonymous");

      toast({
        title: "Session joined",
        description: "You have successfully joined the session.",
      });

      // Navigate to waiting room
      navigate(`/waiting-room/${sessionId}?pin=${pin}&host=false`);
    } catch (error) {
      console.error("Error joining session:", error);
      setError("Failed to join session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 pt-20">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-8">Join a Movie Session</h1>

        <Card className="bg-[#1a1a1a] border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Enter Session Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoinSession} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionId" className="text-gray-300">
                  Session ID
                </Label>
                <Input
                  id="sessionId"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="e.g. MOVIE-ABC123"
                  className="bg-[#222] border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pin" className="text-gray-300">
                  PIN
                </Label>
                <Input
                  id="pin"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="e.g. 1234"
                  className="bg-[#222] border-gray-700 text-white"
                />
              </div>

              {error && (
                <Alert
                  variant="destructive"
                  className="bg-red-900/20 border-red-800 text-red-300"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Joining..." : "Join Session"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
