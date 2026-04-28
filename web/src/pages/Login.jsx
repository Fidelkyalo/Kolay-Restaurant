import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthService } from '../services/api';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await AuthService.login(formData);
            localStorage.setItem('kolay_auth_user', JSON.stringify(response.data));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid username or password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-cream p-4 font-body">
            {/* Decorative background elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl"></div>

            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-cream/50 relative z-10">
                <div className="p-8 text-center bg-primary">
                    <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-2xl shadow-lg mb-4">
                        <ChefHat className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white tracking-tight">KOLAY</h1>
                    <p className="text-white/70 text-sm mt-1">Restaurant Management System</p>
                </div>

                <div className="p-8 lg:p-10">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-primary">Welcome Back</h2>
                        <p className="text-charcoal/50 text-sm">Please enter your credentials to login.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3 rounded-xl">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-charcoal/70 flex items-center gap-2">
                                <User className="w-4 h-4" /> Username
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 bg-bg-cream/50 border border-cream rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none"
                                placeholder="fidel.kyalo"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-charcoal/70 flex items-center gap-2">
                                <Lock className="w-4 h-4" /> Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full px-4 py-3 bg-bg-cream/50 border border-cream rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-secondary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-cream text-secondary focus:ring-secondary" />
                                <span className="text-xs text-charcoal/50 group-hover:text-primary transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-xs font-bold text-secondary hover:underline">Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg transition-all active:transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Get Started
                                    <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                        <span className="text-xs">→</span>
                                    </div>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="p-6 bg-bg-cream/30 border-t border-cream flex justify-center">
                    <p className="text-xs text-charcoal/40">Powered by Kolay Management Platform</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
