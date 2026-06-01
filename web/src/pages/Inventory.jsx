import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Plus, Search, RefreshCw, Filter, TrendingDown, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { isAdmin } from '../hooks/useRole';

// Low-stock threshold — items below this number are flagged LOW
const LOW_THRESHOLD = 20;

// Status is always derived from stock quantity — never stored manually
const deriveStatus = (stock) => {
    if (stock === 0) return 'OUT';
    if (stock < LOW_THRESHOLD) return 'LOW';
    return 'OK';
};

const INITIAL_INVENTORY = [
    { id: 1, name: 'Beef Burger Patties', stock: 12, unit: 'units', category: 'Meat'     },
    { id: 2, name: 'Fresh Salmon',         stock: 5,  unit: 'kg',    category: 'Fish'     },
    { id: 3, name: 'Cooking Oil',          stock: 45, unit: 'L',     category: 'Supplies' },
    { id: 4, name: 'Burger Buns',          stock: 120,unit: 'units', category: 'Bakery'   },
    { id: 5, name: 'French Fries',         stock: 0,  unit: 'kg',    category: 'Produce'  },
    { id: 6, name: 'Tomato Sauce',         stock: 8,  unit: 'L',     category: 'Supplies' },
    { id: 7, name: 'Chicken Breast',       stock: 30, unit: 'kg',    category: 'Meat'     },
    { id: 8, name: 'Pasta',                stock: 3,  unit: 'kg',    category: 'Dry Goods'},
];

