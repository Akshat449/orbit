import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (err.message === "Network Error" || !err.response
          ? "Unable to connect to server. Please ensure the backend is running."
          : "Signup failed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden bg-[#090a10]">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md p-8 sm:p-10 rounded-3xl bg-[#10131d]/90 border border-[#22283b] shadow-2xl backdrop-blur-xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            title="Back to Orbit Home"
            className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 text-indigo-400 shadow-inner hover:scale-105 hover:border-indigo-400 transition-all duration-200 cursor-pointer"
          >
            <svg className="w-6 h-6 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <circle cx="12" cy="12" r="8" strokeDasharray="3 3" />
              <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" opacity="0.6" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Create an <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Orbit</span> account
          </h1>
          <p className="mt-2 text-sm text-[#8c95a8]">
            Get started with real-time kanban and workspace collaboration.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-sm flex items-start gap-2.5">
            <svg className="w-5 h-5 shrink-0 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8c95a8] mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Johnson"
              required
              className="w-full px-4 py-3 rounded-xl bg-[#090a10] border border-[#22283b] text-white placeholder-[#8c95a8]/50 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8c95a8] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              className="w-full px-4 py-3 rounded-xl bg-[#090a10] border border-[#22283b] text-white placeholder-[#8c95a8]/50 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8c95a8] mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl bg-[#090a10] border border-[#22283b] text-white placeholder-[#8c95a8]/50 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-[#22283b] text-center">
          <p className="text-sm text-[#8c95a8]">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
