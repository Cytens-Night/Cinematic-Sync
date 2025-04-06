import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import ViewerSession from "@/components/session/ViewerSession";
import { useAuth } from "@/supabase/auth";
import { supabase } from "@/supabase/supabase";

export default function ViewerSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [searchParams] = useSearchParams();
  const pin = searchParams.get("pin") || "";
  const isHost = searchParams.get("host") === "true";

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [content, setContent] = useState<{
    type: string;
    source: string;
    title?: string;
  } | null>(null);

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

    const fetchSessionContent = async () => {
      try {
        // Get the latest content for this session
        const { data, error } = await supabase
          .from("session_content")
          .select("*")
          .eq("session_id", sessionId)
          .order("added_at", { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;

        if (data) {
          setContent({
            type: data.content_type,
            source: data.content_source,
            title: data.content_title || undefined,
          });
        } else {
          setError("No content found for this session");
        }
      } catch (error) {
        console.error("Error fetching session content:", error);
        setError("Failed to load session content");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionContent();
  }, [sessionId, pin, user, navigate]);

  if (isLoading) {
    return <LoadingScreen text="Loading session..." />;
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

  if (!content) {
    return <LoadingScreen text="Waiting for content..." />;
  }

  return (
    <ViewerSession
      sessionId={sessionId || ""}
      isHost={isHost}
      content={content}
    />
  );
}
