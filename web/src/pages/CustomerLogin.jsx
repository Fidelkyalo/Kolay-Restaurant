import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ChefHat, Lock, User, Eye, EyeOff, Loader2,
    LogIn, ArrowLeft, WifiOff, AtSign
} from 'lucide-react';
import { AuthService } from '../services/api';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

// Simple browser-native password hash using Web Crypto API (SHA-256)
async function hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Detect if the identifier looks like an email address
const isEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

// Look up a member by email or username and return their username
const resolveUsername = (identifier) => {
    try {
        const members = JSON.parse(localStorage.getItem('kolay_members') || '[]');
        const lower = identifier.trim().toLowerCase();
        const member = members.find(m =>
            m.username?.toLowerCase() === lower ||
            m.email?.toLowerCase() === lower
        );
        return member?.username || null;
    } catch { return null; }
};

const CustomerLogin = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [form, setForm] = useState({ identifier: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [offlineSuccess, setOfflineSuccess] = useState(false);

    const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    // Try to sign in using the locally stored member record (offline fallback)
    // Accepts either username or email as identifier
    const tryLocalLogin = async (identifier, password) => {
        try {
            const members = JSON.parse(localStorage.getItem('kolay_members') || '[]');
            const lower = identifier.trim().toLowerCase();
            const member = members.find(m =>
                m.username?.toLowerCase() === lower ||
                m.email?.toLowerCase() === lower
            );
            if (!member) return false;
            if (!member.passwordHash) return false; // no local hash stored — can't verify
            const hash = await hashPassword(password);
            if (hash !== member.passwordHash) return false;

            // Credentials match — create a local session
            const localUser = {
                id: member.id || Date.now(),
                username: member.username,
                fullName: member.fullName || '',
                email: member.email || '',
                phone: member.phone || '',
                birthdayDate: member.birthdayDate || '',
                roles: member.roles || ['ROLE_USER'],
            };
            localStorage.setItem('kolay_auth_user', JSON.stringify(localUser));
            localStorage.setItem('kolay_staff_name', member.username);
            window.dispatchEvent(new Event('storage'));
            return true;
        } catch { return false; }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const identifier = form.identifier.trim();
        if (!identifier) { setError('Username or email is required.'); return; }
        if (!form.password) { setError('Password is required.'); return; }

        // If the user typed an email, try to resolve it to a username for the backend call.
        // The backend only accepts username, so we look up locally first.
        let usernameForApi = identifier;
        if (isEmail(identifier)) {
            const resolved = resolveUsername(identifier);
            if (resolved) usernameForApi = resolved;
            // If not found locally, still pass the email — maybe the backend can handle it
        }

        setIsLoading(true);
        try {
            const res = await AuthService.login({
                username: usernameForApi,
                password: form.password,
            });

            const userData = res.data;
            const normalizedUser = {
                ...userData,
                accessToken: userData.token || userData.accessToken,
            };
            localStorage.setItem('kolay_auth_user', JSON.stringify(normalizedUser));
            localStorage.setItem('kolay_staff_name', userData.username);
            window.dispatchEvent(new Event('storage'));
            navigate('/order');
        } catch (err) {
            console.error('Login error:', err);
            const isTimeout = err.code === 'ECONNABORTED' || err.message?.includes('timeout');
            const serverMsg = err?.response?.data?.message;
            const status = err?.response?.status;

            // 401/400 from server = wrong credentials — don't attempt local fallback
            if (status === 401 || status === 400) {
                setError('Invalid username/email or password.');
                setIsLoading(false);
                return;
            }

            // Server unreachable — try local session (works with both username and email)
            if (!err.response || isTimeout) {
                const ok = await tryLocalLogin(identifier, form.password);
                if (ok) {
                    setOfflineSuccess(true);
                    setTimeout(() => navigate('/order'), 800);
                    setIsLoading(false);
                    return;
                }
                setError(
                    'Cannot reach the server and no offline profile was found. ' +
                    'Please check your connection, or create an account first.'
                );
                setIsLoading(false);
                return;
            }

            setError(serverMsg || 'Sign in failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const inputCls =
        'w-full px-4 py-3.5 bg-bg-cream/50 border border-cream rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none font-semibold text-sm';

    // Determine which icon to show based on what the user is typing
    const identifierIcon = isEmail(form.identifier)
        ? <AtSign className="w-3.5 h-3.5" />
        : <User className="w-3.5 h-3.5" />;

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
                        {t('Kolay Restaurant')}
                    </h1>
                    <p className="text-white/80 text-sm mt-1 font-semibold italic">
                        {t('Where Every Meal Feels Right.')}
                    </p>
                    <span className="inline-flex items-center gap-1.5 mt-3 bg-white/20 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-white rounded-full" /> {t('login_title')}
                    </span>
                </div>

                <div className="p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                            <LogIn className="w-5 h-5 text-secondary" /> {t('Welcome Back')}
                        </h2>
                        <p className="text-charcoal/50 text-sm mt-1">
                            {t('login_subtitle')}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Offline success notice */}
                        {offlineSuccess && (
                            <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
                                <WifiOff className="w-4 h-4 shrink-0" />
                                Signed in offline. Redirecting…
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3 rounded-xl">
                                {error}
                            </div>
                        )}

                        {/* Username or Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-charcoal/60 flex items-center gap-2">
                                {identifierIcon} Username or Email
                            </label>
                            <input
                                type="text"
                                required
                                autoComplete="username email"
                                placeholder="Your username or email address"
                                className={inputCls}
                                value={form.identifier}
                                onChange={e => f('identifier', e.target.value)}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-charcoal/60 flex items-center gap-2">
                                <Lock className="w-3.5 h-3.5" /> {t('login_password')}
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
                            disabled={isLoading || offlineSuccess}
                            className="w-full bg-secondary hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading
                                ? <><Loader2 className="w-5 h-5 animate-spin" /> {t('Signing in…')}</>
                                : <><LogIn className="w-5 h-5" /> {t('nav_sign_in')}</>
                            }
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-charcoal/50">
                            {t('login_no_account')}{' '}
                            <Link to="/register" className="text-secondary font-bold hover:underline">
                                {t('nav_create_account')}
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="p-5 bg-bg-cream/30 border-t border-cream flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-charcoal/40">{t('Powered by Kolay Management Platform')}</p>
                    <LanguageSelector variant="light" />
                </div>
            </div>
        </div>
    );
};

export default CustomerLogin;
