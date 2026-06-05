import React, { useState, useEffect } from 'react';
import {
    Calendar, Clock, Users, Phone, Mail, CheckCircle, XCircle,
    Search, RefreshCw, MessageSquare, UserCheck, ChevronDown, X, AlertTriangle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { ReservationService } from '../services/api';
import { isAdmin } from '../hooks/useRole';

// ── Helpers for local reservation store (used for assignment persistence) ──
const LS_KEY = 'kolay_reservations_local';

const loadLocalReservations = () => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
};

const saveLocalReservations = (list) => {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('storage'));
};

// Merge backend reservations with local assignment data
const mergeWithLocal = (backendList) => {
    const local = loadLocalReservations();
    return backendList.map(r => {
        const localEntry = local.find(l => String(l.id) === String(r.id));
        return localEntry ? { ...r, assignedTo: localEntry.assignedTo } : r;
    });
};

// Get staff list from employees localStorage
const getStaffList = () => {
    try {
        const employees = JSON.parse(localStorage.getItem('kolay_employees') || '[]');
        return employees.filter(e => e.status === 'Active').map(e => `${e.firstName} ${e.lastName}`);
    } catch { return []; }
};

const ManageReservations = () => {
    const adminMode = isAdmin();

    // Staff identity — read from localStorage
    const staffName = (() => {
        try {
            const saved = localStorage.getItem('kolay_staff_name');
            if (saved) return saved;
            const user = JSON.parse(localStorage.getItem('kolay_auth_user'));
            return user?.username || 'Staff';
        } catch { return 'Staff'; }
    })();

    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiOnline, setApiOnline] = useState(true);   // tracks whether API responded
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [staffList, setStaffList] = useState(getStaffList);
    const [assigningId, setAssigningId] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState('');
    const [detailRes, setDetailRes] = useState(null);

    // Admin cancel-with-reason modal
    const [cancelTarget, setCancelTarget]   = useState(null);  // { id, guestName }
    const [cancelReason, setCancelReason]   = useState('');
    const [cancellingId, setCancellingId]   = useState(null);

    const fetchReservations = async () => {
        setLoading(true);
        const local = loadLocalReservations();

        try {
            const response = await ReservationService.getAll();
            setApiOnline(true);

            // Merge: API is authoritative; append any local-only bookings
            const apiIds = new Set(response.data.map(r => String(r.id)));
            const localOnly = local.filter(r => !apiIds.has(String(r.id)));
            const merged = [...mergeWithLocal(response.data), ...localOnly];

            // Sort newest first
            merged.sort((a, b) =>
                new Date(b.createdAt || b.reservationDate) - new Date(a.createdAt || a.reservationDate)
            );
            setReservations(merged);
        } catch (error) {
            console.error('Failed to fetch reservations from API:', error);
            setApiOnline(false);
            // Fallback: show everything from localStorage so no booking is invisible
            const sorted = [...local].sort((a, b) =>
                new Date(b.createdAt || b.reservationDate) - new Date(a.createdAt || a.reservationDate)
            );
            setReservations(sorted);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
        setStaffList(getStaffList());
    }, []);

    // Re-fetch when a new reservation is saved locally (from customer booking form)
    // or when the employee list changes
    useEffect(() => {
        const handler = () => {
            setStaffList(getStaffList());
            // Refresh the list — merges any new locally-saved bookings
            fetchReservations();
        };
        window.addEventListener('storage', handler);
        window.addEventListener('kolay_new_reservation', handler);
        return () => {
            window.removeEventListener('storage', handler);
            window.removeEventListener('kolay_new_reservation', handler);
        };
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await ReservationService.updateStatus(id, newStatus);
            fetchReservations();
        } catch (error) {
            console.error("Status update failed:", error);
            alert("Failed to update status.");
        }
    };

    // Admin cancel — requires a reason; opens modal instead of direct call
    const openAdminCancel = (res) => {
        setCancelTarget({ id: res.id, guestName: res.guestName });
        setCancelReason('');
    };

    const confirmAdminCancel = async () => {
        if (!cancelTarget || !cancelReason.trim()) return;
        setCancellingId(cancelTarget.id);

        // Optimistic local update
        setReservations(prev =>
            prev.map(r => String(r.id) === String(cancelTarget.id)
                ? { ...r, status: 'CANCELLED', cancellationReason: cancelReason.trim() }
                : r
            )
        );
        saveLocalReservations(
            loadLocalReservations().map(r =>
                String(r.id) === String(cancelTarget.id)
                    ? { ...r, status: 'CANCELLED', cancellationReason: cancelReason.trim() }
                    : r
            )
        );

        try {
            await ReservationService.updateStatus(cancelTarget.id, 'CANCELLED', cancelReason.trim());
        } catch { /* silent — already updated locally */ }

        setCancelTarget(null);
        setCancelReason('');
        setCancellingId(null);
        fetchReservations();
    };

    // Assign reservation to a staff member (stored locally)
    const handleAssign = (reservationId) => {
        if (!selectedStaff) return;

        // Update local store
        const local = loadLocalReservations();
        const existing = local.find(l => String(l.id) === String(reservationId));
        const reservation = reservations.find(r => String(r.id) === String(reservationId));

        if (existing) {
            existing.assignedTo = selectedStaff;
            saveLocalReservations(local);
        } else if (reservation) {
            saveLocalReservations([...local, { ...reservation, assignedTo: selectedStaff }]);
        }

        // Update UI
        setReservations(prev =>
            prev.map(r => String(r.id) === String(reservationId) ? { ...r, assignedTo: selectedStaff } : r)
        );
        setAssigningId(null);
        setSelectedStaff('');
    };

    const handleUnassign = (reservationId) => {
        const local = loadLocalReservations();
        const updated = local.map(l =>
            String(l.id) === String(reservationId) ? { ...l, assignedTo: null } : l
        );
        saveLocalReservations(updated);
        setReservations(prev =>
            prev.map(r => String(r.id) === String(reservationId) ? { ...r, assignedTo: null } : r)
        );
    };

    // For staff: only show their assigned reservations
    const visibleReservations = adminMode
        ? reservations
        : reservations.filter(r => r.assignedTo === staffName);

    const filteredReservations = visibleReservations.filter(r => {
        const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
        const q = searchQuery.toLowerCase();
        const matchesSearch = !q ||
            (r.guestName || '').toLowerCase().includes(q) ||
            (r.phone || '').includes(q) ||
            (r.email || '').toLowerCase().includes(q);
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-bg-cream font-body">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12">
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-primary mb-2">
                            {adminMode ? 'Manage Reservations' : 'My Reservations'}
                        </h1>
                        <p className="text-charcoal/60 font-bold uppercase tracking-widest text-xs">
                            {adminMode ? 'Customer Bookings & Staff Allocation' : 'Bookings assigned to you'}
                        </p>
                    </div>
                    {adminMode && (
                        <button
                            onClick={fetchReservations}
                            className="bg-primary text-white p-3 rounded-2xl shadow-premium hover:shadow-glow transition-all active:scale-95"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    )}
                </header>

                {/* API offline banner */}
                {!apiOnline && (
                    <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl px-5 py-4 text-sm font-bold">
                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
                        <div>
                            <p className="font-black">Server offline — showing locally cached bookings</p>
                            <p className="font-semibold text-amber-700/80 text-xs mt-1">
                                The Railway backend is sleeping. Bookings made while it was offline are shown below.
                                Hit Refresh to retry — it may take ~30 seconds to wake up.
                            </p>
                        </div>
                    </div>
                )}

                {/* Filters & Search — admin only */}
                {adminMode && (
                    <div className="bg-white p-6 rounded-3xl shadow-premium border border-primary/5 mb-8 flex flex-col md:flex-row gap-6 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                            <input
                                type="text"
                                placeholder="Search by name, phone or email..."
                                className="w-full pl-12 pr-6 py-4 bg-bg-cream/50 border border-primary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-bold text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex bg-bg-cream p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto">
                            {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setFilterStatus(s)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all whitespace-nowrap ${filterStatus === s ? 'bg-primary text-white shadow-lg' : 'text-primary/40 hover:text-primary/70'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reservations List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {loading && reservations.length === 0 ? (
                        <div className="col-span-full h-64 flex flex-col items-center justify-center text-charcoal/20">
                            <RefreshCw className="w-12 h-12 animate-spin mb-4" />
                            <p className="font-black uppercase tracking-widest text-sm">Loading Bookings...</p>
                        </div>
                    ) : filteredReservations.length === 0 ? (
                        <div className="col-span-full h-64 flex flex-col items-center justify-center text-charcoal/20">
                            <Calendar className="w-12 h-12 mb-4" />
                            <p className="font-black uppercase tracking-widest text-sm">
                                {adminMode ? 'No Reservations Found' : 'No reservations assigned to you yet'}
                            </p>
                            {!adminMode && (
                                <p className="text-charcoal/30 text-xs mt-2 text-center max-w-xs">
                                    An admin will assign bookings to you. Check back later.
                                </p>
                            )}
                        </div>
                    ) : (
                        filteredReservations.map((res) => (
                            <div key={res.id} className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-primary/5 group hover:shadow-xl transition-all duration-300">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl font-bold text-primary">{res.guestName}</h3>
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                                                res.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                                res.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                res.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                'bg-charcoal/5 text-charcoal/60'
                                            }`}>
                                                {res.status}
                                            </span>
                                            {res.synced === false && (
                                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter bg-orange-100 text-orange-600 border border-orange-200">
                                                    ⚠ Local only
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-charcoal/50 uppercase tracking-tighter">
                                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {res.phone}</span>
                                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {res.email}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-secondary font-black text-xl leading-none mb-1">{res.numberOfGuests} GUESTS</p>
                                        <p className="text-[10px] font-black text-charcoal/30 uppercase tracking-widest">Table Booking</p>
                                    </div>
                                </div>

                                {/* Date / Time */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-bg-cream/50 p-4 rounded-2xl border border-primary/5">
                                        <p className="text-[9px] font-black text-charcoal/40 uppercase tracking-widest mb-1 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> Date
                                        </p>
                                        <p className="font-bold text-primary">{new Date(res.reservationDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="bg-bg-cream/50 p-4 rounded-2xl border border-primary/5">
                                        <p className="text-[9px] font-black text-charcoal/40 uppercase tracking-widest mb-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Time
                                        </p>
                                        <p className="font-bold text-primary">{res.reservationTime}</p>
                                    </div>
                                </div>

                                {/* Special Requests */}
                                {res.specialRequests && (
                                    <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/30 mb-5 lowercase">
                                        <p className="text-[9px] font-black text-amber-600/60 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <MessageSquare className="w-3 h-3" /> Special Requests
                                        </p>
                                        <p className="text-sm font-bold text-amber-900/70 leading-relaxed italic">
                                            "{res.specialRequests}"
                                        </p>
                                    </div>
                                )}

                                {/* Cancellation reason */}
                                {res.status === 'CANCELLED' && res.cancellationReason && (
                                    <div className="bg-red-50/50 p-5 rounded-2xl border border-red-200/30 mb-5">
                                        <p className="text-[9px] font-black text-red-600/60 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <XCircle className="w-3 h-3" /> Cancellation Reason
                                        </p>
                                        <p className="text-sm font-bold text-red-900/70 leading-relaxed italic">
                                            "{res.cancellationReason}"
                                        </p>
                                    </div>
                                )}

                                {/* Staff Assignment */}
                                <div className="mb-5">
                                    {res.assignedTo ? (
                                        <div className="flex items-center justify-between bg-green-50 border border-green-200/50 rounded-2xl px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <UserCheck className="w-4 h-4 text-green-600" />
                                                <div>
                                                    <p className="text-[9px] font-black text-green-600/60 uppercase tracking-widest">Assigned To</p>
                                                    <p className="font-black text-green-700 text-sm">{res.assignedTo}</p>
                                                </div>
                                            </div>
                                            {adminMode && (
                                                <button
                                                    onClick={() => handleUnassign(res.id)}
                                                    className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 transition-colors"
                                                    title="Remove assignment"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    ) : adminMode ? (
                                        assigningId === res.id ? (
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <select
                                                        className="w-full bg-bg-cream border border-primary/10 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-semibold text-sm appearance-none pr-8"
                                                        value={selectedStaff}
                                                        onChange={e => setSelectedStaff(e.target.value)}
                                                    >
                                                        <option value="">— Select staff member —</option>
                                                        {staffList.length > 0
                                                            ? staffList.map(s => <option key={s} value={s}>{s}</option>)
                                                            : <option disabled>No active employees found</option>
                                                        }
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal/40 pointer-events-none" />
                                                </div>
                                                <button
                                                    onClick={() => handleAssign(res.id)}
                                                    disabled={!selectedStaff}
                                                    className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-black text-xs rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                                >
                                                    Assign
                                                </button>
                                                <button
                                                    onClick={() => { setAssigningId(null); setSelectedStaff(''); }}
                                                    className="px-3 py-2.5 bg-bg-cream hover:bg-red-50 text-charcoal/40 hover:text-red-400 font-black text-xs rounded-xl transition-all"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => { setAssigningId(res.id); setSelectedStaff(''); }}
                                                className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-primary/15 hover:border-secondary/40 rounded-2xl text-xs font-black text-charcoal/30 hover:text-secondary transition-all"
                                            >
                                                <UserCheck className="w-3.5 h-3.5" /> Assign to Staff
                                            </button>
                                        )
                                    ) : (
                                        <div className="flex items-center gap-2 bg-bg-cream/50 rounded-2xl px-4 py-2.5 border border-primary/5">
                                            <UserCheck className="w-3.5 h-3.5 text-charcoal/30" />
                                            <p className="text-[10px] font-black text-charcoal/30 uppercase tracking-widest">Not yet assigned</p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-5 border-t border-primary/5">
                                    {adminMode ? (
                                        <>
                                            {res.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(res.id, 'CONFIRMED')}
                                                        className="flex-1 bg-green-500 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-md hover:bg-green-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" /> CONFIRM
                                                    </button>
                                                    <button
                                                        onClick={() => openAdminCancel(res)}
                                                        className="flex-1 bg-white text-red-500 border-2 border-red-500/20 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" /> CANCEL
                                                    </button>
                                                </>
                                            )}
                                            {res.status === 'CONFIRMED' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(res.id, 'COMPLETED')}
                                                        className="flex-1 bg-primary text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-md hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" /> MARK COMPLETED
                                                    </button>
                                                    <button
                                                        onClick={() => openAdminCancel(res)}
                                                        className="flex-1 bg-white text-red-500 border-2 border-red-500/20 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" /> CANCEL
                                                    </button>
                                                </>
                                            )}
                                            {(res.status === 'CANCELLED' || res.status === 'COMPLETED') && (
                                                <div className="w-full text-center py-2 text-[10px] font-black text-charcoal/20 uppercase tracking-widest">
                                                    This reservation has been finalized.
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        /* Staff: view full details button */
                                        <button
                                            onClick={() => setDetailRes(res)}
                                            className="flex-1 bg-bg-cream hover:bg-secondary/10 text-primary font-black py-3 rounded-xl text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                        >
                                            <Calendar className="w-3.5 h-3.5" /> View Full Details
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* Admin: Mandatory Cancel Reason Modal */}
            {cancelTarget && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-primary/50 backdrop-blur-sm" onClick={() => { setCancelTarget(null); setCancelReason(''); }} />
                    <div className="relative bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-8 animate-in zoom-in duration-200">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-primary">Cancel Reservation</h3>
                                <p className="text-charcoal/50 text-xs font-bold">{cancelTarget.guestName}</p>
                            </div>
                        </div>

                        {/* Mandatory reason */}
                        <div className="mb-5">
                            <label className="block text-[10px] font-black uppercase text-charcoal/40 tracking-widest mb-2">
                                Reason for cancellation <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={3}
                                placeholder="e.g. Fully booked on requested date, maintenance closure, etc."
                                value={cancelReason}
                                onChange={e => setCancelReason(e.target.value)}
                                className={`w-full bg-bg-cream border rounded-xl px-4 py-3 text-sm font-semibold outline-none resize-none transition-colors ${
                                    cancelReason.trim()
                                        ? 'border-primary/20 focus:border-secondary/40'
                                        : 'border-red-300 focus:border-red-400'
                                }`}
                            />
                            {!cancelReason.trim() && (
                                <p className="text-red-500 text-[10px] font-bold mt-1.5 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> A reason is required to cancel a reservation.
                                </p>
                            )}
                        </div>

                        {/* Quick reason chips */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {['Fully booked', 'Venue unavailable', 'Customer requested', 'Event cancelled', 'Staff shortage'].map(s => (
                                <button key={s}
                                    onClick={() => setCancelReason(cancelReason === s ? '' : s)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${cancelReason === s ? 'bg-primary text-white border-primary' : 'bg-bg-cream border-primary/10 text-charcoal/60 hover:border-secondary/40'}`}>
                                    {s}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => { setCancelTarget(null); setCancelReason(''); }}
                                className="flex-1 py-3 font-bold text-charcoal/40 hover:text-primary transition-colors">
                                Go Back
                            </button>
                            <button
                                onClick={confirmAdminCancel}
                                disabled={!cancelReason.trim() || cancellingId === cancelTarget?.id}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                            >
                                {cancellingId === cancelTarget?.id ? 'Cancelling…' : 'Confirm Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Staff: Full Reservation Detail Modal */}
            {detailRes && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-primary/50 backdrop-blur-sm" onClick={() => setDetailRes(null)} />
                    <div className="relative bg-white rounded-[2rem] w-full max-w-lg shadow-2xl animate-in zoom-in duration-200 max-h-[92vh] overflow-y-auto">
                        {/* Header */}
                        <div className="bg-primary rounded-t-[2rem] px-8 pt-8 pb-6 relative">
                            <button onClick={() => setDetailRes(null)} className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-secondary/30 flex items-center justify-center">
                                    <Calendar className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-0.5">Reservation Details</p>
                                    <h2 className="text-2xl font-display font-black text-white">{detailRes.guestName}</h2>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4 flex-wrap">
                                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                                    detailRes.status === 'CONFIRMED' ? 'bg-green-400/20 text-green-200' :
                                    detailRes.status === 'CANCELLED' ? 'bg-red-400/20 text-red-200' :
                                    detailRes.status === 'PENDING' ? 'bg-amber-400/20 text-amber-200' :
                                    'bg-white/10 text-white/70'
                                }`}>{detailRes.status}</span>
                                {detailRes.assignedTo && (
                                    <span className="text-[10px] font-black px-3 py-1 rounded-full bg-green-400/20 text-green-200 flex items-center gap-1">
                                        <UserCheck className="w-3 h-3" /> {detailRes.assignedTo}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-8 space-y-5">
                            {/* Contact */}
                            <div>
                                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-3">Guest Contact</p>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { icon: Phone, label: 'Phone', value: detailRes.phone },
                                        { icon: Mail,  label: 'Email', value: detailRes.email },
                                    ].map(({ icon: Icon, label, value }) => (
                                        <div key={label} className="flex items-center gap-3 bg-bg-cream rounded-2xl p-4 border border-primary/5">
                                            <Icon className="w-4 h-4 text-secondary shrink-0" />
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-charcoal/40">{label}</p>
                                                <p className="font-semibold text-primary text-sm mt-0.5">{value || '—'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Booking Details */}
                            <div>
                                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-3">Booking Details</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { icon: Calendar, label: 'Date',   value: new Date(detailRes.reservationDate).toLocaleDateString() },
                                        { icon: Clock,    label: 'Time',   value: detailRes.reservationTime },
                                        { icon: Users,    label: 'Guests', value: `${detailRes.numberOfGuests} persons` },
                                    ].map(({ icon: Icon, label, value }) => (
                                        <div key={label} className="flex items-start gap-3 bg-bg-cream rounded-2xl p-4 border border-primary/5">
                                            <Icon className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-charcoal/40">{label}</p>
                                                <p className="font-semibold text-primary text-sm mt-0.5">{value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Special Requests */}
                            {detailRes.specialRequests && (
                                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/30">
                                    <p className="text-[10px] font-black uppercase text-amber-600/60 mb-2 flex items-center gap-1">
                                        <MessageSquare className="w-3 h-3" /> Special Requests
                                    </p>
                                    <p className="text-sm font-bold text-amber-900/70 italic">"{detailRes.specialRequests}"</p>
                                </div>
                            )}

                            <button
                                onClick={() => setDetailRes(null)}
                                className="w-full py-3 font-bold text-charcoal/40 hover:text-primary border border-primary/10 rounded-xl transition-colors text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageReservations;
