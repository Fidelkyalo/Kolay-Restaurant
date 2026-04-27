import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Phone, Mail, CheckCircle, XCircle, Search, Filter, RefreshCw, ChevronRight, MessageSquare } from 'lucide-react';
import Navbar from '../components/Navbar';
import { ReservationService } from '../services/api';

const ManageReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const response = await ReservationService.getAll();
            setReservations(response.data);
        } catch (error) {
            console.error("Failed to fetch reservations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
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

    const filteredReservations = reservations.filter(r => {
        const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
        const matchesSearch = r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.phone.includes(searchQuery);
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-bg-cream font-body">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12">
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-primary mb-2">Manage Reservations</h1>
                        <p className="text-charcoal/60 font-bold uppercase tracking-widest text-xs">Customer Bookings & Table Management</p>
                    </div>
                    <button
                        onClick={fetchReservations}
                        className="bg-primary text-white p-3 rounded-2xl shadow-premium hover:shadow-glow transition-all active:scale-95"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </header>

                {/* Filters & Search */}
                <div className="bg-white p-6 rounded-3xl shadow-premium border border-primary/5 mb-8 flex flex-col md:flex-row gap-6 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                        <input
                            type="text"
                            placeholder="Search by name or phone..."
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
                            <p className="font-black uppercase tracking-widest text-sm">No Reservations Found</p>
                        </div>
                    ) : (
                        filteredReservations.map((res) => (
                            <div key={res.id} className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-primary/5 group hover:shadow-xl transition-all duration-300">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl font-bold text-primary">{res.guestName}</h3>
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${res.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                                res.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                    res.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-charcoal/5 text-charcoal/60'
                                                }`}>
                                                {res.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold text-charcoal/50 uppercase tracking-tighter">
                                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {res.phone}</span>
                                            <span className="flex items-center gap-1 uppercase"><Mail className="w-3 h-3" /> {res.email}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-secondary font-black text-xl leading-none mb-1">{res.numberOfGuests} GUESTS</p>
                                        <p className="text-[10px] font-black text-charcoal/30 uppercase tracking-widest tracking-widest">Table Booking</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
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

                                {res.specialRequests && (
                                    <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-200/30 mb-8 lowercase">
                                        <p className="text-[9px] font-black text-amber-600/60 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <MessageSquare className="w-3 h-3" /> Special Requests
                                        </p>
                                        <p className="text-sm font-bold text-amber-900/70 leading-relaxed italic">
                                            "{res.specialRequests}"
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-6 border-t border-primary/5">
                                    {res.status === 'PENDING' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(res.id, 'CONFIRMED')}
                                                className="flex-1 bg-green-500 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-md hover:bg-green-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle className="w-3.5 h-3.5" /> CONFIRM BOOKING
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(res.id, 'CANCELLED')}
                                                className="flex-1 bg-white text-red-500 border-2 border-red-500/20 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                <XCircle className="w-3.5 h-3.5" /> CANCEL
                                            </button>
                                        </>
                                    )}
                                    {res.status === 'CONFIRMED' && (
                                        <button
                                            onClick={() => handleStatusUpdate(res.id, 'COMPLETED')}
                                            className="flex-1 bg-primary text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-md hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-3.5 h-3.5" /> MARK COMPLETED
                                        </button>
                                    )}
                                    {(res.status === 'CANCELLED' || res.status === 'COMPLETED') && (
                                        <div className="w-full text-center py-2 text-[10px] font-black text-charcoal/20 uppercase tracking-widest">
                                            This reservation has been finalized.
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default ManageReservations;
