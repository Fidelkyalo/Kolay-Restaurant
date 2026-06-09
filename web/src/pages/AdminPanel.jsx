import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Settings, Users, Shield, Database, Trash2, UtensilsCrossed,
    Plus, Edit3, X, Search, RefreshCw, AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { MenuService } from '../services/api';

// ─── Shared helpers (same as POS / GuestMenu) ────────────────────────────────
const CATEGORIES = ['BreakFast', 'Starters', 'Main Dish', 'Side Dish', 'Desserts', 'Beverages'];

const MENU_DEFAULTS = [
    { id: 1,  name: 'Gourmet Beef Burger', price: 1200, category: 'Main Dish', image: '/assets/burger.png',  desc: 'Aged wagyu beef, truffle aioli, melted brie on brioche.' },
    { id: 2,  name: 'Signature Ribeye',    price: 3500, category: 'Main Dish', image: '/assets/steak.png',   desc: 'Prime ribeye, garlic herb butter & truffle fries.' },
    { id: 3,  name: 'Herb-Crusted Salmon', price: 2100, category: 'Main Dish', image: '/assets/salmon.png',  desc: 'Fresh Atlantic salmon with sesame glaze & greens.' },
    { id: 4,  name: 'Margherita Pizza',    price: 1100, category: 'Main Dish', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=600', desc: 'Fresh mozzarella, basil, tomato sauce.' },
    { id: 5,  name: 'Chicken Wings',       price: 950,  category: 'Starters',  image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&q=80&w=600', desc: 'Crispy golden wings tossed in house hot sauce & blue cheese.' },
    { id: 6,  name: 'Crispy Calamari',     price: 850,  category: 'Starters',  image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=600', desc: 'Golden fried with spicy marinara.' },
    { id: 7,  name: 'Bruschetta',          price: 650,  category: 'Starters',  image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&q=80&w=600', desc: 'Fresh tomatoes, garlic, hand-torn basil on grilled sourdough.' },
    { id: 8,  name: 'French Fries',        price: 300,  category: 'Side Dish', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600', desc: 'Crispy golden fries with sea salt.' },
    { id: 9,  name: 'Chocolate Fondant',   price: 700,  category: 'Desserts',  image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600', desc: 'Warm dark chocolate lava cake with vanilla gelato.' },
    { id: 10, name: 'Iced Latte',          price: 450,  category: 'Beverages', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=600', desc: 'Chilled espresso over milk.' },
    { id: 11, name: 'Pancakes',            price: 550,  category: 'BreakFast', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=600', desc: 'Fluffy stack with maple syrup.' },
];

const getLocalDishes = () => {
    try {
        const saved = JSON.parse(localStorage.getItem('kolay_dishes'));
        if (saved && saved.length > 0 && saved[0].image &&
            (saved[0].image.startsWith('http') || saved[0].image.startsWith('/'))) {
            return saved;
        }
    } catch { /* ignore */ }
    return MENU_DEFAULTS;
};

const EMPTY_DISH = { name: '', price: '', category: 'Main Dish', image: '', desc: '' };

// ─── Component ────────────────────────────────────────────────────────────────
function AdminPanel() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'settings' | 'users' | 'maintenance'

    // ── System Settings ───────────────────────────────────────────────────────
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('kolay_settings');
        return saved ? JSON.parse(saved) : {
            restaurantName: 'Kolay Restaurant',
            currency: 'Kenya Shillings (KES)',
            taxRate: 16,
            isTaxInclusive: true,
        };
    });

    // ── User Management ───────────────────────────────────────────────────────
    const [users, setUsers] = useState(() => {
        const saved = localStorage.getItem('kolay_users');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Fidel Kyalo', role: 'SUPER ADMIN' }
        ];
    });

    const [editConfig, setEditConfig] = useState(null);

    // ── Menu Management state ─────────────────────────────────────────────────
    const [menuItems, setMenuItems] = useState(getLocalDishes);
    const [menuLoading, setMenuLoading] = useState(false);
    const [menuError, setMenuError] = useState('');
    const [menuSearch, setMenuSearch] = useState('');
    const [menuCategory, setMenuCategory] = useState('All');
    const [showDishModal, setShowDishModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [dishForm, setDishForm] = useState(EMPTY_DISH);
    const [saveLoading, setSaveLoading] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    // Fetch menu from API and keep everything in sync
    const refreshMenu = async () => {
        setMenuLoading(true);
        setMenuError('');
        try {
            const res = await MenuService.getProducts();
            if (res.data && res.data.length > 0) {
                const fresh = res.data.map(p => ({
                    ...p,
                    image: p.imageUrl || p.image || '',
                    desc: p.description || p.desc || '',
                }));
                setMenuItems(fresh);
                localStorage.setItem('kolay_dishes', JSON.stringify(fresh));
                window.dispatchEvent(new Event('storage'));
            }
        } catch {
            setMenuError('Could not reach the server. Showing cached data.');
        } finally {
            setMenuLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'menu') refreshMenu();

        const syncChannel = new BroadcastChannel('kolay_menu_updates');
        const handleBroadcast = (event) => {
            if (event.data === 'refresh_menu') {
                refreshMenu();
            }
        };
        syncChannel.addEventListener('message', handleBroadcast);
        return () => {
            syncChannel.removeEventListener('message', handleBroadcast);
            syncChannel.close();
        };
    }, [activeTab]);

    // Push updated list to localStorage + notify other tabs/pages
    const syncToCache = (list) => {
        localStorage.setItem('kolay_dishes', JSON.stringify(list));
        window.dispatchEvent(new Event('storage'));
        try {
            const syncChannel = new BroadcastChannel('kolay_menu_updates');
            syncChannel.postMessage('refresh_menu');
            syncChannel.close();
        } catch (e) {
            console.warn('Failed to broadcast menu update:', e);
        }
    };

    // ── Open modal for Add ────────────────────────────────────────────────────
    const openAdd = () => {
        setEditingId(null);
        setDishForm(EMPTY_DISH);
        setShowDishModal(true);
    };

    // ── Open modal for Edit ───────────────────────────────────────────────────
    const openEdit = (item) => {
        setEditingId(item.id);
        setDishForm({
            name: item.name,
            price: String(item.price),
            category: item.category,
            image: item.image || '',
            desc: item.desc || item.description || '',
        });
        setShowDishModal(true);
    };

    // ── Save (Add or Edit) ────────────────────────────────────────────────────
    const saveDish = async () => {
        if (!dishForm.name.trim() || !dishForm.price) return;
        setSaveLoading(true);

        const payload = {
            name:        dishForm.name.trim(),
            description: dishForm.desc || '',
            desc:        dishForm.desc || '',
            price:       parseFloat(dishForm.price),
            category:    dishForm.category || 'Main Dish',
            imageUrl:    dishForm.image || '',
            image:       dishForm.image || '',
            available:   true,
        };

        // Track whether the backend persisted the item
        let apiSuccess = false;
        try {
            if (editingId) {
                // ── EDIT ──
                await MenuService.updateProduct(editingId, payload);
                apiSuccess = true;
            } else {
                // ── ADD ──
                const res = await MenuService.createProduct(payload);
                if (res.data?.id) payload.id = res.data.id;
                apiSuccess = true;
            }
        } catch {
            // API unavailable — will fall back to local update
        }

        // Re-fetch authoritative list from API
        try {
            const res = await MenuService.getProducts();
            if (res.data && res.data.length > 0) {
                let fresh = res.data.map(p => ({
                    ...p,
                    image: p.imageUrl || p.image || '',
                    desc: p.description || p.desc || '',
                }));

                // If the API create/update failed, the re-fetch won't contain the
                // new/edited item — merge it in manually so it still shows up everywhere.
                if (!apiSuccess) {
                    if (editingId) {
                        fresh = fresh.map(p =>
                            p.id === editingId ? { ...p, ...payload, id: editingId } : p
                        );
                    } else {
                        const alreadyThere = fresh.some(
                            p => p.name === payload.name && p.price === payload.price
                        );
                        if (!alreadyThere) {
                            fresh = [...fresh, { ...payload, id: payload.id || Date.now() }];
                        }
                    }
                }

                setMenuItems(fresh);
                syncToCache(fresh);
                setSaveLoading(false);
                setShowDishModal(false);
                return;
            }
        } catch { /* fall through to local update */ }

        // Full local-only fallback (API and re-fetch both unavailable)
        let updated;
        if (editingId) {
            updated = menuItems.map(p =>
                p.id === editingId ? { ...p, ...payload, id: editingId } : p
            );
        } else {
            updated = [...menuItems, { ...payload, id: payload.id || Date.now() }];
        }
        setMenuItems(updated);
        syncToCache(updated);
        setSaveLoading(false);
        setShowDishModal(false);
    };

    // ── Delete ────────────────────────────────────────────────────────────────
    const deleteDish = async (id) => {
        try {
            await MenuService.deleteProduct(id);
        } catch { /* continue with local removal */ }

        // Re-fetch authoritative list
        try {
            const res = await MenuService.getProducts();
            if (res.data && res.data.length > 0) {
                const fresh = res.data.map(p => ({
                    ...p,
                    image: p.imageUrl || p.image || '',
                    desc: p.description || p.desc || '',
                }));
                setMenuItems(fresh);
                syncToCache(fresh);
                setDeleteConfirmId(null);
                return;
            }
        } catch { /* fall through */ }

        const updated = menuItems.filter(p => p.id !== id);
        setMenuItems(updated);
        syncToCache(updated);
        setDeleteConfirmId(null);
    };

    // ── Settings helpers ──────────────────────────────────────────────────────
    const handleSave = () => {
        if (!editConfig) return;
        let updated = { ...settings };
        if (editConfig.type === 'NAME')      updated.restaurantName = editConfig.value;
        if (editConfig.type === 'CURRENCY')  updated.currency = editConfig.value;
        if (editConfig.type === 'TAX_RATE')  updated.taxRate = parseFloat(editConfig.value);
        if (editConfig.type === 'TAX_MODE')  updated.isTaxInclusive = editConfig.value === 'INCLUSIVE';
        if (editConfig.type === 'USER') {
            const updatedUsers = users.map(u =>
                u.id === editConfig.id ? { ...u, name: editConfig.value, role: editConfig.role } : u
            );
            setUsers(updatedUsers);
            localStorage.setItem('kolay_users', JSON.stringify(updatedUsers));
            setEditConfig(null);
            return;
        }
        setSettings(updated);
        localStorage.setItem('kolay_settings', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
        setEditConfig(null);
    };

    // ── Filtered menu for display ─────────────────────────────────────────────
    const filteredMenu = menuItems.filter(p =>
        (menuCategory === 'All' || p.category === menuCategory) &&
        p.name.toLowerCase().includes(menuSearch.toLowerCase())
    );

    // ── Tab definitions ───────────────────────────────────────────────────────
    const TABS = [
        { id: 'menu',        label: 'Menu Management', icon: <UtensilsCrossed className="w-4 h-4" /> },
        { id: 'settings',    label: 'System Settings',  icon: <Settings className="w-4 h-4" /> },
        { id: 'users',       label: 'Users',            icon: <Users className="w-4 h-4" /> },
        { id: 'maintenance', label: 'Maintenance',      icon: <Shield className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-bg-cream text-charcoal font-body">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-10">
                {/* Page header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-primary">Admin Console</h1>
                    <p className="text-charcoal/50 text-sm mt-1">Manage your menu, settings, and users from one place.</p>
                </div>

                {/* Tab bar */}
                <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-primary/5 w-fit shadow-sm">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                activeTab === tab.id
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'text-charcoal/50 hover:text-primary hover:bg-bg-cream'
                            }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── MENU MANAGEMENT TAB ─────────────────────────────────── */}
                {activeTab === 'menu' && (
                    <div className="space-y-6">
                        {/* toolbar */}
                        <div className="flex flex-wrap gap-4 items-center justify-between">
                            <div className="flex gap-3 flex-wrap">
                                {/* search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
                                    <input
                                        type="text"
                                        placeholder="Search items…"
                                        value={menuSearch}
                                        onChange={e => setMenuSearch(e.target.value)}
                                        className="pl-9 pr-4 py-2.5 bg-white border border-primary/10 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-secondary/30 w-52"
                                    />
                                </div>
                                {/* category filter */}
                                <select
                                    value={menuCategory}
                                    onChange={e => setMenuCategory(e.target.value)}
                                    className="px-4 py-2.5 bg-white border border-primary/10 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-secondary/30 appearance-none"
                                >
                                    <option value="All">All Categories</option>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                {/* refresh */}
                                <button
                                    onClick={refreshMenu}
                                    disabled={menuLoading}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-primary/10 rounded-xl text-sm font-bold text-charcoal/60 hover:text-primary transition-all disabled:opacity-40"
                                >
                                    <RefreshCw className={`w-4 h-4 ${menuLoading ? 'animate-spin' : ''}`} />
                                    {menuLoading ? 'Loading…' : 'Refresh'}
                                </button>
                            </div>
                            <button
                                onClick={openAdd}
                                className="flex items-center gap-2 bg-secondary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg active:scale-95"
                            >
                                <Plus className="w-4 h-4" /> Add Item
                            </button>
                        </div>

                        {/* error banner */}
                        {menuError && (
                            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl px-5 py-3 text-sm font-bold">
                                <AlertCircle className="w-4 h-4 shrink-0" /> {menuError}
                            </div>
                        )}

                        {/* stats bar */}
                        <div className="flex gap-4 text-xs font-black uppercase tracking-widest text-charcoal/40">
                            <span>{filteredMenu.length} item{filteredMenu.length !== 1 ? 's' : ''}</span>
                            {menuCategory !== 'All' && <span>· {menuCategory}</span>}
                        </div>

                        {/* grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filteredMenu.map(item => (
                                <div key={item.id} className="bg-white rounded-3xl border border-primary/5 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                                    {/* image */}
                                    <div className="h-40 bg-bg-cream overflow-hidden relative">
                                        {item.image?.startsWith('http') || item.image?.startsWith('/') ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                loading="lazy"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600'; }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-charcoal/10 font-bold uppercase tracking-widest text-sm">No image</div>
                                        )}
                                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-sm">
                                            {item.category}
                                        </span>
                                    </div>

                                    {/* info */}
                                    <div className="p-5">
                                        <h3 className="font-bold text-primary text-base leading-tight mb-1 line-clamp-1">{item.name}</h3>
                                        <p className="text-charcoal/40 text-xs line-clamp-2 mb-4 leading-relaxed">{item.desc || item.description || '—'}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-secondary font-black text-lg">KES {Number(item.price).toLocaleString()}</span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openEdit(item)}
                                                    className="p-2 bg-bg-cream hover:bg-secondary/10 text-charcoal/50 hover:text-secondary rounded-xl transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirmId(item.id)}
                                                    className="p-2 bg-bg-cream hover:bg-red-50 text-charcoal/50 hover:text-red-500 rounded-xl transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* empty state */}
                            {filteredMenu.length === 0 && !menuLoading && (
                                <div className="col-span-full flex flex-col items-center py-20 text-center opacity-40">
                                    <UtensilsCrossed className="w-12 h-12 mb-4 text-primary" />
                                    <p className="font-bold text-primary">No items found</p>
                                    <p className="text-sm text-charcoal/50 mt-1">Try a different search or category, or add a new item.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── SYSTEM SETTINGS TAB ─────────────────────────────────── */}
                {activeTab === 'settings' && (
                    <div className="max-w-2xl space-y-5">
                        {[
                            { label: 'Restaurant Name', sub: settings.restaurantName, type: 'NAME', value: settings.restaurantName },
                            { label: 'Currency Setting', sub: settings.currency, type: 'CURRENCY', value: settings.currency },
                            { label: 'Tax Rate', sub: `${settings.taxRate}%`, type: 'TAX_RATE', value: settings.taxRate },
                            { label: 'Tax Mode', sub: settings.isTaxInclusive ? 'Inclusive' : 'Exclusive', type: 'TAX_MODE', value: settings.isTaxInclusive ? 'INCLUSIVE' : 'EXCLUSIVE' },
                        ].map(row => (
                            <div key={row.type} className="flex items-center justify-between bg-white p-5 rounded-2xl border border-primary/5 shadow-sm">
                                <div>
                                    <h3 className="font-bold">{row.label}</h3>
                                    <p className="text-sm text-charcoal/50">{row.sub}</p>
                                </div>
                                <button
                                    onClick={() => setEditConfig({ type: row.type, value: row.value })}
                                    className="text-secondary font-bold text-sm hover:underline"
                                >
                                    Update
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── USERS TAB ────────────────────────────────────────────── */}
                {activeTab === 'users' && (
                    <div className="max-w-3xl bg-white rounded-3xl border border-primary/5 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-bg-cream border-b border-primary/5">
                                <tr>
                                    <th className="px-6 py-4 text-xs uppercase text-charcoal/40 font-black tracking-widest">User</th>
                                    <th className="px-6 py-4 text-xs uppercase text-charcoal/40 font-black tracking-widest">Role</th>
                                    <th className="px-6 py-4 text-xs uppercase text-charcoal/40 font-black tracking-widest">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="border-b border-primary/5 hover:bg-bg-cream/30 transition-colors">
                                        <td className="px-6 py-4 font-bold">{user.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px] font-black uppercase">{user.role}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setEditConfig({ type: 'USER', id: user.id, value: user.name, role: user.role })}
                                                className="text-secondary text-sm font-bold hover:underline"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── MAINTENANCE TAB ──────────────────────────────────────── */}
                {activeTab === 'maintenance' && (
                    <div className="max-w-md space-y-4">
                        <div className="bg-white p-6 rounded-3xl border border-primary/5 shadow-sm space-y-4">
                            <button
                                onClick={() => {
                                    if (window.confirm('DANGER: This will permanently delete all historical data. Proceed?')) {
                                        localStorage.removeItem('kolay_archive');
                                        alert('Archive cleared successfully.');
                                    }
                                }}
                                className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 border border-red-100 rounded-2xl transition-all text-left"
                            >
                                <div>
                                    <h3 className="font-bold text-sm text-red-700">Clear History Archive</h3>
                                    <p className="text-[10px] text-red-400">Permanently delete all sales records</p>
                                </div>
                                <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                            <button className="w-full flex items-center justify-between p-4 bg-bg-cream rounded-2xl border border-primary/5 text-left opacity-50 cursor-not-allowed">
                                <div>
                                    <h3 className="font-bold text-sm">System Update</h3>
                                    <p className="text-[10px] text-charcoal/40">Latest version installed (v2.4.1)</p>
                                </div>
                                <Database className="w-4 h-4 text-secondary" />
                            </button>
                        </div>
                        <div className="bg-secondary p-6 rounded-3xl text-white">
                            <h3 className="font-black text-xs uppercase tracking-widest mb-2">Pro Tip</h3>
                            <p className="text-sm opacity-90 leading-relaxed font-medium">Regularly export your data for off-site backup. Secure archives are the backbone of smart business intelligence.</p>
                        </div>
                    </div>
                )}
            </main>

            {/* ── ADD / EDIT DISH MODAL ────────────────────────────────────── */}
            {showDishModal && (
                <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-8 animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-primary">
                                {editingId ? 'Edit Menu Item' : 'Add New Item'}
                            </h3>
                            <button onClick={() => setShowDishModal(false)} className="p-2 hover:bg-bg-cream rounded-xl text-charcoal/40 hover:text-primary transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* image preview */}
                            <div className="w-full h-36 bg-bg-cream rounded-2xl overflow-hidden border border-primary/5 flex items-center justify-center">
                                {dishForm.image?.startsWith('http') || dishForm.image?.startsWith('/') ? (
                                    <img
                                        src={dishForm.image}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                        onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600'; }}
                                    />
                                ) : (
                                    <span className="text-charcoal/20 text-xs font-bold uppercase tracking-widest">Image Preview</span>
                                )}
                            </div>

                            {/* name */}
                            <div>
                                <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-1.5">Item Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Chicken Wings"
                                    className="w-full px-4 py-3 bg-bg-cream border border-primary/10 rounded-xl outline-none focus:ring-2 focus:ring-secondary/30 font-bold"
                                    value={dishForm.name}
                                    onChange={e => setDishForm({ ...dishForm, name: e.target.value })}
                                />
                            </div>

                            {/* description */}
                            <div>
                                <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-1.5">Description</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Crispy wings with house sauce"
                                    className="w-full px-4 py-3 bg-bg-cream border border-primary/10 rounded-xl outline-none focus:ring-2 focus:ring-secondary/30 font-bold text-sm"
                                    value={dishForm.desc}
                                    onChange={e => setDishForm({ ...dishForm, desc: e.target.value })}
                                />
                            </div>

                            {/* price + category */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-1.5">Price (KES) *</label>
                                    <input
                                        type="number"
                                        placeholder="950"
                                        className="w-full px-4 py-3 bg-bg-cream border border-primary/10 rounded-xl outline-none focus:ring-2 focus:ring-secondary/30 font-bold"
                                        value={dishForm.price}
                                        onChange={e => setDishForm({ ...dishForm, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-1.5">Category</label>
                                    <select
                                        className="w-full px-4 py-3 bg-bg-cream border border-primary/10 rounded-xl outline-none focus:ring-2 focus:ring-secondary/30 font-bold appearance-none"
                                        value={dishForm.category}
                                        onChange={e => setDishForm({ ...dishForm, category: e.target.value })}
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* image url */}
                            <div>
                                <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-1.5">Image URL</label>
                                <input
                                    type="text"
                                    placeholder="https://images.unsplash.com/… or /assets/burger.png"
                                    className="w-full px-4 py-3 bg-bg-cream border border-primary/10 rounded-xl outline-none focus:ring-2 focus:ring-secondary/30 font-bold text-xs"
                                    value={dishForm.image}
                                    onChange={e => setDishForm({ ...dishForm, image: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowDishModal(false)}
                                    className="flex-1 py-3 font-bold text-charcoal/40 hover:text-primary transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveDish}
                                    disabled={saveLoading || !dishForm.name.trim() || !dishForm.price}
                                    className="flex-1 bg-secondary text-white font-bold py-3 rounded-xl shadow-lg hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {saveLoading ? 'Saving…' : editingId ? 'Save Changes' : 'Add to Menu'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── DELETE CONFIRM MODAL ─────────────────────────────────────── */}
            {deleteConfirmId && (
                <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl p-8 animate-in zoom-in duration-200 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
                            <Trash2 className="w-7 h-7 text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-2">Remove Item?</h3>
                        <p className="text-charcoal/50 text-sm mb-8">
                            This will remove <strong>{menuItems.find(p => p.id === deleteConfirmId)?.name}</strong> from the menu. It will no longer appear in the POS, staff portal, or customer menu.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="flex-1 py-3 font-bold text-charcoal/40 hover:text-primary transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteDish(deleteConfirmId)}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── SETTINGS / USER EDIT MODAL ───────────────────────────────── */}
            {editConfig && (
                <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-8 animate-in zoom-in duration-200">
                        <h3 className="text-2xl font-bold text-primary mb-6">
                            {editConfig.type === 'USER' ? 'Edit User Profile' : 'Update Setting'}
                        </h3>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">
                                    {editConfig.type === 'NAME' ? 'Restaurant Name'
                                        : editConfig.type === 'CURRENCY' ? 'Currency'
                                        : editConfig.type === 'TAX_RATE' ? 'Tax Rate (%)'
                                        : 'Full Name'}
                                </label>
                                {editConfig.type === 'TAX_MODE' ? null : (
                                    <input
                                        type={editConfig.type === 'TAX_RATE' ? 'number' : 'text'}
                                        className="w-full bg-bg-cream border border-primary/5 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-bold"
                                        value={editConfig.value}
                                        onChange={e => setEditConfig({ ...editConfig, value: e.target.value })}
                                    />
                                )}
                            </div>
                            {editConfig.type === 'USER' && (
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">System Role</label>
                                    <select
                                        className="w-full bg-bg-cream border border-primary/5 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-bold appearance-none"
                                        value={editConfig.role}
                                        onChange={e => setEditConfig({ ...editConfig, role: e.target.value })}
                                    >
                                        <option>SUPER ADMIN</option>
                                        <option>ADMIN</option>
                                        <option>MANAGER</option>
                                        <option>STAFF</option>
                                    </select>
                                </div>
                            )}
                            {editConfig.type === 'TAX_MODE' && (
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Pricing Strategy</label>
                                    <select
                                        className="w-full bg-bg-cream border border-primary/5 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-bold appearance-none"
                                        value={editConfig.value}
                                        onChange={e => setEditConfig({ ...editConfig, value: e.target.value })}
                                    >
                                        <option value="INCLUSIVE">Tax Inclusive (Prices include VAT)</option>
                                        <option value="EXCLUSIVE">Tax Exclusive (VAT added at checkout)</option>
                                    </select>
                                </div>
                            )}
                            <div className="flex gap-4 pt-4">
                                <button onClick={() => setEditConfig(null)} className="flex-1 py-3 font-bold text-charcoal/40 hover:text-primary">Cancel</button>
                                <button onClick={handleSave} className="flex-1 bg-secondary text-white font-bold py-3 rounded-xl shadow-lg hover:bg-orange-600 transition-all active:scale-95">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPanel;
