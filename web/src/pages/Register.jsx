import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ChefHat, User, Mail, Lock, Eye, EyeOff, Loader2,
    CheckCircle2, ArrowLeft, UserPlus
} from 'lucide-react';
import { AuthService } from '../services/api';
import { setRole } from '../hooks/useRole';

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const validate = () => {
        if (!form.username.trim()) return 'Username is required.';
        if (form.username.trim().length < 3) return 'Username must be at least 3 characters.';
        if (!form.email.trim()) return 'Email is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address.';
        if (!form.password) return 'Password is required.';
        if (form.password.length < 6) return 'Password must be at least 6 characters.';
        if (form.password !== form.confirm) return 'Passwords do not match.';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const validationError = validate();
        if (validationError) { setError(validationError); return; }

        setIsLoading(true);
        try {
            // Register the account (defaults to CUSTOMER role)
            await AuthService.signup({
                username: form.username.trim(),
                email: form.email.trim(),
                password: form.password,
            });

            // Auto sign-in after registration
            const loginRes = await AuthService.login({
                username: form.username.trim(),
                password: form.password,
            });

            const userData = loginRes.data;
            localStorage.setItem('kolay_auth_user', JSON.stringify(userData));
            localStorage.setItem('kolay_staff_name', userData.username);

            // Set role based on what the backend returned
            const isAdmin = userData.roles?.includes('ROLE_ADMIN');
            setRole(isAdmin ? 'admin' : 'staff');

            setSuccess(true);
            setTimeout(() => navigate('/order'), 1800);
        } catch (err) {
            const isTimeout = err.code === 'ECONNABORTED' || err.message?.includes('timeout');
            const serverMsg = err?.response?.data?.message;
            const msg = isTimeout
                ? 'The server is taking too long to respond. Please try again in a moment.'
                : serverMsg || 'Registration failed. Please try again.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const inputCls = 'w-full px-4 py-3.5 bg-bg-cream/50 border border-cream rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none font-semibold text-sm';

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-cream p-4 font-body">
                <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-12 text-center border border-cream/50">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-primary mb-2">Account Created!</h2>
                    <p className="text-charcoal/50 text-sm mb-2">Welcome, <strong>{form.username}</strong>.</p>
                    <p className="text-charcoal/40 text-xs">Redirecting you to the menu…</p>
                </div>
            </div>
        );
    }

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
                            <UserPlus className="w-5 h-5 text-secondary" /> Join Kolay
                        </h2>
                        <p className="text-charcoal/50 text-sm mt-1">
                            Get access to exclusive specialties and member discounts.
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
                                placeholder="e.g. john_doe"
                                className={inputCls}
                                value={form.username}
                                onChange={e => f('username', e.target.value)}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-charcoal/60 flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5" /> Email Address
                            </label>
                            <input
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="you@example.com"
                                className={inputCls}
                                value={form.email}
                                onChange={e => f('email', e.target.value)}
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
                                    autoComplete="new-password"
                                    placeholder="Min. 6 characters"
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

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-charcoal/60 flex items-center gap-2">
                                <Lock className="w-3.5 h-3.5" /> Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    required
                                    autoComplete="new-password"
                                    placeholder="Repeat your password"
                                    className={inputCls}
                                    value={form.confirm}
                                    onChange={e => f('confirm', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-secondary transition-colors"
                                >
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {/* Password match indicator */}
                            {form.confirm && (
                                <p className={`text-xs font-bold mt-1 ${form.password === form.confirm ? 'text-green-600' : 'text-red-500'}`}>
                                    {form.password === form.confirm ? '✓ Passwords match' : '✗ Passwords do not match'}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-secondary hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading
                                ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating account…</>
                                : <><UserPlus className="w-5 h-5" /> Create Account</>
                            }
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-charcoal/50">
                            Already have an account?{' '}
                            <Link to="/login" className="text-secondary font-bold hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="p-5 bg-bg-cream/30 border-t border-cream text-center">
                    <p className="text-xs text-charcoal/40">
                        By creating an account you agree to our{' '}
                        <span className="text-secondary font-bold cursor-pointer hover:underline">Terms of Service</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
