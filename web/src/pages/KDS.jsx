import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle, ChefHat, Timer, ArrowRight, History, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const KDS = () => {
    const [allOrders, setAllOrders] = useState([]);
    const activeOrders = allOrders.filter(o => o.status === 'PENDING' || o.status === 'PREPARING');
    const completedToday = allOrders.filter(o => o.status === 'READY' || o.status === 'SERVED').length;

    useEffect(() => {
        const loadOrders = () => {
            const saved = localStorage.getItem('kolay_orders');
            if (saved) {
                setAllOrders(JSON.parse(saved));
            } else {
                setAllOrders([]);
            }
        };
        loadOrders();
        window.addEventListener('storage', loadOrders);
        return () => window.removeEventListener('storage', loadOrders);
    }, []);

    const updateStatus = (id, newStatus) => {
        const updated = allOrders.map(order =>
            order.id === id ? { ...order, status: newStatus } : order
        );
        localStorage.setItem('kolay_orders', JSON.stringify(updated));
        setAllOrders(updated);
    };

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-white font-body overflow-hidden flex flex-col">
            <Navbar />
            <div className="p-6 flex-1 flex flex-col overflow-hidden">
                {/* KDS Header */}
                <div className="flex justify-between items-center mb-8 bg-[#252525] p-6 rounded-3xl border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="bg-secondary p-3 rounded-2xl shadow-lg">
                            <ChefHat className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-bold tracking-tight">KITCHEN DISPLAY</h1>
                            <div className="flex gap-4 mt-1 text-sm text-white/40">
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Live Tracking</span>
                                <span className="flex items-center gap-1 font-bold text-secondary"><Timer className="w-4 h-4" /> Avg. Time: 15m</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all border border-white/5 shadow-sm">
                            <History className="w-5 h-5" /> History
                        </button>
                        <div className="bg-primary text-white px-6 py-3 rounded-2xl flex items-center gap-3 border border-accent/20 shadow-[0_0_20px_rgba(78,44,30,0.5)]">
                            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="font-bold tracking-wide">STATION: MAIN GRILL</span>
                        </div>
                    </div>
                </div>

                {/* Orders Grid */}
                <div className="flex-1 overflow-x-auto pb-4 flex gap-6 custom-scrollbar scroll-smooth">
                    {activeOrders.map((order) => (
                        <div
                            key={order.id}
                            className={`w-[380px] shrink-0 flex flex-col rounded-[2.5rem] overflow-hidden shadow-2xl transition-all border-2 ${order.status === 'PREPARING' ? 'border-secondary/50 bg-[#2a2a2a]' : 'border-white/5 bg-[#252525]'
                                }`}
                        >
                            {/* Ticket Header */}
                            <div className={`p-6 flex justify-between items-center ${order.status === 'PREPARING' ? 'bg-secondary' : 'bg-white/5'}`}>
                                <div>
                                    <span className="text-xs font-bold opacity-60 uppercase tracking-widest">{order.status}</span>
                                    <h2 className="text-2xl font-bold">{order.table}</h2>
                                </div>
                                <div className="text-right text-xs font-bold opacity-60">
                                    <p>{order.id}</p>
                                    <p className="flex items-center gap-1 justify-end mt-1"><Clock className="w-3 h-3 text-secondary" /> {order.time || 'Just now'}</p>
                                </div>
                            </div>

                            {/* Ticket Body */}
                            <div className="p-8 flex-1 space-y-6 overflow-y-auto">
                                {Array.isArray(order.items) ? order.items.map((item, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-secondary text-lg border border-white/5 group-hover:bg-secondary group-hover:text-white transition-all">
                                            {item.quantity}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold tracking-tight">{item.name}</h3>
                                            {item.notes && <p className="text-sm text-secondary italic font-medium mt-1">Note: {item.notes}</p>}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-secondary text-lg border border-white/5 transition-all">
                                            1
                                        </div>
                                        <p className="text-lg font-bold tracking-tight">{order.items}</p>
                                    </div>
                                )}
                            </div>

                            {/* Ticket Actions */}
                            <div className="p-6 bg-black/20 border-t border-white/5">
                                {order.status === 'PENDING' ? (
                                    <button
                                        onClick={() => updateStatus(order.id, 'PREPARING')}
                                        className="w-full bg-secondary hover:bg-orange-600 text-white font-bold py-5 rounded-2xl shadow-lg transition-all active:transform active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                                    >
                                        START PREPARING <ArrowRight className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => updateStatus(order.id, 'READY')}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-5 rounded-2xl shadow-[0_0_20px_rgba(22,163,74,0.3)] transition-all active:transform active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                                    >
                                        MARK AS READY <CheckCircle2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {activeOrders.length === 0 && (
                        <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
                            <AlertCircle className="w-16 h-16 mb-4" />
                            <p className="font-bold text-center px-10 italic">Waiting for incoming tickets...</p>
                        </div>
                    )}
                </div>

                {/* KDS Stats Footer */}
                <div className="mt-8 flex gap-8">
                    <div className="bg-[#252525] p-6 rounded-3xl border border-white/5 flex-1 flex items-center justify-between shadow-lg">
                        <span className="text-sm font-bold opacity-40 uppercase tracking-widest">Active Tickets</span>
                        <span className="text-3xl font-display font-bold text-secondary">{activeOrders.length}</span>
                    </div>
                    <div className="bg-[#252525] p-6 rounded-3xl border border-white/5 flex-1 flex items-center justify-between shadow-lg">
                        <span className="text-sm font-bold opacity-40 uppercase tracking-widest">Urgent Tickets (10m+)</span>
                        <span className="text-3xl font-display font-bold text-red-500">0</span>
                    </div>
                    <div className="bg-primary p-6 rounded-3xl border border-accent/20 flex-1 flex items-center justify-between shadow-xl">
                        <span className="text-sm font-bold text-white/50 uppercase tracking-widest">Completed Today</span>
                        <span className="text-3xl font-display font-bold text-accent">{completedToday}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KDS;
