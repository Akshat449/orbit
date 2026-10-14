import { useState, useEffect } from "react";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CardItem from "./CardItem";

const ListColumn = ({
    list,
    cards = [],
    onAddCard,
    onUpdateTitle,
    onDeleteList,
    onCardClick,
    onDeleteCard
}) => {
    // 1. Column DnD Hook
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: list._id,
        data: {
            type: "list",
            list
        }
    });

    // 2. Local State for Card Creation inside this column
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [cardTitle, setCardTitle] = useState("");

    // 3. Local State for Inline Title Editing
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(list.title);

    useEffect(() => {
        setTitle(list.title);
    }, [list.title]);

    const handleCardSubmit = (e) => {
        e.preventDefault();
        if (!cardTitle.trim()) return;
        onAddCard(list._id, cardTitle.trim());
        setCardTitle("");
        setIsAddingCard(false);
    };

    const handleSaveTitle = () => {
        setIsEditingTitle(false);
        if (!title.trim() || title.trim() === list.title) {
            setTitle(list.title);
            return;
        }
        onUpdateTitle?.(list._id, title.trim());
    };

    const handleCancelTitle = () => {
        setTitle(list.title);
        setIsEditingTitle(false);
    };

    const handleDeleteList = (e) => {
        e.stopPropagation();
        if (window.confirm(`Delete list "${list.title}" and all its cards?`)) {
            onDeleteList?.(list._id);
        }
    };

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    const cardIds = cards.map((c) => c._id);

    // Dynamic Column Theme based on title (matching showcase mockup)
    const getColumnTheme = (columnTitle) => {
        if (!columnTitle) return {
            titleClass: "text-[#8c95a8]",
            badgeClass: "bg-[#151926] text-white border-[#22283b]",
            cardBorder: "border-[#22283b]"
        };
        const t = columnTitle.toLowerCase();
        if (t.includes("progress") || t.includes("doing") || t.includes("active") || t.includes("wip")) {
            return {
                titleClass: "text-indigo-400",
                badgeClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
                cardBorder: "border-indigo-500/30 shadow-lg shadow-indigo-500/5"
            };
        }
        if (t.includes("done") || t.includes("complete") || t.includes("finish")) {
            return {
                titleClass: "text-emerald-400",
                badgeClass: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
                cardBorder: "border-emerald-500/20"
            };
        }
        if (t.includes("review") || t.includes("qa") || t.includes("test")) {
            return {
                titleClass: "text-amber-400",
                badgeClass: "bg-amber-500/10 text-amber-300 border-amber-500/20",
                cardBorder: "border-amber-500/20"
            };
        }
        return {
            titleClass: "text-[#8c95a8]",
            badgeClass: "bg-[#151926] text-white border-[#22283b]",
            cardBorder: "border-[#22283b]"
        };
    };

    const theme = getColumnTheme(list.title);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`w-80 min-w-[320px] p-4 rounded-2xl bg-[#10131d] border ${theme.cardBorder} flex flex-col max-h-[calc(100vh-190px)] shadow-xl shrink-0 transition-all duration-200`}
        >
            {/* Column Header (Acts as Drag Handle for Column) */}
            <div
                {...attributes}
                {...listeners}
                className="group flex justify-between items-center mb-3 cursor-grab active:cursor-grabbing select-none pb-2 border-b border-[#22283b]/60"
            >
                {/* Editable Title or Input */}
                <div className="flex items-center gap-2 flex-1 mr-2 min-w-0">
                    <span className="text-[#8c95a8]/50 group-hover:text-indigo-400 transition-colors text-xs">
                        ⋮⋮
                    </span>
                    {isEditingTitle ? (
                        <input
                            type="text"
                            value={title}
                            autoFocus
                            onPointerDown={(e) => e.stopPropagation()}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveTitle();
                                if (e.key === "Escape") handleCancelTitle();
                            }}
                            onBlur={handleSaveTitle}
                            className="w-full px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-[#090a10] border border-indigo-500 rounded-lg text-white outline-none"
                        />
                    ) : (
                        <h3
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditingTitle(true);
                            }}
                            title="Click to rename"
                            className={`font-bold text-xs uppercase tracking-wider truncate hover:opacity-80 px-1 py-0.5 rounded cursor-pointer transition-colors ${theme.titleClass}`}
                        >
                            {list.title}
                        </h3>
                    )}
                </div>

                {/* Right Header Actions: Card Count + Delete Button */}
                <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${theme.badgeClass}`}>
                        {cards.length}
                    </span>
                    {onDeleteList && (
                        <button
                            type="button"
                            title="Delete column"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={handleDeleteList}
                            className="opacity-0 group-hover:opacity-100 p-1 text-[#8c95a8] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-150 cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Sortable Cards Container */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[20px]">
                <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
                    {cards.map((card) => (
                        <CardItem
                            key={card._id}
                            card={card}
                            onCardClick={onCardClick}
                            onDeleteCard={onDeleteCard}
                        />
                    ))}
                </SortableContext>

                {cards.length === 0 && !isAddingCard && (
                    <div className="py-8 text-center text-xs text-[#8c95a8]/50 border border-dashed border-[#22283b]/60 rounded-xl my-2">
                        No cards in this column
                    </div>
                )}
            </div>

            {/* Column Footer: Inline Card Creation */}
            <div className="mt-3 pt-2 border-t border-[#22283b]/60">
                {isAddingCard ? (
                    <form onSubmit={handleCardSubmit} className="flex flex-col gap-2">
                        <textarea
                            autoFocus
                            rows="2"
                            placeholder="Enter task title..."
                            value={cardTitle}
                            onChange={(e) => setCardTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleCardSubmit(e);
                                }
                            }}
                            className="w-full p-2.5 rounded-xl bg-[#090a10] border border-[#22283b] text-xs text-white placeholder-[#8c95a8]/50 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 resize-none transition-all duration-200"
                        />
                        <div className="flex items-center gap-2">
                            <button
                                type="submit"
                                className="py-1.5 px-3 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 text-white text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm"
                            >
                                Add Card
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAddingCard(false);
                                    setCardTitle("");
                                }}
                                className="p-1 text-[#8c95a8] hover:text-white text-xs transition-all duration-200 cursor-pointer rounded-lg hover:bg-[#151926]"
                            >
                                ✕
                            </button>
                        </div>
                    </form>
                ) : (
                    <button
                        onClick={() => setIsAddingCard(true)}
                        className="w-full py-2 px-2.5 rounded-xl text-[#8c95a8] hover:text-white hover:bg-[#151926] text-xs font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer text-left group"
                    >
                        <span className="text-indigo-400 font-bold group-hover:scale-110 transition-transform">+</span>
                        <span>Add card</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ListColumn;
