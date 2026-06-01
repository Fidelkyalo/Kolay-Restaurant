import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, ChevronDown, ChevronUp, ArrowRight, Check, X, User, RefreshCw } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';

const getJobs = () => {
    try { return JSON.parse(localStorage.getItem('kolay_jobs') || '[]').filter(j => j.isOpen); }
    catch { return []; }
};

const getAccount = () => {
    try { return JSON.parse(localStorage.getItem('kolay_career_account') || 'null'); }
    catch { return null; }
};

// ── Steps for new applicants ──────────────────────────────────────────────────
const NEW_HIRE_QUESTIONS = [
    { key: 'whyKolay',       label: 'Why do you want to work at Kolay Restaurant?',                  type: 'textarea' },
    { key: 'experience',     label: 'Describe your relevant work experience.',                        type: 'textarea' },
    { key: 'availability',   label: 'What is your availability? (days/hours per week)',               type: 'text'     },
    { key: 'startDate',      label: 'Earliest start date',                                            type: 'date'     },
    { key: 'skills',         label: 'List your key skills relevant to this role.',                    type: 'textarea' },
    { key: 'references',     label: 'Provide at least one professional reference (name & contact).',  type: 'textarea' },
    { key: 'criminal',       label: 'Do you have any criminal convictions? (Yes / No + details)',     type: 'text'     },
    { key: 'rightToWork',    label: 'Do you have the right to work in Kenya?',                        type: 'text'     },
];

// ── Steps for contract renewal ────────────────────────────────────────────────
const RENEWAL_QUESTIONS = [
    { key: 'employeeId',     label: 'Your Employee ID',                                               type: 'text'     },
    { key: 'currentRole',    label: 'Your current role / position',                                   type: 'text'     },
    { key: 'yearsServed',    label: 'How many years have you been with Kolay Restaurant?',            type: 'number'   },
    { key: 'performance',    label: 'Briefly describe your key achievements in the last contract.',   type: 'textarea' },
    { key: 'goals',          label: 'What are your goals for the next contract period?',              type: 'textarea' },
    { key: 'concerns',       label: 'Any concerns or requests for the new contract?',                 type: 'textarea' },
    { key: 'availability',   label: 'Confirm your availability going forward.',                       type: 'text'     },
    { key: 'references',     label: 'Updated emergency contact (name & phone)',                       type: 'text'     },
];

