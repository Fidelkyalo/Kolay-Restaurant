import React, { useState } from 'react';
import { Search, ShoppingCart, Plus, Minus, X, CreditCard, User, ClipboardList, UtensilsCrossed, ArrowLeft, CheckCircle, Printer, Settings, Trash2, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const POS = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [tables, setTables] = useState(() => {
        const saved = localStorage.getItem('kolay_tables');
        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.map(t => t.startsWith('T-') ? `Kolay ${t}` : t);
        }
        return ['Kolay T-01', 'Kolay T-02', 'Kolay T-03', 'Kolay T-04', 'Kolay T-05', 'Kolay T-08', 'Kolay T-10', 'Kolay T-12', 'Kolay T-15', 'Takeaway', 'Online Order'];
    });
    const [newTableNumber, setNewTableNumber] = useState('');
    const [selectedTable, setSelectedTable] = useState('Kolay T-01');
    const [showTableModal, setShowTableModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [lastPlacedOrder, setLastPlacedOrder] = useState(null);
    const [isManageMode, setIsManageMode] = useState(false);
    const [editingDishId, setEditingDishId] = useState(null);

    const handlePrintReceipt = () => {
        if (!lastPlacedOrder) {
            console.error("No receipt data available");
            return;
        }

        const printWindow = window.open('', '_blank', 'width=400,height=600');
        if (!printWindow) {
            alert('Popup blocked! Please allow popups to print receipts.');
            return;
        }

        const receiptHtml = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Receipt - ${lastPlacedOrder.id}</title>
                    <style>
                        body { 
                            font-family: 'Courier New', Courier, monospace; 
                            width: 300px; 
                            margin: 0 auto; 
                            color: #1a1a1a; 
                            padding: 20px; 
                            line-height: 1.4;
                            position: relative;
                            overflow: hidden;
                        }
                        .watermark {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%) rotate(-15deg);
                            width: 250px;
                            opacity: 0.15;
                            z-index: -1;
                            pointer-events: none;
                        }
                        .header { text-align: center; border-bottom: 2px dashed #eee; padding-bottom: 20px; margin-bottom: 20px; }
                        .restaurant-name { font-size: 24px; font-weight: bold; margin: 0; color: #4E2C1E; }
                        .tagline { font-size: 10px; font-style: italic; color: #888; margin-top: 4px; }
                        .order-info { margin-bottom: 20px; font-size: 14px; }
                        .items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                        .items th { text-align: left; border-bottom: 1px solid #eee; padding: 5px 0; font-size: 10px; text-transform: uppercase; color: #888; }
                        .items td { padding: 8px 0; font-size: 14px; vertical-align: top; }
                        .items .qty { width: 30px; }
                        .items .price { text-align: right; }
                        .totals { border-top: 2px dashed #eee; padding-top: 15px; margin-top: 15px; }
                        .total-row { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 14px; }
                        .total-row.grand { font-size: 20px; font-weight: bold; margin-top: 10px; color: #1a1a1a; border-top: 1px solid #eee; padding-top: 10px; }
                        .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
                        @media print { .no-print { display: none; } }
                    </style>
                </head>
                <body>
                    <img src="/Logo.png" class="watermark" />
                    <div class="header">
                        <h1 class="restaurant-name">KOLAY RESTAURANT</h1>
                        <p class="tagline">"Where Every Meal Feels Right"</p>
                        <p style="font-size: 11px;">123 Thome Street, Nairobi<br>Tel: +254 102 039 121<br>Email: kolayrestaurant@gmail.com</p>
                    </div>
                    <div class="order-info">
                        <div class="total-row"><span>ID:</span> <strong>#${lastPlacedOrder.id}</strong></div>
                        <div class="total-row"><span>Date:</span> <span>${new Date().toLocaleDateString()}</span></div>
                        <div class="total-row"><span>Time:</span> <span>${new Date().toLocaleTimeString('en-GB')}</span></div>
                        <div class="total-row"><span>Channel:</span> <strong>${lastPlacedOrder.table} ${lastPlacedOrder.table === 'Online Order' ? '(ONLINE)' : ''}</strong></div>
                    </div>
                    <table class="items">
                        <thead>
                            <tr><th class="qty">QTY</th><th>ITEM</th><th class="price">PRICE</th></tr>
                        </thead>
                        <tbody>
                            ${lastPlacedOrder.items.map(item => `
                                <tr>
                                    <td class="qty">${item.quantity}</td>
                                    <td>${item.name}</td>
                                    <td class="price">${((item.price || 0) * item.quantity).toLocaleString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="totals">
                        <div class="total-row"><span>Subtotal</span> <span>KES ${lastPlacedOrder.total.replace('KES ', '')}</span></div>
                        <div class="total-row"><span>Tax (VAT 16%)</span> <span>Incl.</span></div>
                        <div class="total-row grand"><span>TOTAL</span> <span>${lastPlacedOrder.total}</span></div>
                    </div>
                    <div class="footer">
                        <p>Thank you for dining with us!<br>Visit again soon.</p>
                        <p style="font-size: 8px; margin-top: 10px;">GENERATED BY KOLAY RMS</p>
                    </div>
                </body>
            </html>
        `;

        printWindow.document.write(receiptHtml);
        printWindow.document.close();
        printWindow.focus();

        // Give it a small moment to render styles before printing
        setTimeout(() => {
            printWindow.print();
            // printWindow.close();
        }, 250);
    };

    const addTable = () => {
        if (!newTableNumber.trim()) return;
        let formatted = newTableNumber;
        if (formatted.startsWith('T-')) {
            formatted = `Kolay ${formatted}`;
        } else if (!formatted.toLowerCase().includes('kolay') && !formatted.toLowerCase().includes('takeaway') && !formatted.toLowerCase().includes('online')) {
            formatted = `Kolay T-${formatted}`;
        }

        if (tables.includes(formatted)) return;

        const updated = [...tables, formatted];
        setTables(updated);
        localStorage.setItem('kolay_tables', JSON.stringify(updated));
        setNewTableNumber('');
    };

    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('kolay_dishes');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Beef Burger', price: 850, category: 'Main Dish', image: '🍔' },
            { id: 2, name: 'Margherita Pizza', price: 1100, category: 'Main Dish', image: '🍕' },
            { id: 3, name: 'Grilled Salmon', price: 1850, category: 'Main Dish', image: '🐟' },
            { id: 4, name: 'Cappuccino', price: 350, category: 'Beverages', image: '☕' },
            { id: 5, name: 'Iced Tea', price: 250, category: 'Beverages', image: '🍹' },
            { id: 6, name: 'French Fries', price: 300, category: 'Side Dish', image: '🍟' },
            { id: 7, name: 'Fruit Salad', price: 450, category: 'Desserts', image: '🥗' },
            { id: 8, name: 'Pancakes', price: 550, category: 'BreakFast', image: '🥞' },
        ];
    });
    const [showDishModal, setShowDishModal] = useState(false);
    const [newDish, setNewDish] = useState({ name: '', price: '', category: 'Main Dish', image: '🍱' });

    const saveDish = () => {
        if (!newDish.name.trim() || !newDish.price) return;

        let updated;
        if (editingDishId) {
            updated = products.map(p => p.id === editingDishId ? {
                ...newDish,
                id: editingDishId,
                price: parseFloat(newDish.price)
            } : p);
        } else {
            const dishToAdd = {
                id: Date.now(),
                ...newDish,
                price: parseFloat(newDish.price)
            };
            updated = [...products, dishToAdd];
        }

        setProducts(updated);
        localStorage.setItem('kolay_dishes', JSON.stringify(updated));
        setNewDish({ name: '', price: '', category: 'Main Dish', image: '🍱' });
        setEditingDishId(null);
        setShowDishModal(false);
    };

    const deleteDish = (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this dish entirely?')) {
            const updated = products.filter(p => p.id !== id);
            setProducts(updated);
            localStorage.setItem('kolay_dishes', JSON.stringify(updated));
        }
    };

    const categories = ['All', 'BreakFast', 'Main Dish', 'Beverages', 'Desserts', 'Side Dish'];

    const filteredProducts = products.filter(p =>
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
            table: selectedTable,
            items: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price, notes: '' })),
            total: `KES ${(subtotal + tax).toLocaleString()}`,
            status: 'PENDING',
            statusColor: 'bg-gray-100 text-gray-700'
        };

        const existing = JSON.parse(localStorage.getItem('kolay_orders') || '[]');
        localStorage.setItem('kolay_orders', JSON.stringify([newOrder, ...existing]));

        // Permanent Archive for history/review
        const archive = JSON.parse(localStorage.getItem('kolay_archive') || '[]');
        localStorage.setItem('kolay_archive', JSON.stringify([newOrder, ...archive]));

        setLastPlacedOrder(newOrder);
        setCart([]);
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setLastPlacedOrder(null);
        }, 8000); // Increased time to allow for receipt printing
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.16; // 16% VAT
    const total = subtotal + tax;

    return (
        <div className="flex flex-col h-screen bg-bg-cream font-body overflow-hidden relative">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                {/* Table Selection Modal */}
                {showTableModal && (
                    <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl p-8 animate-in zoom-in duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-primary">Assign Table</h3>
                                <button onClick={() => setShowTableModal(false)} className="text-charcoal/40 hover:text-primary text-2xl">&times;</button>
                            </div>
                            <div className="grid grid-cols-4 gap-4 mb-8">
                                {tables.map(t => (
                                    <button
                                        key={t}
                                        onClick={() => { setSelectedTable(t); setShowTableModal(false); }}
                                        className={`py-4 rounded-2xl font-bold text-sm transition-all border-2 ${selectedTable === t
                                            ? 'bg-primary text-white border-primary shadow-lg scale-105'
                                            : 'bg-bg-cream border-cream text-charcoal/60 hover:border-secondary/50'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-4 border-t border-cream pt-6 mt-4">
                                <input
                                    type="text"
                                    placeholder="New table # (e.g. 16)"
                                    className="flex-1 px-4 py-3 bg-bg-cream border border-cream rounded-xl outline-none focus:ring-2 focus:ring-secondary/50 font-bold"
                                    value={newTableNumber}
                                    onChange={(e) => setNewTableNumber(e.target.value)}
                                />
                                <button
                                    onClick={addTable}
                                    className="bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg active:scale-95"
                                >
                                    Add Table
                                </button>
                            </div>
                            <button
                                onClick={() => setShowTableModal(false)}
                                className="w-full py-4 mt-4 bg-bg-cream text-charcoal font-bold rounded-2xl hover:bg-cream transition-colors text-sm uppercase tracking-widest"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Success Overlay */}
                {showSuccess && (
                    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-primary/20 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white rounded-[3rem] p-12 text-center shadow-2xl animate-in zoom-in duration-300 max-w-sm w-full mx-4">
                            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                                <CheckCircle className="w-12 h-12" />
                            </div>
                            <h3 className="text-3xl font-black text-primary mb-4">Order Placed!</h3>
                            <p className="text-charcoal/60 font-medium mb-10 leading-relaxed">
                                Order <strong>#{lastPlacedOrder?.id}</strong> has been sent to the kitchen.
                            </p>
                            <div className="space-y-4">
                                <button
                                    onClick={handlePrintReceipt}
                                    className="w-full bg-secondary text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl active:scale-95 text-lg"
                                >
                                    <Printer className="w-6 h-6" /> Print Receipt
                                </button>
                                <button
                                    onClick={() => setShowSuccess(false)}
                                    className="w-full bg-bg-cream text-charcoal/40 py-4 rounded-xl font-bold hover:bg-cream transition-colors text-sm uppercase tracking-widest"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Left Menu Side */}
                <div className="flex-1 flex flex-col p-6 overflow-hidden">
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
                    <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide items-center">
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
                        <button
                            onClick={() => setIsManageMode(!isManageMode)}
                            className={`px-6 py-2.5 rounded-full font-bold border transition-all flex items-center gap-2 ${isManageMode ? 'bg-primary text-white border-primary shadow-lg' : 'bg-primary/5 hover:bg-primary text-primary hover:text-white border-primary/20'
                                }`}
                        >
                            <Settings className="w-4 h-4" /> Edit Menu
                        </button>
                        {isManageMode && (
                            <button
                                onClick={() => {
                                    setEditingDishId(null);
                                    setNewDish({ name: '', price: '', category: 'Main Dish', image: '🍱' });
                                    setShowDishModal(true);
                                }}
                                className="bg-secondary text-white hover:bg-orange-600 px-6 py-2.5 rounded-full font-bold border border-secondary transition-all flex items-center gap-2 shadow-sm"
                            >
                                <Plus className="w-4 h-4" /> Add Dish
                            </button>
                        )}
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pr-2 custom-scrollbar">
                        {filteredProducts.map(product => (
                            <div
                                key={product.id}
                                onClick={() => {
                                    if (isManageMode) {
                                        setEditingDishId(product.id);
                                        setNewDish({ name: product.name, price: product.price, category: product.category, image: product.image });
                                        setShowDishModal(true);
                                    } else {
                                        addToCart(product);
                                    }
                                }}
                                className={`bg-white p-5 rounded-3xl border border-cream hover:border-secondary/30 hover:shadow-xl transition-all cursor-pointer group active:scale-95 ${isManageMode ? 'ring-2 ring-primary/20' : ''}`}
                            >
                                <div className="h-32 bg-bg-cream rounded-2xl mb-4 relative flex items-center justify-center text-5xl group-hover:scale-110 transition-transform overflow-hidden">
                                    {isManageMode && (
                                        <button
                                            onClick={(e) => deleteDish(product.id, e)}
                                            className="absolute top-2 right-2 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white p-2 rounded-full shadow-sm transition-all z-10"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    {product.image?.startsWith('http') || product.image?.startsWith('/') ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600'; }}
                                        />
                                    ) : (
                                        product.image
                                    )}
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
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-bg-cream/20">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-[10px] font-black uppercase text-charcoal/40 tracking-widest">Order Details</h3>
                            <button onClick={() => setCart([])} className="text-[10px] font-black text-red-500 hover:text-red-700 uppercase tracking-tighter hover:underline">Clear Cart</button>
                        </div>
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                                <ShoppingCart className="w-20 h-20 mb-4" />
                                <p className="font-bold">Your cart is empty</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="flex gap-4 p-4 rounded-[2rem] bg-white border-2 border-cream shadow-sm hover:shadow-md transition-all group relative">
                                    <div className="w-16 h-16 bg-bg-cream rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform overflow-hidden shadow-sm">
                                        {item.image?.startsWith('http') || item.image?.startsWith('/') ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600'; }}
                                            />
                                        ) : (
                                            item.image
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-primary text-sm line-clamp-1">{item.name}</h4>
                                            <button onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }} className="text-red-300 hover:text-red-500 transition-colors">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <p className="text-secondary font-black text-sm">KES {item.price.toLocaleString()}</p>
                                            <div className="flex items-center gap-3 bg-bg-cream rounded-xl px-3 py-1.5 border border-cream">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-secondary transition-colors"><Minus className="w-3 h-3" /></button>
                                                <span className="text-sm font-black w-6 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-secondary transition-colors"><Plus className="w-3 h-3" /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Summary & Checkout - REVERTED TO BOTTOM */}
                    <div className="p-8 bg-white border-t border-cream space-y-6 shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.1)] relative z-20">
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs font-bold text-charcoal/40 uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span>KES {subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-charcoal/40 uppercase tracking-widest">
                                <span>Tax (16%)</span>
                                <span>KES {tax.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end pt-4 border-t border-cream/50">
                                <span className="font-black text-primary text-lg">Total</span>
                                <span className="font-black text-secondary text-3xl tracking-tighter">KES {total.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-cream font-black text-charcoal/40 hover:bg-bg-cream transition-all text-xs uppercase tracking-widest">
                                <User className="w-5 h-5" /> Guest
                            </button>
                            <button
                                onClick={() => setShowTableModal(true)}
                                className="flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-secondary/30 text-secondary font-black hover:bg-orange-50 transition-all group text-xs uppercase tracking-widest"
                            >
                                <ShoppingCart className="w-5 h-5" /> {selectedTable}
                            </button>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={cart.length === 0}
                            className="w-full bg-primary hover:bg-charcoal text-white font-black py-5 rounded-2xl shadow-2xl shadow-primary/20 transition-all active:transform active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed text-xl uppercase tracking-widest group"
                        >
                            <CreditCard className="w-6 h-6 text-accent group-hover:rotate-12 transition-transform" /> Place Order
                        </button>
                    </div>
                </div>
                {/* Manage Dish Modal */}
                {showDishModal && (
                    <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-8 animate-in zoom-in duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-primary">Add New Dish</h3>
                                <button onClick={() => setShowDishModal(false)} className="text-charcoal/40 hover:text-primary text-2xl">&times;</button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Dish Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Chicken Wings"
                                        className="w-full px-4 py-3 bg-bg-cream border border-cream rounded-xl outline-none focus:ring-2 focus:ring-secondary/50 font-bold"
                                        value={newDish.name}
                                        onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Price (KES)</label>
                                        <input
                                            type="number"
                                            placeholder="850"
                                            className="w-full px-4 py-3 bg-bg-cream border border-cream rounded-xl outline-none focus:ring-2 focus:ring-secondary/50 font-bold"
                                            value={newDish.price}
                                            onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Category</label>
                                        <select
                                            className="w-full px-4 py-3 bg-bg-cream border border-cream rounded-xl outline-none focus:ring-2 focus:ring-secondary/50 font-bold appearance-none"
                                            value={newDish.category}
                                            onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                                        >
                                            {categories.filter(c => c !== 'All').map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Image URL (Unsplash or Local)</label>
                                    <input
                                        type="text"
                                        placeholder="https://images.unsplash.com/..."
                                        className="w-full px-4 py-3 bg-bg-cream border border-cream rounded-xl outline-none focus:ring-2 focus:ring-secondary/50 font-bold text-sm"
                                        value={newDish.image === '🍱' ? '' : newDish.image}
                                        onChange={(e) => setNewDish({ ...newDish, image: e.target.value || '🍱' })}
                                    />
                                </div>
                                <button
                                    onClick={saveDish}
                                    className="w-full bg-secondary text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-xl mt-4 active:scale-95"
                                >
                                    {editingDishId ? 'Save Changes' : 'Add to Menu'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default POS;
