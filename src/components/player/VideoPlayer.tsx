import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  MessageSquare,
  Users,
} from "lucide-react";
import { supabase } from "../../../supabase/supabase";

interface VideoPlayerProps {
  sessionId: string;
  userId: string;
  isHost: boolean;
  source: string;
  title?: string;
  onToggleChat: () => void;
  onToggleViewers: () => void;
}

export default function VideoPlayer({
  sessionId,
  userId,
  isHost,
  source,
  title,
  onToggleChat,
  onToggleViewers,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [viewerCount, setViewerCount] = useState(3);
  const [isUserSeeking, setIsUserSeeking] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Hide controls after inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setIsControlsVisible(true);
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setIsControlsVisible(false);
        }
      }, 3000);
    };

    const playerElement = playerRef.current;
    if (playerElement) {
      playerElement.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (playerElement) {
        playerElement.removeEventListener("mousemove", handleMouseMove);
      }
      clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  // Subscribe to playback state changes
  useEffect(() => {
    const channel = supabase
      .channel(`session-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "session_playback_state",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          // Only process updates from other users
          if (payload.new.updated_by !== userId) {
            const { is_playing, current_time } = payload.new;

            if (is_playing !== isPlaying) {
              setIsPlaying(is_playing);
              if (is_playing) {
                videoRef.current?.play();
              } else {
                videoRef.current?.pause();
              }
            }

            // Only update time if the difference is significant and user is not seeking
            if (!isUserSeeking && Math.abs(current_time - currentTime) > 1) {
              if (videoRef.current) {
                videoRef.current.currentTime = current_time;
              }
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, userId, isPlaying, currentTime, isUserSeeking]);

  // Update playback state to database
  const updatePlaybackState = async (playing: boolean, time: number) => {
    // Throttle updates to avoid overwhelming the database
    const now = Date.now();
    if (now - lastUpdateTime < 500) return;

    setLastUpdateTime(now);

    try {
      await supabase.from("session_playback_state").upsert({
        session_id: sessionId,
        is_playing: playing,
        current_time: time,
        updated_at: new Date().toISOString(),
        updated_by: userId,
      });
    } catch (error) {
      console.error("Error updating playback state:", error);
    }
  };

  const togglePlay = () => {
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);

    if (newPlayingState) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }

    updatePlaybackState(newPlayingState, currentTime);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isUserSeeking) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (videoRef.current) {
      videoRef.current.muted = newMutedState;
    }
  };

  const handleSeekStart = () => {
    setIsUserSeeking(true);
  };

  const handleSeekChange = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleSeekEnd = () => {
    setIsUserSeeking(false);
    updatePlaybackState(isPlaying, currentTime);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={playerRef}
      className="relative w-full bg-black aspect-video overflow-hidden rounded-lg"
      onMouseEnter={() => setIsControlsVisible(true)}
      onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
    >
      <video
        ref={videoRef}
        src={source}
        className="w-full h-full"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
      />

      {/* Title overlay */}
      {isControlsVisible && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
          <h3 className="text-white font-medium truncate">
            {title || "Video"}
          </h3>
        </div>
      )}

      {/* Center play/pause button */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            onClick={togglePlay}
            className="h-16 w-16 rounded-full bg-red-600/80 hover:bg-red-700/80 text-white"
          >
            <Play className="h-8 w-8" />
          </Button>
        </div>
      )}

      {/* Controls overlay */}
      {isControlsVisible && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="space-y-2">
            {/* Progress bar */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-white">
                {formatTime(currentTime)}
              </span>
              <div className="flex-grow">
                <Slider
                  value={[currentTime]}
                  min={0}
                  max={duration}
                  step={0.1}
                  onValueChange={handleSeekChange}
                  onValueCommit={handleSeekEnd}
                  onPointerDown={handleSeekStart}
                  className="cursor-pointer"
                />
              </div>
              <span className="text-xs text-white">{formatTime(duration)}</span>
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={togglePlay}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>

                <div className="flex items-center space-x-2">
                  <Button
                    onClick={toggleMute}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>
                  <div className="w-20">
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={onToggleChat}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20"
                      >
                        <MessageSquare className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Toggle chat</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={onToggleViewers}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20 relative"
                      >
                        <Users className="h-5 w-5" />
                        <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-red-600">
                          {viewerCount}
                        </Badge>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Toggle viewers</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={toggleFullscreen}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20"
                      >
                        <Maximize className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Fullscreen</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
