import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, Package, DollarSign, Calendar, MessageSquare, Clock, RefreshCw, CheckCircle2, Printer } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard() {
    const [viewMode, setViewMode] = useState('Weekly');
    const [reportScope, setReportScope] = useState('Day');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
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

    const updateStatus = (id, newStatus) => {
        const saved = JSON.parse(localStorage.getItem('kolay_orders') || '[]');
        const updated = saved.map(order =>
            order.id === id ? { ...order, status: newStatus } : order
        );
        localStorage.setItem('kolay_orders', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage')); // Trigger refresh
        // Also update archive for consistency
        const arch = JSON.parse(localStorage.getItem('kolay_archive') || '[]');
        const updatedArch = arch.map(order =>
            order.id === id ? { ...order, status: newStatus } : order
        );
        localStorage.setItem('kolay_archive', JSON.stringify(updatedArch));
    };

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
        const data = {};
        const now = new Date();

        archive.forEach(order => {
            const date = new Date(order.timestamp);
            let key;

            if (viewMode === 'Monthly') {
                key = date.toLocaleString('default', { month: 'short' });
            } else if (viewMode === 'Hourly') {
                key = `${date.getHours()}h`;
            } else {
                key = date.toLocaleDateString('default', { weekday: 'short' });
            }

            const amount = parseFloat(order.total.replace('KES ', '').replace(',', '')) || 0;
            if (!data[key]) data[key] = { name: key, revenue: 0, orders: 0 };
            data[key].revenue += amount;
            data[key].orders += 1;
        });

        // Sort data logically
        const orderOfDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const orderOfMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return Object.values(data).sort((a, b) => {
            if (viewMode === 'Monthly') return orderOfMonths.indexOf(a.name) - orderOfMonths.indexOf(b.name);
            if (viewMode === 'Hourly') return parseInt(a.name) - parseInt(b.name);
            return orderOfDays.indexOf(a.name) - orderOfDays.indexOf(b.name);
        });
    };

    const getPeakStats = () => {
        const days = {};
        const months = {};
        const hours = {};

        archive.forEach(o => {
            const d = new Date(o.timestamp);
            const dayKey = d.toLocaleString('default', { weekday: 'long' });
            const monthKey = d.toLocaleString('default', { month: 'long' });
            const hourKey = `${d.getHours()}:00`;

            days[dayKey] = (days[dayKey] || 0) + 1;
            months[monthKey] = (months[monthKey] || 0) + 1;
            hours[hourKey] = (hours[hourKey] || 0) + 1;
        });

        const getTop = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1])[0] || ["N/A", 0];

        return {
            peakDay: getTop(days)[0],
            peakMonth: getTop(months)[0],
            peakHour: getTop(hours)[0]
        };
    };

    const { peakDay, peakMonth, peakHour } = getPeakStats();
    const realChartData = getChartData();

    const handlePrintReport = () => {
        const printWindow = window.open('', '_blank', 'width=1000,height=900');
        if (!printWindow) {
            alert('Popup blocked! Please allow popups to print reports.');
            return;
        }

        // Advanced Filtering based on Selection
        const filteredArchive = archive.filter(o => {
            const d = new Date(o.timestamp);
            if (reportScope === 'Day') {
                return d.toISOString().split('T')[0] === selectedDate;
            } else if (reportScope === 'Month') {
                return d.toISOString().startsWith(selectedDate.substring(0, 7));
            } else {
                return d.getFullYear().toString() === selectedDate.substring(0, 4);
            }
        });

        const totalRevenue = filteredArchive.reduce((sum, d) => sum + (parseFloat(d.total.replace('KES ', '').replace(',', '')) || 0), 0);
        const totalOrders = filteredArchive.length;

        const reportHtml = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Management Report - ${selectedDate}</title>
                    <style>
                        body { font-family: 'Inter', sans-serif; padding: 50px; color: #1a1a1a; line-height: 1.6; }
                        .header { border-bottom: 4px solid #4E2C1E; padding-bottom: 30px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
                        .restaurant-name { font-size: 36px; font-weight: 800; color: #4E2C1E; margin: 0; letter-spacing: -1px; }
                        .tagline { font-size: 16px; color: #E67E22; font-style: italic; margin-top: 5px; }
                        .report-meta { text-align: right; font-size: 14px; color: #666; }
                        .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 50px; }
                        .summary-card { background: #fdfdfd; border: 1px solid #eee; padding: 25px; border-radius: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
                        .summary-label { font-size: 11px; text-transform: uppercase; font-weight: 800; color: #999; margin-bottom: 10px; display: block; }
                        .summary-value { font-size: 24px; font-weight: 800; color: #4E2C1E; }
                        table { width: 100%; border-collapse: collapse; margin-top: 30px; background: white; }
                        th { text-align: left; background: #4E2C1E; color: white; padding: 18px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
                        td { padding: 18px; border-bottom: 1px solid #eee; font-size: 13px; }
                        tr:nth-child(even) { background: #fafafa; }
                        .footer { margin-top: 80px; text-align: center; font-size: 12px; color: #bbb; border-top: 1px solid #eee; padding-top: 30px; font-style: italic; }
                        .status-pill { padding: 4px 8px; rounded: 4px; font-size: 10px; font-weight: bold; background: #eee; }
                        @media print { .no-print { display: none; } }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div>
                            <h1 class="restaurant-name">KOLAY RESTAURANT</h1>
                            <p class="tagline">"Where Every Meal Feels Right"</p>
                        </div>
                        <div class="report-meta">
                            <strong style="color: #4E2C1E; font-size: 18px;">${reportScope.toUpperCase()} REPORT</strong><br>
                            Period: <strong>${selectedDate}</strong><br>
                            Printed: ${new Date().toLocaleString('en-GB')}
                        </div>
                    </div>

                    <div class="summary-grid">
                        <div class="summary-card">
                            <span class="summary-label">Total Revenue</span>
                            <div class="summary-value text-accent">KES ${totalRevenue.toLocaleString()}</div>
                        </div>
                        <div class="summary-card">
                            <span class="summary-label">Total Orders</span>
                            <div class="summary-value">${totalOrders}</div>
                        </div>
                        <div class="summary-card">
                            <span class="summary-label">Avg Order Value</span>
                            <div class="summary-value">KES ${totalOrders > 0 ? (totalRevenue / totalOrders).toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0}</div>
                        </div>
                    </div>

                    <h2 style="font-size: 20px; color: #4E2C1E; margin-bottom: 20px; border-left: 5px solid #E67E22; padding-left: 15px;">Transaction Log</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Order ID</th>
                                <th>Table/Mode</th>
                                <th>Items</th>
                                <th style="text-align: right;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredArchive.map(o => `
                                <tr>
                                    <td><strong>${new Date(o.timestamp).toLocaleTimeString('en-GB')}</strong></td>
                                    <td><span style="color: #E67E22; font-weight: bold;">${o.id}</span></td>
                                    <td>${o.table}</td>
                                    <td style="color: #666; font-size: 11px;">${o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</td>
                                    <td style="text-align: right; font-weight: bold;">${o.total}</td>
                                </tr>
                            `).join('')}
                            ${filteredArchive.length === 0 ? `<tr><td colspan="5" style="text-align: center; padding: 100px; color: #ccc;">No data found for the selected period</td></tr>` : ''}
                        </tbody>
                    </table>

                    <div class="footer">
                        KOLAY RESTAURANT MANAGEMENT SYSTEM - SECURE OPERATIONAL REPORTING<br>
                        123 Thome Street, Nairobi | Tel: +254 102 039 121 | Email: kolayrestaurant@gmail.com
                    </div>
                </body>
            </html>
        `;

        printWindow.document.write(reportHtml);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };

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
                    <div className="flex bg-cream p-1 rounded-2xl border border-primary/10 shadow-inner">
                        {['Day', 'Month', 'Year'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setReportScope(s)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${reportScope === s ? 'bg-primary text-white shadow-lg' : 'text-primary/40'}`}
                            >
                                {s.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <input
                        type={reportScope === 'Day' ? 'date' : reportScope === 'Month' ? 'month' : 'number'}
                        value={reportScope === 'Year' ? selectedDate.substring(0, 4) : selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-white border border-primary/10 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Year"
                    />
                    <button
                        onClick={handlePrintReport}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-xl text-xs font-black shadow-lg hover:bg-secondary transition-all active:scale-95"
                    >
                        <Printer className="w-4 h-4" /> GENERATE REPORT
                    </button>
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
                                            <th className="px-6 py-4 font-bold text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-cream">
                                        {[...orders]
                                            .slice(0, 10).map((order) => (
                                                <tr key={order.id} className="hover:bg-cream/50 transition-colors cursor-pointer group" onClick={() => navigate('/pos')}>
                                                    <td className="px-6 py-4 font-bold text-primary">{order.id}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-sm">{order.table}</span>
                                                            <span className="text-[10px] text-gray-400 capitalize">{new Date(order.timestamp).toLocaleTimeString()}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs max-w-xs truncate">{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</td>
                                                    <td className="px-6 py-4 font-bold">{order.total}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.status === 'PENDING' ? 'bg-gray-100 text-gray-600' :
                                                            order.status === 'PREPARING' ? 'bg-orange-100 text-secondary' :
                                                                order.status === 'READY' ? 'bg-green-100 text-green-700 animate-pulse' :
                                                                    'bg-blue-100 text-blue-700'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {order.status === 'READY' ? (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    updateStatus(order.id, 'SERVED');
                                                                }}
                                                                className="bg-primary hover:bg-secondary text-white text-[10px] font-black px-4 py-2 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ml-auto"
                                                            >
                                                                <CheckCircle2 className="w-3 h-3" /> MARK DELIVERED
                                                            </button>
                                                        ) : order.status === 'SERVED' ? (
                                                            <div className="flex items-center justify-end gap-2 text-green-600 text-[10px] font-black uppercase tracking-widest">
                                                                <CheckCircle2 className="w-3 h-3" /> DELIVERED
                                                            </div>
                                                        ) : null}
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
