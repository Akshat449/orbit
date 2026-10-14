import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getLists, createList, updateList, deleteList, reorderLists } from "../api/lists";
import { getCards, createCard, updateCard, deleteCard, reorderCards } from "../api/cards";
import { AuthContext } from "../context/AuthContext";
import useSocket from "../hooks/useSocket";
import { getBoardMessages } from "../api/messages";
import ChatPanel from "../components/chat/ChatPanel";
import InviteMemberModal from "../components/workspace/InviteMemberModal";
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

    // Auth and Socket hooks
    const { user } = useContext(AuthContext);
    const { socket, isConnected } = useSocket();

    // Chat UI states
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);

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

    useEffect(() => {
        const loadMessages = async () => {
            try {
                setLoadingMessages(true);
                const history = await getBoardMessages(boardId);
                setMessages(history);
            } catch (err) {
                console.error("Failed to load chat history:", err);
            } finally {
                setLoadingMessages(false);
            }
        };

        if (boardId) {
            loadMessages();
        }
    }, [boardId]);

    useEffect(() => {
        if (!socket || !boardId) return;

        // 1. Join this board's chat room
        socket.emit("join-board", boardId);

        // Rejoin room if socket reconnects
        const handleConnect = () => {
            socket.emit("join-board", boardId);
        };
        socket.on("connect", handleConnect);

        // 2. Listen for incoming real-time messages
        const handleNewMessage = (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        };

        socket.on("new-message", handleNewMessage);

        // 3. Clean up when switching boards or leaving the page
        return () => {
            socket.emit("leave-board", boardId);
            socket.off("connect", handleConnect);
            socket.off("new-message", handleNewMessage);
        };
    }, [socket, boardId]);

    const handleSendMessage = (content) => {
        if (!socket || !content.trim()) return;

        socket.emit("send-message", {
            boardId,
            content: content.trim(),
        });
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

                {/* Right Header Actions */}
                <div className="flex items-center gap-3">
                    {/* Invite Members Button */}
                    <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dark-border bg-dark-surface hover:bg-dark-border text-text-main text-sm font-medium transition-all duration-200 cursor-pointer shadow-sm"
                        title="Invite members to this workspace"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-primary">
                            <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM2.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 8 18a9.953 9.953 0 0 1-5.385-1.572ZM16.25 5.75a.75.75 0 0 0-1.5 0v2h-2a.75.75 0 0 0 0 1.5h2v2a.75.75 0 0 0 1.5 0v-2h2a.75.75 0 0 0 0-1.5h-2v-2Z" />
                        </svg>
                        <span>Invite</span>
                    </button>

                    {/* Chat Toggle Button */}
                    <button
                        onClick={() => setIsChatOpen((prev) => !prev)}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 cursor-pointer ${
                            isChatOpen
                                ? "bg-primary text-white border-primary shadow-sm"
                                : "bg-dark-surface hover:bg-dark-border border-dark-border text-text-main"
                        }`}
                    >
                        {/* Chat Bubble Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.177 7.152.521 1.942.285 3.348 1.986 3.348 3.951v7.556c0 1.965-1.406 3.666-3.348 3.951a49.206 49.206 0 0 1-3.693.425 4.793 4.793 0 0 0-2.88 1.135l-2.023 1.706a.75.75 0 0 1-1.233-.574V18.75A49.043 49.043 0 0 1 4.848 18.28C2.906 17.994 1.5 16.293 1.5 14.328V6.722c0-1.965 1.406-3.666 3.348-3.951ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 3a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-6Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>Chat</span>
                        {/* Live Connection Dot */}
                        <span
                            className={`w-2 h-2 rounded-full ${
                                isConnected ? "bg-emerald-400" : "bg-text-muted"
                            }`}
                        />
                    </button>
                </div>
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

             {/* Live Chat Drawer */}
            <ChatPanel
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                messages={messages}
                currentUser={user}
                onSendMessage={handleSendMessage}
                loading={loadingMessages}
                disabled={!isConnected}
                boardTitle="Board Chat"
            />

            {/* Invite Members Modal */}
            <InviteMemberModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                workspaceId={workspaceId}
            />
        </div>
    );
};

export default BoardPage;
