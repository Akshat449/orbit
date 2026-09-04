import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-dark-bg text-text-main flex flex-col items-center justify-center">
      <div className="p-8 rounded-2xl bg-dark-surface border border-dark-border shadow-2xl text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">Welcome to Orbit!</h1>
        <p className="text-text-muted mb-8">
          You are successfully logged in as: <br />
          <span className="text-white font-medium">{user?.name || user?.email || "User"}</span>
        </p>
        <button
          onClick={logout}
          className="px-6 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
