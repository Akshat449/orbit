import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getBoards, createBoard } from "../api/boards";
import InviteMemberModal from "../components/workspace/InviteMemberModal";

const WorkspacePage = () => {
    const { workspaceId } = useParams();
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                setLoading(true);
                const data = await getBoards(workspaceId);
                setBoards(data || []);
            } catch (error) {
                console.error("Failed to fetch boards:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBoards();
    }, [workspaceId]);

    const handleCreateBoard = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        setSubmitting(true);
        try {
            const newBoard = await createBoard(workspaceId, { title: title.trim() });
            setBoards([...boards, newBoard]);
            setIsModalOpen(false);
            setTitle("");
        } catch (error) {
            console.error("Failed to create board:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#090a10] text-[#f1f3f9] flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-30 glass-panel border-b border-[#22283b] px-6 py-3.5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151926] border border-[#22283b] text-xs font-medium text-[#8c95a8] hover:text-white hover:border-indigo-500/40 transition-all duration-200"
                    >
                        <span>←</span>
                        <span>Dashboard</span>
                    </Link>
                    <span className="text-sm font-semibold text-white/80">/</span>
                    <span className="text-sm font-semibold text-white">Workspace Boards</span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#151926] border border-[#22283b] hover:border-indigo-500/40 text-xs font-medium text-[#f1f3f9] transition-all duration-200 cursor-pointer shadow-sm hover:bg-[#1a2030]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-400">
                            <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM2.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 8 18a9.953 9.953 0 0 1-5.385-1.572ZM16.25 5.75a.75.75 0 0 0-1.5 0v2h-2a.75.75 0 0 0 0 1.5h2v2a.75.75 0 0 0 1.5 0v-2h2a.75.75 0 0 0 0-1.5h-2v-2Z" />
                        </svg>
                        <span>Members</span>
                    </button>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all duration-200 cursor-pointer"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>New Board</span>
                    </button>
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-[#22283b]/60">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                            Project Boards
                        </h1>
                        <p className="text-sm text-[#8c95a8] mt-1">
                            Choose a Kanban board to manage cards, workflows, and live team chat.
                        </p>
                    </div>
                </div>

                {/* Loading Indicator */}
                {loading && (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-[#8c95a8]">
                        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
                        <p className="text-sm">Loading boards...</p>
                    </div>
                )}

                {/* Board Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {boards.map((board) => (
                            <Link to={`/workspace/${workspaceId}/board/${board._id}`} key={board._id} className="group">
                                <div className="glow-card h-full p-6 rounded-2xl bg-[#10131d] border border-[#22283b] flex flex-col justify-between cursor-pointer">
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform duration-200">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                                                </svg>
                                            </div>
                                            <span className="text-[11px] font-medium text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                                Active
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors flex items-center justify-between">
                                            <span>{board.title}</span>
                                            <svg className="w-4 h-4 text-[#8c95a8] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </h3>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-[#22283b]/60 flex items-center justify-between text-xs text-[#8c95a8]">
                                        <span>Kanban & Chat</span>
                                        <span className="text-indigo-400 group-hover:underline">Open Board →</span>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {/* Create Board Card */}
                        <div
                            onClick={() => setIsModalOpen(true)}
                            className="p-6 rounded-2xl bg-[#10131d]/40 border-2 border-dashed border-[#22283b] hover:border-indigo-500/50 hover:bg-[#10131d]/80 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[170px] text-center group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-[#151926] border border-[#22283b] flex items-center justify-center text-[#8c95a8] group-hover:text-indigo-400 group-hover:border-indigo-500/40 group-hover:scale-105 transition-all duration-200 mb-2.5 shadow-inner">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <span className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                                Create New Board
                            </span>
                            <span className="text-xs text-[#8c95a8] mt-0.5">
                                Add columns and cards
                            </span>
                        </div>
                    </div>
                )}
            </main>

            {/* Create Board Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
                    <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#10131d] border border-[#22283b] shadow-2xl relative">
                        <h2 className="text-xl font-bold text-white mb-1.5">Create Board</h2>
                        <p className="text-xs text-[#8c95a8] mb-6">
                            Boards let you track tasks through customizable workflow lists.
                        </p>

                        <form onSubmit={handleCreateBoard} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#8c95a8] mb-1.5">
                                    Board Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Sprint Planning, Roadmap"
                                    required
                                    autoFocus
                                    className="w-full px-4 py-3 rounded-xl bg-[#090a10] border border-[#22283b] text-white placeholder-[#8c95a8]/50 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
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
                                    disabled={submitting || !title.trim()}
                                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
                                >
                                    {submitting ? "Creating..." : "Create Board"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Invite Member Modal */}
            <InviteMemberModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                workspaceId={workspaceId}
            />
        </div>
    );
};

export default WorkspacePage;


