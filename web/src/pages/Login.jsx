import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Lock, User, Eye, EyeOff, Loader2, Shield, Users } from 'lucide-react';
import { setRole } from '../hooks/useRole';

// Hardcoded credentials — in production these would come from the backend
const CREDENTIALS = {
    admin: { username: 'Kolay Admin', password: 'Kolayadmin@123' },
    staff: { username: 'Kolay Staff', password: 'Staff_123' },
};

const Login = () => {
    const [portal, setPortal] = useState('admin'); // 'admin' | 'staff'
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        setTimeout(() => {
            const creds = CREDENTIALS[portal];
            if (
                formData.username.trim() === creds.username &&
                formData.password === creds.password
            ) {
                setRole(portal);
                localStorage.setItem('kolay_auth_user', JSON.stringify({ username: formData.username, role: portal }));
                navigate('/dashboard');
            } else {
                setError('Invalid username or password.');
            }
            setIsLoading(false);
        }, 600);
    };

    const portalConfig = {
        admin: { label: 'Admin Portal', icon: Shield, color: 'bg-primary', hint: 'Full access to all features' },
        staff: { label: 'Staff Portal', icon: Users, color: 'bg-secondary', hint: 'Operational access only' },
    };

    const active = portalConfig[portal];

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-cream p-4 font-body">
            <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />

            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-cream/50 relative z-10">
                {/* Header */}
                <div className={`p-8 text-center ${active.color} transition-colors duration-300`}>
                    <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-2xl shadow-lg mb-4">
                        <ChefHat className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white tracking-tight">KOLAY</h1>
                    <p className="text-white/70 text-sm mt-1">Restaurant Management System</p>
                </div>

                <div className="p-8">
                    {/* Portal Toggle */}
                    <div className="flex bg-bg-cream p-1.5 rounded-2xl mb-8 gap-1">
                        {Object.entries(portalConfig).map(([key, cfg]) => {
                            const Icon = cfg.icon;
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => { setPortal(key); setError(''); setFormData({ username: '', password: '' }); }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${portal === key ? `${key === 'admin' ? 'bg-primary' : 'bg-secondary'} text-white shadow-lg` : 'text-charcoal/40 hover:text-primary'}`}
                                >
                                    <Icon className="w-3.5 h-3.5" /> {cfg.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-primary">Welcome Back</h2>
                        <p className="text-charcoal/50 text-sm">{active.hint}</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
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
                                autoComplete="username"
                                className="w-full px-4 py-3 bg-bg-cream/50 border border-cream rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none font-semibold"
                                placeholder="Username"
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-charcoal/70 flex items-center gap-2">
                                <Lock className="w-4 h-4" /> Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="current-password"
                                    className="w-full px-4 py-3 bg-bg-cream/50 border border-cream rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none font-semibold"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-secondary transition-colors">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full ${portal === 'admin' ? 'bg-primary hover:bg-primary-dark' : 'bg-secondary hover:bg-orange-600'} text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Sign in to ${active.label}`}
                        </button>
                    </form>

                    {/* Demo credentials hint removed */}
                </div>

                <div className="p-6 bg-bg-cream/30 border-t border-cream flex justify-center">
                    <p className="text-xs text-charcoal/40">Powered by Kolay Management Platform</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
