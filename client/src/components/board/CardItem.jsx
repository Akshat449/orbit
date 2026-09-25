import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const CardItem = ({ card, onCardClick, onDeleteCard }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: card._id,
        data: {
            type: "card",
            card
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1, // Dim card when lifted
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onCardClick?.(card)}
            className="group relative p-3 rounded-lg bg-dark-bg border border-dark-border text-sm shadow-sm hover:border-primary/50 cursor-grab active:cursor-grabbing transition-all duration-150"
        >
            <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-text-main flex-1 break-words">{card.title}</p>
                {onDeleteCard && (
                    <button
                        type="button"
                        title="Delete card"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCard(card._id, card.list);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-text-muted hover:text-red-400 hover:bg-dark-surface rounded transition-all duration-150 cursor-pointer"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
            </div>

            {card.description && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-text-muted">
                    <svg className="w-3 h-3 text-text-muted/80 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <span className="truncate">{card.description}</span>
                </div>
            )}
        </div>
    );
};

export default CardItem;
