import React, { useState } from 'react';
import { Search, ShoppingCart, Plus, Minus, X, CreditCard, User, ClipboardList, UtensilsCrossed, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const POS = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const categories = ['All', 'BreakFast', 'Main Dish', 'Beverages', 'Desserts', 'Side Dish'];

    const demoProducts = [
        { id: 1, name: 'Beef Burger', price: 850, category: 'Main Dish', image: '🍔' },
        { id: 2, name: 'Margherita Pizza', price: 1100, category: 'Main Dish', image: '🍕' },
        { id: 3, name: 'Grilled Salmon', price: 1850, category: 'Main Dish', image: '🐟' },
        { id: 4, name: 'Cappuccino', price: 350, category: 'Beverages', image: '☕' },
        { id: 5, name: 'Iced Tea', price: 250, category: 'Beverages', image: '🍹' },
        { id: 6, name: 'French Fries', price: 300, category: 'Side Dish', image: '🍟' },
        { id: 7, name: 'Fruit Salad', price: 450, category: 'Desserts', image: '🥗' },
        { id: 8, name: 'Pancakes', price: 550, category: 'BreakFast', image: '🥞' },
    ];

    const filteredProducts = demoProducts.filter(p =>
        (activeCategory === 'All' || p.category === activeCategory) &&
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const updateQuantity = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const handlePlaceOrder = () => {
        if (cart.length === 0) return;

        const newOrder = {
            id: `#${Math.floor(1000 + Math.random() * 9000)}`,
            table: 'T-01',
            items: cart.map(item => `${item.quantity}x ${item.name}`).join(', '),
            total: `KES ${(subtotal + tax).toLocaleString()}`,
            status: 'Pending',
            statusColor: 'bg-gray-100 text-gray-700'
        };

        const existing = JSON.parse(localStorage.getItem('kolay_orders') || '[]');
        localStorage.setItem('kolay_orders', JSON.stringify([newOrder, ...existing]));

        setShowSuccess(true);
        setCart([]);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.16; // 16% VAT
    const total = subtotal + tax;

    return (
        <div className="flex h-screen bg-bg-cream font-body overflow-hidden relative">
            {/* Success Overlay */}
            {showSuccess && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-primary/20 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl border border-cream text-center animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                            ✅
                        </div>
                        <h2 className="text-2xl font-bold text-primary mb-2">Order Placed!</h2>
                        <p className="text-charcoal/50">Sent to kitchen for preparation.</p>
                    </div>
                </div>
            )}

            {/* Left Menu Side */}
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
                {/* Back Button */}
                <Link to="/dashboard" className="flex items-center gap-2 text-charcoal/40 hover:text-secondary transition-colors mb-4 font-bold text-sm">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-primary flex items-center gap-2">
                            <UtensilsCrossed className="text-secondary" /> POS System
                        </h1>
                        <p className="text-charcoal/50 text-sm">Select items to build a new order</p>
                    </div>
                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search dishes..."
                            className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-cream shadow-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-all ${activeCategory === cat
                                ? 'bg-secondary text-white shadow-lg scale-105'
                                : 'bg-white text-charcoal/60 hover:bg-cream border border-cream'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pr-2 custom-scrollbar">
                    {filteredProducts.map(product => (
                        <div
                            key={product.id}
                            onClick={() => addToCart(product)}
                            className="bg-white p-5 rounded-3xl border border-cream hover:border-secondary/30 hover:shadow-xl transition-all cursor-pointer group active:scale-95"
                        >
                            <div className="h-32 bg-bg-cream rounded-2xl mb-4 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">
                                {product.image}
                            </div>
                            <h3 className="font-bold text-primary mb-1">{product.name}</h3>
                            <p className="text-secondary font-bold">KES {product.price.toLocaleString()}</p>
                            <div className="mt-4 flex justify-between items-center text-[10px] text-charcoal/40 uppercase tracking-widest font-bold">
                                <span>{product.category}</span>
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">In Stock</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Cart Side */}
            <div className="w-[400px] bg-white border-l border-cream flex flex-col shadow-2xl">
                <div className="p-6 border-b border-cream flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-secondary" /> Current Order
                    </h2>
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                        {cart.reduce((acc, item) => acc + item.quantity, 0)} Items
                    </span>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                            <ClipboardList className="w-20 h-20 mb-4" />
                            <p className="font-bold">No items selected</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex gap-4 p-3 rounded-2xl hover:bg-bg-cream transition-colors group">
                                <div className="w-16 h-16 bg-bg-cream rounded-xl flex items-center justify-center text-2xl shrink-0">
                                    {item.image}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-primary text-sm line-clamp-1">{item.name}</h4>
                                        <button onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }} className="text-red-300 hover:text-red-500 transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-secondary font-bold text-xs">KES {(item.price * item.quantity).toLocaleString()}</p>
                                        <div className="flex items-center gap-3 bg-white border border-cream rounded-lg px-2 py-1 shadow-sm">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-secondary transition-colors"><Minus className="w-3 h-3" /></button>
                                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-secondary transition-colors"><Plus className="w-3 h-3" /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Summary & Checkout */}
                <div className="p-6 bg-white border-t border-cream space-y-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
                    <div className="space-y-2 text-sm text-charcoal/60">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-bold text-primary">KES {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Taxes (16% VAT)</span>
                            <span className="font-bold text-primary">KES {tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-lg pt-2 border-t border-cream">
                            <span className="font-bold text-primary">Total</span>
                            <span className="font-bold text-secondary text-2xl">KES {total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="pt-4 grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-cream font-bold text-charcoal/40 hover:bg-bg-cream transition-all">
                            <User className="w-5 h-5" /> Customer
                        </button>
                        <button className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-secondary/50 text-secondary font-bold hover:bg-bg-cream transition-all">
                            Table: T-01
                        </button>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={cart.length === 0}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-5 rounded-2xl shadow-xl transition-all active:transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-lg mt-2"
                    >
                        <CreditCard className="w-6 h-6" /> Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default POS;
