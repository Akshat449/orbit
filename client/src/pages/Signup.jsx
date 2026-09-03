import { useState , useContext} from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-bg">
      <div className="w-full max-w-md p-8 rounded-2xl bg-dark-surface border border-dark-border shadow-2xl">
        
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary tracking-wide">Orbit</h1>
          <p className="text-text-muted mt-2 text-sm">Create your Orbit account to get started.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm text-text-muted mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-dark-border text-text-main placeholder-text-muted/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-dark-border text-text-main placeholder-text-muted/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-dark-border text-text-main placeholder-text-muted/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover cursor-pointer transition-all duration-200 shadow-lg shadow-primary/20"
          >
            Sign Up
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center  text-sm text-text-muted mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
