import React, { useState } from 'react';
import {
    Utensils, Star, Clock, MapPin, Phone, Camera, MessageCircle,
    Send, ArrowRight, Calendar, ChevronDown, Check, ChefHat,
    Award, Users, TrendingUp, Bike, ShoppingBag, Gift, Tag, Repeat, Mail
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import { Link } from 'react-router-dom';

const Home = () => {
    const [reservationSuccess, setReservationSuccess] = useState(false);
    const [activeMenuTab, setActiveMenuTab] = useState('Starters');

    const featuredMeals = [
        { id: 1, name: 'Gourmet Beef Burger', price: 1200, desc: 'Aged wagyu beef, truffle aioli, melted brie on brioche.', tag: 'Best Seller', image: '/assets/burger.png' },
        { id: 2, name: 'Herb-Crusted Salmon', price: 2100, desc: 'Fresh Atlantic salmon with sesame glaze & greens.', tag: 'Chef\'s Pick', image: '/assets/salmon.png' },
        { id: 3, name: 'Signature Ribeye', price: 3500, desc: 'Prime ribeye, garlic herb butter & truffle fries.', tag: 'Premium', image: '/assets/steak.png' },
    ];

    const stats = [
        { icon: Award, value: '15+', label: 'Years in Service' },
        { icon: ChefHat, value: '8', label: 'Master Chefs' },
        { icon: Users, value: '50K+', label: 'Happy Guests' },
        { icon: TrendingUp, value: '200+', label: 'Menu Items' },
    ];

    const menuCategories = {
        Starters: [
            { name: 'Bruschetta', price: 650, desc: 'Fresh tomatoes, garlic, hand-torn basil on grilled sourdough.', image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&q=80&w=600' },
            { name: 'Crispy Calamari', price: 850, desc: 'Golden fried with spicy marinara & aioli.', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=600' },
            { name: 'Caprese Salad', price: 780, desc: 'Buffalo mozzarella, heirloom tomatoes, basil oil.', image: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?auto=format&fit=crop&q=80&w=600' },
            { name: 'Soup of the Day', price: 550, desc: 'Ask your server for today\'s seasonal selection.', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=600' },
        ],
        Mains: [
            { name: 'Pasta Carbonara', price: 1100, desc: 'Classic Roman style with pancetta & parmesan.', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=600' },
            { name: 'Roasted Chicken', price: 1600, desc: 'Half chicken, lemon-thyme jus & seasonal veg.', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c7?auto=format&fit=crop&q=80&w=600' },
            { name: 'Lamb Chops', price: 2800, desc: 'Frenched lamb rack, mint chimichurri & polenta.', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600' },
            { name: 'Mushroom Risotto', price: 1350, desc: 'Wild mushroom, aged parmesan, truffle oil.', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=600' },
        ],
        Desserts: [
            { name: 'Chocolate Fondant', price: 700, desc: 'Warm dark chocolate lava cake with vanilla gelato.', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600' },
            { name: 'Crème Brûlée', price: 650, desc: 'Classic French custard with a caramelised sugar crust.', image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&q=80&w=600' },
            { name: 'Tiramisu', price: 680, desc: 'Espresso-soaked ladyfingers, mascarpone cream.', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=600' },
            { name: 'Seasonal Sorbet', price: 420, desc: 'Three scoops of vibrant house-made fruit sorbet.', image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&q=80&w=600' },
        ],
    };

    const chefs = [
        { name: 'Chef Amara Osei', role: 'Executive Chef', spec: 'French & Pan-African fusion', image: 'https://images.unsplash.com/photo-1583394293214-5df30a6a1da0?auto=format&fit=crop&q=80&w=400' },
        { name: 'Chef Lena Mwangi', role: 'Pastry Chef', spec: 'Artisan desserts & baked goods', image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=400' },
        { name: 'Chef Daniel Kiprop', role: 'Sous Chef', spec: 'Grills, meats & open-fire cooking', image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?auto=format&fit=crop&q=80&w=400' },
    ];

    const offers = [
        { icon: Tag, label: 'Happy Hour', badge: 'Daily 3–6pm', title: '20% Off All Drinks', desc: 'Craft cocktails, mocktails and wines at a special rate every day of the week.', color: '#E67E22' },
        { icon: Gift, label: 'Combo Deal', badge: 'Limited', title: 'Meal for Two — KES 3,500', desc: 'Two mains, two drinks and a shared dessert. Perfect for date night or a casual dinner.', color: '#D4A017' },
        { icon: Repeat, label: 'Loyalty', badge: 'Members Only', title: 'Earn Points on Every Visit', desc: 'Join Kolay Rewards and earn points that convert to free meals and exclusive perks.', color: '#4E2C1E' },
    ];

    const galleryPhotos = [
        { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=700', span: 'row-span-2' },
        { url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=700', span: '' },
        { url: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&q=80&w=700', span: '' },
        { url: 'https://images.unsplash.com/photo-1550966841-aee8cb1b54ed?auto=format&fit=crop&q=80&w=700', span: 'col-span-2' },
    ];

    return (
        <div className="min-h-screen bg-[#0D0A07] font-body selection:bg-[#E67E22] selection:text-white">
            <PublicNavbar />

            {/* ── HERO ────────────────────────────────── */}
            <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
                {/* Cinematic background */}
                <div className="absolute inset-0">
                    <img
                        src="/assets/hero.png"
                        alt="Kolay Restaurant"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0D0A07] via-[#0D0A07]/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0A07] via-transparent to-transparent" />
                </div>

                {/* Decorative orbs */}
                <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#E67E22]/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-[#D4A017]/8 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left — Text */}
                    <div className="space-y-8">
                        <span className="inline-flex items-center gap-2 bg-[#E67E22]/15 border border-[#E67E22]/30 text-[#E67E22] px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.35em]">
                            <span className="w-1.5 h-1.5 bg-[#E67E22] rounded-full animate-pulse" />
                            Fine Dining · Nairobi
                        </span>

                        <h1 className="font-display font-black text-white leading-tight tracking-tight">
                            <span className="block text-[clamp(2.5rem,6vw,5rem)] text-white">Kolay Restaurant</span>
                            <span className="block text-[clamp(1.5rem,3.5vw,2.8rem)] italic text-[#E67E22] mt-1">Where Every Meal Feels Right.</span>
                        </h1>

                        <p className="text-lg text-white/50 leading-relaxed max-w-md font-medium">
                            Experience the perfect union of tradition and contemporary culinary mastery, crafted by award-winning chefs in the heart of the city.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <Link
                                to="/order"
                                className="group flex items-center gap-3 bg-[#E67E22] hover:bg-[#D4A017] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-[0_0_40px_#E67E2240]"
                            >
                                Order Online
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a
                                href="#reservations"
                                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300"
                            >
                                <Calendar className="w-4 h-4" /> Book a Table
                            </a>
                        </div>

                        {/* Quick info pills */}
                        <div className="flex flex-wrap gap-3 pt-4">
                            {[
                                { icon: Clock, text: 'Opens 10am Daily' },
                                { icon: MapPin, text: 'Greenfield Plaza' },
                                { icon: Phone, text: '+254 102 039 121' },
                            ].map(({ icon: Icon, text }) => (
                                <span key={text} className="flex items-center gap-2 text-white/40 text-xs font-semibold">
                                    <Icon className="w-3.5 h-3.5 text-[#E67E22]" /> {text}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right — Featured dish card stack */}
                    <div className="hidden lg:block relative h-[540px]">
                        {/* Base image */}
                        <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-[0_40px_100px_#00000080]">
                            <img src="/assets/steak.png" alt="Signature Dish" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0A07]/80 via-transparent to-transparent" />
                        </div>

                        {/* Floating info card */}
                        <div className="absolute -bottom-6 -left-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 w-52 shadow-xl">
                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1 font-black">Tonight's Special</p>
                            <p className="text-white font-black text-sm leading-tight mb-2">Signature Ribeye</p>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-[#E67E22] text-[#E67E22]" />)}
                            </div>
                        </div>

                        {/* Price badge */}
                        <div className="absolute top-6 right-6 bg-[#E67E22] text-white px-4 py-2 rounded-xl font-black text-sm shadow-glow">
                            KES 3,500
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                    <span className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-black">Scroll</span>
                    <ChevronDown className="text-white/20 w-5 h-5" />
                </div>
            </section>

            {/* ── STATS BAR ───────────────────────────── */}
            <section className="bg-[#E67E22] py-8">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map(({ icon: Icon, value, label }) => (
                        <div key={label} className="flex items-center gap-4">
                            <div className="bg-white/15 p-3 rounded-xl">
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-white font-black text-2xl leading-tight">{value}</p>
                                <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FEATURED MEALS ──────────────────────── */}
            <section id="specials" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <p className="text-[#E67E22] text-xs font-black uppercase tracking-[0.4em] mb-3">Chef's Selection</p>
                        <h2 className="text-4xl md:text-5xl font-display font-black text-white leading-tight">
                            Signature<br />
                            <span className="italic text-white/40">Creations</span>
                        </h2>
                    </div>
                    <Link
                        to="/menu"
                        className="flex items-center gap-2 text-white/40 hover:text-[#E67E22] text-sm font-black uppercase tracking-widest transition-colors"
                    >
                        Full Menu <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featuredMeals.map((meal, i) => (
                        <div
                            key={meal.id}
                            className="group relative bg-white/3 hover:bg-white/6 border border-white/5 hover:border-[#E67E22]/30 rounded-[2rem] overflow-hidden transition-all duration-500 cursor-pointer"
                        >
                            {/* Image */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={meal.image}
                                    alt={meal.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0A07] via-transparent to-transparent" />
                                {/* Tag */}
                                <span className="absolute top-4 left-4 bg-[#E67E22] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                                    {meal.tag}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-7">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-white font-black text-xl group-hover:text-[#E67E22] transition-colors leading-tight">{meal.name}</h3>
                                    <span className="text-[#E67E22] font-black text-lg shrink-0 ml-4">KES {meal.price.toLocaleString()}</span>
                                </div>
                                <p className="text-white/40 text-sm leading-relaxed mb-5">{meal.desc}</p>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-[#D4A017] text-[#D4A017]" />)}
                                </div>
                            </div>

                            {/* Hover action */}
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#E67E22] to-[#D4A017] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        </div>
                    ))}
                </div>
            </section>

            {/* ── ABOUT SECTION ───────────────────────── */}
            <section id="about" className="py-32 relative overflow-hidden">
                {/* Background texture */}
                <div className="absolute inset-0 bg-[#1A1008]" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[#E67E22]/3" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    {/* Image collage */}
                    <div className="relative h-[560px]">
                        <div className="absolute top-0 left-0 w-[72%] h-[75%] rounded-[2.5rem] overflow-hidden border border-white/5">
                            <img
                                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800"
                                alt="Restaurant interior"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-[#E67E22]/20 to-transparent" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-[55%] h-[55%] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-[0_20px_60px_#00000080]">
                            <img
                                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=600"
                                alt="Chef at work"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Floating badge */}
                        <div className="absolute left-[60%] top-[42%] -translate-x-1/2 -translate-y-1/2 bg-[#E67E22] text-white rounded-2xl p-6 text-center shadow-[0_0_60px_#E67E2260] z-10">
                            <p className="font-black text-4xl leading-none">15+</p>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mt-1">Years</p>
                        </div>
                    </div>

                    {/* Text */}
                    <div className="space-y-8">
                        <div>
                            <p className="text-[#E67E22] text-xs font-black uppercase tracking-[0.4em] mb-4">Our Story</p>
                            <h2 className="text-4xl md:text-6xl font-display font-black text-white leading-[0.95] tracking-tight">
                                Crafted with<br />
                                <span className="italic text-white/30">Passion</span>,<br />
                                Served with Love.
                            </h2>
                        </div>

                        <p className="text-white/50 text-lg leading-relaxed">
                            Kolay was born from a vision — to make premium dining accessible, warm, and unforgettable. Every dish is a chapter in a story written by chefs who treat cooking as their art form.
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { title: 'Farm to Table', desc: 'Daily sourced organic ingredients.' },
                                { title: 'Global Flavours', desc: 'Curated world-class recipes.' },
                                { title: 'Award Winning', desc: 'Recognized excellence since 2010.' },
                                { title: 'Private Dining', desc: 'Exclusive events & celebrations.' },
                            ].map(({ title, desc }) => (
                                <div key={title} className="flex gap-3">
                                    <div className="mt-0.5 w-5 h-5 bg-[#E67E22] rounded-full flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-black text-sm mb-1">{title}</p>
                                        <p className="text-white/30 text-xs">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <a
                                href="#reservations"
                                className="group inline-flex items-center gap-3 text-white font-black text-sm uppercase tracking-widest hover:text-[#E67E22] transition-colors"
                            >
                                Reserve Your Experience
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* ── CHEF / TEAM INTRO ─── */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-32">
                    <div className="border-t border-white/8 pt-20">
                        <div className="text-center mb-14">
                            <p className="text-[#E67E22] text-xs font-black uppercase tracking-[0.4em] mb-3">Meet the Team</p>
                            <h3 className="text-3xl md:text-4xl font-display font-black text-white">The Hands Behind<br /><span className="italic text-white/30">Every Dish</span></h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {chefs.map(chef => (
                                <div key={chef.name} className="group text-center">
                                    <div className="relative w-40 h-40 mx-auto mb-5 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#E67E22]/60 transition-colors">
                                        <img src={chef.image} alt={chef.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0A07]/50 to-transparent" />
                                    </div>
                                    <h4 className="text-white font-black text-lg mb-0.5">{chef.name}</h4>
                                    <p className="text-[#E67E22] text-xs font-black uppercase tracking-widest mb-2">{chef.role}</p>
                                    <p className="text-white/30 text-sm">{chef.spec}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── MENU SECTION ────────────────────────── */}
            <section id="menu" className="py-32 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <p className="text-[#E67E22] text-xs font-black uppercase tracking-[0.4em] mb-4">Explore</p>
                        <h2 className="text-4xl md:text-5xl font-display font-black text-white">Our Menu</h2>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 justify-center mb-12 bg-white/3 border border-white/5 rounded-2xl p-1.5 w-fit mx-auto">
                        {Object.keys(menuCategories).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveMenuTab(tab)}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeMenuTab === tab
                                    ? 'bg-[#E67E22] text-white shadow-[0_0_20px_#E67E2240]'
                                    : 'text-white/40 hover:text-white'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Items — Photo Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {menuCategories[activeMenuTab].map(item => (
                            <div
                                key={item.name}
                                className="group relative bg-white/3 border border-white/5 hover:border-[#E67E22]/40 rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer hover:-translate-y-1"
                            >
                                {/* Dish image */}
                                <div className="relative h-44 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0A07] via-[#0D0A07]/20 to-transparent" />
                                    {/* Price badge */}
                                    <span className="absolute top-3 right-3 bg-[#E67E22] text-white text-[10px] font-black px-2.5 py-1 rounded-lg">
                                        KES {item.price.toLocaleString()}
                                    </span>
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <h4 className="text-white font-black text-sm group-hover:text-[#E67E22] transition-colors mb-1.5 leading-tight">{item.name}</h4>
                                    <p className="text-white/30 text-xs leading-relaxed line-clamp-2">{item.desc}</p>
                                </div>

                                {/* Bottom accent */}
                                <div className="h-0.5 bg-gradient-to-r from-[#E67E22] to-[#D4A017] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            to="/order"
                            className="inline-flex items-center gap-3 bg-[#E67E22] hover:bg-[#D4A017] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-[0_0_40px_#E67E2240]"
                        >
                            View Full Menu <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── ORDER ONLINE ────────────────────────── */}
            <section id="order" className="py-32 px-6 md:px-12 bg-[#1A1008]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-[#E67E22] text-xs font-black uppercase tracking-[0.4em] mb-4">Order Online</p>
                        <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-4">Delivered to Your<br /><span className="italic text-white/30">Door</span></h2>
                        <p className="text-white/40 max-w-md mx-auto text-base">Enjoy Kolay's premium meals at home. Choose delivery or come pick up your order.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        {/* Delivery */}
                        <div className="group relative bg-white/3 hover:bg-white/6 border border-white/5 hover:border-[#E67E22]/40 rounded-3xl p-10 text-center transition-all duration-300 cursor-pointer">
                            <div className="w-16 h-16 bg-[#E67E22]/10 border border-[#E67E22]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#E67E22] transition-colors">
                                <Bike className="w-7 h-7 text-[#E67E22] group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-white font-black text-xl mb-3">Home Delivery</h3>
                            <p className="text-white/40 text-sm leading-relaxed mb-6">Hot, fresh and at your doorstep within 45 minutes. Available within Nairobi.</p>
                            <Link to="/order" className="inline-flex items-center gap-2 bg-[#E67E22] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#D4A017] transition-all">
                                Order Delivery <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Takeaway */}
                        <div className="group relative bg-white/3 hover:bg-white/6 border border-white/5 hover:border-[#D4A017]/40 rounded-3xl p-10 text-center transition-all duration-300 cursor-pointer">
                            <div className="w-16 h-16 bg-[#D4A017]/10 border border-[#D4A017]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#D4A017] transition-colors">
                                <ShoppingBag className="w-7 h-7 text-[#D4A017] group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-white font-black text-xl mb-3">Takeaway</h3>
                            <p className="text-white/40 text-sm leading-relaxed mb-6">Pre-order and collect your food ready and waiting — zero wait time.</p>
                            <Link to="/order" className="inline-flex items-center gap-2 bg-[#D4A017] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#E67E22] transition-all">
                                Order Takeaway <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── OFFERS / PROMOTIONS ─────────────────── */}
            <section id="offers" className="py-32 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-[#E67E22] text-xs font-black uppercase tracking-[0.4em] mb-4">Offers &amp; Promotions</p>
                        <h2 className="text-4xl md:text-5xl font-display font-black text-white">Deals Worth<br /><span className="italic text-white/30">Savoring</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {offers.map(offer => (
                            <div key={offer.title} className="group relative bg-white/3 border border-white/5 hover:border-[#E67E22]/30 rounded-3xl p-8 transition-all duration-300 overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[60px] pointer-events-none" style={{ background: offer.color + '18' }} />
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: offer.color + '20', border: `1px solid ${offer.color}40` }}>
                                            <offer.icon className="w-5 h-5" style={{ color: offer.color }} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: offer.color, borderColor: offer.color + '40', background: offer.color + '15' }}>{offer.badge}</span>
                                    </div>
                                    <h3 className="text-white font-black text-xl mb-3 group-hover:text-[#E67E22] transition-colors">{offer.title}</h3>
                                    <p className="text-white/40 text-sm leading-relaxed">{offer.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── GALLERY ────────────────────────────── */}
            <section id="gallery" className="py-20 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <p className="text-[#E67E22] text-xs font-black uppercase tracking-[0.4em] mb-3">Gallery</p>
                            <h2 className="text-4xl font-display font-black text-white">Ambience &amp; Craft</h2>
                        </div>
                        <span className="text-white/20 text-xs font-black uppercase tracking-widest hidden md:block">Our World</span>
                    </div>

                    {/* Masonry grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[220px]">
                        {galleryPhotos.map((photo, i) => (
                            <div
                                key={i}
                                className={`group relative overflow-hidden rounded-2xl border border-white/5 ${photo.span}`}
                            >
                                <img
                                    src={photo.url}
                                    alt={`Gallery ${i + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-[#0D0A07]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── RESERVATIONS ────────────────────────── */}
            <section id="reservations" className="py-32 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="relative bg-gradient-to-br from-[#1A1008] to-[#0D0A07] border border-white/5 rounded-[3rem] overflow-hidden p-12 md:p-20">
                        {/* Decorative */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E67E22]/10 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4A017]/8 rounded-full blur-[80px] pointer-events-none" />

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                            {/* Left info */}
                            <div className="space-y-8">
                                <div>
                                    <p className="text-[#E67E22] text-xs font-black uppercase tracking-[0.4em] mb-4">Reservations</p>
                                    <h2 className="text-4xl md:text-5xl font-display font-black text-white leading-tight">
                                        Reserve Your<br />
                                        <span className="italic text-white/30">Perfect Evening</span>
                                    </h2>
                                </div>
                                <p className="text-white/40 text-base leading-relaxed">
                                    Book a table and let us take care of everything else. Private dining rooms available for special occasions.
                                </p>

                                <div className="space-y-4">
                                    {[
                                        { icon: Phone, label: 'Call Us', value: '+254 700 000 000' },
                                        { icon: MapPin, label: 'Location', value: 'Greenfield Plaza, Nairobi' },
                                        { icon: Clock, label: 'Hours', value: 'Mon–Sat • 10am – 10pm' },
                                    ].map(({ icon: Icon, label, value }) => (
                                        <div key={label} className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-[#E67E22]/10 border border-[#E67E22]/20 rounded-xl flex items-center justify-center shrink-0">
                                                <Icon className="w-4 h-4 text-[#E67E22]" />
                                            </div>
                                            <div>
                                                <p className="text-white/25 text-[10px] uppercase tracking-widest font-black">{label}</p>
                                                <p className="text-white font-semibold text-sm">{value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right — Form */}
                            <div className="bg-white/3 border border-white/8 rounded-3xl p-8">
                                {reservationSuccess ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-[#E67E22] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_#E67E2260]">
                                            <Check className="w-8 h-8 text-white" />
                                        </div>
                                        <h4 className="text-2xl font-black text-white mb-3">Request Sent!</h4>
                                        <p className="text-white/40 text-sm mb-8 leading-relaxed">Our team will call you within 15 minutes to confirm your table.</p>
                                        <button
                                            onClick={() => setReservationSuccess(false)}
                                            className="text-[#E67E22] font-black text-xs uppercase tracking-widest hover:underline"
                                        >
                                            Make Another Booking
                                        </button>
                                    </div>
                                ) : (
                                    <form
                                        className="space-y-4"
                                        onSubmit={e => { e.preventDefault(); setReservationSuccess(true); }}
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                required
                                                placeholder="Your Name"
                                                className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 p-4 rounded-xl outline-none focus:border-[#E67E22]/50 focus:ring-0 text-sm font-semibold transition-colors"
                                            />
                                            <input
                                                required
                                                type="tel"
                                                placeholder="Phone"
                                                className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 p-4 rounded-xl outline-none focus:border-[#E67E22]/50 text-sm font-semibold transition-colors"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                required
                                                type="date"
                                                className="w-full bg-white/5 border border-white/8 text-white/60 p-4 rounded-xl outline-none focus:border-[#E67E22]/50 text-sm font-semibold transition-colors"
                                            />
                                            <select className="w-full bg-white/5 border border-white/8 text-white/60 p-4 rounded-xl outline-none focus:border-[#E67E22]/50 text-sm font-semibold transition-colors">
                                                <option>2 Guests</option>
                                                <option>4 Guests</option>
                                                <option>6+ Guests</option>
                                            </select>
                                        </div>
                                        <textarea
                                            placeholder="Special Requests (optional)"
                                            className="w-full h-24 bg-white/5 border border-white/8 text-white placeholder-white/20 p-4 rounded-xl outline-none focus:border-[#E67E22]/50 text-sm font-semibold resize-none transition-colors"
                                        />
                                        <button
                                            type="submit"
                                            className="w-full bg-[#E67E22] hover:bg-[#D4A017] text-white font-black py-4 rounded-xl text-sm uppercase tracking-widest transition-all active:scale-95 shadow-[0_0_30px_#E67E2230]"
                                        >
                                            Check Availability
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CONTACT ─────────────────────────────── */}
            <section id="contact" className="py-32 px-6 md:px-12 bg-[#1A1008]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-[#E67E22] text-xs font-black uppercase tracking-[0.4em] mb-4">Contact Us</p>
                        <h2 className="text-4xl md:text-5xl font-display font-black text-white">Get in <span className="italic text-white/30">Touch</span></h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left — Map + Info */}
                        <div className="space-y-6">
                            {/* Embedded map */}
                            <div className="rounded-3xl overflow-hidden border border-white/8 h-72">
                                <iframe
                                    title="Kolay Restaurant Location"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.819068887843!2d36.8219462!3d-1.2923532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d22f39d883%3A0x9cc92c4c3ecc3bb4!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2ske!4v1680000000000"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                                    allowFullScreen
                                    loading="lazy"
                                />
                            </div>

                            {/* Info blocks */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { icon: MapPin, label: 'Address', value: 'Greenfield Plaza, Westlands, Nairobi' },
                                    { icon: Phone, label: 'Phone', value: '+254 700 000 000' },
                                    { icon: Clock, label: 'Hours', value: 'Mon–Sat 10am–10pm' },
                                ].map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="bg-white/3 border border-white/5 rounded-2xl p-5">
                                        <div className="w-8 h-8 bg-[#E67E22]/10 border border-[#E67E22]/20 rounded-lg flex items-center justify-center mb-3">
                                            <Icon className="w-4 h-4 text-[#E67E22]" />
                                        </div>
                                        <p className="text-white/25 text-[10px] uppercase tracking-widest font-black mb-1">{label}</p>
                                        <p className="text-white text-sm font-semibold leading-tight">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — Contact Form */}
                        <div className="bg-white/3 border border-white/8 rounded-3xl p-8">
                            <h3 className="text-white font-black text-xl mb-6">Send us a Message</h3>
                            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                                <div className="grid grid-cols-2 gap-4">
                                    <input required placeholder="Your Name" className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 p-4 rounded-xl outline-none focus:border-[#E67E22]/50 text-sm font-semibold transition-colors" />
                                    <input required type="email" placeholder="Email Address" className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 p-4 rounded-xl outline-none focus:border-[#E67E22]/50 text-sm font-semibold transition-colors" />
                                </div>
                                <input placeholder="Subject" className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 p-4 rounded-xl outline-none focus:border-[#E67E22]/50 text-sm font-semibold transition-colors" />
                                <textarea placeholder="Your message..." className="w-full h-36 bg-white/5 border border-white/8 text-white placeholder-white/20 p-4 rounded-xl outline-none focus:border-[#E67E22]/50 text-sm font-semibold resize-none transition-colors" />
                                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#E67E22] hover:bg-[#D4A017] text-white font-black py-4 rounded-xl text-sm uppercase tracking-widest transition-all active:scale-95 shadow-[0_0_30px_#E67E2230]">
                                    <Mail className="w-4 h-4" /> Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ──────────────────────────────── */}
            <footer id="contact" className="border-t border-white/5 bg-[#0A0704] px-6 md:px-12 pt-20 pb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        {/* Brand */}
                        <div className="space-y-5 lg:col-span-1">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-[#E67E22] rounded-lg flex items-center justify-center">
                                    <Utensils className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xl font-display font-black text-white uppercase tracking-tight italic">Kolay Restaurant</span>
                            </div>
                            <p className="text-white/30 text-sm leading-relaxed">
                                Artisan culinary experiences crafted for those who appreciate the finer things in life.
                            </p>
                            <div className="flex gap-3">
                                {[Camera, MessageCircle, Send].map((Icon, i) => (
                                    <button key={i} className="w-9 h-9 bg-white/5 hover:bg-[#E67E22] border border-white/8 hover:border-[#E67E22] rounded-xl flex items-center justify-center transition-all group">
                                        <Icon className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-5">
                            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em]">Navigate</h4>
                            <ul className="space-y-3">
                                {['Home', 'About', 'Menu', 'Order', 'Offers', 'Gallery', 'Reservations', 'Contact'].map(l => (
                                    <li key={l}>
                                        <a href={`#${l.toLowerCase()}`} className="text-white/30 hover:text-[#E67E22] text-sm transition-colors font-medium">{l}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Hours */}
                        <div className="space-y-5">
                            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em]">Hours</h4>
                            <ul className="space-y-3 text-sm">
                                {[
                                    { days: 'Mon – Thu', time: '10am – 10pm' },
                                    { days: 'Fri – Sat', time: '10am – 12am' },
                                    { days: 'Sunday', time: 'Closed' },
                                ].map(({ days, time }) => (
                                    <li key={days} className="flex justify-between gap-4">
                                        <span className="text-white/30">{days}</span>
                                        <span className="text-white font-bold">{time}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="space-y-5">
                            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em]">Newsletter</h4>
                            <p className="text-white/30 text-sm">Get exclusive offers and event invites.</p>
                            <div className="flex gap-2">
                                <input
                                    placeholder="Email address"
                                    className="flex-1 bg-white/5 border border-white/8 text-white/60 placeholder-white/20 px-4 py-2.5 rounded-xl outline-none focus:border-[#E67E22]/50 text-sm transition-colors"
                                />
                                <button className="bg-[#E67E22] hover:bg-[#D4A017] text-white px-4 py-2.5 rounded-xl font-black text-xs transition-all shrink-0">
                                    Join
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-white/20 font-black uppercase tracking-widest">
                        <p>© 2026 Kolay Restaurant. All rights reserved.</p>
                        <div className="flex gap-8">
                            <span className="cursor-pointer hover:text-white/50 transition-colors">Privacy Policy</span>
                            <span className="cursor-pointer hover:text-white/50 transition-colors">Terms of Use</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
