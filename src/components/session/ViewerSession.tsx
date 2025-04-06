import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import VideoPlayer from "../player/VideoPlayer";
import ChatSidebar from "../chat/ChatSidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Wifi, WifiOff, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../../../supabase/auth";
import {
  updateSessionStatus,
  getSessionViewers,
  removeSessionViewer,
} from "@/lib/session";

interface Viewer {
  id: string;
  name: string;
  email?: string;
  isHost: boolean;
  connectionQuality: "good" | "fair" | "poor" | "offline";
}

interface ViewerSessionProps {
  sessionId: string;
  isHost: boolean;
  content: { type: string; source: string; title?: string };
}

export default function ViewerSession({
  sessionId,
  isHost,
  content,
}: ViewerSessionProps) {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isViewersOpen, setIsViewersOpen] = useState(false);
  const [viewers, setViewers] = useState<Viewer[]>([
    {
      id: "1",
      name: "You",
      isHost: isHost,
      connectionQuality: "good",
    },
    {
      id: "2",
      name: "John Doe",
      email: "john@example.com",
      isHost: false,
      connectionQuality: "good",
    },
    {
      id: "3",
      name: "Jane Smith",
      email: "jane@example.com",
      isHost: false,
      connectionQuality: "fair",
    },
  ]);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Fetch viewers when component mounts
    if (sessionId) {
      fetchViewers();
    }

    // Clean up when component unmounts
    return () => {
      if (user && sessionId) {
        removeSessionViewer(sessionId, user.id).catch(console.error);
      }
    };
  }, [sessionId, user]);

  const fetchViewers = async () => {
    try {
      const sessionViewers = await getSessionViewers(sessionId);
      // Transform to our viewer format
      const formattedViewers = sessionViewers.map((viewer) => ({
        id: viewer.user_id,
        name: viewer.user_name,
        email: viewer.user_id.includes("@") ? viewer.user_id : undefined,
        isHost: viewer.user_id === sessionViewers[0]?.user_id, // Assuming first viewer is host
        connectionQuality: (viewer.connection_quality || "good") as
          | "good"
          | "fair"
          | "poor"
          | "offline",
      }));

      setViewers(formattedViewers);
    } catch (error) {
      console.error("Error fetching viewers:", error);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (isViewersOpen && !isChatOpen) {
      setIsViewersOpen(false);
    }
  };

  const toggleViewers = () => {
    setIsViewersOpen(!isViewersOpen);
    if (isChatOpen && !isViewersOpen) {
      setIsChatOpen(false);
    }
  };

  const handleEndSession = async () => {
    try {
      if (isHost && sessionId) {
        await updateSessionStatus(sessionId, "ended");
      }

      toast({
        title: "Session ended",
        description: isHost
          ? "You have ended the session for all viewers."
          : "The host has ended the session.",
      });
      navigate("/");
    } catch (error) {
      console.error("Error ending session:", error);
      toast({
        title: "Error",
        description: "Failed to end session properly.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={isViewersOpen ? 20 : 0}
          minSize={0}
          maxSize={25}
          className={!isViewersOpen ? "hidden" : ""}
        >
          <Card className="h-full rounded-none bg-[#1a1a1a] border-gray-800 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Viewers</CardTitle>
                <Badge variant="outline" className="border-gray-700 bg-[#222]">
                  <Users className="h-3 w-3 mr-1" />
                  {viewers.length}
                </Badge>
              </div>
              <CardDescription className="text-gray-400">
                People in this session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {viewers.map((viewer) => (
                  <div
                    key={viewer.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#222]"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${viewer.email || viewer.name}`}
                        />
                        <AvatarFallback>{viewer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{viewer.name}</p>
                        {viewer.isHost && (
                          <Badge
                            variant="outline"
                            className="text-xs border-red-800 bg-red-900/20 text-red-300"
                          >
                            Host
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      {viewer.connectionQuality === "good" && (
                        <Wifi className="h-4 w-4 text-green-500" />
                      )}
                      {viewer.connectionQuality === "fair" && (
                        <Wifi className="h-4 w-4 text-yellow-500" />
                      )}
                      {viewer.connectionQuality === "poor" && (
                        <Wifi className="h-4 w-4 text-red-500" />
                      )}
                      {viewer.connectionQuality === "offline" && (
                        <WifiOff className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ResizablePanel>

        <ResizablePanel defaultSize={isChatOpen || isViewersOpen ? 60 : 100}>
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h1 className="text-xl font-semibold">
                {content.title || "Movie Session"}
              </h1>
              {isHost && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleEndSession}
                >
                  End Session
                </Button>
              )}
            </div>
            <div className="flex-grow overflow-hidden">
              <VideoPlayer
                sessionId={sessionId}
                userId={user?.id || "anonymous"}
                isHost={isHost}
                source={content.source}
                title={content.title}
                onToggleChat={toggleChat}
                onToggleViewers={toggleViewers}
              />
            </div>
          </div>
        </ResizablePanel>

        <ResizablePanel
          defaultSize={isChatOpen ? 20 : 0}
          minSize={0}
          maxSize={30}
          className={!isChatOpen ? "hidden" : ""}
        >
          <ChatSidebar
            sessionId={sessionId}
            userId={user?.id || "anonymous"}
            userName={user?.email?.split("@")[0] || "Anonymous"}
            userEmail={user?.email}
            currentVideoTime={0}
            onClose={toggleChat}
            isCollapsible={true}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
