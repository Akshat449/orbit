import { useState, useEffect } from "react";
import { getWorkspaceMembers, addWorkspaceMember } from "../../api/workspaces";

const InviteMemberModal = ({ isOpen, onClose, workspaceId, onMemberAdded }) => {
    const [email, setEmail] = useState("");
    const [members, setMembers] = useState([]);
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchingMembers, setFetchingMembers] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!isOpen || !workspaceId) return;

        const fetchMembers = async () => {
            try {
                setFetchingMembers(true);
                setError("");
                setSuccess("");
                const data = await getWorkspaceMembers(workspaceId);
                setMembers(data.members || []);
                setOwner(data.owner || null);
            } catch (err) {
                console.error("Failed to fetch members:", err);
                setError(err.response?.data?.message || "Failed to load members list");
            } finally {
                setFetchingMembers(false);
            }
        };

        fetchMembers();
    }, [isOpen, workspaceId]);

    if (!isOpen) return null;

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const data = await addWorkspaceMember(workspaceId, email.trim());
            setSuccess(data.message || `Successfully invited ${email}!`);
            setEmail("");
            // Refresh members list
            const updated = await getWorkspaceMembers(workspaceId);
            setMembers(updated.members || []);
            if (onMemberAdded) {
                onMemberAdded(data.member);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add member to workspace");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-dark-surface border border-dark-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-6 border-b border-dark-border flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                            <span>Workspace Members</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                {members.length}
                            </span>
                        </h2>
                        <p className="text-text-muted text-xs mt-1">
                            Invite collaborators to view boards and chat in real-time.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-text-muted hover:text-text-main p-1 rounded-lg transition-colors cursor-pointer text-lg"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">

                    {/* Invite Form */}
                    <form onSubmit={handleInvite} className="flex flex-col gap-3">
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                            Invite by Registered Email
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="colleague@example.com"
                                required
                                className="flex-1 px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-text-main placeholder-text-muted/50 outline-none focus:border-primary text-sm transition-all duration-200"
                            />
                            <button
                                type="submit"
                                disabled={loading || !email.trim()}
                                className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 flex items-center gap-2 shadow-lg shadow-primary/20"
                            >
                                {loading ? (
                                    <>
                                        <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        <span>Adding...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>+ Add</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Status Messages */}
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                                <span>⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}
                        {success && (
                            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                                <span>✅</span>
                                <span>{success}</span>
                            </div>
                        )}
                    </form>

                    {/* Current Members List */}
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                            Current Team ({members.length})
                        </label>

                        {fetchingMembers ? (
                            <div className="py-6 text-center text-text-muted text-sm">
                                Loading members...
                            </div>
                        ) : members.length === 0 ? (
                            <div className="py-6 text-center text-text-muted text-sm">
                                No members yet.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                                {members.map((member) => {
                                    const isOwner = owner?._id === member._id;
                                    const initial = member.name ? member.name[0].toUpperCase() : "?";

                                    return (
                                        <div
                                            key={member._id}
                                            className="flex items-center justify-between p-3 rounded-xl bg-dark-bg border border-dark-border/80 hover:border-dark-border transition-colors"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                                                    {initial}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-text-main truncate">
                                                        {member.name}
                                                    </p>
                                                    <p className="text-xs text-text-muted truncate">
                                                        {member.email}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                {isOwner ? (
                                                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                        Owner
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-dark-surface text-text-muted border border-dark-border">
                                                        Member
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-dark-border bg-dark-bg/40 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-dark-bg border border-dark-border text-text-muted hover:text-text-main text-sm transition-colors cursor-pointer"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InviteMemberModal;
