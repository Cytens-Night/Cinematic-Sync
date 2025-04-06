import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import WaitingRoom from "@/components/session/WaitingRoom";
import { useAuth } from "@/supabase/auth";
import { addSessionContent, updateSessionStatus } from "@/lib/session";

export default function WaitingRoomPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [searchParams] = useSearchParams();
  const pin = searchParams.get("pin") || "";
  const isHost = searchParams.get("host") === "true";

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!sessionId || !pin) {
      setError("Invalid session parameters");
      setIsLoading(false);
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    // In a real implementation, you would verify the session exists
    // and that the user has permission to access it
    setIsLoading(false);
  }, [sessionId, pin, user, navigate]);

  const handleStartSession = async (content: {
    type: string;
    source: string;
    title?: string;
  }) => {
    if (!sessionId || !user) return;

    try {
      console.log("Starting session with content:", content);

      // Add content to the session
      await addSessionContent(
        sessionId,
        content.type,
        content.source,
        content.title,
      );

      // Update session status to active
      await updateSessionStatus(sessionId, "active");

      // Navigate to the viewer session
      navigate(`/watch/${sessionId}?pin=${pin}&host=${isHost}`);
    } catch (error) {
      console.error("Error starting session:", error);
      toast({
        title: "Error",
        description: "Failed to start session. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LoadingScreen text="Loading waiting room..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <WaitingRoom
      sessionId={sessionId || ""}
      pin={pin}
      isHost={isHost}
      onStart={handleStartSession}
    />
  );
}
