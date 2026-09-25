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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            {/* Click outside backdrop */}
            <div className="fixed inset-0" onClick={onClose} />

            {/* Modal Box */}
            <div className="relative w-full max-w-lg bg-dark-surface border border-dark-border rounded-2xl shadow-2xl p-6 z-10 flex flex-col gap-5 text-text-main">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                            In list: <span className="text-primary font-semibold">{listTitle || "Column"}</span>
                        </span>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Card title..."
                            className="w-full mt-1.5 px-3 py-2 text-lg font-semibold bg-dark-bg border border-dark-border rounded-lg text-text-main focus:border-primary outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={onClose}
                        className="text-text-muted hover:text-text-main p-1.5 rounded-lg hover:bg-dark-bg transition-colors cursor-pointer"
                        title="Close (Esc)"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Description Body */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-text-muted flex items-center gap-1.5 uppercase tracking-wide">
                        <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        Description
                    </label>
                    <textarea
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add a more detailed description..."
                        className="w-full p-3 rounded-xl bg-dark-bg border border-dark-border text-sm text-text-main placeholder-text-muted/60 focus:border-primary outline-none resize-none transition-all"
                    />
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-dark-border">
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-3.5 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {isDeleting ? "Deleting..." : "Delete Card"}
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-medium text-text-muted hover:text-text-main hover:bg-dark-bg rounded-lg transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving || !title.trim()}
                            className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover transition-colors shadow-md disabled:opacity-50 cursor-pointer"
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
