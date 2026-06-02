import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ChefHat, Lock, User, Eye, EyeOff, Loader2,
    LogIn, ArrowLeft
} from 'lucide-react';
import { AuthService } from '../services/api';

const CustomerLogin = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.username.trim()) { setError('Username is required.'); return; }
        if (!form.password) { setError('Password is required.'); return; }

        setIsLoading(true);
        try {
            const res = await AuthService.login({
                username: form.username.trim(),
                password: form.password,
            });

            const userData = res.data;
            // Normalize: backend returns "token", but our interceptor expects "accessToken"
            const normalizedUser = {
                ...userData,
                accessToken: userData.token || userData.accessToken,
            };
            // Persist the full JWT response so the api interceptor picks up accessToken
            localStorage.setItem('kolay_auth_user', JSON.stringify(normalizedUser));
            localStorage.setItem('kolay_staff_name', userData.username);

            // Dispatch so GuestMenu re-reads the login state
            window.dispatchEvent(new Event('storage'));

            // Redirect back to the menu
            navigate('/order');
        } catch (err) {
            const isTimeout = err.code === 'ECONNABORTED' || err.message?.includes('timeout');
            const serverMsg = err?.response?.data?.message;
            const status = err?.response?.status;

            let msg;
            if (isTimeout) {
                msg = 'The server is taking too long to respond. Please try again in a moment.';
            } else if (status === 401 || status === 400) {
                msg = 'Invalid username or password.';
            } else {
                msg = serverMsg || 'Sign in failed. Please try again.';
            }
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const inputCls =
        'w-full px-4 py-3.5 bg-bg-cream/50 border border-cream rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none font-semibold text-sm';

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-cream p-4 font-body">
            {/* Decorative blobs */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-cream/50 relative z-10">
                {/* Header */}
                <div className="bg-secondary p-8 text-center relative">
                    <Link
                        to="/order"
                        className="absolute top-5 left-5 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-2xl shadow-lg mb-4">
                        <ChefHat className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white tracking-tight">
                        Kolay Restaurant
                    </h1>
                    <p className="text-white/80 text-sm mt-1 font-semibold italic">
                        Where Every Meal Feels Right.
                    </p>
                </div>

                <div className="p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                            <LogIn className="w-5 h-5 text-secondary" /> Welcome Back
                        </h2>
                        <p className="text-charcoal/50 text-sm mt-1">
                            Sign in to access Specialties and member perks.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3 rounded-xl">
                                {error}
                            </div>
                        )}

                        {/* Username */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-charcoal/60 flex items-center gap-2">
                                <User className="w-3.5 h-3.5" /> Username
                            </label>
                            <input
                                type="text"
                                required
                                autoComplete="username"
                                placeholder="Your username"
                                className={inputCls}
                                value={form.username}
                                onChange={e => f('username', e.target.value)}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-charcoal/60 flex items-center gap-2">
                                <Lock className="w-3.5 h-3.5" /> Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className={inputCls}
                                    value={form.password}
                                    onChange={e => f('password', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-secondary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-secondary hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading
                                ? <><Loader2 className="w-5 h-5 animate-spin" /> Signing in…</>
                                : <><LogIn className="w-5 h-5" /> Sign In</>
                            }
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-charcoal/50">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-secondary font-bold hover:underline">
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="p-5 bg-bg-cream/30 border-t border-cream text-center">
                    <p className="text-xs text-charcoal/40">Powered by Kolay Management Platform</p>
                </div>
            </div>
        </div>
    );
};

export default CustomerLogin;
