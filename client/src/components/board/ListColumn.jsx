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

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="w-72 min-w-[288px] p-4 rounded-xl bg-dark-surface border border-dark-border flex flex-col max-h-[calc(100vh-220px)] shadow-lg"
        >
            {/* Column Header (Acts as Drag Handle for Column) */}
            <div 
                {...attributes} 
                {...listeners} 
                className="group flex justify-between items-center mb-3 cursor-grab active:cursor-grabbing select-none"
            >
                {/* Editable Title or Input */}
                <div className="flex-1 mr-2 min-w-0">
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
                            className="w-full px-2 py-0.5 text-sm font-semibold bg-dark-bg border border-primary rounded text-text-main outline-none"
                        />
                    ) : (
                        <h3 
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditingTitle(true);
                            }}
                            title="Click to rename"
                            className="font-semibold text-text-main text-sm tracking-wide truncate hover:bg-dark-bg/40 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                        >
                            {list.title}
                        </h3>
                    )}
                </div>

                {/* Right Header Actions: Card Count + Delete Button */}
                <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs text-text-muted bg-dark-bg/60 px-2 py-0.5 rounded-full border border-dark-border/50">
                        {cards.length}
                    </span>
                    {onDeleteList && (
                        <button
                            type="button"
                            title="Delete list"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={handleDeleteList}
                            className="opacity-0 group-hover:opacity-100 p-1 text-text-muted hover:text-red-400 hover:bg-dark-bg/60 rounded transition-all duration-150 cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Sortable Cards Container */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[10px]">
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
                    <p className="text-xs text-text-muted/60 italic py-4 text-center">
                        No cards yet
                    </p>
                )}
            </div>

            {/* Column Footer: Inline Card Creation */}
            <div className="mt-3 pt-2 border-t border-dark-border/50">
                {isAddingCard ? (
                    <form onSubmit={handleCardSubmit} className="flex flex-col gap-2">
                        <textarea
                            autoFocus
                            rows="2"
                            placeholder="Enter a title for this card..."
                            value={cardTitle}
                            onChange={(e) => setCardTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleCardSubmit(e);
                                }
                            }}
                            className="w-full p-2.5 rounded-lg bg-dark-bg border border-dark-border text-xs text-text-main placeholder-text-muted/60 outline-none focus:border-primary resize-none transition-all duration-200"
                        />
                        <div className="flex items-center gap-2">
                            <button
                                type="submit"
                                className="py-1 px-3 rounded-md bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-all duration-200 cursor-pointer"
                            >
                                Add Card
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAddingCard(false);
                                    setCardTitle("");
                                }}
                                className="p-1 text-text-muted hover:text-text-main text-xs transition-all duration-200 cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                    </form>
                ) : (
                    <button
                        onClick={() => setIsAddingCard(true)}
                        className="w-full py-1.5 px-2 rounded-lg text-text-muted hover:text-text-main hover:bg-dark-bg/60 text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer text-left"
                    >
                        <span>+</span> Add a card
                    </button>
                )}
            </div>
        </div>
    );
};

export default ListColumn;
