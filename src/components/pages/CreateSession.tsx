import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { generateSessionId, generatePin, createSession } from "@/lib/session";
import { useAuth } from "@/supabase/auth";
import ContentUploader from "../content/ContentUploader";

export default function CreateSession() {
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [pin, setPin] = useState("");
  const [content, setContent] = useState<{
    type: string;
    source: string;
    title?: string;
  } | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateSession = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a session",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      // Generate session ID and PIN
      const newSessionId = generateSessionId();
      const newPin = generatePin();

      setSessionId(newSessionId);
      setPin(newPin);

      // Create session in database
      await createSession(user.id, newSessionId, newPin);

      toast({
        title: "Session created",
        description: "Your session has been created successfully.",
      });

      // Navigate to waiting room
      navigate(`/waiting-room/${newSessionId}?pin=${newPin}&host=true`);
    } catch (error) {
      console.error("Error creating session:", error);
      toast({
        title: "Error",
        description: "Failed to create session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentAdded = (contentInfo: {
    type: string;
    source: string;
    title?: string;
  }) => {
    setContent(contentInfo);
    toast({
      title: "Content ready",
      description: `${contentInfo.type === "url" ? "URL" : "File"} has been added and is ready to share.`,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 pt-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Create a Movie Session</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#1a1a1a] border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400">
                Create a new session to watch content with friends. You'll get a
                unique session ID and PIN that you can share.
              </p>
              <Button
                onClick={handleCreateSession}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create New Session"}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800 text-white">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Create a new session</li>
                <li>Add content (URL or file upload)</li>
                <li>Share the session ID and PIN with friends</li>
                <li>Start watching together with perfect synchronization</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
