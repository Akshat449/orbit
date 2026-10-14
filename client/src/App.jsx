import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SocketProvider } from "./context/SocketContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import WorkspacePage from "./pages/WorkspacePage";
import BoardPage from "./pages/BoardPage";
import LandingPage from "./pages/LandingPage";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="min-h-screen bg-dark-bg text-text-main flex items-center justify-center">Loading...</div>
  }
  if (!loading && !user) {
    return <Navigate to="/login" />
  }
  return children
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Routes>
            {/* Public Landing (Home) Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Protected Dashboard Route */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/workspace/:workspaceId/board/:boardId" element={
              <ProtectedRoute>
                <BoardPage />
              </ProtectedRoute>
            } />

            <Route path="/workspace/:workspaceId" element={
              <ProtectedRoute>
                <WorkspacePage />
              </ProtectedRoute>
            } />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
