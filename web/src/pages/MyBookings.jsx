import React, { useState, useEffect } from 'react';
import {
    Calendar, Clock, Users, Phone, Mail, X, ArrowLeft,
    RefreshCw, CheckCircle2, XCircle, Clock3, AlertCircle,
    MessageSquare, ChevronDown
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import { ReservationService } from '../services/api';

// ── helpers ───────────────────────────────────────────────────────────────────
const LS_KEY = 'kolay_reservations_local';
const loadLocal = () => { try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; } };
const saveLocal = (list) => { localStorage.setItem(LS_KEY, JSON.stringify(list)); window.dispatchEvent(new Event('storage')); };

const getCustomer = () => {
    try { const u = JSON.parse(localStorage.getItem('kolay_auth_user')); return (u && u.accessToken && u.username) ? u : null; }
    catch { return null; }
};

const STATUS_CFG = {
    PENDING:   { color: 'bg-amber-100 text-amber-700 border-amber-200',  dark: 'bg-amber-500/10 text-amber-300 border-amber-500/20', icon: <Clock3 className="w-3 h-3" />,       label: 'Pending' },
    CONFIRMED: { color: 'bg-green-100 text-green-700 border-green-200',  dark: 'bg-green-500/10 text-green-300 border-green-500/20', icon: <CheckCircle2 className="w-3 h-3" />, label: 'Confirmed' },
    CANCELLED: { color: 'bg-red-100 text-red-600 border-red-200',        dark: 'bg-red-500/10 text-red-400 border-red-500/20',       icon: <XCircle className="w-3 h-3" />,      label: 'Cancelled' },
    COMPLETED: { color: 'bg-blue-100 text-blue-700 border-blue-200',     dark: 'bg-blue-500/10 text-blue-300 border-blue-500/20',    icon: <CheckCircle2 className="w-3 h-3" />, label: 'Completed' },
};

const CANCEL_SUGGESTIONS = [
    'Change of plans',
    'Found a better time',
    'Unable to attend',
    'Weather concerns',
    'Personal emergency',
    'Duplicate booking',
];

