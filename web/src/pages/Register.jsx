import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ChefHat, User, Mail, Lock, Eye, EyeOff, Loader2,
    CheckCircle2, ArrowLeft, UserPlus, Shield, FileText, CheckSquare, X, ExternalLink, Sparkles
} from 'lucide-react';
import { AuthService } from '../services/api';
import { setRole } from '../hooks/useRole';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Checkbox agreement states
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreePrivacy, setAgreePrivacy] = useState(false);
    const [showPolicyModal, setShowPolicyModal] = useState(false);
    const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'terms' | 'privacy'

    const { t } = useLanguage();

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

    const handleInitialSubmit = (e) => {
        e.preventDefault();
        setError('');
        const validationError = validate();
        if (validationError) { setError(validationError); return; }

        if (!agreeTerms || !agreePrivacy) {
            setShowPolicyModal(true);
            return;
        }

        executeRegistration();
    };

    const executeRegistration = async () => {
        setIsLoading(true);
        setShowPolicyModal(false);
        try {
            // Step 1: Register the account (defaults to CUSTOMER role)
            await AuthService.signup({
                username: form.username.trim(),
                email: form.email.trim(),
                password: form.password,
            });

            // Step 2: Auto sign-in
            try {
                const loginRes = await AuthService.login({
                    username: form.username.trim(),
                    password: form.password,
                });

                const userData = loginRes.data;
                const normalizedUser = {
                    ...userData,
                    accessToken: userData.token || userData.accessToken,
                };
                localStorage.setItem('kolay_auth_user', JSON.stringify(normalizedUser));
                localStorage.setItem('kolay_staff_name', userData.username);

                const isAdmin = userData.roles?.includes('ROLE_ADMIN');
                setRole(isAdmin ? 'admin' : 'staff');
            } catch (loginErr) {
                console.warn('Auto-login after registration failed:', loginErr?.message);
            }

            setSuccess(true);
            setTimeout(() => navigate('/order'), 1800);

        } catch (err) {
            console.error('Registration error:', err);
            const isTimeout = err.code === 'ECONNABORTED' || err.message?.includes('timeout');
            const serverMsg = err?.response?.data?.message;
            const status = err?.response?.status;

            let msg;
            if (isTimeout) {
                msg = 'The server is taking too long to respond. Please try again in a moment.';
            } else if (status === 400 && serverMsg) {
                msg = serverMsg;
                if (serverMsg.includes('already taken') || serverMsg.includes('already in use')) {
                    msg += ' Try signing in instead.';
                }
            } else if (!err.response) {
                msg = 'Cannot connect to server. Please check your internet connection.';
            } else {
                msg = serverMsg || 'Registration failed. Please try again.';
            }
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
                    <h2 className="text-2xl font-display font-bold text-primary mb-2">{t('Account Created!')}</h2>
                    <p className="text-charcoal/50 text-sm mb-2">Welcome, <strong>{form.username}</strong>.</p>
                    <p className="text-charcoal/40 text-xs">{t('Redirecting you to the menu')}</p>
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
                        {t('Where Every Meal Feels Right')}
                    </p>
                </div>

                <div className="p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-secondary" /> {t('Join Kolay')}
                        </h2>
                        <p className="text-charcoal/50 text-sm mt-1">
                            {t('Get access to exclusive specialties and member discounts.')}
                        </p>
                    </div>

                    <form onSubmit={handleInitialSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3 rounded-xl">
                                {error}
                            </div>
                        )}

                        {/* Username */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-charcoal/60 flex items-center gap-2">
                                <User className="w-3.5 h-3.5" /> {t('register_username')}
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
                                <Mail className="w-3.5 h-3.5" /> {t('register_email')}
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
                                <Lock className="w-3.5 h-3.5" /> {t('register_password')}
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
                                <Lock className="w-3.5 h-3.5" /> {t('register_confirm')}
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
                            {form.confirm && (
                                <p className={`text-xs font-bold mt-1 ${form.password === form.confirm ? 'text-green-600' : 'text-red-500'}`}>
                                    {form.password === form.confirm ? '✓ Passwords match' : '✗ Passwords do not match'}
                                </p>
                            )}
                        </div>

                        {/* Explicit Agreement Checkboxes */}
                        <div className="pt-2 space-y-2.5 bg-bg-cream/40 p-4 rounded-xl border border-cream/80">
                            <label className="flex items-start gap-2.5 cursor-pointer text-xs font-semibold text-charcoal/80">
                                <input
                                    type="checkbox"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                    className="mt-0.5 accent-[#E67E22] w-4 h-4 rounded"
                                />
                                <span>
                                    I have read and agree to the{' '}
                                    <button
                                        type="button"
                                        onClick={() => { setActiveTab('terms'); setShowPolicyModal(true); }}
                                        className="text-secondary font-bold hover:underline"
                                    >
                                        Terms of Use
                                    </button>
                                </span>
                            </label>

                            <label className="flex items-start gap-2.5 cursor-pointer text-xs font-semibold text-charcoal/80">
                                <input
                                    type="checkbox"
                                    checked={agreePrivacy}
                                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                                    className="mt-0.5 accent-[#E67E22] w-4 h-4 rounded"
                                />
                                <span>
                                    I have read and agree to the{' '}
                                    <button
                                        type="button"
                                        onClick={() => { setActiveTab('privacy'); setShowPolicyModal(true); }}
                                        className="text-secondary font-bold hover:underline"
                                    >
                                        Privacy Policy
                                    </button>
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-secondary hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading
                                ? <><Loader2 className="w-5 h-5 animate-spin" /> {t('Creating account…')}</>
                                : <><UserPlus className="w-5 h-5" /> {t('register_btn')}</>
                            }
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-charcoal/50">
                            {t('register_have_account')}{' '}
                            <Link to="/customer-login" className="text-secondary font-bold hover:underline">
                                {t('register_sign_in')}
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="p-5 bg-bg-cream/30 border-t border-cream flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-charcoal/50">
                        First-time registration requires policy agreement.
                    </p>
                    <LanguageSelector variant="light" />
                </div>
            </div>

            {/* First-Time Registration Terms & Privacy Onboarding Modal */}
            {showPolicyModal && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-[#0D0A07]/85 backdrop-blur-md" onClick={() => setShowPolicyModal(false)} />
                    
                    <div className="relative bg-[#1A1008] border border-[#E67E22]/30 rounded-[2.5rem] p-6 sm:p-8 max-w-xl w-full text-left shadow-2xl z-10 flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-[#E67E22]/20 border border-[#E67E22]/30 flex items-center justify-center text-[#E67E22]">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-display font-black text-white">First-Time Guest Agreement</h3>
                                    <p className="text-white/40 text-xs font-medium">Please review and check both agreements to continue</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowPolicyModal(false)}
                                className="p-2 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex gap-2 p-1 bg-white/5 rounded-xl mb-4 text-xs font-bold">
                            <button
                                onClick={() => setActiveTab('summary')}
                                className={`flex-1 py-2 rounded-lg transition-colors ${activeTab === 'summary' ? 'bg-[#E67E22] text-white' : 'text-white/60 hover:text-white'}`}
                            >
                                Summary Checklist
                            </button>
                            <button
                                onClick={() => setActiveTab('terms')}
                                className={`flex-1 py-2 rounded-lg transition-colors ${activeTab === 'terms' ? 'bg-[#E67E22] text-white' : 'text-white/60 hover:text-white'}`}
                            >
                                Terms of Use
                            </button>
                            <button
                                onClick={() => setActiveTab('privacy')}
                                className={`flex-1 py-2 rounded-lg transition-colors ${activeTab === 'privacy' ? 'bg-[#E67E22] text-white' : 'text-white/60 hover:text-white'}`}
                            >
                                Privacy Policy
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar text-xs text-white/70">
                            {activeTab === 'summary' && (
                                <div className="space-y-3">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                                        <div className="flex items-center gap-2 text-[#E67E22] font-bold text-sm">
                                            <FileText className="w-4 h-4" /> Key Terms Summary
                                        </div>
                                        <ul className="space-y-1.5 text-white/60 pl-2">
                                            <li className="flex items-start gap-2"><Sparkles className="w-3 h-3 text-[#E67E22] shrink-0 mt-0.5" /> All order prices are listed in KES and include 16% VAT.</li>
                                            <li className="flex items-start gap-2"><Sparkles className="w-3 h-3 text-[#E67E22] shrink-0 mt-0.5" /> Registered members receive 10% off seasonal menu specialties.</li>
                                            <li className="flex items-start gap-2"><Sparkles className="w-3 h-3 text-[#E67E22] shrink-0 mt-0.5" /> Table reservations are held for a max 15-minute grace period.</li>
                                        </ul>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                                        <div className="flex items-center gap-2 text-[#E67E22] font-bold text-sm">
                                            <Shield className="w-4 h-4" /> Privacy Guarantee
                                        </div>
                                        <ul className="space-y-1.5 text-white/60 pl-2">
                                            <li className="flex items-start gap-2"><Sparkles className="w-3 h-3 text-[#E67E22] shrink-0 mt-0.5" /> Guest contact info is used strictly for food delivery & reservations.</li>
                                            <li className="flex items-start gap-2"><Sparkles className="w-3 h-3 text-[#E67E22] shrink-0 mt-0.5" /> Browser local storage caches language choices & active cart items.</li>
                                            <li className="flex items-start gap-2"><Sparkles className="w-3 h-3 text-[#E67E22] shrink-0 mt-0.5" /> We NEVER sell or share personal guest data with 3rd-party marketers.</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'terms' && (
                                <div className="space-y-3">
                                    <h4 className="font-bold text-white text-sm">Terms of Use Highlights</h4>
                                    <p>By registering, you agree to Kolay Restaurant's dining and digital service terms. All menu orders are processed subject to culinary item availability. Registered members get 10% off specialties.</p>
                                    <p>Staff & Admin portals are strictly reserved for authorized Kolay personnel.</p>
                                    <Link to="/terms-of-use" target="_blank" className="inline-flex items-center gap-1 text-[#E67E22] font-bold hover:underline">
                                        Open Full Terms of Use Page <ExternalLink className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            )}

                            {activeTab === 'privacy' && (
                                <div className="space-y-3">
                                    <h4 className="font-bold text-white text-sm">Privacy Policy Highlights</h4>
                                    <p>Kolay Restaurant respects guest privacy. We collect guest contact details, order preferences, and table reservation info to provide seamless hospitality.</p>
                                    <p>All authentication tokens and user preferences are cached securely in Local Storage.</p>
                                    <Link to="/privacy-policy" target="_blank" className="inline-flex items-center gap-1 text-[#E67E22] font-bold hover:underline">
                                        Open Full Privacy Policy Page <ExternalLink className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Interactive Required Checkboxes */}
                        <div className="pt-4 mt-4 border-t border-white/10 space-y-3">
                            <label className="flex items-start gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 cursor-pointer transition-colors">
                                <input
                                    type="checkbox"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                    className="mt-1 accent-[#E67E22] w-4 h-4 rounded shrink-0"
                                />
                                <div className="text-xs">
                                    <span className="font-bold text-white block">I accept the Terms of Use</span>
                                    <span className="text-white/40">Includes pricing, VAT, reservation rules, and ordering policies.</span>
                                </div>
                            </label>

                            <label className="flex items-start gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 cursor-pointer transition-colors">
                                <input
                                    type="checkbox"
                                    checked={agreePrivacy}
                                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                                    className="mt-1 accent-[#E67E22] w-4 h-4 rounded shrink-0"
                                />
                                <div className="text-xs">
                                    <span className="font-bold text-white block">I accept the Privacy Policy</span>
                                    <span className="text-white/40">Includes guest data handling, local cart caching, and security.</span>
                                </div>
                            </label>

                            <button
                                onClick={executeRegistration}
                                disabled={!agreeTerms || !agreePrivacy || isLoading}
                                className="w-full bg-[#E67E22] hover:bg-[#D4A017] text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</>
                                ) : (
                                    <><CheckSquare className="w-4 h-4" /> Agree & Complete Account Creation</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;
