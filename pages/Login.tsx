
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
// Add Globe to the lucide-react imports
import { Lock, ShieldCheck, HelpCircle, Globe } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#002a63] flex flex-col items-center justify-center relative overflow-hidden font-display">
      {/* Background Decorative Curves */}
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-600/20 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      {/* Login Card */}
      <div className="w-full max-w-[500px] bg-white rounded-lg shadow-2xl z-10 p-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-8">
             <div className="bg-fb-blue p-1.5 rounded-md">
                <div className="w-6 h-6 flex items-center justify-center text-white font-black text-2xl leading-none">f</div>
             </div>
             <span className="text-3xl font-black text-fb-navy tracking-tight">FreshBooks</span>
          </div>
          <h1 className="text-2xl font-bold text-fb-navy">Log in to FreshBooks</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-fb-blue focus:border-fb-blue outline-none transition-all placeholder:text-gray-400"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-fb-blue focus:border-fb-blue outline-none transition-all placeholder:text-gray-400"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-fb-blue hover:underline"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-fb-green hover:brightness-110 text-white font-bold py-4 rounded-md shadow-lg transition-all active:scale-[0.98]"
          >
            Log In
          </button>
        </form>

        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">OR</span>
          </div>
        </div>

        <div className="space-y-4">
          <button className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-md font-bold text-fb-navy hover:bg-gray-50 transition-all">
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Sign in with Google
          </button>
          <button className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-md font-bold text-fb-navy hover:bg-gray-50 transition-all">
            <svg className="w-5 h-5" viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
            Sign in with Apple
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-6">
          <div className="flex justify-center gap-8 w-full">
            <a href="#" className="text-sm font-bold text-fb-blue hover:underline">Forgot Your Password?</a>
            <a href="#" className="text-sm font-bold text-fb-blue hover:underline">Can't Log In?</a>
          </div>
          <Link to="/signup" className="text-sm font-bold text-fb-blue hover:underline">Sign Up</Link>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-8 text-white flex flex-col items-center gap-4 text-xs font-bold opacity-80">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-100">
           <Globe size={14} /> English | Español
        </div>
        <div className="flex items-center gap-4">
           <a href="#" className="flex items-center gap-1 hover:underline"><ShieldCheck size={14} /> Security Safeguards</a>
           <span className="opacity-40">|</span>
           <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </div>
    </div>
  );
}
