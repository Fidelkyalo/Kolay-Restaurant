import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, Package, DollarSign, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
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
                        { label: 'Total Revenue', value: 'KES 45,280', icon: '💰', trend: '+12.5%', color: 'border-l-secondary' },
                        { label: 'Active Orders', value: '24', icon: '📝', trend: '8 pending', color: 'border-l-accent' },
                        { label: 'Total Customers', value: '1,204', icon: '👥', trend: '+48 today', color: 'border-l-primary' },
                        { label: 'Stock Alerts', value: '3 Items', icon: '⚠️', trend: 'Refill needed', color: 'border-l-red-500' },
                    ].map((stat, i) => (
                        <div key={i} className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 ${stat.color} hover:shadow-md transition-shadow cursor-pointer`}>
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-3xl">{stat.icon}</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded bg-cream border transition-all ${stat.trend.includes('+') ? 'text-green-600 border-green-100' : 'text-secondary border-orange-100'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <h3 className="text-sm font-bold text-charcoal/50 uppercase tracking-wider">{stat.label}</h3>
                            <p className="text-2xl font-bold text-primary">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Orders - Larger */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-cream">
                            <div className="p-6 border-b border-cream flex justify-between items-center bg-white">
                                <h2 className="text-xl font-bold text-primary">Recent Orders</h2>
                                <button className="text-secondary font-bold text-sm hover:underline">View All</button>
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
                                        {[
                                            { id: '#8902', table: 'T-04', items: '2x Beef Burger, 1x Fries', total: 'KES 2,400', status: 'In Progress', statusColor: 'bg-orange-100 text-orange-700' },
                                            { id: '#8901', table: 'T-12', items: '1x Grilled Salmon', total: 'KES 1,850', status: 'Ready', statusColor: 'bg-green-100 text-green-700' },
                                            { id: '#8900', table: 'T-02', items: '3x Chicken Wings', total: 'KES 1,200', status: 'Served', statusColor: 'bg-blue-100 text-blue-700' },
                                            { id: '#8899', table: 'T-08', items: '1x Margherita Pizza', total: 'KES 1,100', status: 'Pending', statusColor: 'bg-gray-100 text-gray-700' },
                                        ].map((order, i) => (
                                            <tr key={i} className="hover:bg-bg-cream/30 transition-colors cursor-pointer group">
                                                <td className="px-6 py-4 font-bold text-primary group-hover:text-secondary">{order.id}</td>
                                                <td className="px-6 py-4">{order.table}</td>
                                                <td className="px-6 py-4 text-sm text-charcoal/70">{order.items}</td>
                                                <td className="px-6 py-4 font-bold">{order.total}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.statusColor}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Revenue Visualization Mock */}
                        <div className="bg-white p-8 rounded-3xl border border-cream shadow-sm">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-xl font-bold text-primary">Revenue Trends</h2>
                                    <p className="text-charcoal/50 text-sm">Last 7 days performance</p>
                                </div>
                                <div className="flex bg-bg-cream p-1 rounded-xl">
                                    <button className="px-4 py-1.5 rounded-lg bg-white shadow-sm text-xs font-bold text-primary">Weekly</button>
                                    <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-charcoal/40 hover:text-primary transition-colors">Monthly</button>
                                </div>
                            </div>
                            <div className="h-64 flex items-end gap-4 px-2">
                                {[35, 45, 30, 60, 85, 45, 95].map((val, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center group">
                                        <div
                                            className="w-full bg-secondary/10 rounded-t-xl group-hover:bg-secondary transition-all relative"
                                            style={{ height: `${val}%` }}
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                KES {(val * 1000).toLocaleString()}
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-charcoal/30 mt-3 uppercase">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
                                    </div>
                                ))}
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
                                        <span className="font-bold text-secondary">85%</span>
                                    </div>
                                    <div className="h-2 w-full bg-cream rounded-full overflow-hidden">
                                        <div className="h-full bg-secondary rounded-full" style={{ width: '85%' }}></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">Pizza Oven</span>
                                        <span className="font-bold text-accent">40%</span>
                                    </div>
                                    <div className="h-2 w-full bg-cream rounded-full overflow-hidden">
                                        <div className="h-full bg-accent rounded-full" style={{ width: '40%' }}></div>
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
                                {[
                                    { name: 'Beef Patties', current: '12 units', threshold: '20 units', color: 'text-red-500' },
                                    { name: 'Fresh Salmon', current: '5 kg', threshold: '8 kg', color: 'text-red-500' },
                                    { name: 'Cooking Oil', current: '10 L', threshold: '15 L', color: 'text-orange-500' },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-bg-cream/50 rounded-xl border border-cream/30">
                                        <div>
                                            <p className="font-bold text-sm text-primary">{item.name}</p>
                                            <p className="text-[10px] text-charcoal/40 uppercase font-bold">Min: {item.threshold}</p>
                                        </div>
                                        <span className={`font-bold text-sm ${item.color}`}>{item.current}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-3 border-2 border-dashed border-cream rounded-2xl text-xs font-bold text-charcoal/40 hover:text-secondary hover:border-secondary/50 transition-all">
                                Manage Inventory
                            </button>
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
