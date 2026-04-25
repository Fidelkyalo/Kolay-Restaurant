import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, Search, ArrowLeft, RefreshCw, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Inventory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Items');
    const [isSyncing, setIsSyncing] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', category: 'Produce', stock: '', unit: 'units' });
    const [inventory, setInventory] = useState([
        { id: 1, name: 'Beef Patties', stock: 12, unit: 'units', status: 'LOW', category: 'Meat' },
        { id: 2, name: 'Fresh Salmon', stock: 5, unit: 'kg', status: 'LOW', category: 'Fish' },
        { id: 3, name: 'Cooking Oil', stock: 45, unit: 'L', status: 'OK', category: 'Supplies' },
        { id: 4, name: 'Burger Buns', stock: 120, unit: 'units', status: 'OK', category: 'Bakery' },
        { id: 5, name: 'French Fries', stock: 8, unit: 'kg', status: 'OUT', category: 'Produce' },
    ]);

    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All Items' ||
            (statusFilter === 'Low Stock' && item.status === 'LOW') ||
            (statusFilter === 'Out of Stock' && item.status === 'OUT') ||
            (statusFilter === 'Healthy' && item.status === 'OK');
        return matchesSearch && matchesStatus;
    });

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 2000);
    };

    const handleUpdateStock = (id, amount) => {
        setInventory(prev => prev.map(item => {
            if (item.id === id) {
                const newStock = Math.max(0, item.stock + amount);
                let newStatus = 'OK';
                if (newStock === 0) newStatus = 'OUT';
                else if (newStock < 20) newStatus = 'LOW';
                return { ...item, stock: newStock, status: newStatus };
            }
            return item;
        }));
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.stock) return;

        const itemToAdd = {
            id: inventory.length + 1,
            name: newItem.name,
            stock: parseInt(newItem.stock),
            unit: newItem.unit,
            status: parseInt(newItem.stock) < 20 ? 'LOW' : 'OK',
            category: newItem.category
        };

        setInventory([itemToAdd, ...inventory]);
        setNewItem({ name: '', category: 'Produce', stock: '', unit: 'units' });
        setShowAddModal(false);
    };

    return (
        <div className="min-h-screen bg-bg-cream p-8 font-body relative">
            {/* Modal Overlay */}
            {showAddModal && (
                <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-2xl font-bold text-primary mb-6">Onboard New Stock</h3>
                        <form onSubmit={handleAddItem} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Item Name</label>
                                <input
                                    autoFocus
                                    placeholder="e.g. Tomato Sauce"
                                    className="w-full bg-bg-cream border border-cream px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20"
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Initial Stock</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full bg-bg-cream border border-cream px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20"
                                        value={newItem.stock}
                                        onChange={e => setNewItem({ ...newItem, stock: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Unit</label>
                                    <select
                                        className="w-full bg-bg-cream border border-cream px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-bold"
                                        value={newItem.unit}
                                        onChange={e => setNewItem({ ...newItem, unit: e.target.value })}
                                    >
                                        <option>units</option>
                                        <option>kg</option>
                                        <option>L</option>
                                        <option>packs</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Category</label>
                                <select
                                    className="w-full bg-bg-cream border border-cream px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-bold"
                                    value={newItem.category}
                                    onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                >
                                    <option>Produce</option>
                                    <option>Meat</option>
                                    <option>Fish</option>
                                    <option>Bakery</option>
                                    <option>Supplies</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3 font-bold text-charcoal/40 hover:text-primary transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-secondary hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-secondary/20 transition-all active:scale-95"
                                >
                                    Confirm Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                    <button
                        onClick={handleSync}
                        className="flex-1 md:flex-none bg-white border border-cream px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-sm hover:bg-cream transition-all group"
                    >
                        <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-secondary' : ''}`} />
                        {isSyncing ? 'Syncing...' : 'Sync Stock'}
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex-1 md:flex-none bg-primary text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-lg hover:bg-primary-dark transition-all active:scale-95"
                    >
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
                                <input
                                    type="text"
                                    placeholder="Search stock..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-bg-cream/50 border border-cream rounded-xl text-sm outline-none focus:ring-1 focus:ring-secondary"
                                />
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest">Status</p>
                                {['All Items', 'Low Stock', 'Out of Stock', 'Healthy'].map(f => (
                                    <label key={f} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="filter"
                                            checked={statusFilter === f}
                                            onChange={() => setStatusFilter(f)}
                                            className="w-4 h-4 text-secondary accent-secondary"
                                        />
                                        <span className={`text-sm ${statusFilter === f ? 'text-primary font-bold' : 'text-charcoal/70 group-hover:text-primary'}`}>{f}</span>
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
                                    <th className="px-8 py-5 text-sm font-bold text-charcoal/60 text-right">Adjust Stock</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cream">
                                {filteredInventory.map((item) => (
                                    <tr key={item.id} className="hover:bg-bg-cream/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-primary">{item.name}</p>
                                            <p className="text-[10px] text-charcoal/40 uppercase font-bold tracking-tight">SKU: KOL-{item.id}00X</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-black uppercase px-3 py-1 bg-bg-cream border border-cream rounded-full text-charcoal/60">{item.category}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-black text-primary text-lg">{item.stock}</span> <span className="text-xs text-charcoal/40 font-bold">{item.unit}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {item.status === 'LOW' && (
                                                <span className="flex items-center gap-1.5 text-secondary text-xs font-black">
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
                                            <div className="flex justify-end gap-2 text-xs font-black">
                                                <button
                                                    onClick={() => handleUpdateStock(item.id, -1)}
                                                    className="w-8 h-8 rounded-lg border border-cream flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors"
                                                >
                                                    -
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStock(item.id, 1)}
                                                    className="w-8 h-8 rounded-lg border border-cream flex items-center justify-center hover:bg-green-50 hover:text-green-600 transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredInventory.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center text-charcoal/30 font-bold">
                                            No stock items match your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
