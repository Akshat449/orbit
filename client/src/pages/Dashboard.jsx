import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getWorkspaces, createWorkspace } from "../api/workspaces";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getWorkspaces();
        setWorkspaces(data || []);
      } catch (error) {
        console.error("Failed to fetch workspaces:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const newWorkspace = await createWorkspace({ name: name.trim(), description: description.trim() });
      setWorkspaces([...workspaces, newWorkspace]);
      setIsModalOpen(false);
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Failed to create workspace:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Extract initials for user avatar
  const userInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-[#090a10] text-[#f1f3f9] flex flex-col">
      {/* Top Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-30 glass-panel border-b border-[#22283b] px-6 py-3.5 flex justify-between items-center">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <circle cx="12" cy="12" r="8" strokeDasharray="3 3" />
              <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Orbit
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-medium tracking-wide rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Workspace Hub
          </span>
        </div>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#151926] border border-[#22283b]">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
              {userInitials}
            </div>
            <span className="text-xs font-medium text-[#f1f3f9] max-w-[120px] truncate">
              {user?.name || "Member"}
            </span>
          </div>

          <button
            onClick={logout}
            className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-[#8c95a8] hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 flex flex-col">
        {/* Hero / Greeting Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-[#22283b]/60">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Workspaces
            </h1>
            <p className="text-sm text-[#8c95a8] mt-1">
              Select an active workspace or build a new collaborative hub for your team.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all duration-200 cursor-pointer active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>New Workspace</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-[#8c95a8]">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm">Loading your workspaces...</p>
          </div>
        )}

        {/* Workspaces Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {workspaces.map((workspace) => {
              const wsInitial = workspace.name ? workspace.name.charAt(0).toUpperCase() : "W";
              return (
                <Link to={`/workspace/${workspace._id}`} key={workspace._id} className="group">
                  <div className="glow-card h-full p-6 rounded-2xl bg-[#10131d] border border-[#22283b] flex flex-col justify-between cursor-pointer">
                    <div>
                      {/* Top Bar with Icon & Member Count */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm group-hover:scale-105 transition-transform duration-200">
                          {wsInitial}
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#151926] text-[#8c95a8] border border-[#22283b]">
                          {workspace.members?.length || 1} {workspace.members?.length === 1 ? "member" : "members"}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors duration-200 flex items-center justify-between">
                        <span>{workspace.name}</span>
                        <svg className="w-4 h-4 text-[#8c95a8] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </h3>
                      <p className="text-sm text-[#8c95a8] mt-2 line-clamp-2 leading-relaxed">
                        {workspace.description || "No description provided."}
                      </p>
                    </div>

                    {/* Bottom Status / Indicator */}
                    <div className="mt-6 pt-4 border-t border-[#22283b]/60 flex items-center justify-between text-xs text-[#8c95a8]">
                      <span>Open Workspace</span>
                      <span className="text-indigo-400 group-hover:underline">View Boards →</span>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Create Workspace Quick Button Card */}
            <div
              onClick={() => setIsModalOpen(true)}
              className="p-6 rounded-2xl bg-[#10131d]/40 border-2 border-dashed border-[#22283b] hover:border-indigo-500/50 hover:bg-[#10131d]/80 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[190px] text-center group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#151926] border border-[#22283b] flex items-center justify-center text-[#8c95a8] group-hover:text-indigo-400 group-hover:border-indigo-500/40 group-hover:scale-105 transition-all duration-200 mb-3 shadow-inner">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                Create New Workspace
              </span>
              <p className="text-xs text-[#8c95a8] mt-1 max-w-[200px]">
                Organize projects, boards, and invite teammates.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Create Workspace Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#10131d] border border-[#22283b] shadow-2xl relative">
            <h2 className="text-xl font-bold text-white mb-1.5">Create Workspace</h2>
            <p className="text-xs text-[#8c95a8] mb-6">
              A workspace houses all your Kanban boards, cards, and team live chats.
            </p>

            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#8c95a8] mb-1.5">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Engineering & Design"
                  required
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-[#090a10] border border-[#22283b] text-white placeholder-[#8c95a8]/50 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#8c95a8] mb-1.5">
                  Description <span className="text-[#8c95a8]/60 font-normal">(optional)</span>
                </label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will this workspace be used for?"
                  className="w-full px-4 py-3 rounded-xl bg-[#090a10] border border-[#22283b] text-white placeholder-[#8c95a8]/50 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 resize-none"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#151926] hover:bg-[#1a2030] border border-[#22283b] text-sm text-[#8c95a8] hover:text-white transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !name.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Create Workspace"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;