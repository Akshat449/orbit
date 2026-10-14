import { useState, useEffect, useContext, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getLists, createList, updateList, deleteList, reorderLists } from "../api/lists";
import { getCards, createCard, updateCard, deleteCard, reorderCards } from "../api/cards";
import { getBoards } from "../api/boards";
import { getWorkspaceMembers } from "../api/workspaces";
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

    // Workspace & Members states
    const [members, setMembers] = useState([]);
    const [workspaceOwner, setWorkspaceOwner] = useState(null);
    const [boardTitle, setBoardTitle] = useState("");
    const [isMembersOpen, setIsMembersOpen] = useState(false);
    const [membersSearchQuery, setMembersSearchQuery] = useState("");
    const membersDropdownRef = useRef(null);

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

    // Fetch Workspace Members & Board info
    useEffect(() => {
        const fetchWorkspaceAndBoard = async () => {
            if (!workspaceId) return;
            try {
                const [membersData, boardsData] = await Promise.all([
                    getWorkspaceMembers(workspaceId),
                    getBoards(workspaceId)
                ]);

                setMembers(membersData.members || []);
                setWorkspaceOwner(membersData.owner || null);

                if (Array.isArray(boardsData)) {
                    const currentBoard = boardsData.find((b) => b._id === boardId);
                    if (currentBoard) {
                        setBoardTitle(currentBoard.title);
                    }
                }
            } catch (err) {
                console.error("Failed to load workspace members/board info:", err);
            }
        };

        fetchWorkspaceAndBoard();
    }, [workspaceId, boardId]);

    // Close members dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (membersDropdownRef.current && !membersDropdownRef.current.contains(event.target)) {
                setIsMembersOpen(false);
            }
        };

        if (isMembersOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMembersOpen]);

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
        <div className="min-h-screen bg-[#090a10] text-[#f1f3f9] flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-30 glass-panel border-b border-[#22283b] px-6 py-3.5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Link
                        to={`/workspace/${workspaceId}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151926] border border-[#22283b] text-xs font-medium text-[#8c95a8] hover:text-white hover:border-indigo-500/40 transition-all duration-200"
                    >
                        <span>←</span>
                        <span>Workspace</span>
                    </Link>
                    <span className="text-sm font-semibold text-white/80">/</span>
                    <span className="text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                        {boardTitle || "Board"}
                    </span>
                </div>

                {/* Right Header Actions */}
                <div className="flex items-center gap-2.5">
                    {/* Members Button & Popover */}
                    <div className="relative" ref={membersDropdownRef}>
                        <button
                            onClick={() => setIsMembersOpen((prev) => !prev)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all duration-200 cursor-pointer shadow-sm ${isMembersOpen
                                    ? "bg-[#1a2030] border-indigo-500/50 text-white shadow-indigo-500/10"
                                    : "bg-[#151926] hover:bg-[#1a2030] border-[#22283b] hover:border-indigo-500/40 text-[#f1f3f9]"
                                }`}
                            title="View workspace team members"
                        >
                            {/* Avatar Stack Preview */}
                            {members.length > 0 && (
                                <div className="flex items-center -space-x-1.5 mr-0.5">
                                    {members.slice(0, 3).map((m, idx) => {
                                        const initial = m.name ? m.name.charAt(0).toUpperCase() : "?";
                                        const gradients = [
                                            "from-indigo-500 to-violet-600",
                                            "from-emerald-500 to-teal-600",
                                            "from-pink-500 to-rose-600",
                                            "from-amber-500 to-orange-600",
                                            "from-cyan-500 to-blue-600"
                                        ];
                                        return (
                                            <div
                                                key={m._id || idx}
                                                className={`w-5 h-5 rounded-full bg-gradient-to-tr ${gradients[idx % gradients.length]} text-white font-bold text-[9px] flex items-center justify-center border-2 border-[#151926] shadow-sm`}
                                            >
                                                {initial}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <span className="font-semibold text-xs text-white">Members</span>
                            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#10131d] text-indigo-400 border border-[#22283b]">
                                {members.length}
                            </span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className={`w-3.5 h-3.5 text-[#8c95a8] transition-transform duration-200 ${isMembersOpen ? "rotate-180 text-white" : ""
                                    }`}
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>

                        {/* Members Dropdown Menu */}
                        {isMembersOpen && (
                            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#10131d] border border-[#22283b] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                {/* Popover Header */}
                                <div className="p-4 border-b border-[#22283b] flex items-center justify-between bg-[#151926]/60">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                                                Workspace Team
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                {members.length}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-[#8c95a8] mt-0.5">
                                            Collaborators with access to this board
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsMembersOpen(false)}
                                        className="text-[#8c95a8] hover:text-white p-1 rounded-lg hover:bg-[#151926] transition-colors cursor-pointer text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Filter Search (shown if members > 4) */}
                                {members.length > 4 && (
                                    <div className="p-2 border-b border-[#22283b]/60 bg-[#090a10]/50">
                                        <input
                                            type="text"
                                            placeholder="Filter members..."
                                            value={membersSearchQuery}
                                            onChange={(e) => setMembersSearchQuery(e.target.value)}
                                            className="w-full px-3 py-1.5 rounded-lg bg-[#151926] border border-[#22283b] text-xs text-white placeholder-[#8c95a8]/50 outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                )}

                                {/* Member List */}
                                <div className="max-h-64 overflow-y-auto p-2 flex flex-col gap-1">
                                    {members.length === 0 ? (
                                        <div className="py-6 text-center text-xs text-[#8c95a8]">
                                            No members found.
                                        </div>
                                    ) : (
                                        members
                                            .filter((m) =>
                                                !membersSearchQuery
                                                    ? true
                                                    : (m.name || "").toLowerCase().includes(membersSearchQuery.toLowerCase()) ||
                                                    (m.email || "").toLowerCase().includes(membersSearchQuery.toLowerCase())
                                            )
                                            .map((member, idx) => {
                                                const isOwner = workspaceOwner?._id === member._id;
                                                const isMe = (user?._id || user?.id) === member._id;
                                                const initial = member.name ? member.name.charAt(0).toUpperCase() : "?";
                                                const gradients = [
                                                    "from-indigo-500 to-violet-600",
                                                    "from-emerald-500 to-teal-600",
                                                    "from-pink-500 to-rose-600",
                                                    "from-amber-500 to-orange-600",
                                                    "from-cyan-500 to-blue-600"
                                                ];
                                                const gradient = gradients[idx % gradients.length];

                                                return (
                                                    <div
                                                        key={member._id || idx}
                                                        className="flex items-center justify-between p-2 rounded-xl hover:bg-[#151926] transition-colors"
                                                    >
                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                            <div
                                                                className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${gradient} text-white font-bold text-xs flex items-center justify-center shrink-0 border border-white/10`}
                                                            >
                                                                {initial}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-xs font-semibold text-white truncate">
                                                                        {member.name}
                                                                    </span>
                                                                    {isMe && (
                                                                        <span className="text-[10px] text-indigo-400 font-medium">
                                                                            (You)
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-[11px] text-[#8c95a8] truncate">
                                                                    {member.email}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="shrink-0 ml-2">
                                                            {isOwner ? (
                                                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                                    Owner
                                                                </span>
                                                            ) : (
                                                                <span className="text-[10px] uppercase font-medium tracking-wider px-2 py-0.5 rounded-full bg-[#10131d] text-[#8c95a8] border border-[#22283b]">
                                                                    Member
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                    )}
                                </div>

                                {/* Popover Footer with Invite action */}
                                <div className="p-3 border-t border-[#22283b] bg-[#151926]/40 flex items-center justify-between">
                                    <span className="text-[11px] text-[#8c95a8]">
                                        Need more teammates?
                                    </span>
                                    <button
                                        onClick={() => {
                                            setIsMembersOpen(false);
                                            setIsInviteModalOpen(true);
                                        }}
                                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm flex items-center gap-1"
                                    >
                                        <span>+ Invite</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Invite Button */}
                    <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#22283b] bg-[#151926] hover:bg-[#1a2030] hover:border-indigo-500/40 text-[#f1f3f9] text-xs font-medium transition-all duration-200 cursor-pointer shadow-sm"
                        title="Invite members to this workspace"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-400">
                            <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM2.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 8 18a9.953 9.953 0 0 1-5.385-1.572ZM16.25 5.75a.75.75 0 0 0-1.5 0v2h-2a.75.75 0 0 0 0 1.5h2v2a.75.75 0 0 0 1.5 0v-2h2a.75.75 0 0 0 0-1.5h-2v-2Z" />
                        </svg>
                        <span className="hidden sm:inline">Invite</span>
                    </button>

                </div>
            </header>

            {/* Board Content Area */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col overflow-hidden">
                {/* 1. Loading Indicator */}
                {loading && (
                    <div className="flex-1 flex flex-col items-center justify-center text-[#8c95a8]">
                        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
                        <span className="text-sm">Loading board data...</span>
                    </div>
                )}

                {/* 2. Error Banner */}
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl max-w-md text-sm">
                        {error}
                    </div>
                )}

                {/* 3. Loaded Board View */}
                {!loading && !error && (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold tracking-tight text-white">
                                    {boardTitle || "Kanban Canvas"}
                                </h2>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Live Sync Active
                                </span>
                                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#151926] text-[#8c95a8] border border-[#22283b]">
                                    {lists.length} {lists.length === 1 ? "column" : "columns"}
                                </span>
                            </div>

                            {/* Live Board Chat Button */}
                            <button
                                onClick={() => setIsChatOpen((prev) => !prev)}
                                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm ${
                                    isChatOpen
                                        ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-md shadow-indigo-500/25"
                                        : "bg-[#10131d] hover:bg-[#151926] border-[#22283b] hover:border-indigo-500/40 text-[#f1f3f9]"
                                }`}
                                title="Toggle live board chat"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-4 h-4 text-indigo-400"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.177 7.152.521 1.942.285 3.348 1.986 3.348 3.951v7.556c0 1.965-1.406 3.666-3.348 3.951a49.206 49.206 0 0 1-3.693.425 4.793 4.793 0 0 0-2.88 1.135l-2.023 1.706a.75.75 0 0 1-1.233-.574V18.75A49.043 49.043 0 0 1 4.848 18.28C2.906 17.994 1.5 16.293 1.5 14.328V6.722c0-1.965 1.406-3.666 3.348-3.951ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 3a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-6Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>Live Chat</span>
                                <span
                                    className={`w-2 h-2 rounded-full ${
                                        isConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                                    }`}
                                />
                            </button>
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
                                <div className="flex flex-row items-start gap-5 overflow-x-auto pb-6 flex-1">
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
                                    <div className="w-80 min-w-[320px] shrink-0">
                                        {!isAddingList ? (
                                            <button
                                                onClick={() => setIsAddingList(true)}
                                                className="w-full py-3.5 px-4 rounded-2xl bg-[#10131d]/60 hover:bg-[#10131d] border border-dashed border-[#22283b] hover:border-indigo-500/50 text-[#8c95a8] hover:text-white text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm group"
                                            >
                                                <span className="text-base text-indigo-400 group-hover:scale-110 transition-transform">+</span>
                                                <span>{lists.length === 0 ? "Add first column" : "Add another column"}</span>
                                            </button>
                                        ) : (
                                            <form
                                                onSubmit={handleCreateList}
                                                className="p-4 rounded-2xl bg-[#10131d] border border-[#22283b] shadow-xl flex flex-col gap-3"
                                            >
                                                <input
                                                    type="text"
                                                    autoFocus
                                                    placeholder="Enter column name..."
                                                    value={newListTitle}
                                                    onChange={(e) => setNewListTitle(e.target.value)}
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090a10] border border-[#22283b] text-sm text-white placeholder-[#8c95a8]/50 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="submit"
                                                        className="py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 text-white text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm"
                                                    >
                                                        Add Column
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsAddingList(false);
                                                            setNewListTitle("");
                                                        }}
                                                        className="p-1.5 text-[#8c95a8] hover:text-white text-xs transition-all duration-200 cursor-pointer rounded-lg hover:bg-[#151926]"
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
                onMemberAdded={(newMember) => {
                    setMembers((prev) => {
                        if (prev.some((m) => m._id === newMember._id)) return prev;
                        return [...prev, newMember];
                    });
                }}
            />
        </div>
    );
};

export default BoardPage;
