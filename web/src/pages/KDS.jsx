import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle, ChefHat, Timer, ArrowRight, History, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { OrderService } from '../services/api';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

const KDS = () => {
    const { t } = useLanguage();
    const [allOrders, setAllOrders] = useState([]);
    const activeOrders = allOrders.filter(o => o.status === 'PENDING' || o.status === 'PREPARING');
    const completedToday = allOrders.filter(o => o.status === 'READY' || o.status === 'SERVED').length;

    const loadOrders = () => {
        // Merge backend orders with local orders (local takes precedence for status)
        const localOrders = (() => {
            try { return JSON.parse(localStorage.getItem('kolay_orders') || '[]'); }
            catch { return []; }
        })();
        setAllOrders(localOrders);
    };

    const fetchFromBackend = async () => {
        try {
            const res = await OrderService.getActiveOrders();
            if (res.data && res.data.length > 0) {
                // Merge backend orders into local storage so they appear in KDS
                const localOrders = (() => {
                    try { return JSON.parse(localStorage.getItem('kolay_orders') || '[]'); }
                    catch { return []; }
                })();
                const localIds = new Set(localOrders.map(o => String(o.id)));
                // Add any backend orders not already in local
                const newOrders = res.data
                    .filter(o => !localIds.has(String(o.id)))
                    .map(o => ({
                        id: o.id,
                        table: o.tableNumber || o.table || 'Online Order',
                        items: (o.items || []).map(i => ({
                            name: i.productName || i.name || 'Item',
                            quantity: i.quantity || 1,
                            price: i.price || 0,
                        })),
                        total: `KES ${(o.totalAmount || 0).toLocaleString()}`,
                        subtotal: o.subtotal || o.totalAmount || 0,
                        tax: o.tax || 0,
                        totalAmount: o.totalAmount || 0,
                        status: o.status || 'PENDING',
                        paymentStatus: o.paymentStatus || 'UNPAID',
                        timestamp: o.createdAt || new Date().toISOString(),
                        guestName: o.guestName,
                        guestPhone: o.guestPhone,
                        source: 'online',
                    }));
                if (newOrders.length > 0) {
                    const merged = [...newOrders, ...localOrders];
                    localStorage.setItem('kolay_orders', JSON.stringify(merged));
                    setAllOrders(merged);
                    window.dispatchEvent(new Event('storage'));
                }
            }
        } catch (err) {
            // Backend unavailable - fall back to local only
        }
    };

    useEffect(() => {
        loadOrders();
        fetchFromBackend();
        // Poll backend every 15 seconds for new online orders
        const pollInterval = setInterval(fetchFromBackend, 15000);
        // Listen for same-tab and cross-tab storage updates
        window.addEventListener('storage', loadOrders);
        return () => {
            clearInterval(pollInterval);
            window.removeEventListener('storage', loadOrders);
        };
    }, []);

    const updateStatus = (id, newStatus) => {
        const updated = allOrders.map(order =>
            order.id === id ? { ...order, status: newStatus } : order
        );
        localStorage.setItem('kolay_orders', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
        setAllOrders(updated);
    };

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-white font-body flex flex-col">
            <Navbar />
            <div className="p-4 sm:p-6 flex-1 flex flex-col overflow-hidden">
                {/* KDS Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 sm:mb-8 bg-[#252525] p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="bg-secondary p-2.5 sm:p-3 rounded-2xl shadow-lg shrink-0">
                            <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">{t('KITCHEN DISPLAY')}</h1>
                            <div className="flex flex-wrap gap-3 sm:gap-4 mt-1 text-xs sm:text-sm text-white/40">
                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {t('Live Tracking')}</span>
                                <span className="flex items-center gap-1 font-bold text-secondary"><Timer className="w-3.5 h-3.5" /> {t('Avg. Time: 15m')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <button className="bg-white/5 hover:bg-white/10 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl flex items-center gap-2 font-bold text-xs sm:text-sm transition-all border border-white/5 shadow-sm">
                            <History className="w-4 h-4 sm:w-5 sm:h-5" /> {t('History')}
                        </button>
                        <div className="bg-primary text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl flex items-center gap-2.5 sm:gap-3 border border-accent/20 shadow-[0_0_20px_rgba(78,44,30,0.5)] text-xs sm:text-sm">
                            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="font-bold tracking-wide">{t('STATION: MAIN GRILL')}</span>
                        </div>
                    </div>
                </div>

                {/* Orders Grid */}
                <div className="flex-1 overflow-x-auto pb-4 flex flex-col sm:flex-row gap-4 sm:gap-6 custom-scrollbar scroll-smooth">
                    {activeOrders.map((order) => (
                        <div
                            key={order.id}
                            className={`w-full sm:w-[380px] shrink-0 flex flex-col rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl transition-all border-2 ${order.status === 'PREPARING' ? 'border-secondary/50 bg-[#2a2a2a]' : 'border-white/5 bg-[#252525]'
                                }`}
                        >
                            {/* Ticket Header */}
                            <div className={`p-4 sm:p-6 flex justify-between items-center ${order.status === 'PREPARING' ? 'bg-secondary' : 'bg-white/5'}`}>
                                <div>
                                    <span className="text-[10px] sm:text-xs font-bold opacity-60 uppercase tracking-widest">{t(order.status)}</span>
                                    <h2 className="text-xl sm:text-2xl font-bold">{order.table}</h2>
                                    {order.source === 'online' && (
                                        <span className="text-[10px] font-black bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full uppercase tracking-widest mt-1 inline-block">🌐 {t('Online Order')}</span>
                                    )}
                                    {order.guestName && (
                                        <p className="text-xs opacity-60 mt-0.5">👤 {order.guestName}</p>
                                    )}
                                </div>
                                <div className="text-right text-xs font-bold opacity-60">
                                    <p>{order.id}</p>
                                    <p className="flex items-center gap-1 justify-end mt-1"><Clock className="w-3 h-3 text-secondary" /> {order.time || t('Just now')}</p>
                                </div>
                            </div>

                            {/* Ticket Body */}
                            <div className="p-6 sm:p-8 flex-1 space-y-4 sm:space-y-6 overflow-y-auto max-h-[300px] sm:max-h-none">
                                {Array.isArray(order.items) ? order.items.map((item, i) => (
                                    <div key={i} className="flex gap-3 sm:gap-4 group">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-secondary text-base sm:text-lg border border-white/5 group-hover:bg-secondary group-hover:text-white transition-all shrink-0">
                                            {item.quantity}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-base sm:text-lg font-bold tracking-tight">{t(item.name)}</h3>
                                            {item.notes && <p className="text-xs sm:text-sm text-secondary italic font-medium mt-1">{t('Note')}: {item.notes}</p>}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-secondary text-lg border border-white/5 transition-all">
                                            1
                                        </div>
                                        <p className="text-lg font-bold tracking-tight">{t(order.items)}</p>
                                    </div>
                                )}
                            </div>

                            {/* Ticket Actions */}
                            <div className="p-4 sm:p-6 bg-black/20 border-t border-white/5">
                                {order.status === 'PENDING' ? (
                                    <button
                                        onClick={() => updateStatus(order.id, 'PREPARING')}
                                        className="w-full bg-secondary hover:bg-orange-600 text-white font-bold py-4 sm:py-5 rounded-2xl shadow-lg transition-all active:transform active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs sm:text-sm"
                                    >
                                        {t('START PREPARING')} <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => updateStatus(order.id, 'READY')}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 sm:py-5 rounded-2xl shadow-[0_0_20px_rgba(22,163,74,0.3)] transition-all active:transform active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs sm:text-sm"
                                    >
                                        {t('MARK AS READY')} <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {activeOrders.length === 0 && (
                        <div className="w-full py-16 flex flex-col items-center justify-center opacity-20">
                            <AlertCircle className="w-14 h-14 mb-4" />
                            <p className="font-bold text-center px-6 italic">{t('Waiting for incoming tickets...')}</p>
                        </div>
                    )}
                </div>

                {/* KDS Stats Footer */}
                <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-[#252525] p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/5 flex items-center justify-between shadow-lg">
                        <span className="text-xs sm:text-sm font-bold opacity-40 uppercase tracking-widest">{t('Active Tickets')}</span>
                        <span className="text-2xl sm:text-3xl font-display font-bold text-secondary">{activeOrders.length}</span>
                    </div>
                    <div className="bg-[#252525] p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/5 flex items-center justify-between shadow-lg">
                        <span className="text-xs sm:text-sm font-bold opacity-40 uppercase tracking-widest">{t('Urgent Tickets (10m+)')}</span>
                        <span className="text-2xl sm:text-3xl font-display font-bold text-red-500">0</span>
                    </div>
                    <div className="bg-primary p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-accent/20 flex items-center justify-between shadow-xl">
                        <span className="text-xs sm:text-sm font-bold text-white/50 uppercase tracking-widest">{t('Completed Today')}</span>
                        <span className="text-2xl sm:text-3xl font-display font-bold text-accent">{completedToday}</span>
                    </div>
                </div>
            </div>
            <Footer variant="compact" />
        </div>
    );
};

export default KDS;
