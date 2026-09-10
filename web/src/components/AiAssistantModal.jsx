import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Sparkles, RefreshCw, AlertTriangle, CheckCircle, Package, Utensils, Tag, ClipboardList, ShieldAlert, MessageSquare, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Helper to gather live website state
const getLiveWebsiteData = () => {
    // 1. Inventory State
    const rawInventory = localStorage.getItem('kolay_inventory');
    const defaultInventory = [
        { id: 1, name: 'Beef Burger Patties', stock: 12, unit: 'units', category: 'Meat' },
        { id: 2, name: 'Fresh Salmon', stock: 5, unit: 'kg', category: 'Fish' },
        { id: 3, name: 'Cooking Oil', stock: 45, unit: 'L', category: 'Supplies' },
        { id: 4, name: 'Burger Buns', stock: 120, unit: 'units', category: 'Bakery' },
        { id: 5, name: 'French Fries', stock: 0, unit: 'kg', category: 'Produce' },
        { id: 6, name: 'Tomato Sauce', stock: 8, unit: 'L', category: 'Supplies' },
        { id: 7, name: 'Chicken Breast', stock: 30, unit: 'kg', category: 'Meat' },
        { id: 8, name: 'Pasta', stock: 3, unit: 'kg', category: 'Dry Goods' },
    ];
    const inventory = rawInventory ? JSON.parse(rawInventory) : defaultInventory;
    const outOfStockItems = inventory.filter(i => Number(i.stock) <= 0);
    const lowStockItems = inventory.filter(i => Number(i.stock) > 0 && Number(i.stock) <= 20);
    const okStockItems = inventory.filter(i => Number(i.stock) > 20);

    // 2. Dishes & Menu State
    const rawDishes = localStorage.getItem('kolay_dishes');
    const defaultDishes = [
        { id: 1, name: 'Truffle Mushroom Burger', price: 18.50, category: 'Main Course', available: true, isSpecialty: true },
        { id: 2, name: 'Grilled Atlantic Salmon', price: 24.00, category: 'Main Course', available: true, isSpecialty: true },
        { id: 3, name: 'Artisan Wood-fired Pizza', price: 16.00, category: 'Main Course', available: true, isSpecialty: false },
        { id: 4, name: 'Classic French Fries', price: 6.50, category: 'Sides', available: false, isSpecialty: false },
        { id: 5, name: 'Organic Garden Salad', price: 9.50, category: 'Starters', available: true, isSpecialty: false },
        { id: 6, name: 'Signature Chocolate Lava Cake', price: 11.00, category: 'Desserts', available: true, isSpecialty: true },
    ];
    const dishes = rawDishes ? JSON.parse(rawDishes) : defaultDishes;
    const availableDishes = dishes.filter(d => d.available !== false);
    const unavailableDishes = dishes.filter(d => d.available === false);
    const specialtyDishes = dishes.filter(d => d.isSpecialty || d.category === 'Specialties');

    // 3. Active Orders & Kitchen State
    const rawOrders = localStorage.getItem('kolay_kds_orders');
    const orders = rawOrders ? JSON.parse(rawOrders) : [
        { id: 'ORD-101', table: 'Table 04', items: ['Truffle Mushroom Burger', 'French Fries'], status: 'Preparing' },
        { id: 'ORD-102', table: 'Table 08', items: ['Grilled Atlantic Salmon'], status: 'Pending' },
    ];

    // 4. Reservations & Bookings
    const rawBookings = localStorage.getItem('kolay_reservations');
    const bookings = rawBookings ? JSON.parse(rawBookings) : [
        { id: 1, name: 'John Doe', partySize: 4, time: '19:30', status: 'Confirmed' },
        { id: 2, name: 'Sarah Smith', partySize: 2, time: '20:00', status: 'Pending' },
    ];

    // 5. Members State
    const rawMembers = localStorage.getItem('kolay_members');
    const members = rawMembers ? JSON.parse(rawMembers) : [
        { id: 1, name: 'John Mwangi', tier: 'Gold', totalSpent: 1250 },
        { id: 2, name: 'Amina Ali', tier: 'Silver', totalSpent: 840 },
    ];

    // 6. Settings
    const rawSettings = localStorage.getItem('kolay_settings');
    const settings = rawSettings ? JSON.parse(rawSettings) : { restaurantName: 'Kolay Restaurant', currency: '$' };

    return {
        inventory,
        outOfStockItems,
        lowStockItems,
        okStockItems,
        dishes,
        availableDishes,
        unavailableDishes,
        specialtyDishes,
        orders,
        bookings,
        members,
        settings,
    };
};

