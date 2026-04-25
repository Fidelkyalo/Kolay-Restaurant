import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, Package, DollarSign, Calendar, MessageSquare, Clock, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard() {
    const [viewMode, setViewMode] = useState('Weekly');
    const [inventory] = useState(() => {
        const saved = localStorage.getItem('kolay_inventory');
        return saved ? JSON.parse(saved) : [];
    });

    const [orders] = useState(() => {
        const saved = localStorage.getItem('kolay_orders');
        return saved ? JSON.parse(saved) : [];
    });

    const [archive] = useState(() => {
        const saved = localStorage.getItem('kolay_archive');
        return saved ? JSON.parse(saved) : [];
    });

    const [notes, setNotes] = useState(() => {
        const saved = localStorage.getItem('kolay_dashboard_notes');
        return saved ? JSON.parse(saved) : "Great sales today! Need to restock on Beef Burger patties soon.";
    });

    // Auto-Reset Logic (24h)
    React.useEffect(() => {
        const lastReset = localStorage.getItem('kolay_last_reset');
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        if (!lastReset || (now - parseInt(lastReset)) > oneDay) {
            // Self-cleaning: Archive current orders and clear active pool
            const activePool = JSON.parse(localStorage.getItem('kolay_orders') || '[]');
            if (activePool.length > 0) {
                const currentArchive = JSON.parse(localStorage.getItem('kolay_archive') || '[]');
                localStorage.setItem('kolay_archive', JSON.stringify([...activePool, ...currentArchive]));
            }
            localStorage.setItem('kolay_orders', JSON.stringify([]));
            localStorage.setItem('kolay_last_reset', now.toString());
            console.log('Daily system reset completed.');
        }
    }, []);

    const alerts = inventory.filter(item => item.status === 'LOW' || item.status === 'OUT');
    const activeOrders = orders.filter(o => o.status === 'In Progress' || o.status === 'Pending');

    const totalRevenue = orders.reduce((sum, order) => {
        const val = parseInt(order.total.replace(/[^0-9]/g, '')) || 0;
        return sum + val;
    }, 0);

    const totalCustomers = new Set(orders.map(o => o.table)).size;

    // Functional Load Calculation
    const grillLoad = Math.min(100, activeOrders.filter(o => {
        const str = Array.isArray(o.items) ? o.items.map(i => i.name).join(' ') : o.items;
        const low = str.toLowerCase();
        return low.includes('burger') || low.includes('wings') || low.includes('salmon');
    }).length * 30);

    const pizzaLoad = Math.min(100, activeOrders.filter(o => {
        const str = Array.isArray(o.items) ? o.items.map(i => i.name).join(' ') : o.items;
        return str.toLowerCase().includes('pizza');
    }).length * 40);

    // Dynamic Chart Data from Archive
    const getChartData = () => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return {
                label: d.toLocaleDateString('en-US', { weekday: 'short' }),
                dateStr: d.toLocaleDateString('en-CA') // YYYY-MM-DD
            };
        });

        return last7Days.map(day => {
            const dayOrders = archive.filter(o => o.timestamp && o.timestamp.startsWith(day.dateStr));
            const revenue = dayOrders.reduce((sum, o) => sum + (parseInt(o.total.replace(/[^0-9]/g, '')) || 0), 0);

            return {
                name: day.label,
                revenue: revenue || 0,
                orders: dayOrders.length
            };
        });
    };

    const realChartData = getChartData();

    return (
        <div className="min-h-screen bg-bg-cream text-charcoal font-body">
            {/* Navigation */}
            <nav className="bg-primary text-white py-4 px-8 flex justify-between items-center shadow-lg sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <img src="/Logo.png" alt="Kolay Logo" className="h-10 w-auto rounded" />
                    <span className="text-2xl font-display font-bold tracking-tight">KOLAY</span>
                </div>
                <div className="hidden md:flex gap-8 font-medium">
                    <Link to="/dashboard" className="hover:text-secondary transition-colors underline decoration-secondary decoration-2 underline-offset-8">Dashboard</Link>
                    <Link to="/pos" className="hover:text-secondary transition-colors">Menu</Link>
                    <Link to="/kds" className="hover:text-secondary transition-colors">KDS</Link>
                    <Link to="/inventory" className="hover:text-secondary transition-colors">Inventory</Link>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to clear all orders and start over?')) {
                                localStorage.removeItem('kolay_orders');
                                window.location.reload();
                            }
                        }}
                        className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all border border-red-500/20"
                    >
                        Reset System
                    </button>
                    <div className="bg-accent text-primary px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                        Admin Panel
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary-dark border-2 border-accent flex items-center justify-center cursor-pointer shadow-md">
                        <span className="font-bold text-accent">FK</span>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-8 py-12">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">Welcome back, Fidel</h1>
                    <p className="text-charcoal/70 text-lg">Here's what's happening at Kolay Restaurant today.</p>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Revenue', value: `KES ${totalRevenue.toLocaleString()}`, icon: '💰', trend: '0%', color: 'border-l-secondary', path: '/dashboard' },
                        { label: 'Active Orders', value: activeOrders.length.toString(), icon: '📝', trend: `${activeOrders.length} pending`, color: 'border-l-accent', path: '/pos' },
                        { label: 'Total Customers', value: totalCustomers.toLocaleString(), icon: '👥', trend: `${orders.length} orders`, color: 'border-l-primary', path: '/dashboard' },
                        { label: 'Stock Alerts', value: `${alerts.length} Items`, icon: '⚠️', trend: alerts.length > 0 ? 'Refill needed' : 'All good', color: 'border-l-red-500', path: '/inventory' },
                    ].map((stat, i) => (
                        <Link key={i} to={stat.path} className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 ${stat.color} hover:shadow-md transition-shadow cursor-pointer block`}>
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-3xl">{stat.icon}</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded bg-cream border transition-all ${stat.trend.includes('+') ? 'text-green-600 border-green-100' : 'text-secondary border-orange-100'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <h3 className="text-sm font-bold text-charcoal/50 uppercase tracking-wider">{stat.label}</h3>
                            <p className="text-2xl font-bold text-primary">{stat.value}</p>
                        </Link>
                    ))}
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Orders - Larger */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-cream">
                            <div className="p-6 border-b border-cream flex justify-between items-center bg-white">
                                <h2 className="text-xl font-bold text-primary">Recent Orders</h2>
                                <Link to="/pos" className="text-secondary font-bold text-sm hover:underline">View All</Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-bg-cream/50 text-charcoal/60 text-sm">
                                            <th className="px-6 py-4 font-bold">Order ID</th>
                                            <th className="px-6 py-4 font-bold">Table</th>
                                            <th className="px-6 py-4 font-bold">Items</th>
                                            <th className="px-6 py-4 font-bold">Total</th>
                                            <th className="px-6 py-4 font-bold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-cream">
                                        {[...orders]
                                            .filter(o => o.status !== 'SERVED')
                                            .reverse()
                                            .slice(0, 5)
                                            .map((order, i) => (
                                                <tr key={i} className="hover:bg-bg-cream/30 transition-colors cursor-pointer group">
                                                    <td className="px-6 py-4 font-bold text-primary group-hover:text-secondary">{order.id}</td>
                                                    <td className="px-6 py-4">{order.table}</td>
                                                    <td className="px-6 py-4 text-sm text-charcoal/70">
                                                        {Array.isArray(order.items)
                                                            ? order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')
                                                            : order.items}
                                                    </td>
                                                    <td className="px-6 py-4 font-bold">{order.total}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.status === 'PENDING' ? 'bg-gray-100 text-gray-600' :
                                                            order.status === 'PREPARING' ? 'bg-orange-100 text-secondary' :
                                                                'bg-green-100 text-green-700'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Statistics Graph Section */}
                        <div className="bg-white p-8 rounded-3xl border border-cream shadow-sm relative overflow-hidden">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-secondary" />
                                        System Statistics
                                    </h2>
                                    <p className="text-charcoal/50 text-sm">Real-time revenue & order trends from archive</p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-xs font-bold border border-green-100 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Auto-Reset: 24h
                                    </div>
                                </div>
                            </div>

                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={realChartData}>
                                        <defs>
                                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#d35400" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#d35400" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#888', fontSize: 10, fontWeight: 'bold' }}
                                            dy={10}
                                        />
                                        <YAxis hide />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#d35400"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorRev)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Comments/Notes Section within Graph Area */}
                            <div className="mt-8 pt-8 border-t border-cream grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div className="bg-bg-cream/50 p-6 rounded-2xl border border-cream/50">
                                    <h4 className="text-xs font-black uppercase text-charcoal/40 mb-3 flex items-center gap-2">
                                        <MessageSquare className="w-3 h-3" /> Management Notes
                                    </h4>
                                    <textarea
                                        className="w-full bg-transparent border-none outline-none text-sm text-primary font-medium resize-none h-20"
                                        value={notes}
                                        onChange={(e) => {
                                            setNotes(e.target.value);
                                            localStorage.setItem('kolay_dashboard_notes', JSON.stringify(e.target.value));
                                        }}
                                        placeholder="Add performance notes here..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-primary text-white rounded-2xl shadow-lg">
                                        <p className="text-[10px] font-bold opacity-60 uppercase mb-1">Peak Day</p>
                                        <p className="text-xl font-black">Friday</p>
                                    </div>
                                    <div className="p-4 bg-secondary text-white rounded-2xl shadow-lg">
                                        <p className="text-[10px] font-bold opacity-60 uppercase mb-1">Avg Ticket</p>
                                        <p className="text-xl font-black">KES 1,250</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Side Module: Quick Actions */}
                    <div className="space-y-6">
                        <div className="bg-primary p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 transform scale-150 group-hover:scale-175 transition-transform">
                                <img src="/Logo.png" alt="" className="w-32 h-32" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 relative z-10">Quick Order</h3>
                            <p className="text-white/70 mb-6 text-sm relative z-10">Generate a new POS order quickly from here.</p>
                            <Link to="/pos" className="w-full bg-secondary hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:transform active:scale-95 relative z-10 flex items-center justify-center">
                                + Create New Order
                            </Link>
                        </div>

                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-cream">
                            <h3 className="text-lg font-bold text-primary mb-4">Kitchen Load</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">Grill Station</span>
                                        <span className={`font-bold ${grillLoad > 70 ? 'text-secondary' : 'text-primary'}`}>{grillLoad}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-cream rounded-full overflow-hidden">
                                        <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: `${grillLoad}%` }}></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">Pizza Oven</span>
                                        <span className={`font-bold ${pizzaLoad > 70 ? 'text-secondary' : 'text-primary'}`}>{pizzaLoad}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-cream rounded-full overflow-hidden">
                                        <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${pizzaLoad}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stock Alerts Panel */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-cream">
                            <div className="flex items-center gap-2 mb-6">
                                <AlertTriangle className="text-secondary w-5 h-5" />
                                <h3 className="text-lg font-bold text-primary">Inventory Alerts</h3>
                            </div>
                            <div className="space-y-4">
                                {alerts.length > 0 ? alerts.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-bg-cream/50 rounded-xl border border-cream/30">
                                        <div>
                                            <p className="font-bold text-sm text-primary">{item.name}</p>
                                            <p className="text-[10px] text-charcoal/40 uppercase font-bold">Current: {item.stock} {item.unit}</p>
                                        </div>
                                        <span className={`font-bold text-xs px-2 py-1 rounded-lg ${item.status === 'OUT' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                            {item.status === 'OUT' ? 'OUT' : 'LOW'}
                                        </span>
                                    </div>
                                )) : (
                                    <div className="text-center py-6">
                                        <p className="text-sm text-charcoal/40 font-bold italic">All items well stocked</p>
                                    </div>
                                )}
                            </div>
                            <Link to="/inventory" className="w-full mt-6 py-3 border-2 border-dashed border-cream rounded-2xl text-xs font-bold text-charcoal/40 hover:text-secondary hover:border-secondary/50 transition-all flex items-center justify-center">
                                Manage Inventory
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="max-w-7xl mx-auto px-8 py-8 border-t border-cream flex flex-col md:flex-row justify-between items-center text-charcoal/50 text-sm">
                <p>© 2026 Kolay Restaurant Management System. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-primary">Support</a>
                    <a href="#" className="hover:text-primary">Privacy Policy</a>
                    <a href="#" className="hover:text-primary">User Guide</a>
                </div>
            </footer>
        </div>
    );
}

export default Dashboard;
