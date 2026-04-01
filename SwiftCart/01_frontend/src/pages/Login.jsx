import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Mail, Lock, User, LogIn } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login: loginUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('Username and password are required.');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login({ email, password, role });
      const { user, token } = response.data;

      if (!user || !token) {
        throw new Error('Invalid login response from server.');
      }

      loginUser(user, token);
      toast.success('Successfully logged in!');
      
      if (user.role === 'admin') {
        navigate('/profile');
      } else {
        navigate('/');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Invalid credentials';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 animate-fade-in relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan/20 rounded-full blur-3xl -ml-16 -mb-16"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="input-glass w-full pl-10 pr-4 py-3 placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-glass w-full pl-10 pr-4 py-3 placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300 ml-1">Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  className="input-glass w-full pl-10 pr-4 py-3 appearance-none bg-[#0F172A]"
                >
                  <option value="user" className="bg-[#0F172A]">Customer</option>
                  <option value="admin" className="bg-[#0F172A]">Store Admin</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-gradient w-full py-3 mt-4 text-lg flex justify-center items-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <LogIn className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700/50 text-center text-sm text-slate-400">
            <p className="mb-2 font-medium">Demo Credentials:</p>
            <div className="flex flex-col gap-1">
              <code className="bg-slate-800/50 px-2 py-1 rounded">user@example.com / user123</code>
              <code className="bg-slate-800/50 px-2 py-1 rounded">admin@example.com / admin123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