const AiAssistantModal = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'ai',
            text: t('ai_welcome_msg', 'Hello! I am your AI Operations Simulator. I monitor live website data, inventory, menu availability, offers, and active orders. What would you like to know?'),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    if (!isOpen) return null;

    const quickPrompts = [
        { label: t('ai_qp_stock', 'What is out of stock?'), icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> },
        { label: t('ai_qp_food', 'What food is available?'), icon: <Utensils className="w-3.5 h-3.5 text-emerald-400" /> },
        { label: t('ai_qp_offers', 'What offers & specialties exist?'), icon: <Tag className="w-3.5 h-3.5 text-cyan-400" /> },
        { label: t('ai_qp_orders', 'What active orders are in kitchen?'), icon: <ClipboardList className="w-3.5 h-3.5 text-indigo-400" /> },
    ];

    const generateAiResponse = (userQuery) => {
        const query = userQuery.toLowerCase().trim();
        const data = getLiveWebsiteData();
        const currency = data.settings.currency || '$';

        // 1. Check for Out of Stock or Low Stock
        if (query.includes('out of stock') || query.includes('missing') || query.includes('sold out') || query.includes('unavailable')) {
            const inventoryOut = data.outOfStockItems;
            const dishesOut = data.unavailableDishes;

            if (inventoryOut.length === 0 && dishesOut.length === 0) {
                return `✅ **Great news!** Everything is currently in stock. No inventory items or menu dishes are marked out of stock.`;
            }

            let response = `🚨 **Out of Stock Report (Live State):**\n\n`;
            if (inventoryOut.length > 0) {
                response += `**Inventory Ingredients Out of Stock (${inventoryOut.length}):**\n`;
                inventoryOut.forEach(item => {
                    response += `• 🔴 **${item.name}** (${item.category}): 0 ${item.unit} remaining\n`;
                });
            }
            if (dishesOut.length > 0) {
                response += `\n**Menu Items Marked Unavailable (${dishesOut.length}):**\n`;
                dishesOut.forEach(dish => {
                    response += `• ❌ **${dish.name}** (${dish.category}) - ${currency}${dish.price}\n`;
                });
            }
            response += `\n*Recommendation: Reorder stock for ${inventoryOut.map(i => i.name).join(', ') || 'depleted items'} immediately.*`;
            return response;
        }

        // 2. Check for Low Stock
        if (query.includes('low stock') || query.includes('stock warning') || query.includes('inventory status') || query.includes('running low')) {
            const low = data.lowStockItems;
            if (low.length === 0) {
                return `✅ **Stock Status:** All stock items are well supplied above threshold levels.`;
            }
            let response = `⚠️ **Low Stock Alert (${low.length} items below threshold):**\n\n`;
            low.forEach(item => {
                response += `• 🟡 **${item.name}**: ${item.stock} ${item.unit} remaining (${item.category})\n`;
            });
            response += `\n💡 Total inventory tracked: ${data.inventory.length} items (${data.outOfStockItems.length} out of stock, ${low.length} low stock).`;
            return response;
        }

        // 3. General Stock Question
        if (query.includes('stock') || query.includes('inventory') || query.includes('ingredient')) {
            let response = `📦 **Live Inventory & Stock Breakdown:**\n\n`;
            response += `• 🟢 **Well Supplied (${data.okStockItems.length}):** ${data.okStockItems.map(i => `${i.name} (${i.stock} ${i.unit})`).slice(0, 4).join(', ')}...\n`;
            response += `• 🟡 **Low Stock (${data.lowStockItems.length}):** ${data.lowStockItems.map(i => `${i.name} (${i.stock} ${i.unit})`).join(', ') || 'None'}\n`;
            response += `• 🔴 **Out of Stock (${data.outOfStockItems.length}):** ${data.outOfStockItems.map(i => `${i.name}`).join(', ') || 'None'}\n`;
            return response;
        }

        // 4. Food & Menu Availability
        if (query.includes('food') || query.includes('menu') || query.includes('dishes') || query.includes('what is there') || query.includes('available')) {
            let response = `🍽️ **Live Menu & Food Availability:**\n\n`;
            response += `Currently **${data.availableDishes.length}** out of **${data.dishes.length}** menu items are ready to serve.\n\n`;
            response += `**Popular Available Dishes:**\n`;
            data.availableDishes.slice(0, 6).forEach(dish => {
                response += `• 🟢 **${dish.name}** — ${currency}${dish.price} (${dish.category})${dish.isSpecialty ? ' ⭐ *Specialty*' : ''}\n`;
            });
            if (data.unavailableDishes.length > 0) {
                response += `\n**Currently Unavailable:** ${data.unavailableDishes.map(d => d.name).join(', ')}`;
            }
            return response;
        }

        // 5. Offers & Specialties
        if (query.includes('offer') || query.includes('special') || query.includes('discount') || query.includes('deal') || query.includes('promo')) {
            let response = `🎁 **Active Offers & Chef Specialties:**\n\n`;
            if (data.specialtyDishes.length > 0) {
                data.specialtyDishes.forEach(item => {
                    response += `⭐ **${item.name}** — ${currency}${item.price}\n  └ ${item.category} • *10% Member Discount Applicable*\n`;
                });
            } else {
                response += `No dishes currently flagged as special offer. Check Specialties page to feature items.\n`;
            }
            response += `\n💡 Members receive exclusive 10% discounts on all specialty dishes automatically at checkout!`;
            return response;
        }

        // 6. Active Orders & Kitchen KDS Activity
        if (query.includes('order') || query.includes('kitchen') || query.includes('kds') || query.includes('activity') || query.includes('sales')) {
            let response = `🍳 **Kitchen & Order Activity (Live):**\n\n`;
            response += `• **Active Orders:** ${data.orders.length} in queue\n`;
            data.orders.forEach(ord => {
                response += `  └ **${ord.id}** (${ord.table || 'Dine-in'}) — Status: *${ord.status}* [${ord.items.join(', ')}]\n`;
            });
            response += `\n• **Upcoming Table Reservations:** ${data.bookings.length} reservations today.`;
            return response;
        }

        // 7. Specific Item Lookup (e.g., "burger", "salmon", "fries", "pizza", "coffee")
        const matchedDish = data.dishes.find(d => query.includes(d.name.toLowerCase()) || query.includes(d.category.toLowerCase()));
        const matchedItem = data.inventory.find(i => query.includes(i.name.toLowerCase()));

        if (matchedDish || matchedItem) {
            let response = `🔍 **Live Status Search Results:**\n\n`;
            if (matchedDish) {
                response += `🍽️ **Dish:** ${matchedDish.name}\n`;
                response += `• Category: ${matchedDish.category}\n`;
                response += `• Price: ${currency}${matchedDish.price}\n`;
                response += `• Availability: ${matchedDish.available !== false ? '🟢 Available' : '🔴 Out of Stock / Unavailable'}\n`;
            }
            if (matchedItem) {
                response += `\n📦 **Inventory Ingredient:** ${matchedItem.name}\n`;
                response += `• Category: ${matchedItem.category}\n`;
                response += `• Stock Quantity: ${matchedItem.stock} ${matchedItem.unit}\n`;
                response += `• Status: ${matchedItem.stock <= 0 ? '🔴 OUT OF STOCK' : matchedItem.stock <= 20 ? '🟡 LOW STOCK' : '🟢 OK'}\n`;
            }
            return response;
        }

        // Default Comprehensive Overview
        return `🤖 **Live Website Operations Summary (${data.settings.restaurantName || 'Kolay Restaurant'}):**\n\n` +
            `• 📦 **Stock Status:** ${data.inventory.length} total tracked items (${data.outOfStockItems.length} out of stock, ${data.lowStockItems.length} low stock).\n` +
            `• 🍽️ **Food & Menu:** ${data.availableDishes.length}/${data.dishes.length} dishes active & ready for orders.\n` +
            `• ⭐ **Active Offers:** ${data.specialtyDishes.length} featured specialty offerings with member discounts.\n` +
            `• 🍳 **Kitchen Queue:** ${data.orders.length} active orders currently in preparation.\n` +
            `• 📅 **Reservations:** ${data.bookings.length} customer bookings recorded.\n\n` +
            `Ask me anything specific like *"What is low in stock?"*, *"What offers are available?"*, or *"Is salmon in stock?"*`;
    };

    const handleSend = (textToSend) => {
        const text = textToSend || input;
        if (!text.trim()) return;

        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => [...prev, userMsg]);
        if (!textToSend) setInput('');
        setIsThinking(true);

        setTimeout(() => {
            const responseText = generateAiResponse(text);
            const aiMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                text: responseText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsThinking(false);
        }, 400);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-primary/70 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-slate-900 text-white w-full max-w-2xl h-[85vh] max-h-[700px] rounded-3xl shadow-2xl border border-amber-500/20 flex flex-col overflow-hidden relative">

                {/* Header */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-primary-dark to-slate-900 border-b border-white/10 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 animate-pulse">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-base sm:text-lg tracking-tight text-white">{t('ai_sim_title', 'AI Operations Simulator')}</h3>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                    {t('ai_sim_live', 'LIVE WEBSITE STATE')}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium">{t('ai_sim_subtitle', 'Ask any question about stock, menu items, offers & live activity')}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Quick Prompts bar */}
                <div className="px-4 py-2.5 bg-slate-950/60 border-b border-white/5 flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
                    {quickPrompts.map((qp, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSend(qp.label)}
                            className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-white/5 hover:bg-amber-500/20 hover:border-amber-500/40 border border-white/10 text-xs text-slate-300 hover:text-amber-300 font-medium transition-all flex items-center gap-1.5 shrink-0"
                        >
                            {qp.icon}
                            <span>{qp.label}</span>
                        </button>
                    ))}
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-sm font-sans bg-slate-900/90">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.sender === 'ai' && (
                                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                </div>
                            )}
                            <div className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 ${
                                msg.sender === 'user'
                                    ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none shadow-md shadow-amber-500/10'
                                    : 'bg-slate-800/90 border border-white/10 text-slate-100 rounded-tl-none shadow-lg'
                            }`}>
                                <div className="whitespace-pre-line leading-relaxed text-xs sm:text-sm">
                                    {msg.text}
                                </div>
                                <span className={`text-[10px] block mt-1.5 ${msg.sender === 'user' ? 'text-slate-800/70 text-right' : 'text-slate-400'}`}>
                                    {msg.time}
                                </span>
                            </div>
                        </div>
                    ))}

                    {isThinking && (
                        <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                            </div>
                            <div className="bg-slate-800/90 border border-white/10 text-slate-400 rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                                <span className="ml-1 text-amber-300/80 font-medium">{t('ai_sim_analyzing', 'Analyzing live website data...')}</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Controls Footer */}
                <div className="p-3 sm:p-4 bg-slate-950 border-t border-white/10 shrink-0">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                        className="flex items-center gap-2"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t('ai_sim_input_ph', 'Ask AI about stock, food, offers, orders...')}
                            className="flex-1 bg-slate-800/90 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isThinking}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shrink-0 shadow-lg shadow-amber-500/20 text-xs sm:text-sm"
                        >
                            <span>{t('ai_sim_send', 'Ask')}</span>
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default AiAssistantModal;
