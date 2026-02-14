// frontend/ai-learning-assistant/src/pages/Auth/LoginPage.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import { BrainCircuit, Mail, Lock, ArrowRight ,GraduationCap, User  } from "lucide-react";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const[username,setUsername]=useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();
  // const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

     if(password.length<6){
      setError("password is too short")
    }
    setError("");
    setLoading(true);

   

    try {
      await authService.register(username,email, password);
      // login(user, token);
      toast.success("Registered successfully!");
      navigate("/login");
    } catch (err) {
      setError(
        err.message || "Failed to register. Please check your credentials."
      );
      toast.error(err.message || "Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <GraduationCap  className="h-10 w-10 text-emerald-500" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold">Welcome to AI learning dashboard</h1>
          <p className="text-slate-400 text-sm">
            Register to continue your journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* username Field */}
          <div>
            <label className="block text-sm mb-1 text-slate-300">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User
                  className={`h-5 w-5 ${
                    focusedField === "email"
                      ? "text-emerald-500"
                      : "text-slate-400"
                  }`}
                  strokeWidth={2}
                />
              </div>
              <input
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocusedField("username")}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="tusharpatel"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1 text-slate-300">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail
                  className={`h-5 w-5 ${
                    focusedField === "email"
                      ? "text-emerald-500"
                      : "text-slate-400"
                  }`}
                  strokeWidth={2}
                />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm mb-1 text-slate-300">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock
                  className={`h-5 w-5 ${
                    focusedField === "password"
                      ? "text-emerald-500"
                      : "text-slate-400"
                  }`}
                  strokeWidth={2}
                />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 transition-colors py-2.5 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/login"
            className="text-emerald-500 hover:underline"
          >
            login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

