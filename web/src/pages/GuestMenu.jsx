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
        let savedDishes;
        try {
            savedDishes = JSON.parse(localStorage.getItem('kolay_dishes'));
            if (savedDishes && savedDishes.length > 0 && !savedDishes[0].image.includes('/')) {
                // old emoji format detected
                savedDishes = null;
            }
        } catch (e) { }

        if (savedDishes) {
            setDishes(savedDishes);
        } else {
            // Default dishes if none exist — Real images and pricing
            const defaults = [
                { id: 1, name: 'Gourmet Beef Burger', price: 1200, category: 'Mains', image: '/assets/burger.png', desc: 'Aged wagyu beef, truffle aioli.' },
                { id: 2, name: 'Crispy Calamari', price: 850, category: 'Starters', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=600', desc: 'Golden fried with spicy marinara.' },
                { id: 3, name: 'Signature Ribeye', price: 3500, category: 'Mains', image: '/assets/steak.png', desc: 'Prime ribeye, garlic herb butter.' },
                { id: 4, name: 'Herb-Crusted Salmon', price: 2100, category: 'Mains', image: '/assets/salmon.png', desc: 'Fresh salmon with sesame glaze.' },
                { id: 5, name: 'Bruschetta', price: 650, category: 'Starters', image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&q=80&w=600', desc: 'Fresh tomatoes, garlic, hand-torn basil.' },
                { id: 6, name: 'Chocolate Fondant', price: 700, category: 'Desserts', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600', desc: 'Warm dark chocolate lava cake.' },
                { id: 7, name: 'Iced Latte', price: 450, category: 'Drinks', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=600', desc: 'Chilled espresso over milk.' }
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
            setCart([...cart, { ...dish, quantity: 1, image: dish.image }]);
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
        <div className="min-h-screen bg-[#0D0A07] font-body selection:bg-[#E67E22] selection:text-white">
            {/* Header */}
            <header className="sticky top-0 z-[100] bg-[#0A0704]/80 backdrop-blur-xl border-b border-white/5 p-5 shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors border border-white/8">
                            <ArrowLeft className="w-5 h-5 text-white/50 hover:text-white" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#E67E22] rounded-xl flex items-center justify-center">
                                <Utensils className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-display font-black text-white uppercase tracking-tight italic">
                                Kolay<span className="text-[#E67E22]">Menu</span>
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative bg-[#E67E22] hover:bg-[#D4A017] text-white p-4 rounded-2xl shadow-[0_0_30px_#E67E2240] hover:scale-105 active:scale-95 transition-all"
                    >
                        <ShoppingCart className="w-6 h-6" />
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-white text-[#E67E22] w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border border-white/20">
                                {cart.reduce((acc, item) => acc + item.quantity, 0)}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 md:px-12 py-16">
                <div className="mb-14 text-center">
                    <p className="text-[#E67E22] text-xs font-black uppercase tracking-[0.4em] mb-4">Live Menu</p>
                    <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4 tracking-tight">Order Online</h1>
                    <p className="text-white/40 font-medium max-w-md mx-auto">Fresh food, prepared with love. Pick your favorites and we'll handle the rest.</p>
                </div>

                {/* Categories */}
                <div className="flex justify-center gap-3 mb-14 overflow-x-auto pb-4 scrollbar-hide">
                    <div className="bg-white/3 border border-white/5 rounded-2xl p-1.5 flex gap-2 w-fit mx-auto">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${selectedCategory === cat
                                    ? 'bg-[#E67E22] text-white shadow-[0_0_20px_#E67E2240]'
                                    : 'text-white/40 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dishes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {dishes.filter(d => selectedCategory === 'ALL' || d.category === selectedCategory).map(dish => (
                        <div key={dish.id} className="group relative bg-white/3 border border-white/5 hover:border-[#E67E22]/40 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1">
                            {/* Dish image using an img instead of emoji */}
                            <div className="relative h-56 overflow-hidden">
                                {dish.image?.startsWith('http') || dish.image?.startsWith('/') ? (
                                    <img src={dish.image} alt={dish.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full bg-[#1A1008] flex items-center justify-center font-display text-white/10 uppercase tracking-widest text-xl">Kolay</div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0A07] via-transparent to-transparent" />
                                <span className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                                    {dish.category}
                                </span>
                            </div>

                            <div className="p-6">
                                <h3 className="text-white font-black text-lg group-hover:text-[#E67E22] transition-colors mb-2 leading-tight line-clamp-1">{dish.name}</h3>
                                <p className="text-white/30 text-xs leading-relaxed line-clamp-2 mb-6">{dish.desc || 'Finest local ingredients, gourmet prep.'}</p>
                                <div className="flex justify-between items-center mt-auto">
                                    <span className="text-[#E67E22] font-black text-lg shrink-0">KES {dish.price.toLocaleString()}</span>
                                    <button
                                        onClick={() => addToCart(dish)}
                                        className="bg-white/5 hover:bg-[#E67E22] border border-white/10 text-white w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 group/btn shadow-lg"
                                    >
                                        <Plus className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>
                            {/* Bottom accent */}
                            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[#E67E22] to-[#D4A017] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        </div>
                    ))}
                </div>
            </main>

            {/* Cart Sidebar */}
            {isCartOpen && (
                <div className="fixed inset-0 z-[200]">
                    <div className="absolute inset-0 bg-[#0D0A07]/80 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
                    <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[#1A1008] border-l border-white/5 shadow-2xl flex flex-col pt-8 animate-in slide-in-from-right duration-300">
                        <div className="flex justify-between items-center mb-8 px-8">
                            <h2 className="text-2xl font-display font-black text-white flex items-center gap-3">
                                <ShoppingCart className="text-[#E67E22]" /> Your Order
                            </h2>
                            <button onClick={() => setIsCartOpen(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors">
                                <X className="w-5 h-5 text-white/50" />
                            </button>
                        </div>

                        {cart.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center opacity-30 mt-20 px-8 text-center">
                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                    <Utensils className="w-10 h-10 text-white" />
                                </div>
                                <p className="text-xl font-black uppercase tracking-widest text-white mb-2">Cart is Empty</p>
                                <p className="text-white/50 text-sm">Add some delicious meals from the menu.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex-1 overflow-y-auto space-y-4 px-8 pb-8 custom-scrollbar">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex gap-4 p-4 bg-white/3 hover:bg-white/5 rounded-3xl border border-white/5 transition-colors">
                                            <div className="w-20 h-20 bg-[#0D0A07] rounded-2xl overflow-hidden shadow-sm shrink-0">
                                                {item.image?.startsWith('http') || item.image?.startsWith('/') ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : <div className="w-full h-full bg-[#1A1008]" />}
                                            </div>
                                            <div className="flex-1 py-1 flex flex-col justify-between">
                                                <div>
                                                    <h4 className="font-bold text-white text-sm leading-tight mb-1">{item.name}</h4>
                                                    <p className="text-[#E67E22] font-black text-xs">KES {item.price.toLocaleString()}</p>
                                                </div>
                                                <div className="flex items-center gap-3 bg-[#0D0A07] w-fit px-1.5 py-1 rounded-xl border border-white/5">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white/5 hover:bg-[#E67E22] rounded-lg text-white transition-colors"><Minus className="w-3 h-3" /></button>
                                                    <span className="font-black text-xs w-4 text-center text-white">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white/5 hover:bg-[#E67E22] rounded-lg text-white transition-colors"><Plus className="w-3 h-3" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-6 pb-8 px-8 bg-[#0D0A07] border-t border-white/5">
                                    <div className="flex justify-between items-end mb-6">
                                        <span className="text-white/40 font-black uppercase tracking-widest text-[10px]">Total Amount</span>
                                        <span className="text-3xl font-black text-[#E67E22]">KES {cartTotal.toLocaleString()}</span>
                                    </div>
                                    <button
                                        onClick={() => setIsCheckoutOpen(true)}
                                        className="w-full bg-[#E67E22] hover:bg-[#D4A017] text-white font-black py-5 rounded-2xl shadow-[0_0_30px_#E67E2230] transition-all flex items-center justify-center gap-3 text-sm tracking-widest uppercase active:scale-95"
                                    >
                                        Checkout Now <ArrowRight className="w-4 h-4" />
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
                    <div className="absolute inset-0 bg-[#0D0A07]/90 backdrop-blur-sm" onClick={() => setIsCheckoutOpen(false)} />
                    <div className="relative bg-[#1A1008] border border-white/5 rounded-[3rem] w-full max-w-xl p-10 shadow-2xl animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-display font-black text-white">Finalize Order</h2>
                            <button onClick={() => setIsCheckoutOpen(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white/40 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handlePlaceOrder} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <input
                                    required
                                    placeholder="Your Name"
                                    className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 p-4 rounded-xl outline-none focus:border-[#E67E22]/50 focus:ring-0 text-sm font-semibold transition-colors"
                                    value={guestInfo.name}
                                    onChange={e => setGuestInfo({ ...guestInfo, name: e.target.value })}
                                />
                                <input
                                    required
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 p-4 rounded-xl outline-none focus:border-[#E67E22]/50 text-sm font-semibold transition-colors"
                                    value={guestInfo.phone}
                                    onChange={e => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                                />
                            </div>
                            <div className="flex bg-white/3 p-1.5 rounded-2xl border border-white/5">
                                {['Takeaway', 'Dining In'].map(m => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setGuestInfo({ ...guestInfo, mode: m })}
                                        className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${guestInfo.mode === m ? 'bg-[#E67E22] text-white shadow-[0_4px_15px_#E67E2240]' : 'text-white/30 hover:text-white'
                                            }`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                            <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                                <div className="bg-[#E67E22]/20 border border-[#E67E22]/30 p-3 rounded-xl text-[#E67E22]">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Payment Options</p>
                                    <p className="font-semibold text-white text-sm">Pay seamlessly on delivery/collection</p>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#E67E22] hover:bg-[#D4A017] text-white font-black mt-2 py-4 rounded-xl text-sm uppercase tracking-widest transition-all active:scale-95 shadow-[0_0_30px_#E67E2230]"
                            >
                                Confirm Order • {cartTotal.toLocaleString()} KES
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {orderSuccess && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0D0A07]/90 backdrop-blur-md" onClick={() => setOrderSuccess(false)} />
                    <div className="relative bg-[#1A1008] border border-white/5 rounded-[3rem] p-12 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-[#E67E22] rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-[0_0_40px_#E67E2250]">
                            <Check className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-display font-black text-white mb-3">Chef is ready!</h2>
                        <p className="text-white/40 text-sm leading-relaxed mb-8">
                            Your order has been sent straight to the kitchen. {guestInfo.mode === 'Takeaway' ? 'We will prepare it right away.' : 'A server will attend to you matching your name.'}
                        </p>
                        <button
                            onClick={() => {
                                setOrderSuccess(false);
                                setGuestInfo({ name: '', phone: '', mode: 'Takeaway' });
                            }}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black w-full py-4 rounded-xl text-[10px] uppercase tracking-widest transition-colors"
                        >
                            Return to Menu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuestMenu;
