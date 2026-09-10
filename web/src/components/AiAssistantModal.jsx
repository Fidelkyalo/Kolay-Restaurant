import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Sparkles, AlertTriangle, Utensils, Tag, ClipboardList, Gift, Cake, Search, UserCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Helper to gather strictly live website data
const getLiveWebsiteData = () => {
    // 1. Members State (pulls from kolay_members and registered users)
    const rawMembers = localStorage.getItem('kolay_members');
    const defaultMembers = [
        {
            id: 'MEM-1001',
            username: 'john_mwangi',
            fullName: 'John Mwangi',
            email: 'john.mwangi@gmail.com',
            phone: '+254 722 123 456',
            dateJoined: '2025-09-15',
            birthdayDate: '09-10', // Celebrates today!
            favoriteMeal: 'Gourmet Beef Burger',
            loyaltyLevel: 'VIP Platinum',
            totalSpent: 1250,
            totalOrders: 48,
            status: 'Active'
        },
        {
            id: 'MEM-1002',
            username: 'amina_ali',
            fullName: 'Amina Ali',
            email: 'amina.ali@yahoo.com',
            phone: '+254 733 987 654',
            dateJoined: '2026-01-20',
            birthdayDate: '09-12',
            favoriteMeal: 'Herb-Crusted Salmon',
            loyaltyLevel: 'Silver Member',
            totalSpent: 840,
            totalOrders: 22,
            status: 'Active'
        }
    ];

    let members = defaultMembers;
    if (rawMembers) {
        try {
            const parsed = JSON.parse(rawMembers);
            if (Array.isArray(parsed) && parsed.length > 0) {
                members = parsed;
            }
        } catch (e) {
            console.error('Error parsing kolay_members:', e);
        }
    }

    // 2. Today's Date MM-DD for Birthday Checking
    const now = new Date();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    const currentDay = String(now.getDate()).padStart(2, '0');
    const todayMMDD = `${currentMonth}-${currentDay}`;

    const todayBirthdays = members.filter(m => {
        if (!m.birthdayDate) return false;
        // Normalize birthday string format (YYYY-MM-DD or MM-DD)
        const parts = m.birthdayDate.split('-');
        if (parts.length === 3) {
            return `${parts[1]}-${parts[2]}` === todayMMDD;
        } else if (parts.length === 2) {
            return `${parts[0]}-${parts[1]}` === todayMMDD;
        }
        return false;
    });

    // 3. Inventory State
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
    let inventory = defaultInventory;
    if (rawInventory) {
        try {
            const parsed = JSON.parse(rawInventory);
            if (Array.isArray(parsed) && parsed.length > 0) inventory = parsed;
        } catch (e) {}
    }

    const outOfStockItems = inventory.filter(i => Number(i.stock) <= 0);
    const lowStockItems = inventory.filter(i => Number(i.stock) > 0 && Number(i.stock) <= 20);
    const okStockItems = inventory.filter(i => Number(i.stock) > 20);

    // 4. Menu & Dishes State
    const rawDishes = localStorage.getItem('kolay_dishes');
    const defaultDishes = [
        { id: 1, name: 'Truffle Mushroom Burger', price: 18.50, category: 'Main Course', available: true, isSpecialty: true },
        { id: 2, name: 'Grilled Atlantic Salmon', price: 24.00, category: 'Main Course', available: true, isSpecialty: true },
        { id: 3, name: 'Artisan Wood-fired Pizza', price: 16.00, category: 'Main Course', available: true, isSpecialty: false },
        { id: 4, name: 'Classic French Fries', price: 6.50, category: 'Sides', available: false, isSpecialty: false },
        { id: 5, name: 'Organic Garden Salad', price: 9.50, category: 'Starters', available: true, isSpecialty: false },
        { id: 6, name: 'Signature Chocolate Lava Cake', price: 11.00, category: 'Desserts', available: true, isSpecialty: true },
        { id: 7, name: 'Gourmet Beef Burger', price: 17.00, category: 'Main Course', available: true, isSpecialty: true },
        { id: 8, name: 'Signature Ribeye', price: 29.50, category: 'Main Course', available: true, isSpecialty: true },
        { id: 9, name: 'Pasta Carbonara', price: 15.00, category: 'Main Course', available: true, isSpecialty: false },
    ];
    let dishes = defaultDishes;
    if (rawDishes) {
        try {
            const parsed = JSON.parse(rawDishes);
            if (Array.isArray(parsed) && parsed.length > 0) dishes = parsed;
        } catch (e) {}
    }

    const availableDishes = dishes.filter(d => d.available !== false);
    const unavailableDishes = dishes.filter(d => d.available === false);
    const specialtyDishes = dishes.filter(d => d.isSpecialty || d.category === 'Specialties');

    // 5. Active Orders State
    const rawOrders = localStorage.getItem('kolay_kds_orders');
    let orders = [
        { id: 'ORD-101', table: 'Table 04', items: ['Truffle Mushroom Burger', 'French Fries'], status: 'Preparing' },
        { id: 'ORD-102', table: 'Table 08', items: ['Grilled Atlantic Salmon'], status: 'Pending' },
    ];
    if (rawOrders) {
        try {
            const parsed = JSON.parse(rawOrders);
            if (Array.isArray(parsed)) orders = parsed;
        } catch (e) {}
    }

    // 6. Bookings & Reservations State
    const rawBookings = localStorage.getItem('kolay_reservations');
    let bookings = [
        { id: 1, name: 'John Doe', partySize: 4, time: '19:30', status: 'Confirmed' },
        { id: 2, name: 'Sarah Smith', partySize: 2, time: '20:00', status: 'Pending' },
    ];
    if (rawBookings) {
        try {
            const parsed = JSON.parse(rawBookings);
            if (Array.isArray(parsed)) bookings = parsed;
        } catch (e) {}
    }

    // 7. Settings
    const rawSettings = localStorage.getItem('kolay_settings');
    let settings = { restaurantName: 'Kolay Restaurant', currency: '$' };
    if (rawSettings) {
        try { settings = JSON.parse(rawSettings); } catch (e) {}
    }

    return {
        members,
        todayBirthdays,
        todayMMDD,
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
        settings,
    };
};

