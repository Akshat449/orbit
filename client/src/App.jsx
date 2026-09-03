import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider,AuthContext } from "./context/AuthContext";
import { useContext } from "react";

const ProtectedRoute = ({children}) => {
  const {user,loading} = useContext(AuthContext);

  if(loading){
    return <div>Loading...</div>
  }
  if(!loading && !user){
    return <Navigate to="/login" />
  }
  return children
}

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        {/* If a user goes to the root URL, automatically redirect them to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
    </AuthProvider> 
  );
}

export default App;