const Inventory = () => {
    const adminMode = isAdmin();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Items');
    const [isSyncing, setIsSyncing] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', category: 'Produce', stock: '', unit: 'units' });

    const [inventory, setInventory] = useState(() => {
        const saved = localStorage.getItem('kolay_inventory');
        // Strip any stored status field — always recompute
        return saved
            ? JSON.parse(saved).map(i => ({ ...i, status: deriveStatus(i.stock) }))
            : INITIAL_INVENTORY.map(i => ({ ...i, status: deriveStatus(i.stock) }));
    });

    // Persist whenever inventory changes; status is always recomputed on load
    useEffect(() => {
        localStorage.setItem('kolay_inventory', JSON.stringify(inventory));
    }, [inventory]);

    // Recompute status whenever stock changes
    const updateStock = (id, delta) => {
        setInventory(prev => prev.map(item => {
            if (item.id !== id) return item;
            const newStock = Math.max(0, item.stock + delta);
            return { ...item, stock: newStock, status: deriveStatus(newStock) };
        }));
    };

    // Admin: set exact stock value
    const setStockExact = (id, value) => {
        const n = Math.max(0, parseInt(value) || 0);
        setInventory(prev => prev.map(item =>
            item.id === id ? { ...item, stock: n, status: deriveStatus(n) } : item
        ));
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItem.name.trim() || newItem.stock === '') return;
        const stock = parseInt(newItem.stock) || 0;
        setInventory(prev => [{
            id: Date.now(),
            name: newItem.name.trim(),
            stock,
            unit: newItem.unit,
            category: newItem.category,
            status: deriveStatus(stock),
        }, ...prev]);
        setNewItem({ name: '', category: 'Produce', stock: '', unit: 'units' });
        setShowAddModal(false);
    };

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 1200);
    };

    const filtered = inventory.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus =
            statusFilter === 'All Items' ||
            (statusFilter === 'Low Stock'    && item.status === 'LOW') ||
            (statusFilter === 'Out of Stock' && item.status === 'OUT') ||
            (statusFilter === 'Healthy'      && item.status === 'OK');
        return matchSearch && matchStatus;
    });

    // Summary counts — always live
    const outCount  = inventory.filter(i => i.status === 'OUT').length;
    const lowCount  = inventory.filter(i => i.status === 'LOW').length;
    const okCount   = inventory.filter(i => i.status === 'OK').length;

    const StatusBadge = ({ status }) => {
        if (status === 'OUT') return (
            <span className="inline-flex items-center gap-1.5 text-red-600 text-xs font-black">
                <XCircle className="w-4 h-4" /> OUT OF STOCK
            </span>
        );
        if (status === 'LOW') return (
            <span className="inline-flex items-center gap-1.5 text-secondary text-xs font-black">
                <TrendingDown className="w-4 h-4" /> LOW STOCK
            </span>
        );
        return (
            <span className="inline-flex items-center gap-1.5 text-green-600 text-xs font-black">
                <CheckCircle className="w-4 h-4" /> HEALTHY
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-bg-cream font-body">
            {/* Add Item Modal — admin only */}
            {showAddModal && adminMode && (
                <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-8 animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-primary">Add New Stock Item</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-charcoal/40 hover:text-primary text-2xl leading-none">&times;</button>
                        </div>
                        <form onSubmit={handleAddItem} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Item Name</label>
                                <input required autoFocus placeholder="e.g. Tomato Sauce"
                                    className="w-full bg-bg-cream border border-cream px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-semibold"
                                    value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Initial Stock</label>
                                    <input required type="number" placeholder="0" min="0"
                                        className="w-full bg-bg-cream border border-cream px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-bold text-primary"
                                        value={newItem.stock} onChange={e => setNewItem({ ...newItem, stock: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Unit</label>
                                    <select className="w-full bg-bg-cream border border-cream px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-bold appearance-none"
                                        value={newItem.unit} onChange={e => setNewItem({ ...newItem, unit: e.target.value })}>
                                        <option>units</option><option>kg</option><option>L</option><option>packs</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Category</label>
                                <select className="w-full bg-bg-cream border border-cream px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-bold appearance-none"
                                    value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
                                    <option>Produce</option><option>Meat</option><option>Fish</option>
                                    <option>Bakery</option><option>Supplies</option><option>Dry Goods</option>
                                </select>
                            </div>
                            {/* Live status preview */}
                            <div className="flex items-center gap-3 bg-bg-cream rounded-xl px-4 py-3 border border-cream">
                                <span className="text-[10px] font-black uppercase text-charcoal/40">Auto Status:</span>
                                <StatusBadge status={deriveStatus(parseInt(newItem.stock) || 0)} />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3 font-bold text-charcoal/40 hover:text-primary transition-colors">Cancel</button>
                                <button type="submit"
                                    className="flex-1 bg-secondary hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95">
                                    Add Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Navbar />

            <div className="p-6 md:p-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-primary flex items-center gap-3">
                            <Package className="text-secondary" /> Inventory Control
                        </h1>
                        <p className="text-charcoal/50 mt-1 text-sm">
                            Status updates automatically based on quantity.
                            <span className="ml-2 text-charcoal/30">Low threshold: &lt;{LOW_THRESHOLD} units</span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleSync}
                            className="bg-white border border-cream px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold text-sm shadow-sm hover:bg-cream transition-all">
                            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-secondary' : ''}`} />
                            {isSyncing ? 'Syncing...' : 'Sync'}
                        </button>
                        {adminMode && (
                            <button onClick={() => setShowAddModal(true)}
                                className="bg-primary text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold text-sm shadow-lg hover:bg-primary-dark transition-all active:scale-95">
                                <Plus className="w-4 h-4" /> Add Item
                            </button>
                        )}
                    </div>
                </header>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-red-500 text-white rounded-2xl p-5 shadow-sm">
                        <p className="text-3xl font-black">{outCount}</p>
                        <p className="text-sm opacity-75 font-bold mt-1">Out of Stock</p>
                    </div>
                    <div className="bg-secondary text-white rounded-2xl p-5 shadow-sm">
                        <p className="text-3xl font-black">{lowCount}</p>
                        <p className="text-sm opacity-75 font-bold mt-1">Low Stock</p>
                    </div>
                    <div className="bg-green-600 text-white rounded-2xl p-5 shadow-sm">
                        <p className="text-3xl font-black">{okCount}</p>
                        <p className="text-sm opacity-75 font-bold mt-1">Healthy</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Filters */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-3xl border border-cream shadow-sm">
                            <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                                <Filter className="w-4 h-4 text-secondary" /> Filters
                            </h3>
                            <div className="space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30 w-4 h-4" />
                                    <input type="text" placeholder="Search stock..."
                                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-bg-cream/50 border border-cream rounded-xl text-sm outline-none focus:ring-1 focus:ring-secondary" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest">Status</p>
                                    {['All Items', 'Low Stock', 'Out of Stock', 'Healthy'].map(f => (
                                        <label key={f} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="radio" name="filter" checked={statusFilter === f}
                                                onChange={() => setStatusFilter(f)}
                                                className="w-4 h-4 accent-secondary" />
                                            <span className={`text-sm ${statusFilter === f ? 'text-primary font-bold' : 'text-charcoal/70 group-hover:text-primary'}`}>{f}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-[2rem] shadow-sm border border-cream overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-bg-cream/50 border-b border-cream">
                                        <th className="px-6 py-4 text-sm font-bold text-charcoal/60">Product</th>
                                        <th className="px-6 py-4 text-sm font-bold text-charcoal/60">Category</th>
                                        <th className="px-6 py-4 text-sm font-bold text-charcoal/60">Stock</th>
                                        <th className="px-6 py-4 text-sm font-bold text-charcoal/60">Auto Status</th>
                                        <th className="px-6 py-4 text-sm font-bold text-charcoal/60 text-right">Adjust</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-cream">
                                    {filtered.map(item => (
                                        <tr key={item.id} className={`hover:bg-bg-cream/30 transition-colors ${item.status === 'OUT' ? 'bg-red-50/30' : item.status === 'LOW' ? 'bg-orange-50/30' : ''}`}>
                                            <td className="px-6 py-5">
                                                <p className="font-bold text-primary">{item.name}</p>
                                                <p className="text-[10px] text-charcoal/40 uppercase font-bold">SKU: KOL-{String(item.id).slice(-4)}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-[10px] font-black uppercase px-3 py-1 bg-bg-cream border border-cream rounded-full text-charcoal/60">{item.category}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                {adminMode ? (
                                                    /* Admin: editable number input */
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number" min="0"
                                                            className="w-20 bg-bg-cream border border-cream px-3 py-1.5 rounded-xl font-black text-primary text-sm outline-none focus:ring-2 focus:ring-secondary/20"
                                                            value={item.stock}
                                                            onChange={e => setStockExact(item.id, e.target.value)}
                                                        />
                                                        <span className="text-xs text-charcoal/40 font-bold">{item.unit}</span>
                                                    </div>
                                                ) : (
                                                    /* Staff: read-only display */
                                                    <span>
                                                        <span className="font-black text-primary text-lg">{item.stock}</span>
                                                        <span className="text-xs text-charcoal/40 font-bold ml-1">{item.unit}</span>
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                <StatusBadge status={item.status} />
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => updateStock(item.id, -1)}
                                                        className="w-8 h-8 rounded-lg border border-cream flex items-center justify-center font-black hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-sm">
                                                        −
                                                    </button>
                                                    <button onClick={() => updateStock(item.id, 1)}
                                                        className="w-8 h-8 rounded-lg border border-cream flex items-center justify-center font-black hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors text-sm">
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filtered.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-20 text-center text-charcoal/30 font-bold">
                                                No items match your search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
