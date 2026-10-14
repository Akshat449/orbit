import { useState, useEffect } from "react";

const CardModal = ({ card, listTitle, isOpen, onClose, onUpdate, onDelete }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (card) {
            setTitle(card.title || "");
            setDescription(card.description || "");
        }
    }, [card]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !card) return null;

    const handleSave = async (e) => {
        e?.preventDefault();
        if (!title.trim()) return;

        try {
            setIsSaving(true);
            await onUpdate(card._id, title.trim(), description.trim());
            onClose();
        } catch (err) {
            console.error("Failed to update card:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this card?")) return;
        try {
            setIsDeleting(true);
            await onDelete(card._id, card.list);
            onClose();
        } catch (err) {
            console.error("Failed to delete card:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
            {/* Click outside backdrop */}
            <div className="fixed inset-0" onClick={onClose} />

            {/* Modal Box */}
            <div className="relative w-full max-w-lg bg-[#10131d] border border-[#22283b] rounded-3xl shadow-2xl p-6 sm:p-8 z-10 flex flex-col gap-6 text-[#f1f3f9]">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[11px] font-semibold text-[#8c95a8] uppercase tracking-wider">
                                Column
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                {listTitle || "Column"}
                            </span>
                        </div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Card title..."
                            className="w-full px-3.5 py-2 text-lg font-bold bg-[#090a10] border border-[#22283b] rounded-xl text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 outline-none transition-all"
                        />

                        {/* Quick Tag Selector Chips */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                            <span className="text-[11px] text-[#8c95a8] mr-1">Tag:</span>
                            {[
                                { label: "Frontend", color: "text-blue-400 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20" },
                                { label: "Backend", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20" },
                                { label: "Real-Time", color: "text-violet-400 bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/20" },
                                { label: "Architecture", color: "text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20" },
                                { label: "Auth", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20" },
                                { label: "Bug", color: "text-rose-400 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20" },
                            ].map((t) => (
                                <button
                                    key={t.label}
                                    type="button"
                                    onClick={() => {
                                        const clean = title.replace(/^\[(.*?)\]\s*/, "");
                                        setTitle(`[${t.label}] ${clean}`);
                                    }}
                                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-lg border transition-all cursor-pointer hover:scale-105 active:scale-95 ${t.color}`}
                                >
                                    +{t.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#8c95a8] hover:text-white p-2 rounded-xl hover:bg-[#151926] transition-colors cursor-pointer"
                        title="Close (Esc)"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Description Body */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-[#8c95a8] uppercase tracking-wider flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        Description
                    </label>
                    <textarea
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add a more detailed description or notes..."
                        className="w-full p-3.5 rounded-2xl bg-[#090a10] border border-[#22283b] text-sm text-white placeholder-[#8c95a8]/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 outline-none resize-none transition-all"
                    />
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-[#22283b]/60">
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-3.5 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 rounded-xl transition-all duration-150 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {isDeleting ? "Deleting..." : "Delete Card"}
                    </button>

                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold text-[#8c95a8] hover:text-white hover:bg-[#151926] rounded-xl transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving || !title.trim()}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-500/20 transition-all duration-150 disabled:opacity-50 cursor-pointer"
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardModal;
