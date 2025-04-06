import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Copy, FileVideo, Users, Wifi, WifiOff } from "lucide-react";
import ContentUploader from "../content/ContentUploader";
import { useToast } from "@/components/ui/use-toast";

interface Viewer {
  id: string;
  name: string;
  email?: string;
  isHost: boolean;
  connectionQuality: "good" | "fair" | "poor" | "offline";
}

interface WaitingRoomProps {
  sessionId: string;
  pin: string;
  isHost: boolean;
  onStart: (contentInfo: {
    type: string;
    source: string;
    title?: string;
  }) => void;
}

export default function WaitingRoom({
  sessionId,
  pin,
  isHost,
  onStart,
}: WaitingRoomProps) {
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

  const [content, setContent] = useState<{
    type: string;
    source: string;
    title?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleContentAdded = (contentInfo: {
    type: string;
    source: string;
    title?: string;
  }) => {
    setIsLoading(true);
    console.log("Content added:", contentInfo);

    // Simulate processing delay
    setTimeout(() => {
      setContent(contentInfo);
      setIsLoading(false);
      toast({
        title: "Content added successfully",
        description: `${contentInfo.type === "url" ? "URL" : "File"} has been added to the session.`,
      });
    }, 1500);
  };

  const handleCopyInvite = () => {
    const inviteText = `Join my CinematicSync session! Session ID: ${sessionId}, PIN: ${pin}`;
    navigator.clipboard.writeText(inviteText);
    toast({
      title: "Copied to clipboard",
      description: "Invite details copied to clipboard.",
    });
  };

  const handleStartSession = () => {
    if (!content) {
      toast({
        title: "No content selected",
        description: "Please add content before starting the session.",
        variant: "destructive",
      });
      return;
    }
    onStart(content);
  };

  const getConnectionIcon = (quality: string) => {
    switch (quality) {
      case "good":
        return <Wifi className="h-4 w-4 text-green-500" />;
      case "fair":
        return <Wifi className="h-4 w-4 text-yellow-500" />;
      case "poor":
        return <Wifi className="h-4 w-4 text-red-500" />;
      case "offline":
        return <WifiOff className="h-4 w-4 text-gray-500" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-[#1a1a1a] border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Waiting Room</CardTitle>
              <CardDescription className="text-gray-400">
                {isHost
                  ? "Add content to start the session"
                  : "Waiting for host to start the session"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[#222] rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">Session ID</p>
                    <p className="text-lg font-medium">{sessionId}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyInvite}
                    className="border-gray-700 text-gray-300 hover:text-white"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Invite
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#222] rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">PIN</p>
                    <p className="text-lg font-medium">{pin}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-red-800 bg-red-900/20 text-red-300"
                  >
                    Keep Private
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {isHost && (
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Add Content</h3>
              <ContentUploader
                onContentAdded={handleContentAdded}
                isLoading={isLoading}
              />
            </div>
          )}

          {content && (
            <Card className="bg-[#1a1a1a] border-gray-800 text-white">
              <CardHeader>
                <CardTitle>Content Ready</CardTitle>
                <CardDescription className="text-gray-400">
                  {content.title || content.source}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-[#111] rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FileVideo className="h-12 w-12 mx-auto mb-2 text-gray-500" />
                    <p className="text-gray-400">
                      {content.type === "url" ? "URL Content" : "File Upload"}
                    </p>
                    <p className="text-sm text-gray-500 truncate max-w-xs mx-auto">
                      {content.title || content.source}
                    </p>
                  </div>
                </div>
              </CardContent>
              {isHost && (
                <CardFooter>
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleStartSession}
                  >
                    Start Session
                  </Button>
                </CardFooter>
              )}
            </Card>
          )}
        </div>

        <div>
          <Card className="bg-[#1a1a1a] border-gray-800 text-white">
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
                    <div>{getConnectionIcon(viewer.connectionQuality)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