const AiAssistantModal = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'ai',
            text: t('ai_welcome_msg', 'Hello! I am your AI Operations Simulator. I monitor live website data, inventory, menu availability, offers, active orders, and member birthdays. What would you like to know?'),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const liveData = getLiveWebsiteData();
    const todayBirthdays = liveData.todayBirthdays;

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
        { label: t('ai_qp_bday', '🎂 Birthday Notifications'), icon: <Cake className="w-3.5 h-3.5 text-pink-400" /> },
        { label: t('ai_qp_stock', 'What is out of stock?'), icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> },
        { label: t('ai_qp_food', 'What food is available?'), icon: <Utensils className="w-3.5 h-3.5 text-emerald-400" /> },
        { label: t('ai_qp_members', '👥 Members List'), icon: <UserCheck className="w-3.5 h-3.5 text-blue-400" /> },
        { label: t('ai_qp_offers', 'What offers & specialties exist?'), icon: <Tag className="w-3.5 h-3.5 text-cyan-400" /> },
        { label: t('ai_qp_orders', 'What active orders are in kitchen?'), icon: <ClipboardList className="w-3.5 h-3.5 text-indigo-400" /> },
    ];

    // High-precision, instant natural language response generator reading live website data
    const generateAiResponse = (userQuery) => {
        const query = userQuery.toLowerCase().trim();
        const data = getLiveWebsiteData();
        const currency = data.settings.currency || '$';

        // 1. Birthdays & Birthday Notifications
        if (query.includes('birthday') || query.includes('bday') || query.includes('birth') || query.includes('born') || query.includes('celebrat')) {
            if (data.todayBirthdays.length > 0) {
                let response = `🎉 **LIVE BIRTHDAY ALERT (Today's Celebrations):**\n\n`;
                response += `We have **${data.todayBirthdays.length} member(s)** celebrating a birthday today (${data.todayMMDD})!\n\n`;
                data.todayBirthdays.forEach(m => {
                    response += `🎂 **${m.fullName || m.username}** (${m.email})\n`;
                    response += `  ├ Phone: ${m.phone || 'N/A'}\n`;
                    response += `  ├ Loyalty Tier: ${m.loyaltyLevel || 'Member'}\n`;
                    response += `  └ Favorite Meal: ${m.favoriteMeal || 'Gourmet Beef Burger'}\n\n`;
                });
                response += `💡 **Recommended Action:** Send a 20% Birthday Discount voucher or offer a complimentary dessert when they visit today!`;
                return response;
            } else {
                let response = `🎂 **Member Birthdays Status (Live Website Data):**\n\n`;
                response += `No registered members have a birthday today (${data.todayMMDD}).\n\n`;
                response += `**Registered Members Overview (${data.members.length} Total):**\n`;
                data.members.slice(0, 5).forEach(m => {
                    response += `• **${m.fullName || m.username}** — Birthday: ${m.birthdayDate || 'Not set'} (${m.loyaltyLevel})\n`;
                });
                return response;
            }
        }

        // 2. Members & Customer Accounts Query
        if (query.includes('member') || query.includes('user') || query.includes('account') || query.includes('customer') || query.includes('who registered')) {
            let response = `👥 **Live Website Members Directory (${data.members.length} Registered):**\n\n`;
            data.members.forEach((m, idx) => {
                response += `${idx + 1}. 👤 **${m.fullName || m.username}** (@${m.username})\n`;
                response += `   ├ Email: ${m.email}\n`;
                response += `   ├ Phone: ${m.phone || 'N/A'}\n`;
                response += `   ├ Date Joined: ${m.dateJoined || 'Recently'}\n`;
                response += `   ├ Birthday: ${m.birthdayDate || 'N/A'}\n`;
                response += `   └ Loyalty: ${m.loyaltyLevel || 'Member'} (${currency}${m.totalSpent || 0} spent)\n\n`;
            });
            response += `All accounts created on the website are automatically monitored in real time!`;
            return response;
        }

        // 3. Out of Stock / Depleted Items Query
        if (query.includes('out of stock') || query.includes('missing') || query.includes('sold out') || query.includes('empty') || query.includes('depleted')) {
            const inventoryOut = data.outOfStockItems;
            const dishesOut = data.unavailableDishes;

            if (inventoryOut.length === 0 && dishesOut.length === 0) {
                return `✅ **Live Website Check:** Everything is currently in stock! No stock items or menu dishes are out of stock.`;
            }

            let response = `🚨 **Out of Stock Report (Strict Website Data):**\n\n`;
            if (inventoryOut.length > 0) {
                response += `**Depleted Inventory Items (${inventoryOut.length}):**\n`;
                inventoryOut.forEach(item => {
                    response += `• 🔴 **${item.name}** (${item.category}): 0 ${item.unit} remaining\n`;
                });
            }
            if (dishesOut.length > 0) {
                response += `\n**Menu Dishes Marked Unavailable (${dishesOut.length}):**\n`;
                dishesOut.forEach(dish => {
                    response += `• ❌ **${dish.name}** (${dish.category}) — ${currency}${dish.price}\n`;
                });
            }
            return response;
        }

        // 4. Low Stock Query
        if (query.includes('low stock') || query.includes('stock warning') || query.includes('running low')) {
            if (data.lowStockItems.length === 0) {
                return `✅ **Stock Status:** All stock items are well supplied above threshold levels.`;
            }
            let response = `⚠️ **Low Stock Alert (${data.lowStockItems.length} items below threshold):**\n\n`;
            data.lowStockItems.forEach(item => {
                response += `• 🟡 **${item.name}**: ${item.stock} ${item.unit} remaining (${item.category})\n`;
            });
            return response;
        }

        // 5. Stock & Inventory Query
        if (query.includes('stock') || query.includes('inventory') || query.includes('ingredient') || query.includes('supplies')) {
            let response = `📦 **Live Website Inventory State (${data.inventory.length} Tracked Items):**\n\n`;
            data.inventory.forEach(i => {
                const statusIcon = i.stock <= 0 ? '🔴' : i.stock <= 20 ? '🟡' : '🟢';
                response += `${statusIcon} **${i.name}**: ${i.stock} ${i.unit} (${i.category})\n`;
            });
            return response;
        }

        // 6. Food, Dishes & Menu Query
        if (query.includes('food') || query.includes('menu') || query.includes('dishes') || query.includes('what is there') || query.includes('available food') || query.includes('what food')) {
            let response = `🍽️ **Live Website Menu (${data.availableDishes.length} Available Dishes):**\n\n`;
            data.availableDishes.forEach(dish => {
                response += `• 🟢 **${dish.name}** — ${currency}${dish.price} [${dish.category}]${dish.isSpecialty ? ' ⭐ *Specialty*' : ''}\n`;
            });
            if (data.unavailableDishes.length > 0) {
                response += `\n🔴 **Unavailable:** ${data.unavailableDishes.map(d => d.name).join(', ')}`;
            }
            return response;
        }

        // 7. Offers & Specialties Query
        if (query.includes('offer') || query.includes('special') || query.includes('discount') || query.includes('deal') || query.includes('promo')) {
            let response = `🎁 **Active Website Offers & Specialties:**\n\n`;
            if (data.specialtyDishes.length > 0) {
                data.specialtyDishes.forEach(item => {
                    response += `⭐ **${item.name}** — ${currency}${item.price} (${item.category})\n  └ *Eligible for 10% Member Specialty Discount*\n`;
                });
            } else {
                response += `No dishes currently marked as specialty offer.`;
            }
            return response;
        }

        // 8. Orders & Kitchen Activity
        if (query.includes('order') || query.includes('kitchen') || query.includes('kds') || query.includes('sales') || query.includes('queue')) {
            let response = `🍳 **Live Kitchen & Order Status:**\n\n`;
            response += `• **Active Orders in Queue:** ${data.orders.length}\n`;
            data.orders.forEach(ord => {
                response += `  └ **${ord.id}** (${ord.table || 'Table'}) — Status: *${ord.status}* [${ord.items.join(', ')}]\n`;
            });
            response += `\n• **Upcoming Table Reservations:** ${data.bookings.length} reservations today.`;
            return response;
        }

        // 9. Specific Item Search (e.g. "burger", "salmon", "pizza", "fries", "john", "oil")
        const matchedDish = data.dishes.find(d => query.includes(d.name.toLowerCase()) || query.includes(d.category.toLowerCase()));
        const matchedItem = data.inventory.find(i => query.includes(i.name.toLowerCase()));
        const matchedMember = data.members.find(m => query.includes(m.username.toLowerCase()) || query.includes((m.fullName || '').toLowerCase()));

        if (matchedDish || matchedItem || matchedMember) {
            let response = `🔍 **Live Website Search Results:**\n\n`;
            if (matchedDish) {
                response += `🍽️ **Menu Dish:** ${matchedDish.name}\n`;
                response += `• Price: ${currency}${matchedDish.price}\n`;
                response += `• Category: ${matchedDish.category}\n`;
                response += `• Availability: ${matchedDish.available !== false ? '🟢 Available' : '🔴 Out of Stock / Unavailable'}\n`;
            }
            if (matchedItem) {
                response += `\n📦 **Inventory Stock Item:** ${matchedItem.name}\n`;
                response += `• Category: ${matchedItem.category}\n`;
                response += `• Quantity: ${matchedItem.stock} ${matchedItem.unit}\n`;
                response += `• Status: ${matchedItem.stock <= 0 ? '🔴 OUT OF STOCK' : matchedItem.stock <= 20 ? '🟡 LOW STOCK' : '🟢 OK'}\n`;
            }
            if (matchedMember) {
                response += `\n👤 **Registered Member:** ${matchedMember.fullName || matchedMember.username}\n`;
                response += `• Email: ${matchedMember.email}\n`;
                response += `• Phone: ${matchedMember.phone || 'N/A'}\n`;
                response += `• Birthday: ${matchedMember.birthdayDate || 'N/A'}\n`;
                response += `• Loyalty Tier: ${matchedMember.loyaltyLevel || 'Member'}\n`;
            }
            return response;
        }

        // Default Comprehensive Real-Time Overview
        return `🤖 **Live Website Operations Summary (${data.settings.restaurantName || 'Kolay Restaurant'}):**\n\n` +
            `• 👥 **Registered Members:** ${data.members.length} members (${data.todayBirthdays.length} birthdays today!)\n` +
            `• 📦 **Stock Status:** ${data.inventory.length} total items (${data.outOfStockItems.length} out of stock, ${data.lowStockItems.length} low stock).\n` +
            `• 🍽️ **Food & Menu:** ${data.availableDishes.length}/${data.dishes.length} dishes active & available.\n` +
            `• ⭐ **Offers & Specialties:** ${data.specialtyDishes.length} active menu offers.\n` +
            `• 🍳 **Kitchen Queue:** ${data.orders.length} active orders in KDS.\n\n` +
            `Ask me anything specific like *"Who has a birthday today?"*, *"What is out of stock?"*, *"Show members list"*, or *"Is salmon in stock?"*`;
    };

    // Instant submission handler without artificial delays
    const handleSend = (textToSend) => {
        const text = textToSend || input;
        if (!text.trim()) return;

        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const responseText = generateAiResponse(text);
        const aiMsg = {
            id: Date.now() + 1,
            sender: 'ai',
            text: responseText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        // Instant update for maximum responsiveness
        setMessages(prev => [...prev, userMsg, aiMsg]);
        if (!textToSend) setInput('');
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-primary/70 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-slate-900 text-white w-full max-w-2xl h-[85vh] max-h-[700px] rounded-3xl shadow-2xl border border-amber-500/20 flex flex-col overflow-hidden relative">

                {/* Header */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-primary-dark to-slate-900 border-b border-white/10 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-base sm:text-lg tracking-tight text-white">{t('ai_sim_title', 'AI Operations Simulator')}</h3>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                    {t('ai_sim_live', 'STRICT LIVE WEBSITE DATA')}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium">{t('ai_sim_subtitle', 'Monitors website stock, menu, offers, members & birthdays')}</p>
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

                {/* Live Birthday Notification Banner */}
                {todayBirthdays.length > 0 && (
                    <div className="bg-gradient-to-r from-pink-600/90 via-purple-600/90 to-pink-600/90 px-4 py-2.5 flex items-center justify-between border-b border-pink-400/30 text-white shrink-0">
                        <div className="flex items-center gap-2.5 text-xs font-bold">
                            <Cake className="w-4 h-4 text-amber-300 animate-bounce" />
                            <span>
                                🎉 <strong>Birthday Alert:</strong> {todayBirthdays.map(m => m.fullName || m.username).join(', ')} celebrating a birthday today!
                            </span>
                        </div>
                        <button
                            onClick={() => handleSend("Who has a birthday today?")}
                            className="text-[11px] font-extrabold bg-white text-pink-700 hover:bg-pink-100 px-3 py-1 rounded-full shadow-sm transition-all whitespace-nowrap"
                        >
                            View & Offer Discount
                        </button>
                    </div>
                )}

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
                            placeholder={t('ai_sim_input_ph', 'Ask AI about stock, food, offers, members, birthdays...')}
                            className="flex-1 bg-slate-800/90 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
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
