import React, { useState, useEffect } from 'react';
import {
    User, LogOut, Calendar, ShoppingBag, Star, ArrowLeft,
    Clock, Users, CheckCircle2, XCircle, Clock3, RefreshCw,
    BookOpen, Utensils, TrendingUp
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

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

export default function Profile() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const customer = getCustomer();

    useEffect(() => {
        if (!customer) navigate('/customer-login', { replace: true });
    }, []);

    // ── Data ──────────────────────────────────────────────────────────────────
    const [bookings, setBookings] = useState([]);
    const [orders, setOrders] = useState([]);
    const [myRating, setMyRating] = useState(null);
    const [activeTab, setActiveTab] = useState('overview'); // overview | bookings | orders | rating

    useEffect(() => {
        if (!customer) return;

        // Reservations
        try {
            const all = JSON.parse(localStorage.getItem('kolay_reservations_local') || '[]');
            const mine = all.filter(r =>
                r.username?.toLowerCase() === customer.username.toLowerCase() ||
                r.guestName?.toLowerCase() === customer.username.toLowerCase() ||
                (customer.email && r.email?.toLowerCase() === customer.email.toLowerCase())
            );
            setBookings(mine.sort((a, b) => new Date(b.createdAt || b.reservationDate) - new Date(a.createdAt || a.reservationDate)));
        } catch { setBookings([]); }

        // Orders (filter by guest name matching username)
        try {
            const all = JSON.parse(localStorage.getItem('kolay_orders') || '[]');
            const mine = all.filter(o =>
                o.guestName?.toLowerCase() === customer.username.toLowerCase()
            );
            setOrders(mine.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
        } catch { setOrders([]); }

        // My rating
        try {
            const all = JSON.parse(localStorage.getItem('kolay_ratings') || '[]');
            const mine = all.find(r => r.username?.toLowerCase() === customer.username.toLowerCase());
            setMyRating(mine || null);
        } catch { setMyRating(null); }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('kolay_auth_user');
        window.dispatchEvent(new Event('storage'));
        navigate('/');
    };

    if (!customer) return null;

    // ── Stats ─────────────────────────────────────────────────────────────────
    const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED').length;
    const totalSpend = orders.reduce((sum, o) => {
        const val = parseFloat(String(o.total || '0').replace('KES ', '').replace(/,/g, '')) || o.totalAmount || 0;
        return sum + val;
    }, 0);

    const tabs = [
        { id: 'overview', label: 'Overview',  icon: <TrendingUp className="w-4 h-4" /> },
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
                            {customer.fullName && <p className="text-white/30 text-xs font-semibold mt-0.5">{customer.fullName}</p>}
                            <span className="inline-flex items-center gap-1.5 mt-2 bg-[#E67E22]/15 text-[#E67E22] text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-[#E67E22]/20">
                                <User className="w-3 h-3" /> Member
                            </span>
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
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'bg-[#E67E22] text-white shadow-[0_0_20px_#E67E2240]'
                                    : 'text-white/40 hover:text-white'
                            }`}
                        >
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

                {/* ── Overview ── */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Bookings', value: bookings.length, icon: <Calendar className="w-5 h-5" />, color: 'text-blue-300' },
                                { label: 'Confirmed',      value: confirmedBookings, icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-green-300' },
                                { label: 'Orders Placed',  value: orders.length, icon: <Utensils className="w-5 h-5" />, color: 'text-[#E67E22]' },
                                { label: 'Total Spend',    value: `KES ${totalSpend.toLocaleString()}`, icon: <TrendingUp className="w-5 h-5" />, color: 'text-purple-300' },
                            ].map(stat => (
                                <div key={stat.label} className="bg-white/3 border border-white/8 rounded-2xl p-5 flex flex-col gap-2">
                                    <span className={stat.color}>{stat.icon}</span>
                                    <p className="text-white font-black text-xl">{stat.value}</p>
                                    <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* My Rating */}
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
                                <p className="text-white/25 text-xs mt-2">{myRating.date}</p>
                            </div>
                        )}

                        {/* Recent bookings preview */}
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
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${cfg.cls}`}>
                                                            {cfg.icon} {cfg.label}
                                                        </span>
                                                    </div>
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

                        {/* Recent orders preview */}
                        {orders.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Recent Orders</p>
                                    <button onClick={() => setActiveTab('orders')} className="text-[#E67E22] text-xs font-bold hover:underline">View all</button>
                                </div>
                                <div className="space-y-3">
                                    {orders.slice(0, 3).map((o, i) => {
                                        const cfg = ORDER_STATUS[o.status] || ORDER_STATUS.PENDING;
                                        return (
                                            <div key={i} className="bg-white/3 border border-white/8 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-[#E67E22]/10 border border-[#E67E22]/20 rounded-xl flex items-center justify-center">
                                                        <Utensils className="w-3.5 h-3.5 text-[#E67E22]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white/70 text-sm font-bold">{o.table || 'Takeaway'}</p>
                                                        <p className="text-white/25 text-[10px]">{o.timestamp ? new Date(o.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[#E67E22] font-black text-sm">{o.total}</p>
                                                    <span className={`inline-flex items-center text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${cfg.cls}`}>
                                                        {cfg.label}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {bookings.length === 0 && orders.length === 0 && !myRating && (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <User className="w-7 h-7 text-white/20" />
                                </div>
                                <p className="text-white/30 font-black uppercase tracking-widest text-sm">No activity yet</p>
                                <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
                                    <Link to="/reservations" className="flex items-center gap-2 bg-[#E67E22] hover:bg-[#cf6d17] text-white font-black text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all shadow-lg">
                                        <Calendar className="w-3.5 h-3.5" /> Make a Reservation
                                    </Link>
                                    <Link to="/order" className="flex items-center gap-2 bg-white/8 border border-white/15 text-white font-black text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all">
                                        <Utensils className="w-3.5 h-3.5" /> Order Food
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Bookings Tab ── */}
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
                        ) : (
                            bookings.map((b, i) => {
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
                                            {b.specialRequests && (
                                                <p className="text-white/30 text-xs mt-1 italic truncate">"{b.specialRequests}"</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        {bookings.length > 0 && (
                            <div className="flex justify-center pt-2">
                                <Link to="/my-bookings" className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-[#E67E22] hover:border-[#E67E22] text-white/60 hover:text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all duration-300">
                                    <BookOpen className="w-3.5 h-3.5" /> Manage Bookings
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Orders Tab ── */}
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
                                {/* Summary bar */}
                                <div className="bg-white/3 border border-white/8 rounded-2xl px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
                                    <div>
                                        <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Total Orders</p>
                                        <p className="text-white font-black text-2xl">{orders.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Total Spend</p>
                                        <p className="text-[#E67E22] font-black text-2xl">KES {totalSpend.toLocaleString()}</p>
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
                                                        <p className="text-white/30 text-[10px]">{o.timestamp ? new Date(o.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[#E67E22] font-black">{o.total}</p>
                                                    <span className={`inline-flex items-center text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${cfg.cls}`}>
                                                        {cfg.label}
                                                    </span>
                                                </div>
                                            </div>
                                            {o.items && o.items.length > 0 && (
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

                {/* ── Rating Tab ── */}
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
                                {myRating.comment ? (
                                    <blockquote className="text-white/60 text-base italic leading-relaxed border-l-2 border-[#E67E22]/40 pl-4">
                                        "{myRating.comment}"
                                    </blockquote>
                                ) : (
                                    <p className="text-white/25 text-sm italic">No comment left.</p>
                                )}
                                <p className="text-white/25 text-xs mt-4">{myRating.date}</p>
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Star className="w-7 h-7 text-white/20" />
                                </div>
                                <p className="text-white/30 font-black uppercase tracking-widest text-sm mb-2">You haven't rated us yet</p>
                                <p className="text-white/20 text-xs mb-6">Share your experience with other guests.</p>
                                <Link
                                    to="/#ratings"
                                    onClick={() => { setTimeout(() => document.getElementById('ratings')?.scrollIntoView({ behavior: 'smooth' }), 300); }}
                                    className="inline-flex items-center gap-2 bg-[#E67E22] hover:bg-[#cf6d17] text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-lg"
                                >
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
