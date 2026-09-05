import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getBoards, createBoard } from "../api/boards";

const WorkspacePage = () => {
    const { workspaceId } = useParams();
    const [boards, setBoards] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState("");

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const data = await getBoards(workspaceId);
                setBoards(data);
            }
            catch (error) {
                console.log(error);
            }
        };
        fetchBoards();
    }, [workspaceId]);

    const handleCreateBoard = async (e) => {
        e.preventDefault();
        try {
            const newBoard = await createBoard(workspaceId,{title});
            setBoards([...boards, newBoard]);
            setIsModalOpen(false);
            setTitle("");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg text-text-main">

            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-dark-border">
                <Link to="/" className="text-text-muted hover:text-text-main transition-all duration-200">
                    ← Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-primary tracking-wide">Orbit</h1>
            </div>

            {/* Content */}
            <div className="p-6">
                <h2 className="text-xl font-semibold text-text-main mb-6">Boards</h2>

                {/* Board Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    {/* Board Cards */}
                    {boards.map((board) => (
                        <Link to={`/board/${board._id}`} key={board._id}>
                            <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border shadow-2xl hover:border-primary/50 transition-all duration-200 cursor-pointer">
                                <h3 className="text-lg font-semibold text-text-main">{board.title}</h3>
                            </div>
                        </Link>
                    ))}

                    {/* Create Board Card */}
                    <div
                        onClick={() => setIsModalOpen(true)}
                        className="p-6 rounded-2xl bg-dark-surface border-2 border-dashed border-dark-border shadow-2xl hover:border-primary/50 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[120px]"
                    >
                        <span className="text-3xl text-text-muted mb-2">+</span>
                        <span className="text-text-muted text-sm">Create Board</span>
                    </div>
                </div>
            </div>

            {/* Create Board Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="w-full max-w-md p-8 rounded-2xl bg-dark-surface border border-dark-border shadow-2xl">
                        <h2 className="text-xl font-semibold text-text-main mb-6">Create Board</h2>

                        <form onSubmit={handleCreateBoard} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm text-text-muted mb-1.5">Board Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Sprint Planning"
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-dark-border text-text-main placeholder-text-muted/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                                />
                            </div>

                            <div className="flex gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 rounded-lg bg-dark-bg border border-dark-border text-text-muted hover:text-text-main cursor-pointer transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover cursor-pointer transition-all duration-200 shadow-lg shadow-primary/20"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default WorkspacePage;

