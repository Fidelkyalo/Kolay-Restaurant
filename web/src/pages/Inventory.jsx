import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, Search, ArrowLeft, RefreshCw, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Inventory = () => {
    const [inventory, setInventory] = useState([
        { id: 1, name: 'Beef Patties', stock: 12, unit: 'units', status: 'LOW', category: 'Meat' },
        { id: 2, name: 'Fresh Salmon', stock: 5, unit: 'kg', status: 'LOW', category: 'Fish' },
        { id: 3, name: 'Cooking Oil', stock: 45, unit: 'L', status: 'OK', category: 'Supplies' },
        { id: 4, name: 'Burger Buns', stock: 120, unit: 'units', status: 'OK', category: 'Bakery' },
        { id: 5, name: 'French Fries', stock: 8, unit: 'kg', status: 'OUT', category: 'Produce' },
    ]);

    return (
        <div className="min-h-screen bg-bg-cream p-8 font-body">
            <Link to="/dashboard" className="flex items-center gap-2 text-charcoal/40 hover:text-secondary transition-colors mb-8 font-bold text-sm">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-display font-bold text-primary flex items-center gap-3">
                        <Package className="text-secondary" /> Inventory Control
                    </h1>
                    <p className="text-charcoal/50 mt-1">Manage and track your restaurant supplies in real-time.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none bg-white border border-cream px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-sm hover:bg-cream transition-all">
                        <RefreshCw className="w-4 h-4" /> Sync Stock
                    </button>
                    <button className="flex-1 md:flex-none bg-primary text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-lg hover:bg-primary-dark transition-all">
                        <Plus className="w-4 h-4" /> Add Item
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-cream shadow-sm">
                        <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                            <Filter className="w-4 h-4 text-secondary" /> Filters
                        </h3>
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30 w-4 h-4" />
                                <input type="text" placeholder="Search stock..." className="w-full pl-10 pr-4 py-2.5 bg-bg-cream/50 border border-cream rounded-xl text-sm outline-none focus:ring-1 focus:ring-secondary" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest">Status</p>
                                {['All Items', 'Low Stock', 'Out of Stock', 'Healthy'].map(f => (
                                    <label key={f} className="flex items-center gap-3 cursor-pointer group">
                                        <input type="radio" name="filter" className="w-4 h-4 text-secondary" />
                                        <span className="text-sm text-charcoal/70 group-hover:text-primary">{f}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Inventory Table */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-cream overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-bg-cream/50 border-b border-cream">
                                    <th className="px-8 py-5 text-sm font-bold text-charcoal/60">Product Name</th>
                                    <th className="px-8 py-5 text-sm font-bold text-charcoal/60">Category</th>
                                    <th className="px-8 py-5 text-sm font-bold text-charcoal/60">Stock Level</th>
                                    <th className="px-8 py-5 text-sm font-bold text-charcoal/60">Status</th>
                                    <th className="px-8 py-5 text-sm font-bold text-charcoal/60">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cream">
                                {inventory.map((item) => (
                                    <tr key={item.id} className="hover:bg-bg-cream/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-primary">{item.name}</p>
                                            <p className="text-[10px] text-charcoal/30 uppercase font-black">SKU: KOL-{item.id}00X</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-bold px-3 py-1 bg-bg-cream border border-cream rounded-full">{item.category}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-black text-primary">{item.stock}</span> <span className="text-xs text-charcoal/40 font-bold">{item.unit}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {item.status === 'LOW' && (
                                                <span className="flex items-center gap-1.5 text-orange-600 text-xs font-black">
                                                    <AlertTriangle className="w-4 h-4" /> LOW STOCK
                                                </span>
                                            )}
                                            {item.status === 'OUT' && (
                                                <span className="flex items-center gap-1.5 text-red-600 text-xs font-black">
                                                    <AlertTriangle className="w-4 h-4" /> OUT OF STOCK
                                                </span>
                                            )}
                                            {item.status === 'OK' && (
                                                <span className="flex items-center gap-1.5 text-green-600 text-xs font-black">
                                                    <div className="w-2 h-2 bg-green-600 rounded-full"></div> HEALTHY
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="text-secondary font-black text-xs hover:underline uppercase tracking-widest">Update</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
