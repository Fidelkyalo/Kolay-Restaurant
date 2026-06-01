import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Trash2, Edit3, X, Check, Calendar, Tag, Star, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';

const EMPTY_FORM = {
    id: null,
    name: '',
    description: '',
    originalPrice: '',
    season: '',
    startDate: '',
    endDate: '',
    image: '',
};

const DISCOUNT_RATE = 10;

const isActive = (sp) => {
    const now = new Date();
    const start = sp.startDate ? new Date(sp.startDate) : null;
    const end = sp.endDate ? new Date(sp.endDate) : null;
    if (start && now < start) return false;
    if (end && now > end) return false;
    return true;
};

const getSpecialties = () => {
    try { return JSON.parse(localStorage.getItem('kolay_specialties') || '[]'); }
    catch { return []; }
};

const saveSpecialties = (list) => {
    localStorage.setItem('kolay_specialties', JSON.stringify(list));
    window.dispatchEvent(new Event('storage'));
};

// Load all dishes from localStorage (same source as POS / GuestMenu)
const getMenuDishes = () => {
    try {
        const saved = JSON.parse(localStorage.getItem('kolay_dishes') || '[]');
        if (saved.length > 0) return saved;
    } catch { /* ignore */ }
    // Fallback defaults
    return [
        { id: 1,  name: 'Gourmet Beef Burger', price: 1200, category: 'Main Dish',  image: '/assets/burger.png',  desc: 'Aged wagyu beef, truffle aioli.' },
        { id: 2,  name: 'Signature Ribeye',     price: 3500, category: 'Main Dish',  image: '/assets/steak.png',   desc: 'Prime ribeye, garlic herb butter.' },
        { id: 3,  name: 'Herb-Crusted Salmon',  price: 2100, category: 'Main Dish',  image: '/assets/salmon.png',  desc: 'Fresh salmon with sesame glaze.' },
        { id: 4,  name: 'Crispy Calamari',      price: 850,  category: 'Starters',   image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=600', desc: 'Golden fried with spicy marinara.' },
        { id: 5,  name: 'Bruschetta',           price: 650,  category: 'Starters',   image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&q=80&w=600', desc: 'Fresh tomatoes, garlic, hand-torn basil.' },
        { id: 6,  name: 'Chocolate Fondant',    price: 700,  category: 'Desserts',   image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600', desc: 'Warm dark chocolate lava cake.' },
        { id: 7,  name: 'Iced Latte',           price: 450,  category: 'Beverages',  image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=600', desc: 'Chilled espresso over milk.' },
        { id: 8,  name: 'Margherita Pizza',     price: 1100, category: 'Main Dish',  image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=600', desc: 'Fresh mozzarella, basil, tomato sauce.' },
        { id: 9,  name: 'French Fries',         price: 300,  category: 'Side Dish',  image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600', desc: 'Crispy golden fries with sea salt.' },
        { id: 10, name: 'Pancakes',             price: 550,  category: 'BreakFast',  image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=600', desc: 'Fluffy stack with maple syrup.' },
    ];
};

export default function Specialties() {
    const [specialties, setSpecialties] = useState(getSpecialties);
    const [menuDishes, setMenuDishes] = useState(getMenuDishes);
    const [form, setForm] = useState(EMPTY_FORM);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    // 'menu' = pick from existing menu | 'custom' = type manually
    const [dishSource, setDishSource] = useState('menu');

    useEffect(() => {
        const handler = () => {
            setSpecialties(getSpecialties());
            setMenuDishes(getMenuDishes());
        };
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, []);

    const discountedPrice = (original) => {
        const p = parseFloat(original);
        if (isNaN(p)) return 0;
        return Math.round(p * (1 - DISCOUNT_RATE / 100));
    };

    // When staff picks a dish from the dropdown, auto-fill the form fields
    const handleMenuPick = (dishId) => {
        if (!dishId) {
            setForm({ ...form, name: '', originalPrice: '', image: '', description: '' });
            return;
        }
        const dish = menuDishes.find(d => String(d.id) === String(dishId));
        if (!dish) return;
        setForm(prev => ({
            ...prev,
            name: dish.name,
            originalPrice: String(dish.price),
            image: dish.image || '',
            description: dish.desc || dish.description || '',
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.originalPrice) return;

        const entry = {
            ...form,
            id: editingId || Date.now(),
            originalPrice: parseFloat(form.originalPrice),
            discountedPrice: discountedPrice(form.originalPrice),
            discount: DISCOUNT_RATE,
        };

        const updated = editingId
            ? specialties.map(s => s.id === editingId ? entry : s)
            : [...specialties, entry];

        setSpecialties(updated);
        saveSpecialties(updated);
        setForm(EMPTY_FORM);
        setEditingId(null);
        setShowForm(false);
        setDishSource('menu');
    };

    const handleEdit = (sp) => {
        setForm({ ...sp, originalPrice: String(sp.originalPrice) });
        setEditingId(sp.id);
        setDishSource('custom'); // when editing, show manual fields directly
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (!window.confirm('Delete this specialty?')) return;
        const updated = specialties.filter(s => s.id !== id);
        setSpecialties(updated);
        saveSpecialties(updated);
    };

    const handleCancel = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setShowForm(false);
        setDishSource('menu');
    };

    // Group dishes by category for the dropdown
    const dishesByCategory = menuDishes.reduce((acc, d) => {
        const cat = d.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(d);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-bg-cream text-charcoal font-body">
            <Navbar />

            <main className="max-w-6xl mx-auto px-8 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-primary flex items-center gap-3">
                            <Sparkles className="text-secondary" /> Specialties
                        </h1>
                        <p className="text-charcoal/50 mt-1 text-sm">
                            Manage seasonal & nightly specials. All specialties carry a <strong className="text-secondary">{DISCOUNT_RATE}% discount</strong> applied automatically at checkout.
                        </p>
                    </div>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-orange-600 transition-all active:scale-95"
                        >
                            <Plus className="w-4 h-4" /> Add Specialty
                        </button>
                    )}
                </div>

                {/* Form */}
                {showForm && (
                    <div className="bg-white rounded-3xl border border-primary/5 shadow-premium p-8 mb-10 animate-in fade-in slide-in-from-top-4 duration-200">
                        <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                            {editingId ? <Edit3 className="w-5 h-5 text-secondary" /> : <Plus className="w-5 h-5 text-secondary" />}
                            {editingId ? 'Edit Specialty' : 'New Specialty'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* ── Dish Source Toggle + Picker ── */}
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Dish *</label>

                                    {/* Toggle tabs */}
                                    <div className="flex bg-bg-cream p-1 rounded-xl border border-primary/10 w-fit mb-3">
                                        <button
                                            type="button"
                                            onClick={() => { setDishSource('menu'); setForm({ ...form, name: '', originalPrice: '', image: '', description: '' }); }}
                                            className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${dishSource === 'menu' ? 'bg-secondary text-white shadow' : 'text-charcoal/40 hover:text-primary'}`}
                                        >
                                            Pick from Menu
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDishSource('custom')}
                                            className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${dishSource === 'custom' ? 'bg-secondary text-white shadow' : 'text-charcoal/40 hover:text-primary'}`}
                                        >
                                            Enter Manually
                                        </button>
                                    </div>

                                    {dishSource === 'menu' ? (
                                        /* Grouped dropdown of all menu dishes */
                                        <div className="relative">
                                            <select
                                                className="w-full bg-bg-cream border border-primary/10 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-semibold appearance-none pr-10"
                                                value={menuDishes.find(d => d.name === form.name)?.id || ''}
                                                onChange={e => handleMenuPick(e.target.value)}
                                            >
                                                <option value="">— Select a dish from the menu —</option>
                                                {Object.entries(dishesByCategory).map(([cat, dishes]) => (
                                                    <optgroup key={cat} label={cat}>
                                                        {dishes.map(d => (
                                                            <option key={d.id} value={d.id}>
                                                                {d.name} — KES {Number(d.price).toLocaleString()}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40 pointer-events-none" />
                                        </div>
                                    ) : (
                                        /* Manual text input */
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. Signature Ribeye"
                                            className="w-full bg-bg-cream border border-primary/10 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-semibold"
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                        />
                                    )}

                                    {/* Preview of selected menu dish */}
                                    {dishSource === 'menu' && form.name && (
                                        <div className="mt-3 flex items-center gap-3 bg-secondary/5 border border-secondary/20 rounded-xl px-4 py-3">
                                            {form.image && (
                                                <img src={form.image} alt={form.name} className="w-12 h-12 rounded-lg object-cover shrink-0" onError={e => { e.target.style.display = 'none'; }} />
                                            )}
                                            <div>
                                                <p className="font-black text-primary text-sm">{form.name}</p>
                                                <p className="text-charcoal/40 text-xs">{form.description}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Season / Occasion */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Season / Occasion *</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Tonight, Christmas, Eid, Valentine's"
                                        className="w-full bg-bg-cream border border-primary/10 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-semibold"
                                        value={form.season}
                                        onChange={e => setForm({ ...form, season: e.target.value })}
                                    />
                                </div>

                                {/* Original Price */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Original Price (KES) *</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        placeholder="e.g. 3500"
                                        className="w-full bg-bg-cream border border-primary/10 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-semibold"
                                        value={form.originalPrice}
                                        onChange={e => setForm({ ...form, originalPrice: e.target.value })}
                                    />
                                    {form.originalPrice && (
                                        <p className="text-xs text-secondary font-bold mt-1">
                                            After 10% discount: KES {discountedPrice(form.originalPrice).toLocaleString()}
                                        </p>
                                    )}
                                </div>

                                {/* Image URL — only shown in manual mode (menu pick auto-fills it) */}
                                {dishSource === 'custom' && (
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Image URL</label>
                                        <input
                                            type="text"
                                            placeholder="https://... or /assets/..."
                                            className="w-full bg-bg-cream border border-primary/10 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-semibold"
                                            value={form.image}
                                            onChange={e => setForm({ ...form, image: e.target.value })}
                                        />
                                    </div>
                                )}

                                {/* Start Date */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full bg-bg-cream border border-primary/10 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-semibold"
                                        value={form.startDate}
                                        onChange={e => setForm({ ...form, startDate: e.target.value })}
                                    />
                                </div>

                                {/* End Date */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">End Date</label>
                                    <input
                                        type="date"
                                        className="w-full bg-bg-cream border border-primary/10 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-semibold"
                                        value={form.endDate}
                                        onChange={e => setForm({ ...form, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Description</label>
                                <textarea
                                    rows={2}
                                    placeholder="Brief description of the dish..."
                                    className="w-full bg-bg-cream border border-primary/10 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-semibold resize-none"
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                />
                            </div>

                            {/* Discount info banner */}
                            <div className="flex items-center gap-3 bg-secondary/10 border border-secondary/20 rounded-2xl px-5 py-3">
                                <Tag className="w-4 h-4 text-secondary shrink-0" />
                                <p className="text-sm text-secondary font-bold">
                                    A <strong>{DISCOUNT_RATE}% discount</strong> is automatically applied to all specialties at checkout — no configuration needed.
                                </p>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 py-3 font-bold text-charcoal/40 hover:text-primary border border-primary/10 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-secondary text-white font-bold py-3 rounded-xl shadow-lg hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Check className="w-4 h-4" /> {editingId ? 'Save Changes' : 'Add Specialty'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Specialties List */}
                {specialties.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-primary/5 p-16 text-center shadow-sm">
                        <Sparkles className="w-12 h-12 text-charcoal/20 mx-auto mb-4" />
                        <p className="text-charcoal/40 font-bold text-lg">No specialties yet</p>
                        <p className="text-charcoal/30 text-sm mt-1">Add your first specialty to feature it on the home page and customer menu.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {specialties.map(sp => {
                            const active = isActive(sp);
                            return (
                                <div key={sp.id} className={`bg-white rounded-3xl border shadow-sm overflow-hidden transition-all ${active ? 'border-secondary/30 shadow-secondary/10' : 'border-primary/5 opacity-60'}`}>
                                    {/* Image */}
                                    <div className="relative h-40 bg-bg-cream overflow-hidden">
                                        {sp.image ? (
                                            <img src={sp.image} alt={sp.name} className="w-full h-full object-cover" onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Sparkles className="w-10 h-10 text-charcoal/20" />
                                            </div>
                                        )}
                                        {/* Status badge */}
                                        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${active ? 'bg-green-500 text-white' : 'bg-charcoal/20 text-white'}`}>
                                            {active ? 'Active' : 'Inactive'}
                                        </span>
                                        {/* Discount badge */}
                                        <span className="absolute top-3 right-3 bg-secondary text-white px-3 py-1 rounded-full text-[10px] font-black">
                                            {sp.discount}% OFF
                                        </span>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h3 className="font-black text-primary text-base leading-tight">{sp.name}</h3>
                                        </div>
                                        <p className="text-[11px] text-secondary font-black uppercase tracking-widest mb-2">{sp.season}</p>
                                        {sp.description && <p className="text-charcoal/50 text-xs mb-3 line-clamp-2">{sp.description}</p>}

                                        {/* Pricing */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-charcoal/30 line-through text-sm">KES {sp.originalPrice.toLocaleString()}</span>
                                            <span className="text-secondary font-black text-lg">KES {sp.discountedPrice.toLocaleString()}</span>
                                        </div>

                                        {/* Dates */}
                                        {(sp.startDate || sp.endDate) && (
                                            <div className="flex items-center gap-2 text-[11px] text-charcoal/40 mb-4">
                                                <Calendar className="w-3 h-3" />
                                                <span>
                                                    {sp.startDate || '—'} → {sp.endDate || 'Ongoing'}
                                                </span>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-3 pt-3 border-t border-primary/5">
                                            <button
                                                onClick={() => handleEdit(sp)}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-bg-cream hover:bg-secondary/10 text-primary font-bold text-xs rounded-xl transition-colors"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(sp.id)}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-bg-cream hover:bg-red-50 text-red-400 font-bold text-xs rounded-xl transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
