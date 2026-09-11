import React, { useState, useEffect } from 'react';
import {
    User, LogOut, Calendar, ShoppingBag, Star, ArrowLeft,
    Clock, Users, CheckCircle2, XCircle, Clock3,
    BookOpen, Utensils, TrendingUp, Zap, Gift, QrCode,
    ChevronUp, ChevronDown, History, ArrowDownCircle, ArrowUpCircle, ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import {
    getLoyaltyRecord, awardPoints, redeemPoints,
    getTier, TIERS, REDEEM, EARN_RATES, ptsToKES, canRedeem,
    redeemQRUrl, seedWelcomePtsToAllMembers
} from '../utils/loyaltyUtils';

// ── helpers ───────────────────────────────────────────────────────────────────
const getCustomer = () => {
    try {
        const u = JSON.parse(localStorage.getItem('kolay_auth_user'));
        return u && u.username ? u : null;
    } catch { return null; }
};

const STATUS_CFG = {
    PENDING:   { cls: 'bg-amber-500/10 text-amber-300 border-amber-500/20', icon: <Clock3 className="w-3 h-3" />,       label: 'Pending' },
    CONFIRMED: { cls: 'bg-green-500/10 text-green-300 border-green-500/20', icon: <CheckCircle2 className="w-3 h-3" />, label: 'Confirmed' },
    CANCELLED: { cls: 'bg-red-500/10 text-red-400 border-red-500/20',       icon: <XCircle className="w-3 h-3" />,      label: 'Cancelled' },
    COMPLETED: { cls: 'bg-blue-500/10 text-blue-300 border-blue-500/20',    icon: <CheckCircle2 className="w-3 h-3" />, label: 'Completed' },
};

const ORDER_STATUS = {
    PENDING:   { cls: 'bg-amber-500/10 text-amber-300 border-amber-500/20', label: 'Pending' },
    PREPARING: { cls: 'bg-blue-500/10 text-blue-300 border-blue-500/20',    label: 'Preparing' },
    READY:     { cls: 'bg-green-500/10 text-green-300 border-green-500/20', label: 'Ready' },
    DELIVERED: { cls: 'bg-white/5 text-white/40 border-white/10',           label: 'Delivered' },
};

// ── Real scannable QR via qrserver.com API ────────────────────────────────
function LoyaltyQR({ username, points, tier }) {
    const [url, setUrl] = useState('');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Build the redemption URL the QR encodes
        try {
            const redeemUrl = redeemQRUrl(username, points);
            const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(redeemUrl)}&size=180x180&bgcolor=1a0e08&color=E67E22&margin=8&format=png`;
            setUrl(qrApiUrl);
        } catch {
            setUrl('');
        }
    }, [username, points]);

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-[#1a0e08] rounded-2xl border border-[#E67E22]/30 shadow-[0_0_30px_#E67E2220] w-[196px] h-[196px] flex items-center justify-center">
                {url ? (
                    <>
                        {!loaded && (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-2 border-[#E67E22]/30 border-t-[#E67E22] rounded-full animate-spin" />
                                <p className="text-white/20 text-[10px]">Generating QR…</p>
                            </div>
                        )}
                        <img
                            src={url}
                            alt="Loyalty QR Code"
                            className={`rounded-lg transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0 w-0 h-0'}`}
                            style={{ width: 180, height: 180 }}
                            onLoad={() => setLoaded(true)}
                            onError={() => setLoaded(true)}
                        />
                    </>
                ) : (
                    <div className="text-white/20 text-xs text-center px-3">QR unavailable offline</div>
                )}
            </div>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Scan to Redeem at Restaurant</p>
            <div className="text-center">
                <p className="text-[#E67E22] font-black text-sm">{username}</p>
                <p className="text-white/40 text-xs">{tier.icon} {tier.name} · {points.toLocaleString()} pts</p>
                <p className="text-white/20 text-[9px] italic mt-1">Deliciously Earned</p>
            </div>
        </div>
    );
}

