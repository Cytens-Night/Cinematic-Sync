import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronRight, Settings, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";

export default function LandingPage() {
  const { user, signOut } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cinema-style navigation */}
      <header className="fixed top-0 z-50 w-full bg-[rgba(0,0,0,0.8)] backdrop-blur-md border-b border-[#333]/30">
        <div className="max-w-[980px] mx-auto flex h-12 items-center justify-between px-4">
          <div className="flex items-center">
            <Link
              to="/"
              className="font-medium text-xl text-white flex items-center"
            >
              <span className="text-red-600 mr-1">Cinematic</span>Sync
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-sm font-light text-white hover:text-gray-400"
                  >
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 hover:cursor-pointer">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt={user.email || ""}
                      />
                      <AvatarFallback>
                        {user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl border-none shadow-lg"
                  >
                    <DropdownMenuLabel className="text-xs text-gray-500">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={() => signOut()}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-sm font-light text-white hover:text-gray-400"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full bg-red-600 text-white hover:bg-red-700 text-sm px-4">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-12">
        {/* Hero section */}
        <section className="py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
            <img
              src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80"
              alt="Cinema background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10">
            <h2 className="text-5xl font-semibold tracking-tight mb-1 text-white">
              Cinematic Sync
            </h2>
            <h3 className="text-2xl font-medium text-gray-300 mb-6 max-w-2xl mx-auto">
              Watch movies together, perfectly synchronized, no matter where you
              are.
            </h3>
            <div className="flex justify-center space-x-6 text-xl text-red-500">
              <Link to="/" className="flex items-center hover:underline">
                Learn more <ChevronRight className="h-4 w-4" />
              </Link>
              <Link to="/signup" className="flex items-center hover:underline">
                Get started <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 relative">
              <div className="w-full max-w-4xl mx-auto h-[300px] rounded-lg overflow-hidden shadow-2xl border border-gray-800 relative">
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-20 bg-[#111] text-center">
          <h2 className="text-5xl font-semibold tracking-tight mb-1 text-white">
            Cinematic Features
          </h2>
          <h3 className="text-2xl font-medium text-gray-400 mb-4">
            Everything you need for the perfect synchronized movie experience
          </h3>
          <div className="flex justify-center space-x-6 text-xl text-red-500">
            <Link to="/" className="flex items-center hover:underline">
              Explore features <ChevronRight className="h-4 w-4" />
            </Link>
            <Link to="/" className="flex items-center hover:underline">
              How it works <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-md border border-gray-800 text-left hover:border-red-900 transition-all duration-300">
              <div className="h-12 w-12 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-medium mb-2 text-white">
                Perfect Sync
              </h4>
              <p className="text-gray-400">
                Watch together in perfect synchronization, no matter where you
                are. Every play, pause, and seek is synced across all viewers
                instantly.
              </p>
            </div>
            <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-md border border-gray-800 text-left hover:border-red-900 transition-all duration-300">
              <div className="h-12 w-12 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-medium mb-2 text-white">
                Chat & React
              </h4>
              <p className="text-gray-400">
                Share your reactions in real-time with our unobtrusive chat
                sidebar. Send messages, reactions, and timestamps without
                disrupting the viewing experience.
              </p>
            </div>
            <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-md border border-gray-800 text-left hover:border-red-900 transition-all duration-300">
              <div className="h-12 w-12 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-medium mb-2 text-white">
                Simple Sharing
              </h4>
              <p className="text-gray-400">
                Share content with a single link and PIN. Paste a URL or upload
                a file, and everyone in your session will see the same content
                at the same time.
              </p>
            </div>
          </div>
        </section>

        {/* Grid section for other features */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-black">
          <div className="bg-[#111] rounded-3xl p-12 text-center border border-gray-800">
            <h2 className="text-4xl font-semibold tracking-tight mb-1 text-white">
              Create a Session
            </h2>
            <h3 className="text-xl font-medium text-gray-400 mb-4">
              Host your own movie night in seconds
            </h3>
            <div className="flex justify-center space-x-6 text-lg text-red-500">
              <Link
                to="/create-session"
                className="flex items-center hover:underline"
              >
                Start hosting <ChevronRight className="h-4 w-4" />
              </Link>
              <Link to="/" className="flex items-center hover:underline">
                How it works <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-4 bg-[#1a1a1a] p-6 rounded-xl shadow-md border border-gray-800 max-w-sm mx-auto">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-[#222] rounded-lg border border-gray-700">
                  <div className="h-10 w-10 bg-red-900/30 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-400">Session ID</p>
                    <p className="text-sm font-medium text-white">
                      MOVIE-NIGHT-2023
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-[#222] rounded-lg border border-gray-700">
                  <div className="h-10 w-10 bg-red-900/30 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-400">Access PIN</p>
                    <p className="text-sm font-medium text-white">1234</p>
                  </div>
                </div>
                <Link to="/create-session">
                  <button className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                    Create Session
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="bg-[#111] rounded-3xl p-12 text-center border border-gray-800">
            <h2 className="text-4xl font-semibold tracking-tight mb-1 text-white">
              Join a Session
            </h2>
            <h3 className="text-xl font-medium text-gray-400 mb-4">
              Connect with friends instantly
            </h3>
            <div className="flex justify-center space-x-6 text-lg text-red-500">
              <Link
                to="/join-session"
                className="flex items-center hover:underline"
              >
                Join now <ChevronRight className="h-4 w-4" />
              </Link>
              <Link to="/" className="flex items-center hover:underline">
                View active sessions <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-4 bg-[#1a1a1a] p-6 rounded-xl shadow-md border border-gray-800 max-w-sm mx-auto">
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter session ID"
                    className="w-full h-12 bg-[#222] border border-gray-700 rounded-lg px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter PIN"
                    className="w-full h-12 bg-[#222] border border-gray-700 rounded-lg px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <Link to="/join-session">
                  <button className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                    Join Session
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#111] py-12 text-xs text-gray-400 border-t border-gray-800">
        <div className="max-w-[980px] mx-auto px-4">
          <div className="border-b border-gray-800 pb-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-medium text-sm text-white mb-4">
                CinematicSync
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:text-red-500 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-red-500 transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-red-500 transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-red-500 transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-white mb-4">
                Watch Together
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/create-session"
                    className="hover:text-red-500 transition-colors"
                  >
                    Create a Session
                  </Link>
                </li>
                <li>
                  <Link
                    to="/join-session"
                    className="hover:text-red-500 transition-colors"
                  >
                    Join a Session
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-red-500 transition-colors">
                    Supported Platforms
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-red-500 transition-colors">
                    Content Guidelines
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-white mb-4">Community</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:text-red-500 transition-colors">
                    Discord
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-red-500 transition-colors">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-red-500 transition-colors">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-red-500 transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:text-red-500 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-red-500 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-red-500 transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-red-500 transition-colors">
                    DMCA
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="py-4">
            <p>Copyright © 2025 CinematicSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
