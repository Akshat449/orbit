import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getWorkspaces, createWorkspace } from "../api/workspaces";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [workspaces, setWorkspaces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWorkspaces();
        setWorkspaces(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const newWorkspace = await createWorkspace({ name, description });
      setWorkspaces([...workspaces, newWorkspace]);
      setIsModalOpen(false);
      setName("");
      setDescription("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-text-main">

      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-dark-border">
        <h1 className="text-2xl font-bold text-primary tracking-wide">Orbit</h1>
        <div className="flex items-center gap-4">
          <span className="text-text-muted text-sm">
            Hey, {user?.name || "User"}
          </span>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 cursor-pointer transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-text-main mb-6">Your Workspaces</h2>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Workspace Cards */}
          {workspaces.map((workspace) => (
            <Link to={`/workspace/${workspace._id}`} key={workspace._id}>
              <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border shadow-2xl hover:border-primary/50 transition-all duration-200 cursor-pointer">
                <h3 className="text-lg font-semibold text-text-main">{workspace.name}</h3>
                <p className="text-text-muted text-sm mt-2">
                  {workspace.description || "No description"}
                </p>
              </div>
            </Link>
          ))}

          {/* Create Workspace Card */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="p-6 rounded-2xl bg-dark-surface border-2 border-dashed border-dark-border shadow-2xl hover:border-primary/50 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[120px]"
          >
            <span className="text-3xl text-text-muted mb-2">+</span>
            <span className="text-text-muted text-sm">Create Workspace</span>
          </div>
        </div>
      </div>

      {/* Create Workspace Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-full max-w-md p-8 rounded-2xl bg-dark-surface border border-dark-border shadow-2xl">
            <h2 className="text-xl font-semibold text-text-main mb-6">Create Workspace</h2>

            <form onSubmit={handleCreate} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm text-text-muted mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Workspace"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-dark-border text-text-main placeholder-text-muted/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-1.5">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this workspace for?"
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

export default Dashboard;