import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Heart,
  MessageSquare,
  Send,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Smile,
  X,
} from "lucide-react";

interface Message {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  text: string;
  timestamp: number;
  type: "text" | "reaction" | "timestamp";
  reactionType?: "like" | "dislike" | "heart" | "laugh";
  videoTimestamp?: number;
}

interface ChatSidebarProps {
  sessionId: string;
  userId: string;
  userName: string;
  userEmail?: string;
  currentVideoTime: number;
  onClose?: () => void;
  isCollapsible?: boolean;
}

export default function ChatSidebar({
  sessionId,
  userId,
  userName,
  userEmail,
  currentVideoTime,
  onClose,
  isCollapsible = true,
}: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      userId: "user2",
      userName: "John Doe",
      text: "Hey everyone, ready to watch?",
      timestamp: Date.now() - 300000,
      type: "text",
    },
    {
      id: "2",
      userId: "user3",
      userName: "Jane Smith",
      text: "Yes! So excited!",
      timestamp: Date.now() - 240000,
      type: "text",
    },
    {
      id: "3",
      userId: "user3",
      userName: "Jane Smith",
      text: "heart",
      timestamp: Date.now() - 180000,
      type: "reaction",
      reactionType: "heart",
    },
    {
      id: "4",
      userId: "user2",
      userName: "John Doe",
      text: "Check out this scene!",
      timestamp: Date.now() - 120000,
      type: "timestamp",
      videoTimestamp: 125,
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      userId,
      userName,
      userEmail,
      text: newMessage,
      timestamp: Date.now(),
      type: "text",
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // In a real implementation, you would send this message to Supabase
    // and it would be broadcasted to all users in the session
  };

  const handleSendReaction = (
    reactionType: "like" | "dislike" | "heart" | "laugh",
  ) => {
    const message: Message = {
      id: Date.now().toString(),
      userId,
      userName,
      userEmail,
      text: reactionType,
      timestamp: Date.now(),
      type: "reaction",
      reactionType,
    };

    setMessages([...messages, message]);

    // In a real implementation, you would send this reaction to Supabase
    // and it would be broadcasted to all users in the session
  };

  const handleSendTimestamp = () => {
    const message: Message = {
      id: Date.now().toString(),
      userId,
      userName,
      userEmail,
      text: `Check out this moment at ${formatVideoTime(currentVideoTime)}`,
      timestamp: Date.now(),
      type: "timestamp",
      videoTimestamp: currentVideoTime,
    };

    setMessages([...messages, message]);

    // In a real implementation, you would send this timestamp to Supabase
    // and it would be broadcasted to all users in the session
  };

  const formatVideoTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatMessageTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getReactionIcon = (type?: string) => {
    switch (type) {
      case "like":
        return <ThumbsUp className="h-5 w-5 text-blue-500" />;
      case "dislike":
        return <ThumbsDown className="h-5 w-5 text-red-500" />;
      case "heart":
        return <Heart className="h-5 w-5 text-red-500" />;
      case "laugh":
        return <Smile className="h-5 w-5 text-yellow-500" />;
      default:
        return <Smile className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a] border-l border-gray-800 text-white">
      <div className="p-3 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-gray-400" />
          <h3 className="font-medium">Chat</h3>
        </div>
        {isCollapsible && onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-grow p-3">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.userEmail || message.userName}`}
                />
                <AvatarFallback>{message.userName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{message.userName}</p>
                  <span className="text-xs text-gray-500">
                    {formatMessageTime(message.timestamp)}
                  </span>
                </div>

                {message.type === "text" && (
                  <p className="text-sm text-gray-300">{message.text}</p>
                )}

                {message.type === "reaction" && (
                  <div className="flex items-center">
                    <div className="bg-[#222] p-2 rounded-full">
                      {getReactionIcon(message.reactionType)}
                    </div>
                  </div>
                )}

                {message.type === "timestamp" && (
                  <div className="flex items-center">
                    <Badge
                      variant="outline"
                      className="flex items-center space-x-1 bg-[#222] hover:bg-[#333] cursor-pointer"
                    >
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span>
                        {formatVideoTime(message.videoTimestamp || 0)}
                      </span>
                    </Badge>
                    <span className="text-sm text-gray-300 ml-2">
                      {message.text}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-gray-800">
        <div className="flex space-x-2 mb-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-[#222] border-gray-700"
                  onClick={() => handleSendReaction("like")}
                >
                  <ThumbsUp className="h-4 w-4 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Like</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-[#222] border-gray-700"
                  onClick={() => handleSendReaction("heart")}
                >
                  <Heart className="h-4 w-4 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Heart</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-[#222] border-gray-700"
                  onClick={() => handleSendReaction("laugh")}
                >
                  <Smile className="h-4 w-4 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Laugh</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-[#222] border-gray-700"
                  onClick={handleSendTimestamp}
                >
                  <Clock className="h-4 w-4 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Share current timestamp</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow bg-[#222] border-gray-700 text-white"
          />
          <Button
            type="submit"
            size="icon"
            className="bg-red-600 hover:bg-red-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
