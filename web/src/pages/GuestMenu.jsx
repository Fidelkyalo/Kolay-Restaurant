import React, { useState, useEffect } from 'react';
import { ShoppingCart, Utensils, X, Plus, Minus, ArrowLeft, CreditCard, Check, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const GuestMenu = () => {
    const [dishes, setDishes] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [guestInfo, setGuestInfo] = useState({ name: '', phone: '', mode: 'Takeaway' });

    useEffect(() => {
        const savedDishes = localStorage.getItem('kolay_dishes');
        if (savedDishes) {
            setDishes(JSON.parse(savedDishes));
        } else {
            // Default dishes if none exist
            const defaults = [
                { id: 1, name: 'Gourmet Beef Burger', price: 1200, category: 'Mains', image: '🍔' },
                { id: 2, name: 'Calamari Rings', price: 850, category: 'Appetizers', image: '🦑' },
                { id: 3, name: 'Iced Latte', price: 450, category: 'Drinks', image: '☕' }
            ];
            setDishes(defaults);
            localStorage.setItem('kolay_dishes', JSON.stringify(defaults));
        }
    }, []);

    const categories = ['ALL', ...new Set(dishes.map(d => d.category))];

    const addToCart = (dish) => {
        const existing = cart.find(item => item.id === dish.id);
        if (existing) {
            setCart(cart.map(item => item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { ...dish, quantity: 1 }]);
        }
    };

    const updateQuantity = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0, item.quantity + delta);
                return newQty === 0 ? null : { ...item, quantity: newQty };
            }
            return item;
        }).filter(Boolean));
    };

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        const newOrder = {
            id: Math.floor(Math.random() * 1000000),
            items: cart,
            total: `KES ${cartTotal.toLocaleString()}`,
            table: guestInfo.mode === 'Dining In' ? 'Awaiting Table' : 'Takeaway',
            status: 'PENDING',
            timestamp: new Date().toISOString(),
            guestName: guestInfo.name,
            guestPhone: guestInfo.phone
        };

        const existingOrders = JSON.parse(localStorage.getItem('kolay_orders') || '[]');
        localStorage.setItem('kolay_orders', JSON.stringify([...existingOrders, newOrder]));
        window.dispatchEvent(new Event('storage'));

        setOrderSuccess(true);
        setCart([]);
        setIsCheckoutOpen(false);
    };

    return (
        <div className="min-h-screen bg-bg-cream font-body selection:bg-secondary selection:text-white">
            {/* Header */}
            <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-cream p-6 shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="p-3 hover:bg-bg-cream rounded-2xl transition-colors">
                            <ArrowLeft className="w-5 h-5 text-charcoal/40 hover:text-primary" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <img src="/Logo.png" alt="Logo" className="h-10 w-auto rounded" />
                            <span className="text-2xl font-black text-primary uppercase tracking-tighter italic">Kolay<span className="text-secondary">Menu</span></span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative bg-primary text-white p-4 rounded-2xl shadow-glow hover:scale-105 active:scale-95 transition-all"
                    >
                        <ShoppingCart className="w-6 h-6" />
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-secondary text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white">
                                {cart.reduce((acc, item) => acc + item.quantity, 0)}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-primary mb-4 tracking-tight">Order Online</h1>
                    <p className="text-charcoal/50 font-medium">Fresh food, prepared with love. Pick your favorites below.</p>
                </div>

                {/* Categories */}
                <div className="flex gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap shadow-sm ${selectedCategory === cat ? 'bg-primary text-white scale-105' : 'bg-white text-charcoal/40 hover:text-primary'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Dishes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {dishes.filter(d => selectedCategory === 'ALL' || d.category === selectedCategory).map(dish => (
                        <div key={dish.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-premium hover:shadow-glow transition-all duration-500 group">
                            <div className="h-48 bg-bg-cream flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                                {dish.image}
                            </div>
                            <div className="p-8">
                                <span className="text-xs font-black text-secondary uppercase tracking-[0.2em] mb-2 block">{dish.category}</span>
                                <h3 className="text-xl font-black text-primary mb-2 line-clamp-1">{dish.name}</h3>
                                <p className="text-xs text-charcoal/40 mb-6 font-medium">Finest local ingredients, gourmet prep.</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-black text-primary">KES {dish.price.toLocaleString()}</span>
                                    <button
                                        onClick={() => addToCart(dish)}
                                        className="bg-primary hover:bg-secondary text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-90"
                                    >
                                        <Plus className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Cart Sidebar */}
            {isCartOpen && (
                <div className="fixed inset-0 z-[200]">
                    <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
                    <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col p-8 animate-in slide-in-from-right duration-300">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-3xl font-black text-primary flex items-center gap-3">
                                <ShoppingCart className="text-secondary" /> Your Cart
                            </h2>
                            <button onClick={() => setIsCartOpen(false)} className="p-3 hover:bg-bg-cream rounded-2xl transition-colors">
                                <X className="w-6 h-6 text-charcoal/40" />
                            </button>
                        </div>

                        {cart.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center opacity-20">
                                <Utensils className="w-24 h-24 mb-6" />
                                <p className="text-xl font-black uppercase tracking-widest text-primary">Cart is Empty</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex gap-4 p-4 bg-bg-cream/50 rounded-3xl border border-cream/50 group">
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                                                {item.image}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-primary mb-1">{item.name}</h4>
                                                <p className="text-secondary font-black text-sm mb-3">KES {item.price.toLocaleString()}</p>
                                                <div className="flex items-center gap-4 bg-white self-start px-2 py-1 rounded-xl shadow-sm border border-cream">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="text-charcoal/40 hover:text-secondary"><Minus className="w-4 h-4" /></button>
                                                    <span className="font-black text-sm w-6 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="text-charcoal/40 hover:text-secondary"><Plus className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 pt-8 border-t border-cream space-y-6">
                                    <div className="flex justify-between items-end">
                                        <span className="text-charcoal/40 font-black uppercase tracking-widest text-xs">Total Amount</span>
                                        <span className="text-3xl font-black text-primary">KES {cartTotal.toLocaleString()}</span>
                                    </div>
                                    <button
                                        onClick={() => setIsCheckoutOpen(true)}
                                        className="w-full bg-primary hover:bg-secondary text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-4 text-xl tracking-widest uppercase"
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Checkout Modal */}
            {isCheckoutOpen && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-primary/60 backdrop-blur-md" onClick={() => setIsCheckoutOpen(false)} />
                    <div className="relative bg-white rounded-[3rem] w-full max-w-xl p-10 shadow-2xl animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-black text-primary">Ordering Info</h2>
                            <button onClick={() => setIsCheckoutOpen(false)} className="p-3 hover:bg-bg-cream rounded-2xl text-charcoal/40"><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handlePlaceOrder} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input
                                    required
                                    placeholder="Your Name"
                                    className="w-full bg-bg-cream border border-cream p-4 rounded-2xl outline-none focus:ring-2 focus:ring-secondary/20 font-bold"
                                    value={guestInfo.name}
                                    onChange={e => setGuestInfo({ ...guestInfo, name: e.target.value })}
                                />
                                <input
                                    required
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="w-full bg-bg-cream border border-cream p-4 rounded-2xl outline-none focus:ring-2 focus:ring-secondary/20 font-bold"
                                    value={guestInfo.phone}
                                    onChange={e => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                                />
                            </div>
                            <div className="flex bg-bg-cream p-1.5 rounded-2xl">
                                {['Takeaway', 'Dining In'].map(m => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setGuestInfo({ ...guestInfo, mode: m })}
                                        className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${guestInfo.mode === m ? 'bg-primary text-white shadow-lg' : 'text-primary/40'}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                            <div className="p-6 bg-secondary/5 rounded-3xl border border-secondary/10 flex items-center gap-4">
                                <div className="bg-secondary p-3 rounded-2xl text-white shadow-glow">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Payment Mode</p>
                                    <p className="font-bold text-primary">Pay on Collection/Delivery</p>
                                </div>
                            </div>
                            <button className="w-full bg-primary hover:bg-secondary text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95 text-xl tracking-widest uppercase">
                                Finalize Order
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Success Animation */}
            {orderSuccess && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-primary/90 backdrop-blur-2xl">
                    <div className="text-center text-white animate-in zoom-in duration-500">
                        <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-glow animate-bounce">
                            <Check className="w-16 h-16" strokeWidth={4} />
                        </div>
                        <h2 className="text-5xl font-black mb-4">Deliciously confirmed!</h2>
                        <p className="text-xl opacity-70 mb-12">Your order is being prepared with artisan care.</p>
                        <div className="flex flex-col items-center gap-8 mb-16">
                            <div className="flex gap-10">
                                <div className="text-center">
                                    <p className="text-[10px] uppercase font-black tracking-[0.3em] opacity-40 mb-2">ETA</p>
                                    <div className="flex items-center gap-2 text-2xl font-black">
                                        <Clock className="w-6 h-6 text-accent" /> 15-20 Min
                                    </div>
                                </div>
                                <div className="text-center border-l border-white/10 pl-10">
                                    <p className="text-[10px] uppercase font-black tracking-[0.3em] opacity-40 mb-2">Order #</p>
                                    <p className="text-2xl font-black text-secondary italic">#KO-{Math.floor(Math.random() * 9000) + 1000}</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => { setOrderSuccess(false); setIsCartOpen(false); }}
                            className="bg-white text-primary px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] hover:scale-110 active:scale-95 transition-all shadow-glow"
                        >
                            Back to Menu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuestMenu;
