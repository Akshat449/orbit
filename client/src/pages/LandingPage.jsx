import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("kanban"); // "kanban" | "chat" | "workspaces"

  return (
    <div className="min-h-screen bg-[#090a10] text-[#f1f3f9] flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-indigo-500/15 via-violet-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 -right-40 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 -left-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 glass-panel border-b border-[#22283b]/80 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500/25 to-violet-500/25 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 group-hover:border-indigo-400 transition-all duration-200 shadow-sm shadow-indigo-500/10">
              <svg className="w-5 h-5 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <circle cx="12" cy="12" r="8" strokeDasharray="3 3" />
                <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" opacity="0.6" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Orbit
              </span>
            </div>
          </Link>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#8c95a8]">
            <a href="#features" className="hover:text-white transition-colors duration-200">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors duration-200">
              How It Works
            </a>
            <a href="#preview" className="hover:text-white transition-colors duration-200">
              Product Demo
            </a>
            <a href="#why-orbit" className="hover:text-white transition-colors duration-200">
              Why Orbit
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <span>Dashboard</span>
                <span>→</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#8c95a8] hover:text-white hover:bg-[#151926] border border-transparent hover:border-[#22283b] transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-95"
                >
                  <span>Get Started</span>
                  <span className="text-indigo-200">→</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Announcement Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-xs font-medium text-indigo-300 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="font-semibold text-white">Orbit</span>
            <span className="text-[#8c95a8]">•</span>
            <span>Kanban Boards meet Real-Time Live Chat</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.12]">
            Where teams plan, move, and{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              build together.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-[#8c95a8] max-w-2xl leading-relaxed">
            Eliminate scattered tools. Orbit combines fluid drag-and-drop Kanban boards with instant team messaging and shared workspaces—engineered for fast-moving squads.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            {user ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Continue to Your Dashboard</span>
                <span>→</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 group"
                >
                  <span>Start Free with Orbit</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#151926] hover:bg-[#1a2030] border border-[#22283b] hover:border-indigo-500/40 text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>Sign In to Existing Workspace</span>
                </Link>
              </>
            )}
          </div>

          {/* Key Value Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-medium text-[#8c95a8]">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>Instant Real-Time Chat</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>Fluid Drag & Drop Kanban</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>Multi-Member Workspaces</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>Zero Configuration Needed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Product Showcase / Mockup Canvas */}
      <section id="preview" className="px-6 py-12 max-w-7xl mx-auto w-full">
        <div className="relative rounded-3xl bg-[#10131d] border border-[#22283b] shadow-2xl overflow-hidden">
          {/* Glow accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Window Chrome Header */}
          <div className="px-6 py-4 bg-[#151926]/90 border-b border-[#22283b] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-semibold text-[#8c95a8] ml-2">
                Orbit Studio — Workspace: Core Engine
              </span>
            </div>

            {/* Interactive View Switcher Tabs */}
            <div className="flex items-center bg-[#090a10] p-1 rounded-xl border border-[#22283b]">
              <button
                onClick={() => setActiveTab("kanban")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === "kanban"
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-[#8c95a8] hover:text-white"
                }`}
              >
                Kanban Flow
              </button>
              <button
                onClick={() => setActiveTab("chat")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === "chat"
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-[#8c95a8] hover:text-white"
                }`}
              >
                Live Team Chat
              </button>
              <button
                onClick={() => setActiveTab("workspaces")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === "workspaces"
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-[#8c95a8] hover:text-white"
                }`}
              >
                Workspace Hub
              </button>
            </div>
          </div>

          {/* Window Body: Visual Mockup */}
          <div className="p-6 sm:p-8 bg-[#090a10]/60 min-h-[440px] flex flex-col justify-center">
            {/* 1. Kanban View Mockup */}
            {activeTab === "kanban" && (
              <div className="flex flex-col gap-6 animate-in fade-in duration-200">
                {/* Board Subheader */}
                <div className="flex items-center justify-between pb-4 border-b border-[#22283b]/60">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-white">Sprint 24 — High Velocity</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Sync Active
                    </span>
                    <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#151926] text-[#8c95a8] border border-[#22283b]">
                      3 columns
                    </span>
                  </div>

                  {/* Live Board Chat Button in Canvas Subheader */}
                  <button
                    onClick={() => setActiveTab("chat")}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#22283b] bg-[#10131d] hover:bg-[#151926] hover:border-indigo-500/40 text-xs font-semibold text-white transition-all duration-200 cursor-pointer shadow-sm group"
                    title="Click to switch to live team chat preview"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.177 7.152.521 1.942.285 3.348 1.986 3.348 3.951v7.556c0 1.965-1.406 3.666-3.348 3.951a49.206 49.206 0 0 1-3.693.425 4.793 4.793 0 0 0-2.88 1.135l-2.023 1.706a.75.75 0 0 1-1.233-.574V18.75A49.043 49.043 0 0 1 4.848 18.28C2.906 17.994 1.5 16.293 1.5 14.328V6.722c0-1.965 1.406-3.666 3.348-3.951ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 3a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-6Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Live Chat</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </button>
                </div>

                {/* Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Column 1: Backlog */}
                  <div className="p-4 rounded-2xl bg-[#10131d] border border-[#22283b] flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#8c95a8]">
                      <span>BACKLOG</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#151926] text-white">3</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#151926] border border-[#22283b] hover:border-indigo-500/40 transition-colors shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Architecture
                        </span>
                        <span className="text-[11px] text-[#8c95a8]">#104</span>
                      </div>
                      <p className="text-xs font-medium text-white">
                        Design distributed WebSocket cluster architecture
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#151926] border border-[#22283b] hover:border-indigo-500/40 transition-colors shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          Frontend
                        </span>
                        <span className="text-[11px] text-[#8c95a8]">#105</span>
                      </div>
                      <p className="text-xs font-medium text-white">
                        Build responsive member list popover modal
                      </p>
                    </div>
                  </div>

                  {/* Column 2: In Progress */}
                  <div className="p-4 rounded-2xl bg-[#10131d] border border-indigo-500/30 flex flex-col gap-3 shadow-lg shadow-indigo-500/5">
                    <div className="flex items-center justify-between text-xs font-semibold text-indigo-400">
                      <span>IN PROGRESS</span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300">2</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#151926] border border-indigo-500/40 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          Real-time
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          Moving now
                        </span>
                      </div>
                      <p className="text-xs font-medium text-white">
                        Integrate dnd-kit collision sensors for drag & drop
                      </p>
                      <div className="mt-3 pt-2.5 border-t border-[#22283b]/60 flex items-center justify-between text-[11px] text-[#8c95a8]">
                        <span>4 subtasks completed</span>
                        <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-bold text-[9px] flex items-center justify-center">
                          A
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#151926] border border-[#22283b] hover:border-indigo-500/40 transition-colors shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                          Sockets
                        </span>
                        <span className="text-[11px] text-[#8c95a8]">#108</span>
                      </div>
                      <p className="text-xs font-medium text-white">
                        Broadcast room join & leave events per board
                      </p>
                    </div>
                  </div>

                  {/* Column 3: Done */}
                  <div className="p-4 rounded-2xl bg-[#10131d] border border-[#22283b] flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
                      <span>COMPLETED</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300">4</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#151926]/80 border border-emerald-500/20 shadow-sm opacity-90">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Auth
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold">✓ Verified</span>
                      </div>
                      <p className="text-xs font-medium text-white/90 line-through decoration-[#8c95a8]">
                        Implement JWT auth persistence and token refresh
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Live Chat Mockup */}
            {activeTab === "chat" && (
              <div className="max-w-2xl mx-auto w-full p-6 rounded-2xl bg-[#10131d] border border-[#22283b] flex flex-col gap-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-[#22283b]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      💬
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Board Live Channel</h4>
                      <p className="text-[10px] text-[#8c95a8]">Messages are scoped to this active board</p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>

                <div className="flex flex-col gap-3 py-2">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      S
                    </div>
                    <div className="bg-[#151926] p-3 rounded-2xl rounded-tl-sm border border-[#22283b] text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white">Sarah</span>
                        <span className="text-[10px] text-[#8c95a8]">10:42 AM</span>
                      </div>
                      <p className="text-[#f1f3f9]">
                        Just reviewed the card layout. Moving #104 into In Progress now! 🚀
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-3 rounded-2xl rounded-tr-sm text-xs text-white shadow-md">
                      <div className="flex items-center gap-2 mb-1 justify-end">
                        <span className="font-semibold text-white/90">You</span>
                        <span className="text-[10px] text-white/70">10:44 AM</span>
                      </div>
                      <p>Awesome! Socket events are synced, drag positions persist instantly.</p>
                    </div>
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      Y
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#22283b] flex items-center gap-2">
                  <input
                    type="text"
                    disabled
                    placeholder="Type a message to your board teammates..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#090a10] border border-[#22283b] text-xs text-[#8c95a8] cursor-not-allowed"
                  />
                  <button
                    disabled
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-xs font-semibold text-white opacity-70 cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}

            {/* 3. Workspace Hub Mockup */}
            {activeTab === "workspaces" && (
              <div className="flex flex-col gap-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-[#22283b]/60">
                  <div>
                    <h3 className="text-base font-bold text-white">Active Team Workspaces</h3>
                    <p className="text-xs text-[#8c95a8]">Switch between projects and invite collaborators with ease</p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                    + New Workspace
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-[#10131d] border border-indigo-500/30 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-bold flex items-center justify-center text-xs">
                          P
                        </div>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#151926] text-[#8c95a8] border border-[#22283b]">
                          8 Members
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white">Product Engineering</h4>
                      <p className="text-xs text-[#8c95a8] mt-1">
                        Core SaaS platform development, API infrastructure, and real-time socket events.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#22283b] flex items-center justify-between text-xs">
                      <span className="text-[#8c95a8]">4 Boards</span>
                      <span className="text-indigo-400 font-semibold">Open Workspace →</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#10131d] border border-[#22283b] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center text-xs">
                          M
                        </div>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#151926] text-[#8c95a8] border border-[#22283b]">
                          4 Members
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white">Mobile Application</h4>
                      <p className="text-xs text-[#8c95a8] mt-1">
                        Cross-platform iOS and Android apps, offline support, and push notifications.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#22283b] flex items-center justify-between text-xs">
                      <span className="text-[#8c95a8]">2 Boards</span>
                      <span className="text-indigo-400 font-semibold">Open Workspace →</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-6 py-20 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
            Intuitive Workflow
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Orbit Powers Your Daily Flow
          </h3>
          <p className="text-sm sm:text-base text-[#8c95a8] mt-3">
            Simple enough to start in 30 seconds, powerful enough to scale with complex engineering roadmaps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-[#10131d] border border-[#22283b] hover:border-indigo-500/40 transition-all duration-200 flex flex-col justify-between relative group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-lg flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                01
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Create Workspaces</h4>
              <p className="text-xs sm:text-sm text-[#8c95a8] leading-relaxed">
                Establish team hubs for projects or departments. Workspaces keep boards, members, and assets organized in one space.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#22283b]/60 text-xs font-semibold text-indigo-400">
              Step 1 • Team Hub
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-[#10131d] border border-[#22283b] hover:border-indigo-500/40 transition-all duration-200 flex flex-col justify-between relative group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 font-bold text-lg flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                02
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Invite Collaborators</h4>
              <p className="text-xs sm:text-sm text-[#8c95a8] leading-relaxed">
                Add teammates by their registered email address. Invited users automatically inherit access to all workspace boards.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#22283b]/60 text-xs font-semibold text-violet-400">
              Step 2 • Instant Access
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-[#10131d] border border-[#22283b] hover:border-indigo-500/40 transition-all duration-200 flex flex-col justify-between relative group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-lg flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                03
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Drag & Drop Kanban</h4>
              <p className="text-xs sm:text-sm text-[#8c95a8] leading-relaxed">
                Build custom columns for your workflow stages. Move cards effortlessly between lists with instant order persistence.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#22283b]/60 text-xs font-semibold text-emerald-400">
              Step 3 • Visual Progress
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-3xl bg-[#10131d] border border-[#22283b] hover:border-indigo-500/40 transition-all duration-200 flex flex-col justify-between relative group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-lg flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                04
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Chat in Real-Time</h4>
              <p className="text-xs sm:text-sm text-[#8c95a8] leading-relaxed">
                Open the live chat panel right inside any board. Coordinate with your team without switching between endless tabs.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#22283b]/60 text-xs font-semibold text-amber-400">
              Step 4 • Live Discussion
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="px-6 py-20 bg-[#10131d]/40 border-y border-[#22283b]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
              Deep Features
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Crafted for Modern Engineering Teams
            </h3>
            <p className="text-sm sm:text-base text-[#8c95a8] mt-3">
              Everything you need to run agile sprints, manage project tasks, and keep everyone connected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-7 rounded-3xl bg-[#10131d] border border-[#22283b] hover:border-indigo-500/40 transition-all duration-200 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Fluid Drag & Drop Canvas</h4>
              <p className="text-xs sm:text-sm text-[#8c95a8] leading-relaxed">
                Reorder lists and transfer cards seamlessly across columns with pixel-perfect animation and drag collision physics.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-3xl bg-[#10131d] border border-[#22283b] hover:border-indigo-500/40 transition-all duration-200 group">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Real-Time Board Chat</h4>
              <p className="text-xs sm:text-sm text-[#8c95a8] leading-relaxed">
                Socket.IO powers instant message delivery with live connection status dots and zero refresh needed.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-3xl bg-[#10131d] border border-[#22283b] hover:border-indigo-500/40 transition-all duration-200 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Workspace Team Hierarchy</h4>
              <p className="text-xs sm:text-sm text-[#8c95a8] leading-relaxed">
                Add team members once at the workspace level, and they automatically get access to all project boards inside.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-3xl bg-[#10131d] border border-[#22283b] hover:border-indigo-500/40 transition-all duration-200 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Secure Authentication</h4>
              <p className="text-xs sm:text-sm text-[#8c95a8] leading-relaxed">
                Bcrypt password hashing and JWT token authorization keep your company’s proprietary workflows completely private.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-7 rounded-3xl bg-[#10131d] border border-[#22283b] hover:border-indigo-500/40 transition-all duration-200 group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Optimistic UI Updates</h4>
              <p className="text-xs sm:text-sm text-[#8c95a8] leading-relaxed">
                Actions feel instantaneous. Lists and cards update immediately with fallback rollback if network issues arise.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-7 rounded-3xl bg-[#10131d] border border-[#22283b] hover:border-indigo-500/40 transition-all duration-200 group">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Premium Dark Aesthetic</h4>
              <p className="text-xs sm:text-sm text-[#8c95a8] leading-relaxed">
                Designed with a bespoke dark palette, glassmorphism, and custom scrollbars for maximum visual comfort and focus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Orbit vs Scattered Tools Section */}
      <section id="why-orbit" className="px-6 py-20 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl bg-[#10131d] border border-[#22283b] p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
              Why Orbit
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Stop losing context between disjointed chat and project apps.
            </h3>
            <p className="text-sm sm:text-base text-[#8c95a8] mt-4 leading-relaxed">
              When communication is separated from task management, team velocity stalls. Orbit anchors real-time discussions directly to the Kanban canvas—ensuring your team never asks "where was that decided?" again.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-[#22283b]">
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-white">&lt;50ms</span>
                <p className="text-xs text-[#8c95a8] mt-1">Socket sync latency</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-indigo-400">100%</span>
                <p className="text-xs text-[#8c95a8] mt-1">Integrated chat & canvas</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-violet-400">∞</span>
                <p className="text-xs text-[#8c95a8] mt-1">Boards & workspaces</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">Zero</span>
                <p className="text-xs text-[#8c95a8] mt-1">Setup friction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="px-6 py-20 max-w-5xl mx-auto w-full text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-b from-[#151926] to-[#10131d] border border-indigo-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight relative z-10">
            Ready to bring your team into{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Orbit?
            </span>
          </h3>
          <p className="mt-4 text-sm sm:text-base text-[#8c95a8] max-w-xl mx-auto relative z-10">
            Create your account today, invite your team, and build your first Kanban board in less than two minutes.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            {user ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 transition-all duration-200 active:scale-95"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 transition-all duration-200 active:scale-95"
                >
                  Create Free Account →
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#10131d] hover:bg-[#151926] border border-[#22283b] hover:border-indigo-500/40 text-white font-medium text-sm transition-all duration-200"
                >
                  Sign In to Orbit
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#22283b] bg-[#090a10] px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <circle cx="12" cy="12" r="8" strokeDasharray="3 3" />
                <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" opacity="0.6" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white tracking-tight">Orbit</span>
            <span className="text-xs text-[#8c95a8] ml-2">
              • Unified Workspaces & Real-time Kanban
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#8c95a8]">
            <Link to="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="hover:text-white transition-colors">
              Create Account
            </Link>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Systems Live
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