// ── component ─────────────────────────────────────────────────────────────────
export default function MyBookings() {
    const navigate = useNavigate();
    const customer = getCustomer();

    useEffect(() => { if (!customer) navigate('/customer-login', { replace: true }); }, []);

    const [bookings, setBookings]       = useState([]);
    const [loading, setLoading]         = useState(true);
    const [filter, setFilter]           = useState('ALL');
    const [expandedId, setExpandedId]   = useState(null);

    // cancel modal state
    const [cancelTarget, setCancelTarget] = useState(null);   // { id, name }
    const [cancelReason, setCancelReason] = useState('');
    const [cancelling, setCancelling]     = useState(false);

    // ── fetch ─────────────────────────────────────────────────────────────────
    const fetchBookings = async () => {
        setLoading(true);
        const local = loadLocal();
        const mine = local.filter(r =>
            r.username?.toLowerCase() === customer?.username?.toLowerCase() ||
            r.guestName?.toLowerCase() === customer?.username?.toLowerCase() ||
            r.email?.toLowerCase() === customer?.email?.toLowerCase()
        );

        try {
            const res = await ReservationService.getAll();
            const fromApi = (res.data || []).filter(r =>
                r.guestName?.toLowerCase() === customer?.username?.toLowerCase() ||
                r.email?.toLowerCase() === customer?.email?.toLowerCase()
            );
            const apiIds = new Set(fromApi.map(r => String(r.id)));
            const localOnly = mine.filter(r => !apiIds.has(String(r.id)));
            setBookings(
                [...fromApi, ...localOnly].sort(
                    (a, b) => new Date(b.createdAt || b.reservationDate) - new Date(a.createdAt || a.reservationDate)
                )
            );
        } catch {
            setBookings(mine.sort((a, b) => new Date(b.createdAt || b.reservationDate) - new Date(a.createdAt || a.reservationDate)));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (customer) fetchBookings(); }, []);

    // Re-sync when another tab/page updates the store
    useEffect(() => {
        const handler = () => fetchBookings();
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, []);

    // ── cancel ────────────────────────────────────────────────────────────────
    const openCancel = (booking) => {
        setCancelTarget({ id: booking.id, name: booking.guestName });
        setCancelReason('');
    };

    const confirmCancel = async () => {
        if (!cancelTarget) return;
        setCancelling(true);
        const { id } = cancelTarget;
        const reason = cancelReason.trim() || null;

        // Optimistic UI update
        setBookings(prev => prev.map(b =>
            String(b.id) === String(id) ? { ...b, status: 'CANCELLED', cancellationReason: reason } : b
        ));

        // Persist locally
        saveLocal(loadLocal().map(r =>
            String(r.id) === String(id) ? { ...r, status: 'CANCELLED', cancellationReason: reason } : r
        ));

        // Backend sync
        try { await ReservationService.updateStatus(id, 'CANCELLED', reason); } catch { /* silent */ }

        setCancelTarget(null);
        setCancelReason('');
        setCancelling(false);
    };

    // ── filter ────────────────────────────────────────────────────────────────
    const FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
    const filtered = bookings.filter(b => filter === 'ALL' || b.status === filter);

    if (!customer) return null;

    return (
        <div className="min-h-screen bg-[#0D0A07] font-body selection:bg-[#E67E22] selection:text-white">
            <PublicNavbar />

            <div className="pt-28 pb-16 px-6 md:px-12 max-w-4xl mx-auto">

                {/* ── Page header ── */}
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/reservations" className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/50 hover:text-white transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <p className="text-[#E67E22] text-[10px] font-black uppercase tracking-[0.4em] mb-1">My Account</p>
                        <h1 className="text-3xl md:text-4xl font-display font-black text-white">My Bookings</h1>
                    </div>
                    <button onClick={fetchBookings} disabled={loading} className="ml-auto p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/50 hover:text-white transition-all" title="Refresh">
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* ── Filter tabs ── */}
                <div className="flex gap-2 bg-white/3 border border-white/5 rounded-2xl p-1.5 mb-8 w-fit overflow-x-auto">
                    {FILTERS.map(f => {
                        const count = f === 'ALL' ? bookings.length : bookings.filter(b => b.status === f).length;
                        return (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === f ? 'bg-[#E67E22] text-white shadow-[0_0_20px_#E67E2240]' : 'text-white/40 hover:text-white'}`}>
                                {f}
                                {count > 0 && (
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${filter === f ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'}`}>{count}</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ── Content ── */}
                {loading && bookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-white/20">
                        <RefreshCw className="w-10 h-10 animate-spin mb-4" />
                        <p className="font-black uppercase tracking-widest text-sm">Loading your bookings…</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-6">
                            <Calendar className="w-8 h-8 text-white/20" />
                        </div>
                        <p className="text-white/30 font-black uppercase tracking-widest text-sm mb-2">
                            {filter === 'ALL' ? 'No bookings yet' : `No ${filter.toLowerCase()} bookings`}
                        </p>
                        {filter === 'ALL' && (
                            <Link to="/reservations" className="mt-4 flex items-center gap-2 bg-[#E67E22] hover:bg-[#cf6d17] text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-lg active:scale-95">
                                <Calendar className="w-4 h-4" /> Make a Reservation
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map(booking => {
                            const cfg   = STATUS_CFG[booking.status] || STATUS_CFG.PENDING;
                            const isExp = expandedId === booking.id;
                            const canCancel = booking.status === 'PENDING' || booking.status === 'CONFIRMED';

                            return (
                                <div key={booking.id} className="bg-white/3 border border-white/8 hover:border-white/15 rounded-3xl overflow-hidden transition-all duration-300">
                                    {/* Card row */}
                                    <div className="flex items-center gap-4 p-6 cursor-pointer" onClick={() => setExpandedId(isExp ? null : booking.id)}>
                                        {/* Date block */}
                                        <div className="bg-[#E67E22]/10 border border-[#E67E22]/20 rounded-2xl p-3 text-center shrink-0 w-14">
                                            <p className="text-[#E67E22] font-black text-lg leading-none">{new Date(booking.reservationDate).getDate()}</p>
                                            <p className="text-[#E67E22]/70 text-[9px] font-black uppercase tracking-wider mt-0.5">{new Date(booking.reservationDate).toLocaleString('default', { month: 'short' })}</p>
                                        </div>
                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${cfg.dark}`}>
                                                    {cfg.icon} {cfg.label}
                                                </span>
                                                <span className="text-white/20 text-[10px] font-bold">#{String(booking.id).slice(-6).toUpperCase()}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-white/50 text-xs font-bold flex-wrap">
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{booking.reservationTime}</span>
                                                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'Guest' : 'Guests'}</span>
                                            </div>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-300 shrink-0 ${isExp ? 'rotate-180' : ''}`} />
                                    </div>

                                    {/* Expanded panel */}
                                    {isExp && (
                                        <div className="px-6 pb-6 space-y-4 border-t border-white/5 pt-4">
                                            {/* Contact */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {booking.phone && (
                                                    <div className="flex items-center gap-3 bg-white/3 rounded-2xl p-3 border border-white/5">
                                                        <Phone className="w-4 h-4 text-[#E67E22] shrink-0" />
                                                        <div><p className="text-[9px] font-black uppercase text-white/30 tracking-widest">Phone</p><p className="text-white/70 text-sm font-bold">{booking.phone}</p></div>
                                                    </div>
                                                )}
                                                {booking.email && (
                                                    <div className="flex items-center gap-3 bg-white/3 rounded-2xl p-3 border border-white/5">
                                                        <Mail className="w-4 h-4 text-[#E67E22] shrink-0" />
                                                        <div><p className="text-[9px] font-black uppercase text-white/30 tracking-widest">Email</p><p className="text-white/70 text-sm font-bold truncate">{booking.email}</p></div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Special requests */}
                                            {booking.specialRequests && (
                                                <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4">
                                                    <MessageSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase text-amber-400/60 tracking-widest mb-1">Special Requests</p>
                                                        <p className="text-amber-200/70 text-sm italic">"{booking.specialRequests}"</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Cancellation reason (if cancelled) */}
                                            {booking.status === 'CANCELLED' && booking.cancellationReason && (
                                                <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-2xl p-4">
                                                    <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase text-red-400/60 tracking-widest mb-1">Cancellation Reason</p>
                                                        <p className="text-red-200/70 text-sm italic">"{booking.cancellationReason}"</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Status message */}
                                            <div className={`flex items-start gap-3 rounded-2xl p-4 border ${cfg.dark}`}>
                                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                                <p className="text-xs font-semibold leading-relaxed">
                                                    {booking.status === 'PENDING'   && "Your reservation is awaiting confirmation from our team. We'll update this shortly."}
                                                    {booking.status === 'CONFIRMED' && 'Great news — your table is confirmed! We look forward to seeing you.'}
                                                    {booking.status === 'CANCELLED' && 'This reservation has been cancelled. Feel free to make a new booking anytime.'}
                                                    {booking.status === 'COMPLETED' && 'Thank you for dining with us. We hope to see you again soon!'}
                                                </p>
                                            </div>

                                            {/* Cancel button */}
                                            {canCancel && (
                                                <button onClick={() => openCancel(booking)}
                                                    className="w-full flex items-center justify-center gap-2 py-3 border border-red-500/30 hover:border-red-500/60 text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                                                    <X className="w-3.5 h-3.5" /> Cancel This Booking
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {bookings.length > 0 && (
                    <div className="mt-10 flex justify-center">
                        <Link to="/reservations"
                            className="flex items-center gap-2 bg-white/5 hover:bg-[#E67E22] border border-white/10 hover:border-[#E67E22] text-white/60 hover:text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all duration-300">
                            <Calendar className="w-4 h-4" /> Make Another Reservation
                        </Link>
                    </div>
                )}
            </div>

            {/* ── Customer Cancel Modal (reason optional + suggestions) ── */}
            {cancelTarget && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0D0A07]/80 backdrop-blur-sm" onClick={() => { setCancelTarget(null); setCancelReason(''); }} />
                    <div className="relative bg-[#1A1008] border border-white/10 rounded-[2rem] w-full max-w-md shadow-2xl p-8 animate-in zoom-in duration-200">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center shrink-0">
                                <XCircle className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white">Cancel Booking?</h3>
                                <p className="text-white/40 text-xs">This action cannot be undone.</p>
                            </div>
                        </div>

                        {/* Quick suggestions */}
                        <div className="mb-4">
                            <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2">Quick reason <span className="text-white/20 normal-case font-semibold">(optional)</span></p>
                            <div className="flex flex-wrap gap-2">
                                {CANCEL_SUGGESTIONS.map(s => (
                                    <button key={s} onClick={() => setCancelReason(cancelReason === s ? '' : s)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${cancelReason === s ? 'bg-[#E67E22] border-[#E67E22] text-white' : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20'}`}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Free-text reason */}
                        <textarea
                            rows={2}
                            placeholder="Or write your own reason… (optional)"
                            value={cancelReason}
                            onChange={e => setCancelReason(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 focus:border-[#E67E22]/40 outline-none rounded-2xl px-4 py-3 text-white/70 text-sm font-semibold placeholder:text-white/20 resize-none transition-colors mb-6"
                        />

                        <div className="flex gap-3">
                            <button onClick={() => { setCancelTarget(null); setCancelReason(''); }}
                                className="flex-1 py-3 border border-white/10 hover:border-white/20 text-white/50 hover:text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all">
                                Keep It
                            </button>
                            <button onClick={confirmCancel} disabled={cancelling}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-black py-3 rounded-xl transition-all active:scale-95 disabled:opacity-60 text-xs uppercase tracking-widest">
                                {cancelling ? 'Cancelling…' : 'Yes, Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