export default function Careers() {
    const [jobs, setJobs] = useState(getJobs);
    const [expandedJob, setExpandedJob] = useState(null);
    const [account, setAccount] = useState(getAccount);

    // flow: null | 'choose' | 'register' | 'login' | 'apply' | 'renewal' | 'done'
    const [flow, setFlow] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [flowType, setFlowType] = useState(null); // 'new' | 'renewal'

    // Registration / login form
    const [authForm, setAuthForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    const [authError, setAuthError] = useState('');

    // Application answers
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const handler = () => setJobs(getJobs());
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, []);

    const openApply = (job) => {
        setSelectedJob(job);
        setFlow('choose');
        setAnswers({});
        setAuthError('');
    };

    const openRenewal = () => {
        setSelectedJob(null);
        setFlowType('renewal');
        if (account) { setFlow('renewal'); }
        else { setFlow('choose'); }
        setAnswers({});
        setAuthError('');
    };

    // ── Auth handlers ─────────────────────────────────────────────────────────
    const handleRegister = (e) => {
        e.preventDefault();
        if (authForm.password !== authForm.confirmPassword) { setAuthError('Passwords do not match.'); return; }
        if (authForm.password.length < 6) { setAuthError('Password must be at least 6 characters.'); return; }
        const existing = JSON.parse(localStorage.getItem('kolay_career_accounts') || '[]');
        if (existing.find(a => a.email === authForm.email)) { setAuthError('An account with this email already exists.'); return; }
        const newAcc = { id: Date.now(), name: authForm.name, email: authForm.email, phone: authForm.phone, password: authForm.password };
        localStorage.setItem('kolay_career_accounts', JSON.stringify([...existing, newAcc]));
        localStorage.setItem('kolay_career_account', JSON.stringify(newAcc));
        setAccount(newAcc);
        setFlow(flowType === 'renewal' ? 'renewal' : 'apply');
        setAuthError('');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const existing = JSON.parse(localStorage.getItem('kolay_career_accounts') || '[]');
        const found = existing.find(a => a.email === authForm.email && a.password === authForm.password);
        if (!found) { setAuthError('Invalid email or password.'); return; }
        localStorage.setItem('kolay_career_account', JSON.stringify(found));
        setAccount(found);
        setFlow(flowType === 'renewal' ? 'renewal' : 'apply');
        setAuthError('');
    };

    const handleLogout = () => {
        localStorage.removeItem('kolay_career_account');
        setAccount(null);
        setFlow(null);
    };

    // ── Submit application ────────────────────────────────────────────────────
    const handleSubmitApplication = (e) => {
        e.preventDefault();
        const apps = JSON.parse(localStorage.getItem('kolay_applications') || '[]');
        const newApp = {
            id: Date.now(),
            type: flowType,
            jobId: selectedJob?.id || null,
            fullName: account.name,
            email: account.email,
            phone: account.phone,
            answers,
            status: 'Pending',
            submittedAt: new Date().toISOString(),
        };
        localStorage.setItem('kolay_applications', JSON.stringify([...apps, newApp]));
        window.dispatchEvent(new Event('storage'));
        setSubmitted(true);
        setFlow('done');
    };

    const questions = flowType === 'renewal' ? RENEWAL_QUESTIONS : NEW_HIRE_QUESTIONS;

    // ── Helpers ───────────────────────────────────────────────────────────────
    const inputCls = 'w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl outline-none focus:border-[#E67E22]/50 text-sm font-semibold transition-colors';
    const labelCls = 'block text-[10px] font-black uppercase text-white/40 mb-2';

    return (
        <div className="min-h-screen bg-[#0D0A07] font-body text-white">
            <PublicNavbar />

            {/* Hero */}
            <section className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto text-center">
                <span className="inline-flex items-center gap-2 bg-[#E67E22]/15 border border-[#E67E22]/30 text-[#E67E22] px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.35em] mb-6">
                    <span className="w-1.5 h-1.5 bg-[#E67E22] rounded-full animate-pulse" /> Join Our Team
                </span>
                <h1 className="text-5xl md:text-6xl font-display font-black text-white mb-4">
                    Build Your Career<br /><span className="italic text-[#E67E22]">at Kolay</span>
                </h1>
                <p className="text-white/40 text-lg max-w-xl mx-auto mb-10">
                    We hire on 5-year contracts. Grow with us, be part of something exceptional.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <button onClick={openRenewal}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all">
                        <RefreshCw className="w-4 h-4" /> Renew My Contract
                    </button>
                    {account && (
                        <button onClick={handleLogout}
                            className="flex items-center gap-2 text-white/30 hover:text-white/60 text-xs font-bold transition-colors">
                            <User className="w-3.5 h-3.5" /> Signed in as {account.name} · Sign out
                        </button>
                    )}
                </div>
            </section>

            {/* Jobs List */}
            <section className="pb-32 px-6 md:px-12 max-w-5xl mx-auto">
                <h2 className="text-2xl font-display font-black text-white mb-8">
                    Open Positions <span className="text-white/20 text-lg font-normal">({jobs.length})</span>
                </h2>

                {jobs.length === 0 ? (
                    <div className="bg-white/3 border border-white/5 rounded-3xl p-16 text-center">
                        <Briefcase className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <p className="text-white/30 font-bold text-lg">No open positions right now</p>
                        <p className="text-white/20 text-sm mt-1">Check back soon or renew your existing contract above.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map(job => {
                            const isExp = expandedJob === job.id;
                            const isExpired = job.deadline && new Date(job.deadline) < new Date();
                            return (
                                <div key={job.id} className="bg-white/3 border border-white/5 hover:border-[#E67E22]/30 rounded-3xl overflow-hidden transition-all">
                                    <div className="flex items-center justify-between p-6 cursor-pointer" onClick={() => setExpandedJob(isExp ? null : job.id)}>
                                        <div>
                                            <div className="flex items-center gap-3 flex-wrap mb-1">
                                                <h3 className="font-black text-white text-lg">{job.title}</h3>
                                                <span className="text-[10px] font-black px-3 py-1 rounded-full bg-[#E67E22]/20 text-[#E67E22] uppercase">{job.type}</span>
                                                {isExpired && <span className="text-[10px] font-black px-3 py-1 rounded-full bg-white/10 text-white/40 uppercase">Deadline passed</span>}
                                            </div>
                                            <p className="text-white/40 text-sm flex items-center gap-3">
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.contractYears}-year contract</span>
                                                {job.department && <span>{job.department}</span>}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            {!isExpired && (
                                                <button onClick={e => { e.stopPropagation(); openApply(job); }}
                                                    className="flex items-center gap-2 bg-[#E67E22] hover:bg-[#D4A017] text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_#E67E2230]">
                                                    Apply <ArrowRight className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            {isExp ? <ChevronUp className="w-5 h-5 text-white/30" /> : <ChevronDown className="w-5 h-5 text-white/30" />}
                                        </div>
                                    </div>
                                    {isExp && (
                                        <div className="border-t border-white/5 p-6 space-y-5 bg-white/2">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-white/30 mb-2">About the Role</p>
                                                <p className="text-white/60 text-sm leading-relaxed">{job.description}</p>
                                            </div>
                                            {job.requirements && (
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-white/30 mb-2">Requirements</p>
                                                    <ul className="space-y-1">
                                                        {job.requirements.split('\n').filter(Boolean).map((r, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-white/60 text-sm">
                                                                <Check className="w-3.5 h-3.5 text-[#E67E22] mt-0.5 shrink-0" />{r}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {job.responsibilities && (
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-white/30 mb-2">Responsibilities</p>
                                                    <ul className="space-y-1">
                                                        {job.responsibilities.split('\n').filter(Boolean).map((r, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-white/60 text-sm">
                                                                <ArrowRight className="w-3.5 h-3.5 text-[#E67E22] mt-0.5 shrink-0" />{r}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {job.deadline && <p className="text-[11px] text-white/30">Application deadline: {new Date(job.deadline).toLocaleDateString()}</p>}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* ── MODAL OVERLAY ── */}
            {flow && flow !== 'done' && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0D0A07]/90 backdrop-blur-md" onClick={() => setFlow(null)} />
                    <div className="relative bg-[#1A1008] border border-white/5 rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-8 pb-0">
                            <h2 className="text-xl font-display font-black text-white">
                                {flow === 'choose' && 'How would you like to proceed?'}
                                {flow === 'register' && 'Create Your Account'}
                                {flow === 'login' && 'Sign In'}
                                {flow === 'apply' && `Apply — ${selectedJob?.title}`}
                                {flow === 'renewal' && 'Contract Renewal'}
                            </h2>
                            <button onClick={() => setFlow(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                                <X className="w-5 h-5 text-white/50" />
                            </button>
                        </div>

                        <div className="p-8">
                            {/* ── CHOOSE ── */}
                            {flow === 'choose' && (
                                <div className="space-y-4">
                                    <p className="text-white/40 text-sm mb-6">
                                        {flowType === 'renewal'
                                            ? 'To renew your contract, please sign in to your account.'
                                            : 'New applicants need to create an account first. Existing account holders can sign in.'}
                                    </p>
                                    {!account ? (
                                        <>
                                            <button onClick={() => { setFlowType(flowType || 'new'); setFlow('register'); }}
                                                className="w-full bg-[#E67E22] hover:bg-[#D4A017] text-white font-black py-4 rounded-2xl text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                                <User className="w-4 h-4" /> Create Account & Apply
                                            </button>
                                            <button onClick={() => { setFlowType(flowType || 'new'); setFlow('login'); }}
                                                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black py-4 rounded-2xl text-sm uppercase tracking-widest transition-all">
                                                Sign In to Existing Account
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={() => setFlow(flowType === 'renewal' ? 'renewal' : 'apply')}
                                            className="w-full bg-[#E67E22] hover:bg-[#D4A017] text-white font-black py-4 rounded-2xl text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                            Continue as {account.name} <ArrowRight className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* ── REGISTER ── */}
                            {flow === 'register' && (
                                <form onSubmit={handleRegister} className="space-y-4">
                                    {authError && <p className="text-red-400 text-sm font-bold bg-red-400/10 px-4 py-3 rounded-xl">{authError}</p>}
                                    {[
                                        { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
                                        { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
                                        { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+254 ...' },
                                        { key: 'password', label: 'Password', type: 'password', placeholder: 'Min. 6 characters' },
                                        { key: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' },
                                    ].map(f => (
                                        <div key={f.key}>
                                            <label className={labelCls}>{f.label}</label>
                                            <input required type={f.type} placeholder={f.placeholder} className={inputCls}
                                                value={authForm[f.key]} onChange={e => setAuthForm({ ...authForm, [f.key]: e.target.value })} />
                                        </div>
                                    ))}
                                    <button type="submit" className="w-full bg-[#E67E22] hover:bg-[#D4A017] text-white font-black py-4 rounded-2xl text-sm uppercase tracking-widest transition-all mt-2">
                                        Create Account
                                    </button>
                                    <button type="button" onClick={() => setFlow('login')} className="w-full text-white/30 hover:text-white/60 text-xs font-bold transition-colors py-2">
                                        Already have an account? Sign in
                                    </button>
                                </form>
                            )}

                            {/* ── LOGIN ── */}
                            {flow === 'login' && (
                                <form onSubmit={handleLogin} className="space-y-4">
                                    {authError && <p className="text-red-400 text-sm font-bold bg-red-400/10 px-4 py-3 rounded-xl">{authError}</p>}
                                    {[
                                        { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
                                        { key: 'password', label: 'Password', type: 'password', placeholder: 'Your password' },
                                    ].map(f => (
                                        <div key={f.key}>
                                            <label className={labelCls}>{f.label}</label>
                                            <input required type={f.type} placeholder={f.placeholder} className={inputCls}
                                                value={authForm[f.key]} onChange={e => setAuthForm({ ...authForm, [f.key]: e.target.value })} />
                                        </div>
                                    ))}
                                    <button type="submit" className="w-full bg-[#E67E22] hover:bg-[#D4A017] text-white font-black py-4 rounded-2xl text-sm uppercase tracking-widest transition-all mt-2">
                                        Sign In
                                    </button>
                                    <button type="button" onClick={() => setFlow('register')} className="w-full text-white/30 hover:text-white/60 text-xs font-bold transition-colors py-2">
                                        No account yet? Create one
                                    </button>
                                </form>
                            )}

                            {/* ── APPLICATION / RENEWAL FORM ── */}
                            {(flow === 'apply' || flow === 'renewal') && (
                                <form onSubmit={handleSubmitApplication} className="space-y-5">
                                    <div className="bg-[#E67E22]/10 border border-[#E67E22]/20 rounded-2xl px-4 py-3 text-sm text-[#E67E22] font-bold mb-2">
                                        Applying as: {account?.name} ({account?.email})
                                    </div>
                                    {questions.map(q => (
                                        <div key={q.key}>
                                            <label className={labelCls}>{q.label}</label>
                                            {q.type === 'textarea' ? (
                                                <textarea required rows={3} className={`${inputCls} resize-none`}
                                                    value={answers[q.label] || ''}
                                                    onChange={e => setAnswers({ ...answers, [q.label]: e.target.value })} />
                                            ) : (
                                                <input required type={q.type} className={inputCls}
                                                    value={answers[q.label] || ''}
                                                    onChange={e => setAnswers({ ...answers, [q.label]: e.target.value })} />
                                            )}
                                        </div>
                                    ))}
                                    <button type="submit" className="w-full bg-[#E67E22] hover:bg-[#D4A017] text-white font-black py-4 rounded-2xl text-sm uppercase tracking-widest transition-all active:scale-95 mt-2">
                                        Submit {flow === 'renewal' ? 'Renewal Request' : 'Application'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── SUCCESS ── */}
            {flow === 'done' && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0D0A07]/90 backdrop-blur-md" onClick={() => setFlow(null)} />
                    <div className="relative bg-[#1A1008] border border-white/5 rounded-[2.5rem] p-12 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-[#E67E22] rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-[0_0_40px_#E67E2250]">
                            <Check className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-display font-black text-white mb-3">
                            {flowType === 'renewal' ? 'Renewal Submitted!' : 'Application Sent!'}
                        </h2>
                        <p className="text-white/40 text-sm leading-relaxed mb-8">
                            {flowType === 'renewal'
                                ? 'Your contract renewal request has been received. Our HR team will be in touch shortly.'
                                : 'Your application has been received. We will review it and get back to you.'}
                        </p>
                        <button onClick={() => setFlow(null)}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black w-full py-4 rounded-xl text-[10px] uppercase tracking-widest transition-colors">
                            Back to Careers
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
