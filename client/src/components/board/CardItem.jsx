import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Parse bracket tag or derive badge
const parseCardTitle = (rawTitle) => {
    if (!rawTitle) return { tag: null, title: "" };

    // Check if title has [Tag] at the start, e.g. [Frontend] My Card
    const bracketMatch = rawTitle.match(/^\[(.*?)\]\s*(.*)$/);
    if (bracketMatch) {
        return {
            tag: bracketMatch[1].trim(),
            title: bracketMatch[2].trim() || bracketMatch[1].trim()
        };
    }

    // Check for common keywords in title to auto-tag if desired
    const lower = rawTitle.toLowerCase();
    if (lower.includes("bug") || lower.includes("fix") || lower.includes("error") || lower.includes("issue")) {
        return { tag: "Bug", title: rawTitle };
    }
    if (lower.includes("ui") || lower.includes("frontend") || lower.includes("design") || lower.includes("css") || lower.includes("modal")) {
        return { tag: "Frontend", title: rawTitle };
    }
    if (lower.includes("api") || lower.includes("backend") || lower.includes("server") || lower.includes("db") || lower.includes("database")) {
        return { tag: "Backend", title: rawTitle };
    }
    if (lower.includes("socket") || lower.includes("chat") || lower.includes("realtime") || lower.includes("real-time") || lower.includes("sync")) {
        return { tag: "Real-time", title: rawTitle };
    }
    if (lower.includes("auth") || lower.includes("login") || lower.includes("signup") || lower.includes("security") || lower.includes("jwt")) {
        return { tag: "Auth", title: rawTitle };
    }
    if (lower.includes("arch") || lower.includes("infra") || lower.includes("deploy") || lower.includes("docker")) {
        return { tag: "Architecture", title: rawTitle };
    }

    return { tag: null, title: rawTitle };
};

// Tag color styles matching the showcase mockup
const getTagColor = (tag) => {
    if (!tag) return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    const t = tag.toLowerCase();
    if (t.includes("arch") || t.includes("plan") || t.includes("warn") || t.includes("infra")) {
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
    if (t.includes("front") || t.includes("ui") || t.includes("ux") || t.includes("client")) {
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
    if (t.includes("real") || t.includes("socket") || t.includes("live") || t.includes("chat")) {
        return "bg-violet-500/10 text-violet-400 border-violet-500/20";
    }
    if (t.includes("back") || t.includes("api") || t.includes("serv") || t.includes("db")) {
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    }
    if (t.includes("auth") || t.includes("done") || t.includes("pass") || t.includes("sec") || t.includes("verif")) {
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }
    if (t.includes("bug") || t.includes("fix") || t.includes("fail") || t.includes("error")) {
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    }
    return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
};

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
        opacity: isDragging ? 0.35 : 1,
    };

    const { tag, title: displayTitle } = parseCardTitle(card.title);
    const tagColor = getTagColor(tag);
    const cardId = card._id ? card._id.slice(-3).toUpperCase() : "101";

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onCardClick?.(card)}
            className="group relative p-3.5 rounded-xl bg-[#151926] hover:bg-[#1a2030] border border-[#22283b] hover:border-indigo-500/40 text-xs shadow-sm hover:shadow-md hover:shadow-indigo-500/5 cursor-grab active:cursor-grabbing transition-all duration-150 select-none"
        >
            {/* Top Row: Tag / Category Badge & Card ID / Delete Action */}
            <div className="flex items-center justify-between gap-2 mb-2">
                {tag ? (
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${tagColor}`}>
                        {tag}
                    </span>
                ) : (
                    <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-[#10131d] text-[#8c95a8] border border-[#22283b]">
                        Task
                    </span>
                )}

                <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] font-mono text-[#8c95a8] group-hover:opacity-70 transition-opacity">
                        #{cardId}
                    </span>
                    {onDeleteCard && (
                        <button
                            type="button"
                            title="Delete card"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteCard(card._id, card.list);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-0.5 text-[#8c95a8] hover:text-red-400 hover:bg-red-500/10 rounded transition-all duration-150 cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Card Main Title */}
            <p className="font-semibold text-white/95 break-words leading-relaxed">
                {displayTitle}
            </p>

            {/* Description Snippet or Notes */}
            {card.description && (
                <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-[#22283b]/50 text-[11px] text-[#8c95a8]">
                    <svg className="w-3 h-3 text-[#8c95a8]/70 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <span className="truncate">{card.description}</span>
                </div>
            )}
        </div>
    );
};

export default CardItem;
