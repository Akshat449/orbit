import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import WorkspacePage from "./pages/WorkspacePage";
import BoardPage from "./pages/BoardPage";

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
      <Router>
        <Routes>
          {/* Protected Dashboard Route */}
          <Route path="/" element={
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
    </AuthProvider>
  );
}

export default App;
