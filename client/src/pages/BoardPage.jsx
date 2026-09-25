import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getLists, createList, updateList, deleteList, reorderLists } from "../api/lists";
import { getCards, createCard, updateCard, deleteCard, reorderCards } from "../api/cards";

// DnD Imports
import {
    DndContext,
    DragOverlay,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    SortableContext,
    horizontalListSortingStrategy,
    arrayMove
} from "@dnd-kit/sortable";

// Components
import ListColumn from "../components/board/ListColumn";
import CardItem from "../components/board/CardItem";
import CardModal from "../components/board/CardModal";

const BoardPage = () => {
    const { workspaceId, boardId } = useParams();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5
            }
        })
    );
    const [activeItem, setActiveItem] = useState(null);

    const [lists, setLists] = useState([]);
    const [cardsByList, setCardsByList] = useState({});
    const [isAddingList, setIsAddingList] = useState(false);
    const [newListTitle, setNewListTitle] = useState("");
    const [selectedCard, setSelectedCard] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [listsData, cardsData] = await Promise.all([
                    getLists(boardId),
                    getCards(boardId)
                ]);

                const sortedLists = [...listsData].sort((a, b) => a.position - b.position);

                const cardMap = {};
                sortedLists.forEach((list) => {
                    cardMap[list._id] = [];
                });

                cardsData.forEach((card) => {
                    if (cardMap[card.list]) {
                        cardMap[card.list].push(card);
                    }
                });

                Object.keys(cardMap).forEach((listId) => {
                    cardMap[listId].sort((a, b) => a.position - b.position);
                });

                setLists(sortedLists);
                setCardsByList(cardMap);
            } catch (err) {
                console.error("Failed to fetch board data:", err);
                setError(err.response?.data?.message || "Failed to load board data");
            } finally {
                setLoading(false);
            }
        };

        if (boardId) {
            fetchBoardData();
        }
    }, [boardId]);

    const handleCreateList = async (e) => {
        e.preventDefault();
        if (!newListTitle.trim()) return;

        try {
            const newList = await createList(boardId, newListTitle.trim());
            setLists((prev) => [...prev, newList]);
            setCardsByList((prev) => ({
                ...prev,
                [newList._id]: []
            }));
            setNewListTitle("");
            setIsAddingList(false);
        } catch (err) {
            console.error("Failed to create list:", err);
        }
    };

    const handleCreateCard = async (listId, title) => {
        try {
            const newCard = await createCard(listId, title);
            setCardsByList((prev) => ({
                ...prev,
                [listId]: [...(prev[listId] || []), newCard]
            }));
        } catch (err) {
            console.error("Failed to create card:", err);
        }
    };

    // --- List Actions ---
    const handleUpdateListTitle = async (listId, newTitle) => {
        const previousLists = [...lists];
        setLists((prev) =>
            prev.map((l) => (l._id === listId ? { ...l, title: newTitle } : l))
        );

        try {
            await updateList(boardId, listId, newTitle);
        } catch (err) {
            console.error("Failed to update list title:", err);
            setLists(previousLists);
        }
    };

    const handleDeleteList = async (listId) => {
        const previousLists = [...lists];
        const previousCards = { ...cardsByList };

        setLists((prev) => prev.filter((l) => l._id !== listId));
        setCardsByList((prev) => {
            const next = { ...prev };
            delete next[listId];
            return next;
        });

        try {
            await deleteList(boardId, listId);
        } catch (err) {
            console.error("Failed to delete list:", err);
            setLists(previousLists);
            setCardsByList(previousCards);
        }
    };

    // --- Card Actions ---
    const handleDeleteCard = async (cardId, listId) => {
        const previousCards = { ...cardsByList };

        setCardsByList((prev) => ({
            ...prev,
            [listId]: (prev[listId] || []).filter((c) => c._id !== cardId)
        }));

        if (selectedCard?._id === cardId) {
            setSelectedCard(null);
        }

        try {
            await deleteCard(cardId);
        } catch (err) {
            console.error("Failed to delete card:", err);
            setCardsByList(previousCards);
        }
    };

    const handleUpdateCard = async (cardId, newTitle, newDescription) => {
        const previousCards = { ...cardsByList };
        const cardListId = selectedCard?.list;
        if (!cardListId) return;

        setCardsByList((prev) => ({
            ...prev,
            [cardListId]: (prev[cardListId] || []).map((c) =>
                c._id === cardId
                    ? { ...c, title: newTitle, description: newDescription }
                    : c
            )
        }));

        setSelectedCard((prev) =>
            prev ? { ...prev, title: newTitle, description: newDescription } : null
        );

        try {
            await updateCard(cardId, newTitle, newDescription);
        } catch (err) {
            console.error("Failed to update card:", err);
            setCardsByList(previousCards);
        }
    };

    // --- DnD Handlers ---
    const handleDragStart = (event) => {
        setActiveItem(event.active.data.current);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;

        if (active.data.current?.type !== "card") return;

        const activeCard = active.data.current.card;
        const activeListId = activeCard.list;

        const overListId = over.data.current?.type === "card"
            ? over.data.current.card.list
            : over.id;

        if (!activeListId || !overListId || activeListId === overListId) return;

        setCardsByList((prev) => {
            const sourceCards = [...(prev[activeListId] || [])];
            const destCards = [...(prev[overListId] || [])];

            const cardIndex = sourceCards.findIndex((c) => c._id === active.id);
            if (cardIndex === -1) return prev;

            const [movedCard] = sourceCards.splice(cardIndex, 1);
            movedCard.list = overListId;
            destCards.push(movedCard);

            return {
                ...prev,
                [activeListId]: sourceCards,
                [overListId]: destCards
            };
        });
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveItem(null);

        if (!over || active.id === over.id) return;

        // CASE A: User dragged a Column (List)
        if (active.data.current?.type === "list") {
            const oldIndex = lists.findIndex((l) => l._id === active.id);
            const newIndex = lists.findIndex((l) => l._id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const reorderedLists = arrayMove(lists, oldIndex, newIndex);
                setLists(reorderedLists);

                try {
                    await reorderLists(boardId, reorderedLists.map((l) => l._id));
                } catch (err) {
                    console.error("Failed to reorder lists:", err);
                }
            }
            return;
        }

        // CASE B: User dragged a Card
        if (active.data.current?.type === "card") {
            const cardId = active.id;
            const activeCard = active.data.current.card;
            const sourceListId = activeCard.list;

            const destListId = over.data.current?.type === "card"
                ? over.data.current.card.list
                : over.id;

            const destCards = cardsByList[destListId] || [];
            const newPosition = destCards.findIndex((c) => c._id === cardId);

            if (destListId && newPosition !== -1) {
                try {
                    await reorderCards(cardId, sourceListId, destListId, newPosition);
                } catch (err) {
                    console.error("Failed to reorder cards:", err);
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg text-text-main flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-dark-border">
                <Link
                    to={`/workspace/${workspaceId}`}
                    className="text-text-muted hover:text-text-main transition-all duration-200"
                >
                    ← Back to Workspace
                </Link>
                <h1 className="text-2xl font-bold text-primary tracking-wide">Orbit</h1>
            </div>

            {/* Board Content Area */}
            <div className="p-6 flex-1 flex flex-col">
                {/* 1. Loading Indicator */}
                {loading && (
                    <div className="flex-1 flex items-center justify-center text-text-muted">
                        Loading board...
                    </div>
                )}

                {/* 2. Error Banner */}
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg max-w-md">
                        {error}
                    </div>
                )}

                {/* 3. Loaded Board View */}
                {!loading && !error && (
                    <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-text-main">Kanban Board</h2>
                            <span className="text-sm text-text-muted">
                                {lists.length} {lists.length === 1 ? "list" : "lists"}
                            </span>
                        </div>

                        {/* DnD Context Wrapping the Canvas */}
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCorners}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={lists.map((l) => l._id)}
                                strategy={horizontalListSortingStrategy}
                            >
                                <div className="flex flex-row items-start gap-4 overflow-x-auto pb-4">
                                    {lists.map((list) => (
                                        <ListColumn
                                            key={list._id}
                                            list={list}
                                            cards={cardsByList[list._id] || []}
                                            onAddCard={handleCreateCard}
                                            onUpdateTitle={handleUpdateListTitle}
                                            onDeleteList={handleDeleteList}
                                            onCardClick={setSelectedCard}
                                            onDeleteCard={handleDeleteCard}
                                        />
                                    ))}

                                    {/* Add List Placeholder / Form */}
                                    <div className="w-72 min-w-[288px]">
                                        {!isAddingList ? (
                                            <button
                                                onClick={() => setIsAddingList(true)}
                                                className="w-full py-3 px-4 rounded-xl bg-dark-surface/60 hover:bg-dark-surface border border-dashed border-dark-border hover:border-primary/50 text-text-muted hover:text-text-main text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                                            >
                                                <span>+</span> {lists.length === 0 ? "Add a list" : "Add another list"}
                                            </button>
                                        ) : (
                                            <form
                                                onSubmit={handleCreateList}
                                                className="p-3 rounded-xl bg-dark-surface border border-dark-border shadow-xl flex flex-col gap-3"
                                            >
                                                <input
                                                    type="text"
                                                    autoFocus
                                                    placeholder="Enter list title..."
                                                    value={newListTitle}
                                                    onChange={(e) => setNewListTitle(e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border text-sm text-text-main placeholder-text-muted/60 outline-none focus:border-primary transition-all duration-200"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="submit"
                                                        className="py-1.5 px-3 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-all duration-200 cursor-pointer"
                                                    >
                                                        Add List
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsAddingList(false);
                                                            setNewListTitle("");
                                                        }}
                                                        className="p-1.5 text-text-muted hover:text-text-main text-xs transition-all duration-200 cursor-pointer"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </SortableContext>

                            {/* Floating Ghost Element during drag */}
                            <DragOverlay>
                                {activeItem?.type === "list" && (
                                    <ListColumn
                                        list={activeItem.list}
                                        cards={cardsByList[activeItem.list._id] || []}
                                        onAddCard={() => { }}
                                    />
                                )}
                                {activeItem?.type === "card" && (
                                    <CardItem card={activeItem.card} />
                                )}
                            </DragOverlay>
                        </DndContext>
                    </div>
                )}
            </div>

            {/* Card Detail Modal */}
            <CardModal
                isOpen={!!selectedCard}
                card={selectedCard}
                listTitle={lists.find((l) => l._id === selectedCard?.list)?.title || ""}
                onClose={() => setSelectedCard(null)}
                onUpdate={handleUpdateCard}
                onDelete={handleDeleteCard}
            />
        </div>
    );
};

export default BoardPage;