// ── Tier progress bar ─────────────────────────────────────────────────────────
function TierProgress({ lifetime }) {
    const tier = getTier(lifetime);
    const tierIdx = TIERS.findIndex(t => t.name === tier.name);
    const nextTier = TIERS[tierIdx + 1];
    const progress = nextTier
        ? Math.min(100, ((lifetime - tier.min) / (nextTier.min - tier.min)) * 100)
        : 100;

    return (
        <div className={`rounded-2xl p-5 border ${tier.bg} ${tier.border}`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{tier.icon}</span>
                    <div>
                        <p className={`font-black text-sm ${tier.text}`}>{tier.name}</p>
                        <p className="text-white/30 text-[10px]">{lifetime.toLocaleString()} lifetime pts</p>
                    </div>
                </div>
                {nextTier && (
                    <div className="text-right">
                        <p className="text-white/30 text-[10px]">Next tier</p>
                        <p className="text-white/50 text-xs font-black">{nextTier.icon} {nextTier.name}</p>
                        <p className="text-white/25 text-[10px]">{(nextTier.min - lifetime).toLocaleString()} pts away</p>
                    </div>
                )}
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${progress}%`, background: tier.color }}
                />
            </div>
            {!nextTier && (
                <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${tier.text}`}>
                    💎 Maximum tier reached!
                </p>
            )}
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Profile() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const customer = getCustomer();

    useEffect(() => {
        if (!customer) navigate('/customer-login', { replace: true });
    }, []);

    const [bookings, setBookings] = useState([]);
    const [orders, setOrders] = useState([]);
    const [myRating, setMyRating] = useState(null);
    const [loyalty, setLoyalty] = useState({ balance: 0, lifetime: 0, history: [] });
    const [activeTab, setActiveTab] = useState('overview');
    const [redeemInput, setRedeemInput] = useState(100);
    const [redeemMsg, setRedeemMsg] = useState(null); // { ok, text }

    const loadLoyalty = () => {
        if (customer) setLoyalty(getLoyaltyRecord(customer.username));
    };

    useEffect(() => {
        if (!customer) return;

        // Reservations
        try {
            const all = JSON.parse(localStorage.getItem('kolay_reservations_local') || '[]');
            setBookings(all.filter(r =>
                r.username?.toLowerCase() === customer.username.toLowerCase() ||
                r.guestName?.toLowerCase() === customer.username.toLowerCase() ||
                (customer.email && r.email?.toLowerCase() === customer.email.toLowerCase())
            ).sort((a, b) => new Date(b.createdAt || b.reservationDate) - new Date(a.createdAt || a.reservationDate)));
        } catch { setBookings([]); }

        // Orders
        try {
            const all = JSON.parse(localStorage.getItem('kolay_orders') || '[]');
            setOrders(all.filter(o =>
                o.guestName?.toLowerCase() === customer.username.toLowerCase()
            ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
        } catch { setOrders([]); }

        // Rating
        try {
            const all = JSON.parse(localStorage.getItem('kolay_ratings') || '[]');
            setMyRating(all.find(r => r.username?.toLowerCase() === customer.username.toLowerCase()) || null);
        } catch { setMyRating(null); }

        loadLoyalty();
        seedWelcomePtsToAllMembers(); // ensure this user has their 100 pts if not already
        window.addEventListener('storage', loadLoyalty);
        return () => window.removeEventListener('storage', loadLoyalty);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('kolay_auth_user');
        window.dispatchEvent(new Event('storage'));
        navigate('/');
    };

    const handleRedeem = () => {
        const pts = Math.max(REDEEM.MIN_PTS, Math.min(redeemInput, REDEEM.MAX_PTS_PER_ORDER, loyalty.balance));
        const result = redeemPoints(customer.username, pts);
        if (result.ok) {
            setLoyalty(result.updated);
            setRedeemMsg({ ok: true, text: `✓ Redeemed ${pts} pts for KES ${result.kesDiscount} discount! Use at checkout.` });
        } else {
            setRedeemMsg({ ok: false, text: result.reason });
        }
        setTimeout(() => setRedeemMsg(null), 4000);
    };

    if (!customer) return null;

    const tier = getTier(loyalty.lifetime);
    const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED').length;
    const totalSpend = orders.reduce((sum, o) => {
        return sum + (parseFloat(String(o.total || '0').replace('KES ', '').replace(/,/g, '')) || o.totalAmount || 0);
    }, 0);

    const tabs = [
        { id: 'overview', label: 'Overview',  icon: <TrendingUp className="w-4 h-4" /> },
        { id: 'points',   label: 'Points',    icon: <Zap className="w-4 h-4" /> },
        { id: 'bookings', label: 'Bookings',  icon: <Calendar className="w-4 h-4" />, count: bookings.length },
        { id: 'orders',   label: 'Orders',    icon: <ShoppingBag className="w-4 h-4" />, count: orders.length },
        { id: 'rating',   label: 'My Rating', icon: <Star className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-[#0D0A07] font-body selection:bg-[#E67E22] selection:text-white">
            <PublicNavbar />

            <div className="pt-28 pb-20 px-6 md:px-12 max-w-4xl mx-auto">

                {/* ── Header ── */}
                <div className="flex items-center gap-4 mb-10">
                    <Link to="/" className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/50 hover:text-white transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <p className="text-[#E67E22] text-[10px] font-black uppercase tracking-[0.4em] mb-1">My Account</p>
                        <h1 className="text-3xl md:text-4xl font-display font-black text-white">Profile</h1>
                    </div>
                </div>

                {/* ── Profile Card ── */}
                <div className="bg-white/3 border border-white/8 rounded-3xl p-6 mb-8 flex items-center justify-between gap-6 flex-wrap">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-[#E67E22] rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-[0_0_30px_#E67E2240]">
                            {customer.username[0].toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-white font-black text-xl capitalize">{customer.username}</h2>
                            {customer.email && <p className="text-white/40 text-sm font-semibold mt-0.5">{customer.email}</p>}
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <span className="inline-flex items-center gap-1.5 bg-[#E67E22]/15 text-[#E67E22] text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-[#E67E22]/20">
                                    <User className="w-3 h-3" /> Member
                                </span>
                                <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${tier.bg} ${tier.border} ${tier.text}`}>
                                    {tier.icon} {tier.name}
                                </span>
                                <button
                                    onClick={() => setActiveTab('points')}
                                    className="inline-flex items-center gap-1 bg-[#E67E22]/10 border border-[#E67E22]/25 text-[#E67E22] text-[10px] font-black px-2.5 py-1 rounded-full hover:bg-[#E67E22]/20 transition-all"
                                >
                                    <Zap className="w-3 h-3 fill-[#E67E22]" /> {loyalty.balance.toLocaleString()} pts
                                </button>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 border border-red-500/30 hover:border-red-500/60 text-red-400 hover:text-red-300 hover:bg-red-500/5 font-black text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>

                {/* ── Tabs ── */}
                <div className="flex gap-1.5 bg-white/3 border border-white/5 rounded-2xl p-1.5 mb-8 overflow-x-auto">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                activeTab === tab.id ? 'bg-[#E67E22] text-white shadow-[0_0_20px_#E67E2240]' : 'text-white/40 hover:text-white'
                            }`}>
                            {tab.icon}
                            {tab.label}
                            {tab.count !== undefined && tab.count > 0 && (
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ════════════════ OVERVIEW TAB ════════════════ */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Bookings', value: bookings.length,          icon: <Calendar className="w-5 h-5" />,  color: 'text-blue-300' },
                                { label: 'Confirmed',      value: confirmedBookings,         icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-green-300' },
                                { label: 'Orders Placed',  value: orders.length,             icon: <Utensils className="w-5 h-5" />,  color: 'text-[#E67E22]' },
                                { label: 'Loyalty Points', value: `${loyalty.balance.toLocaleString()} pts`, icon: <Zap className="w-5 h-5" />, color: 'text-[#E67E22]' },
                            ].map(stat => (
                                <div key={stat.label} className="bg-white/3 border border-white/8 rounded-2xl p-5 flex flex-col gap-2">
                                    <span className={stat.color}>{stat.icon}</span>
                                    <p className="text-white font-black text-xl">{stat.value}</p>
                                    <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Points teaser */}
                        <div className="bg-gradient-to-r from-[#E67E22]/10 to-[#E67E22]/5 border border-[#E67E22]/20 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap cursor-pointer"
                            onClick={() => setActiveTab('points')}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#E67E22]/20 rounded-2xl flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-[#E67E22] fill-[#E67E22]" />
                                </div>
                                <div>
                                    <p className="text-white font-black text-lg">{loyalty.balance.toLocaleString()} <span className="text-[#E67E22]">pts</span></p>
                                    <p className="text-white/40 text-xs font-semibold italic">Deliciously Earned</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-black ${tier.text}`}>{tier.icon} {tier.name}</span>
                                <ChevronUp className="w-4 h-4 text-white/30 rotate-90" />
                            </div>
                        </div>

                        {myRating && (
                            <div className="bg-[#E67E22]/8 border border-[#E67E22]/20 rounded-2xl p-5">
                                <p className="text-[10px] font-black uppercase text-[#E67E22]/60 tracking-widest mb-3">Your Review</p>
                                <div className="flex items-center gap-1 mb-2">
                                    {[1,2,3,4,5].map(i => (
                                        <Star key={i} className={`w-4 h-4 ${i <= myRating.stars ? 'fill-[#E67E22] text-[#E67E22]' : 'text-white/15'}`} />
                                    ))}
                                    <span className="ml-2 text-white font-black text-sm">{myRating.stars}/5</span>
                                </div>
                                {myRating.comment && <p className="text-white/50 text-sm italic">"{myRating.comment}"</p>}
                            </div>
                        )}

                        {bookings.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Recent Bookings</p>
                                    <button onClick={() => setActiveTab('bookings')} className="text-[#E67E22] text-xs font-bold hover:underline">View all</button>
                                </div>
                                <div className="space-y-3">
                                    {bookings.slice(0, 3).map((b, i) => {
                                        const cfg = STATUS_CFG[b.status] || STATUS_CFG.PENDING;
                                        return (
                                            <div key={i} className="bg-white/3 border border-white/8 rounded-2xl px-5 py-4 flex items-center gap-4">
                                                <div className="bg-[#E67E22]/10 border border-[#E67E22]/20 rounded-xl p-2.5 text-center shrink-0 w-12">
                                                    <p className="text-[#E67E22] font-black text-base leading-none">{new Date(b.reservationDate).getDate()}</p>
                                                    <p className="text-[#E67E22]/60 text-[8px] font-black uppercase">{new Date(b.reservationDate).toLocaleString('default', { month: 'short' })}</p>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${cfg.cls}`}>
                                                        {cfg.icon} {cfg.label}
                                                    </span>
                                                    <p className="text-white/50 text-xs font-bold mt-1 flex items-center gap-2">
                                                        <Clock className="w-3 h-3" />{b.reservationTime}
                                                        <Users className="w-3 h-3 ml-1" />{b.numberOfGuests} guest{b.numberOfGuests !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ════════════════ POINTS TAB ════════════════ */}
                {activeTab === 'points' && (
                    <div className="space-y-6">
                        {/* Balance hero */}
                        <div className="bg-gradient-to-br from-[#1a0e08] to-[#0D0A07] border border-[#E67E22]/25 rounded-3xl p-8 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[#E67E22]/3 pointer-events-none" />
                            <p className="text-[#E67E22]/60 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Deliciously Earned</p>
                            <div className="flex items-center justify-center gap-3 mb-1">
                                <Zap className="w-8 h-8 text-[#E67E22] fill-[#E67E22]" />
                                <span className="text-6xl font-black text-white">{loyalty.balance.toLocaleString()}</span>
                            </div>
                            <p className="text-white/30 text-sm font-semibold mb-6">points balance · worth <span className="text-[#E67E22] font-black">KES {ptsToKES(loyalty.balance).toLocaleString()}</span></p>

                            <TierProgress lifetime={loyalty.lifetime} />
                        </div>

                        {/* How to earn */}
                        <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
                            <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-4">How to Earn Points</p>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Sign-up bonus',   pts: EARN_RATES.SIGNUP_BONUS,  icon: '🎁' },
                                    { label: 'Per KES 10 spent', pts: 1,                        icon: '🍽️' },
                                    { label: 'Make a reservation', pts: EARN_RATES.RESERVATION, icon: '📅' },
                                    { label: 'Leave a review',  pts: EARN_RATES.REVIEW,         icon: '⭐' },
                                    { label: 'Birthday bonus',  pts: EARN_RATES.BIRTHDAY,       icon: '🎂' },
                                ].map(e => (
                                    <div key={e.label} className="flex items-center gap-3 bg-white/3 border border-white/5 rounded-xl px-4 py-3">
                                        <span className="text-lg">{e.icon}</span>
                                        <div>
                                            <p className="text-[#E67E22] font-black text-sm">+{e.pts} pts</p>
                                            <p className="text-white/40 text-[10px] font-semibold">{e.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Redeem */}
                        <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
                            <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-4 flex items-center gap-2">
                                <Gift className="w-4 h-4 text-[#E67E22]" /> Redeem Points
                            </p>
                            <p className="text-white/50 text-xs mb-4">
                                100 pts = KES 50 discount &nbsp;·&nbsp; Min: {REDEEM.MIN_PTS} pts &nbsp;·&nbsp; Max per order: {REDEEM.MAX_PTS_PER_ORDER} pts
                            </p>

                            {redeemMsg && (
                                <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-bold ${redeemMsg.ok ? 'bg-green-500/10 border border-green-500/20 text-green-300' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                                    {redeemMsg.text}
                                </div>
                            )}

                            <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                                    <button onClick={() => setRedeemInput(v => Math.max(REDEEM.MIN_PTS, v - 100))}
                                        className="text-white/40 hover:text-white transition-colors"><ChevronDown className="w-4 h-4" /></button>
                                    <span className="text-white font-black text-lg w-16 text-center">{redeemInput}</span>
                                    <button onClick={() => setRedeemInput(v => Math.min(Math.min(REDEEM.MAX_PTS_PER_ORDER, loyalty.balance), v + 100))}
                                        className="text-white/40 hover:text-white transition-colors"><ChevronUp className="w-4 h-4" /></button>
                                </div>
                                <span className="text-white/30 text-sm">= KES {ptsToKES(redeemInput).toLocaleString()} off</span>
                                <button
                                    onClick={handleRedeem}
                                    disabled={!canRedeem(loyalty.balance) || loyalty.balance < REDEEM.MIN_PTS}
                                    className="flex items-center gap-2 bg-[#E67E22] hover:bg-[#cf6d17] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-widest px-5 py-3 rounded-xl transition-all active:scale-95 shadow-lg"
                                >
                                    <Gift className="w-4 h-4" /> Redeem
                                </button>
                            </div>
                            {!canRedeem(loyalty.balance) && (
                                <p className="text-white/25 text-xs mt-3">You need at least {REDEEM.MIN_PTS} pts to redeem. Keep ordering!</p>
                            )}
                        </div>

                        {/* QR Code */}
                        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8">
                            <LoyaltyQR username={customer.username} points={loyalty.balance} tier={tier} />
                            <div className="flex-1">
                                <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-3 flex items-center gap-2">
                                    <QrCode className="w-4 h-4 text-[#E67E22]" /> Your Loyalty Card
                                </p>
                                <p className="text-white/50 text-sm leading-relaxed mb-4">
                                    Show this QR to restaurant staff to scan and instantly redeem your points as a discount at checkout.
                                    The QR refreshes with your current balance.
                                </p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-white/30 font-semibold">Member</span>
                                        <span className="text-white font-black">{customer.username}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-white/30 font-semibold">Balance</span>
                                        <span className="text-[#E67E22] font-black">{loyalty.balance.toLocaleString()} pts</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-white/30 font-semibold">Tier</span>
                                        <span className={`font-black ${tier.text}`}>{tier.icon} {tier.name}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-white/30 font-semibold">Lifetime earned</span>
                                        <span className="text-white/60 font-bold">{loyalty.lifetime.toLocaleString()} pts</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* History */}
                        {loyalty.history.length > 0 && (
                            <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
                                <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-4 flex items-center gap-2">
                                    <History className="w-4 h-4 text-[#E67E22]" /> Points History
                                </p>
                                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                    {loyalty.history.map((evt, i) => (
                                        <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${evt.type === 'earn' ? 'bg-green-500/15' : 'bg-red-500/15'}`}>
                                                {evt.type === 'earn'
                                                    ? <ArrowDownCircle className="w-4 h-4 text-green-400" />
                                                    : <ArrowUpCircle className="w-4 h-4 text-red-400" />
                                                }
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white/70 text-xs font-bold truncate">{evt.reason}</p>
                                                <p className="text-white/25 text-[10px]">{new Date(evt.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                            </div>
                                            <span className={`font-black text-sm shrink-0 ${evt.pts > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {evt.pts > 0 ? '+' : ''}{evt.pts}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {loyalty.history.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-white/20 text-sm font-black uppercase tracking-widest">No points history yet</p>
                                <p className="text-white/15 text-xs mt-1">Place an order to start earning!</p>
                                <Link to="/order" className="inline-flex items-center gap-2 mt-4 bg-[#E67E22] hover:bg-[#cf6d17] text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-lg">
                                    <Utensils className="w-3.5 h-3.5" /> Order Now
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* ════════════════ BOOKINGS TAB ════════════════ */}
                {activeTab === 'bookings' && (
                    <div className="space-y-4">
                        {bookings.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="w-7 h-7 text-white/20" />
                                </div>
                                <p className="text-white/30 font-black uppercase tracking-widest text-sm mb-4">No bookings yet</p>
                                <Link to="/reservations" className="inline-flex items-center gap-2 bg-[#E67E22] hover:bg-[#cf6d17] text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-lg">
                                    <Calendar className="w-3.5 h-3.5" /> Make a Reservation
                                </Link>
                            </div>
                        ) : bookings.map((b, i) => {
                            const cfg = STATUS_CFG[b.status] || STATUS_CFG.PENDING;
                            return (
                                <div key={i} className="bg-white/3 border border-white/8 rounded-2xl px-6 py-5 flex items-center gap-4">
                                    <div className="bg-[#E67E22]/10 border border-[#E67E22]/20 rounded-2xl p-3 text-center shrink-0 w-14">
                                        <p className="text-[#E67E22] font-black text-lg leading-none">{new Date(b.reservationDate).getDate()}</p>
                                        <p className="text-[#E67E22]/70 text-[9px] font-black uppercase tracking-wider mt-0.5">{new Date(b.reservationDate).toLocaleString('default', { month: 'short' })}</p>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${cfg.cls}`}>
                                                {cfg.icon} {cfg.label}
                                            </span>
                                            <span className="text-white/20 text-[10px] font-bold">#{String(b.id || i).slice(-6).toUpperCase()}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-white/50 text-xs font-bold flex-wrap">
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{b.reservationTime}</span>
                                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{b.numberOfGuests} guest{b.numberOfGuests !== 1 ? 's' : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {bookings.length > 0 && (
                            <div className="flex justify-center pt-2">
                                <Link to="/my-bookings" className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-[#E67E22] hover:border-[#E67E22] text-white/60 hover:text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all duration-300">
                                    <BookOpen className="w-3.5 h-3.5" /> Manage Bookings
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* ════════════════ ORDERS TAB ════════════════ */}
                {activeTab === 'orders' && (
                    <div className="space-y-4">
                        {orders.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <ShoppingBag className="w-7 h-7 text-white/20" />
                                </div>
                                <p className="text-white/30 font-black uppercase tracking-widest text-sm mb-4">No orders yet</p>
                                <Link to="/order" className="inline-flex items-center gap-2 bg-[#E67E22] hover:bg-[#cf6d17] text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-lg">
                                    <Utensils className="w-3.5 h-3.5" /> Browse Menu
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="bg-white/3 border border-white/8 rounded-2xl px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
                                    <div>
                                        <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Total Orders</p>
                                        <p className="text-white font-black text-2xl">{orders.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Total Spend</p>
                                        <p className="text-[#E67E22] font-black text-2xl">KES {totalSpend.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Points Earned</p>
                                        <p className="text-green-400 font-black text-2xl">+{loyalty.lifetime.toLocaleString()}</p>
                                    </div>
                                </div>
                                {orders.map((o, i) => {
                                    const cfg = ORDER_STATUS[o.status] || ORDER_STATUS.PENDING;
                                    return (
                                        <div key={i} className="bg-white/3 border border-white/8 rounded-2xl p-5">
                                            <div className="flex items-center justify-between gap-4 mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 bg-[#E67E22]/10 border border-[#E67E22]/20 rounded-xl flex items-center justify-center">
                                                        <Utensils className="w-4 h-4 text-[#E67E22]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-black text-sm">{o.table || 'Takeaway'}</p>
                                                        <p className="text-white/30 text-[10px]">{o.timestamp ? new Date(o.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[#E67E22] font-black">{o.total}</p>
                                                    <span className={`inline-flex items-center text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${cfg.cls}`}>
                                                        {cfg.label}
                                                    </span>
                                                </div>
                                            </div>
                                            {o.items?.length > 0 && (
                                                <div className="border-t border-white/5 pt-3 space-y-1.5">
                                                    {o.items.map((item, j) => (
                                                        <div key={j} className="flex items-center justify-between text-xs">
                                                            <span className="text-white/50 font-semibold">{item.name}</span>
                                                            <span className="text-white/30 font-bold">x{item.quantity} — KES {(item.price * item.quantity).toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>
                )}

                {/* ════════════════ RATING TAB ════════════════ */}
                {activeTab === 'rating' && (
                    <div>
                        {myRating ? (
                            <div className="bg-white/3 border border-white/8 rounded-3xl p-8">
                                <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-5">Your Review</p>
                                <div className="flex items-center gap-2 mb-4">
                                    {[1,2,3,4,5].map(i => (
                                        <Star key={i} className={`w-7 h-7 ${i <= myRating.stars ? 'fill-[#E67E22] text-[#E67E22]' : 'text-white/15'}`} />
                                    ))}
                                    <span className="ml-2 text-white font-black text-xl">{myRating.stars}<span className="text-white/30 text-base">/5</span></span>
                                </div>
                                {myRating.comment
                                    ? <blockquote className="text-white/60 text-base italic leading-relaxed border-l-2 border-[#E67E22]/40 pl-4">"{myRating.comment}"</blockquote>
                                    : <p className="text-white/25 text-sm italic">No comment left.</p>
                                }
                                <p className="text-white/25 text-xs mt-4">{myRating.date}</p>
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Star className="w-7 h-7 text-white/20" />
                                </div>
                                <p className="text-white/30 font-black uppercase tracking-widest text-sm mb-2">You haven't rated us yet</p>
                                <p className="text-white/20 text-xs mb-6">You'll earn <span className="text-green-400 font-bold">+{EARN_RATES.REVIEW} pts</span> for leaving a review!</p>
                                <Link to="/" className="inline-flex items-center gap-2 bg-[#E67E22] hover:bg-[#cf6d17] text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-lg">
                                    <Star className="w-3.5 h-3.5" /> Leave a Review
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
