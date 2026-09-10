import React, { useState, useEffect } from 'react';
import {
    Users, UserPlus, UserCheck, TrendingUp, Crown, Flame, Moon,
    DollarSign, ShoppingBag, Star, Cake, Brain, AlertTriangle,
    Search, Filter, Eye, Edit3, Trash2, Mail, Phone, Calendar,
    Clock, Shield, Award, Sparkles, CheckCircle2, ChevronRight,
    ArrowUpRight, RefreshCw, Send, Zap, ThumbsUp, ThumbsDown,
    Heart, Gift, PieChart as PieIcon, BarChart2, MessageSquare,
    Activity, Coffee, ArrowRight, X, ChevronDown, Check, Download, Plus
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

// ── Persistence Key ─────────────────────────────────────────────────────────
const LS_MEMBERS_KEY = 'kolay_members';

// ── Seed Demo Members Data ──────────────────────────────────────────────────
const SEED_MEMBERS = [
    {
        id: 'MEM-1001',
        username: 'john_mwangi',
        fullName: 'John Mwangi',
        email: 'john.mwangi@gmail.com',
        phone: '+254 722 123 456',
        dateJoined: '2025-09-15',
        firstOrderDate: '2025-09-15',
        latestOrderDate: '2026-09-08',
        lastLogin: '2026-09-10 14:22',
        totalOrders: 48,
        totalSpent: 1250, // $ or KES scaled
        avgOrderValue: 26.04,
        favoriteMeal: 'Gourmet Beef Burger',
        favoriteDrink: 'House Red Wine',
        loyaltyLevel: 'VIP Platinum',
        rewardPoints: 2450,
        preferredMethod: 'Dine-In',
        segment: 'VIP Customers',
        secondarySegments: ['High-Spending Customers', 'Regular Customers'],
        status: 'Active',
        churnRisk: 'Low (4%)',
        churnRiskLevel: 'low',
        birthdayThisWeek: true,
        birthdayDate: '09-12',
        avatarColor: 'bg-amber-500',
        ordersHistory: [
            { id: 'ORD-9901', date: '2026-09-08', items: 'Gourmet Beef Burger x2, Truffle Fries, House Red Wine', amount: 42.50, type: 'Dine-In' },
            { id: 'ORD-9812', date: '2026-09-01', items: 'Signature Ribeye, Garlic Bread', amount: 38.00, type: 'Dine-In' },
            { id: 'ORD-9750', date: '2026-08-22', items: 'Herb-Crusted Salmon, Fresh Orange Juice', amount: 28.50, type: 'Dine-In' }
        ],
        timeline: [
            { title: 'Dined at Restaurant', date: '2026-09-08 19:30', desc: 'Ordered Gourmet Beef Burger & Wine. Paid via Card.' },
            { title: 'Earned 150 Loyalty Points', date: '2026-09-08 19:30', desc: 'VIP multiplier applied (+25% bonus points).' },
            { title: 'Upgraded to VIP Platinum', date: '2026-06-10 11:00', desc: 'Crossed $1,000 lifetime spend threshold.' },
            { title: 'First Order Placed', date: '2025-09-15 13:10', desc: 'Welcome 10% specialty discount redeemed.' },
            { title: 'Account Registered', date: '2025-09-15 12:45', desc: 'Signed up via Kolay Web App.' }
        ]
    },
    {
        id: 'MEM-1002',
        username: 'sarah_wanjiku',
        fullName: 'Sarah Wanjiku',
        email: 'sarah.wanjiku@yahoo.com',
        phone: '+254 733 987 654',
        dateJoined: '2026-01-10',
        firstOrderDate: '2026-01-11',
        latestOrderDate: '2026-09-09',
        lastLogin: '2026-09-09 20:05',
        totalOrders: 36,
        totalSpent: 890,
        avgOrderValue: 24.72,
        favoriteMeal: 'Herb-Crusted Salmon',
        favoriteDrink: 'Fresh Orange Juice',
        loyaltyLevel: 'Gold Member',
        rewardPoints: 1680,
        preferredMethod: 'Delivery',
        segment: 'Regular Customers',
        secondarySegments: ['Delivery-Only Customers', 'High-Spending Customers'],
        status: 'Active',
        churnRisk: 'Low (8%)',
        churnRiskLevel: 'low',
        birthdayThisWeek: false,
        birthdayDate: '11-20',
        avatarColor: 'bg-emerald-500',
        ordersHistory: [
            { id: 'ORD-9915', date: '2026-09-09', items: 'Herb-Crusted Salmon, Caprese Salad', amount: 31.00, type: 'Delivery' },
            { id: 'ORD-9840', date: '2026-09-02', items: 'Gourmet Beef Burger, Iced Latte', amount: 21.50, type: 'Delivery' }
        ],
        timeline: [
            { title: 'Home Delivery Order', date: '2026-09-09 20:00', desc: 'Delivered to Westlands, Nairobi.' },
            { title: 'Redeemed $10 Voucher', date: '2026-08-15 18:00', desc: 'Used 500 reward points.' },
            { title: 'Account Registered', date: '2026-01-10 09:15', desc: 'Registered on web portal.' }
        ]
    },
    {
        id: 'MEM-1003',
        username: 'david_omondi',
        fullName: 'David Omondi',
        email: 'david.omondi@techkenya.io',
        phone: '+254 712 555 123',
        dateJoined: '2025-11-04',
        firstOrderDate: '2025-11-04',
        latestOrderDate: '2026-07-12',
        lastLogin: '2026-07-20 10:11',
        totalOrders: 19,
        totalSpent: 430,
        avgOrderValue: 22.63,
        favoriteMeal: 'Signature Ribeye',
        favoriteDrink: 'Craft Beer',
        loyaltyLevel: 'Silver Member',
        rewardPoints: 410,
        preferredMethod: 'Dine-In',
        segment: 'Inactive Customers',
        secondarySegments: ['Weekend Customers'],
        status: 'Inactive (60+ days)',
        churnRisk: 'High (88%)',
        churnRiskLevel: 'high',
        birthdayThisWeek: false,
        birthdayDate: '04-05',
        avatarColor: 'bg-rose-500',
        ordersHistory: [
            { id: 'ORD-8920', date: '2026-07-12', items: 'Signature Ribeye, Chocolate Fondant', amount: 45.00, type: 'Dine-In' }
        ],
        timeline: [
            { title: 'No Activity Warning', date: '2026-08-20 00:00', desc: 'System flagged account as becoming inactive (30+ days no orders).' },
            { title: 'Last Order Placed', date: '2026-07-12 21:15', desc: 'Signature Ribeye dinner with colleagues.' }
        ]
    },
    {
        id: 'MEM-1004',
        username: 'grace_mutua',
        fullName: 'Grace Mutua',
        email: 'grace.m@designstudio.co.ke',
        phone: '+254 720 444 888',
        dateJoined: '2026-09-10', // Today
        firstOrderDate: '2026-09-10',
        latestOrderDate: '2026-09-10',
        lastLogin: '2026-09-10 18:30',
        totalOrders: 1,
        totalSpent: 28,
        avgOrderValue: 28.00,
        favoriteMeal: 'Pasta Carbonara',
        favoriteDrink: 'Fresh Orange Juice',
        loyaltyLevel: 'Bronze Member',
        rewardPoints: 100,
        preferredMethod: 'Takeaway',
        segment: 'New Customers',
        secondarySegments: ['Budget Customers'],
        status: 'Active',
        churnRisk: 'Low (2%)',
        churnRiskLevel: 'low',
        birthdayThisWeek: true,
        birthdayDate: '09-11',
        avatarColor: 'bg-indigo-500',
        ordersHistory: [
            { id: 'ORD-9990', date: '2026-09-10', items: 'Pasta Carbonara, Fresh Orange Juice', amount: 28.00, type: 'Takeaway' }
        ],
        timeline: [
            { title: 'First Takeaway Order', date: '2026-09-10 18:30', desc: 'Picked up at main counter.' },
            { title: 'Account Registered Today', date: '2026-09-10 18:15', desc: 'Joined via mobile web.' }
        ]
    },
    {
        id: 'MEM-1005',
        username: 'brian_kipkorir',
        fullName: 'Brian Kipkorir',
        email: 'brian.k@financecorp.co.ke',
        phone: '+254 701 999 333',
        dateJoined: '2025-08-20',
        firstOrderDate: '2025-08-21',
        latestOrderDate: '2026-09-07',
        lastLogin: '2026-09-08 09:12',
        totalOrders: 54,
        totalSpent: 1420,
        avgOrderValue: 26.29,
        favoriteMeal: 'Gourmet Beef Burger',
        favoriteDrink: 'House Red Wine',
        loyaltyLevel: 'VIP Platinum',
        rewardPoints: 3100,
        preferredMethod: 'Dine-In',
        segment: 'VIP Customers',
        secondarySegments: ['High-Spending Customers', 'Weekend Customers'],
        status: 'Active',
        churnRisk: 'Low (3%)',
        churnRiskLevel: 'low',
        birthdayThisWeek: false,
        birthdayDate: '02-14',
        avatarColor: 'bg-purple-600',
        ordersHistory: [
            { id: 'ORD-9890', date: '2026-09-07', items: 'Gourmet Beef Burger, Truffle Fries, Wine', amount: 48.00, type: 'Dine-In' }
        ],
        timeline: [
            { title: 'Weekly Dinner', date: '2026-09-07 20:00', desc: 'Table reserved for party of 2.' }
        ]
    },
    {
        id: 'MEM-1006',
        username: 'amina_hassan',
        fullName: 'Amina Hassan',
        email: 'amina.hassan@outlook.com',
        phone: '+254 799 111 222',
        dateJoined: '2026-03-15',
        firstOrderDate: '2026-03-15',
        latestOrderDate: '2026-08-01',
        lastLogin: '2026-08-05 16:40',
        totalOrders: 12,
        totalSpent: 260,
        avgOrderValue: 21.66,
        favoriteMeal: 'Margherita Pizza',
        favoriteDrink: 'Iced Latte',
        loyaltyLevel: 'Silver Member',
        rewardPoints: 290,
        preferredMethod: 'Delivery',
        segment: 'Inactive Customers',
        secondarySegments: ['Delivery-Only Customers'],
        status: 'Inactive (35+ days)',
        churnRisk: 'Medium (64%)',
        churnRiskLevel: 'medium',
        birthdayThisWeek: false,
        birthdayDate: '12-01',
        avatarColor: 'bg-amber-600',
        ordersHistory: [
            { id: 'ORD-9102', date: '2026-08-01', items: 'Margherita Pizza x2', amount: 24.00, type: 'Delivery' }
        ],
        timeline: [
            { title: 'Delivery Order', date: '2026-08-01 13:10', desc: 'Delivered to Kilimani.' }
        ]
    },
    {
        id: 'MEM-1007',
        username: 'kevin_otieno',
        fullName: 'Kevin Otieno',
        email: 'kevin.otieno@startup.co',
        phone: '+254 788 777 666',
        dateJoined: '2026-05-01',
        firstOrderDate: '2026-05-02',
        latestOrderDate: '2026-09-10',
        lastLogin: '2026-09-10 12:05',
        totalOrders: 28,
        totalSpent: 620,
        avgOrderValue: 22.14,
        favoriteMeal: 'Crispy Calamari',
        favoriteDrink: 'Fresh Orange Juice',
        loyaltyLevel: 'Gold Member',
        rewardPoints: 1120,
        preferredMethod: 'Takeaway',
        segment: 'Regular Customers',
        secondarySegments: ['Weekend Customers'],
        status: 'Active',
        churnRisk: 'Low (6%)',
        churnRiskLevel: 'low',
        birthdayThisWeek: false,
        birthdayDate: '06-18',
        avatarColor: 'bg-blue-600',
        ordersHistory: [
            { id: 'ORD-9988', date: '2026-09-10', items: 'Crispy Calamari, Iced Latte', amount: 18.00, type: 'Takeaway' }
        ],
        timeline: [
            { title: 'Lunch Takeaway Order', date: '2026-09-10 12:05', desc: 'Picked up during lunch break.' }
        ]
    },
    {
        id: 'MEM-1008',
        username: 'rose_njeri',
        fullName: 'Rose Njeri',
        email: 'rose.njeri@health.org',
        phone: '+254 721 000 333',
        dateJoined: '2026-02-14',
        firstOrderDate: '2026-02-14',
        latestOrderDate: '2026-09-06',
        lastLogin: '2026-09-06 19:45',
        totalOrders: 22,
        totalSpent: 510,
        avgOrderValue: 23.18,
        favoriteMeal: 'Caprese Salad',
        favoriteDrink: 'Green Tea',
        loyaltyLevel: 'Silver Member',
        rewardPoints: 850,
        preferredMethod: 'Dine-In',
        segment: 'Regular Customers',
        secondarySegments: ['Dine-In Customers'],
        status: 'Active',
        churnRisk: 'Low (9%)',
        churnRiskLevel: 'low',
        birthdayThisWeek: true,
        birthdayDate: '09-14',
        avatarColor: 'bg-pink-500',
        ordersHistory: [
            { id: 'ORD-9877', date: '2026-09-06', items: 'Caprese Salad, Salmon', amount: 34.00, type: 'Dine-In' }
        ],
        timeline: [
            { title: 'Sunday Dinner', date: '2026-09-06 19:45', desc: 'Dined at window section.' }
        ]
    }
];

const loadMembers = () => {
    try {
        const saved = localStorage.getItem(LS_MEMBERS_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        console.error('Failed loading members:', e);
    }
    localStorage.setItem(LS_MEMBERS_KEY, JSON.stringify(SEED_MEMBERS));
    return SEED_MEMBERS;
};

export default function Members() {
    const { t } = useLanguage();
    const [members, setMembers] = useState(loadMembers);
    const [activeTab, setActiveTab] = useState('directory'); 
    // Tabs: 'directory' | 'growth' | 'activity' | 'spending' | 'favorites' | 'segmentation' | 'retention' | 'marketing' | 'loyalty' | 'behavior' | 'feedback' | 'ai_recommendations'

    const [searchQuery, setSearchQuery] = useState('');
    const [segmentFilter, setSegmentFilter] = useState('All');
    const [selectedMember, setSelectedMember] = useState(null); // Timeline Drawer/Modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Save to localStorage when state updates
    const updateMembersState = (newList) => {
        setMembers(newList);
        localStorage.setItem(LS_MEMBERS_KEY, JSON.stringify(newList));
    };

    const showNotification = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3500);
    };

    // ── Computed AI Metrics & Dashboard Widget Numbers ──────────────────────
    const totalMembers = members.length;
    const newMembersToday = members.filter(m => m.dateJoined === '2026-09-10').length;
    const membershipGrowthPct = 15.4; // % vs previous period
    const vipMembersCount = members.filter(m => m.loyaltyLevel.includes('VIP') || m.segment === 'VIP Customers').length;
    const mostActiveCount = members.filter(m => m.totalOrders >= 25).length;
    const inactiveMembersCount = members.filter(m => m.status.toLowerCase().includes('inactive')).length;
    const totalSpentSum = members.reduce((acc, m) => acc + (m.totalSpent || 0), 0);
    const avgSpendPerMember = totalMembers > 0 ? (totalSpentSum / totalMembers).toFixed(2) : 0;
    const totalOrdersCount = members.reduce((acc, m) => acc + (m.totalOrders || 0), 0);
    const loyaltyMembersCount = members.filter(m => (m.rewardPoints || 0) > 0).length;
    const birthdaysThisWeekCount = members.filter(m => m.birthdayThisWeek).length;
    const churnRiskCount = members.filter(m => m.churnRiskLevel === 'high' || m.churnRiskLevel === 'medium').length;

    // Filter members for directory
    const filteredMembers = members.filter(m => {
        const matchesSearch = (
            m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const matchesSegment = segmentFilter === 'All' || m.segment === segmentFilter || (m.secondarySegments && m.secondarySegments.includes(segmentFilter));
        return matchesSearch && matchesSegment;
    });

    // Handle Campaign Action
    const handleSendPromo = (memberName, promoType) => {
        showNotification(`✓ Promo "${promoType}" sent successfully to ${memberName}!`);
    };

    const SEGMENT_OPTIONS = [
        'All', 'VIP Customers', 'Regular Customers', 'New Customers',
        'Inactive Customers', 'High-Spending Customers', 'Budget Customers',
        'Weekend Customers', 'Delivery-Only Customers', 'Dine-In Customers'
    ];

    return (
        <div className="min-h-screen bg-[#0D0A07] text-white font-body selection:bg-secondary selection:text-white flex flex-col">
            <Navbar />

            {/* Notification Toast */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-[600] bg-secondary text-white px-6 py-3.5 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
                    <Sparkles className="w-5 h-5 text-accent animate-spin" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Main Wrapper */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8 space-y-8">
                
                {/* Header Banner */}
                <div className="relative overflow-hidden bg-gradient-to-r from-[#1E140B] via-[#2A1B0E] to-[#1E140B] border border-amber-500/20 rounded-[2.5rem] p-6 md:p-8 shadow-2xl">
                    <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-black tracking-widest uppercase flex items-center gap-1.5">
                                    <Brain className="w-3.5 h-3.5 animate-pulse text-amber-300" /> AI Member Intelligence Portal
                                </span>
                                <span className="text-white/40 text-xs font-semibold">Live Real-Time Sync</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight text-white">
                                Members & AI Customer Analytics
                            </h1>
                            <p className="text-white/60 text-sm mt-1 max-w-2xl">
                                Real-time customer growth, behavioral segmentation, automated churn prevention, spending trends, and predictive AI insights for registered Kolay members.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                            <button
                                onClick={() => showNotification("AI Model recalculated customer intelligence & lifetime values.")}
                                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all border border-white/10 active:scale-95"
                            >
                                <RefreshCw className="w-4 h-4 text-amber-400" /> Refresh AI Engine
                            </button>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-5 py-2.5 bg-secondary hover:bg-orange-600 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg active:scale-95"
                            >
                                <UserPlus className="w-4 h-4" /> Add New Member
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── AI Dashboard Widgets Grid (12 Cards) ────────────────────────── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
                    {/* 1. Total Members */}
                    <div className="bg-[#18110A] border border-white/10 hover:border-amber-500/30 rounded-2xl p-4 transition-all">
                        <div className="flex items-center justify-between text-white/50 mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider">Total Members</span>
                            <Users className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="text-2xl font-display font-black text-white">{totalMembers}</div>
                        <p className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" /> +12% this month
                        </p>
                    </div>

                    {/* 2. New Members Today */}
                    <div className="bg-[#18110A] border border-white/10 hover:border-emerald-500/30 rounded-2xl p-4 transition-all">
                        <div className="flex items-center justify-between text-white/50 mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider">New Today</span>
                            <UserPlus className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="text-2xl font-display font-black text-white">{newMembersToday}</div>
                        <p className="text-[10px] text-white/40 font-semibold mt-1">Joined in last 24h</p>
                    </div>

                    {/* 3. Membership Growth */}
                    <div className="bg-[#18110A] border border-white/10 hover:border-sky-500/30 rounded-2xl p-4 transition-all">
                        <div className="flex items-center justify-between text-white/50 mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider">Growth Rate</span>
                            <TrendingUp className="w-4 h-4 text-sky-400" />
                        </div>
                        <div className="text-2xl font-display font-black text-white">+{membershipGrowthPct}%</div>
                        <p className="text-[10px] text-sky-400 font-semibold mt-1">vs. previous 30 days</p>
                    </div>

                    {/* 4. VIP Members */}
                    <div className="bg-[#18110A] border border-white/10 hover:border-purple-500/30 rounded-2xl p-4 transition-all">
                        <div className="flex items-center justify-between text-white/50 mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider">VIP Members</span>
                            <Crown className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="text-2xl font-display font-black text-purple-300">{vipMembersCount}</div>
                        <p className="text-[10px] text-purple-400/80 font-semibold mt-1">Top tier status</p>
                    </div>

                    {/* 5. Most Active Customers */}
                    <div className="bg-[#18110A] border border-white/10 hover:border-orange-500/30 rounded-2xl p-4 transition-all">
                        <div className="flex items-center justify-between text-white/50 mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider">Most Active</span>
                            <Flame className="w-4 h-4 text-orange-400" />
                        </div>
                        <div className="text-2xl font-display font-black text-white">{mostActiveCount}</div>
                        <p className="text-[10px] text-orange-400 font-semibold mt-1">25+ lifetime orders</p>
                    </div>

                    {/* 6. Inactive Members */}
                    <div className="bg-[#18110A] border border-white/10 hover:border-rose-500/30 rounded-2xl p-4 transition-all">
                        <div className="flex items-center justify-between text-white/50 mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider">Inactive</span>
                            <Moon className="w-4 h-4 text-rose-400" />
                        </div>
                        <div className="text-2xl font-display font-black text-rose-300">{inactiveMembersCount}</div>
                        <p className="text-[10px] text-rose-400 font-semibold mt-1">30+ days no order</p>
                    </div>

                    {/* 7. Avg Spend Per Member */}
                    <div className="bg-[#18110A] border border-white/10 hover:border-green-500/30 rounded-2xl p-4 transition-all">
                        <div className="flex items-center justify-between text-white/50 mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider">Avg Spend</span>
                            <DollarSign className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="text-2xl font-display font-black text-emerald-400">${avgSpendPerMember}</div>
                        <p className="text-[10px] text-white/40 font-semibold mt-1">LTV per member</p>
                    </div>

                    {/* 8. Total Orders */}
                    <div className="bg-[#18110A] border border-white/10 hover:border-indigo-500/30 rounded-2xl p-4 transition-all">
                        <div className="flex items-center justify-between text-white/50 mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider">Member Orders</span>
                            <ShoppingBag className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="text-2xl font-display font-black text-white">{totalOrdersCount}</div>
                        <p className="text-[10px] text-indigo-400 font-semibold mt-1">Cumulative orders</p>
                    </div>

                    {/* 9. Loyalty Members */}
                    <div className="bg-[#18110A] border border-white/10 hover:border-yellow-500/30 rounded-2xl p-4 transition-all">
                        <div className="flex items-center justify-between text-white/50 mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider">Loyalty Stars</span>
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        </div>
                        <div className="text-2xl font-display font-black text-yellow-300">{loyaltyMembersCount}</div>
                        <p className="text-[10px] text-yellow-400/80 font-semibold mt-1">Earning reward pts</p>
                    </div>

                    {/* 10. Birthdays This Week */}
                    <div className="bg-[#18110A] border border-white/10 hover:border-pink-500/30 rounded-2xl p-4 transition-all">
                        <div className="flex items-center justify-between text-white/50 mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider">Birthdays</span>
                            <Cake className="w-4 h-4 text-pink-400" />
                        </div>
                        <div className="text-2xl font-display font-black text-pink-300">{birthdaysThisWeekCount}</div>
                        <p className="text-[10px] text-pink-400 font-semibold mt-1">Send coupon today</p>
                    </div>

                    {/* 11. AI Recommendations */}
                    <div className="bg-[#18110A] border border-white/10 hover:border-cyan-500/30 rounded-2xl p-4 transition-all">
                        <div className="flex items-center justify-between text-white/50 mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider">AI Insights</span>
                            <Brain className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="text-2xl font-display font-black text-cyan-300">4 Active</div>
                        <p className="text-[10px] text-cyan-400 font-semibold mt-1">Actionable suggestions</p>
                    </div>

                    {/* 12. Customers at Risk */}
                    <div className="bg-[#18110A] border border-white/10 hover:border-red-500/30 rounded-2xl p-4 transition-all">
                        <div className="flex items-center justify-between text-white/50 mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider">At Risk Churn</span>
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                        </div>
                        <div className="text-2xl font-display font-black text-red-400">{churnRiskCount}</div>
                        <p className="text-[10px] text-red-400 font-semibold mt-1">High churn probability</p>
                    </div>
                </div>

                {/* ── Navigation Tabs Bar ─────────────────────────────────────────── */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
                    {[
                        { id: 'directory', label: '👥 Member Timeline & Directory', badge: members.length },
                        { id: 'growth', label: '📈 1. Customer Growth' },
                        { id: 'activity', label: '⚡ 2. Customer Activity' },
                        { id: 'spending', label: '💰 3. Spending Analysis' },
                        { id: 'favorites', label: '🍔 4. Favorite Food Analysis' },
                        { id: 'segmentation', label: '🏷️ 5. Customer Segmentation' },
                        { id: 'retention', label: '⚠️ 6. Retention & Churn AI' },
                        { id: 'marketing', label: '🎯 7. Personalized Marketing' },
                        { id: 'loyalty', label: '⭐ 8. Loyalty Intelligence' },
                        { id: 'behavior', label: '🕒 9. Ordering Behavior' },
                        { id: 'feedback', label: '💬 10. Feedback Analysis' },
                        { id: 'ai_recommendations', label: '🧠 11. AI Recommendations' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                                activeTab === tab.id
                                    ? 'bg-secondary text-white shadow-lg shadow-secondary/20'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <span>{tab.label}</span>
                            {tab.badge !== undefined && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-black">
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ── TAB 1: Member Timeline & Directory ─────────────────────────── */}
                {activeTab === 'directory' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                        {/* Filters & Search */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#150F0A] p-4 rounded-2xl border border-white/10">
                            <div className="relative flex-1 w-full">
                                <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search members by name, email, phone or ID..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-secondary transition-all"
                                />
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="flex items-center gap-2 text-xs text-white/60 font-bold shrink-0">
                                    <Filter className="w-3.5 h-3.5 text-secondary" /> Segment:
                                </div>
                                <select
                                    value={segmentFilter}
                                    onChange={e => setSegmentFilter(e.target.value)}
                                    className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-secondary cursor-pointer font-bold"
                                >
                                    {SEGMENT_OPTIONS.map(opt => (
                                        <option key={opt} value={opt} className="bg-[#1A1008] text-white">
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Members Table */}
                        <div className="bg-[#150F0A] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-white/5 text-[11px] font-black uppercase text-white/50 tracking-wider">
                                            <th className="py-4 px-6">Member Profile</th>
                                            <th className="py-4 px-4">Loyalty Tier</th>
                                            <th className="py-4 px-4">Total Orders</th>
                                            <th className="py-4 px-4">Total Spent</th>
                                            <th className="py-4 px-4">Favorite Meal</th>
                                            <th className="py-4 px-4">Status & Churn</th>
                                            <th className="py-4 px-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-xs">
                                        {filteredMembers.map((m) => (
                                            <tr key={m.id} className="hover:bg-white/[0.03] transition-colors group">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-2xl ${m.avatarColor || 'bg-amber-500'} flex items-center justify-center font-black text-sm text-white shadow-md`}>
                                                            {m.fullName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-2">
                                                                {m.fullName}
                                                                {m.birthdayThisWeek && (
                                                                    <span className="px-1.5 py-0.5 bg-pink-500/20 text-pink-300 border border-pink-500/30 rounded text-[9px] font-black" title="Birthday This Week!">
                                                                        🎂 Birthday
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-[11px] text-white/40 font-mono">
                                                                @{m.username} • Joined {m.dateJoined}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-4 px-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${
                                                        m.loyaltyLevel.includes('VIP')
                                                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                                            : m.loyaltyLevel.includes('Gold')
                                                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                                            : m.loyaltyLevel.includes('Silver')
                                                            ? 'bg-slate-400/20 text-slate-200 border-slate-400/40'
                                                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                                    }`}>
                                                        {m.loyaltyLevel} ({m.rewardPoints} pts)
                                                    </span>
                                                </td>

                                                <td className="py-4 px-4 font-bold text-white">
                                                    {m.totalOrders} orders
                                                </td>

                                                <td className="py-4 px-4 font-bold text-emerald-400">
                                                    ${m.totalSpent?.toFixed(2)}
                                                </td>

                                                <td className="py-4 px-4 text-white/70">
                                                    <span className="px-2 py-1 bg-white/5 rounded-lg text-[11px] font-medium border border-white/5">
                                                        {m.favoriteMeal || 'N/A'}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-4">
                                                    <div className="space-y-1">
                                                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                                            m.status.includes('Active')
                                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                                : 'bg-rose-500/20 text-rose-400'
                                                        }`}>
                                                            {m.status}
                                                        </span>
                                                        <div className="text-[10px] text-white/40">
                                                            Risk: <span className={m.churnRiskLevel === 'high' ? 'text-red-400 font-bold' : 'text-emerald-400'}>{m.churnRisk}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => setSelectedMember(m)}
                                                            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-white rounded-lg text-xs font-bold transition-all border border-amber-500/30 flex items-center gap-1.5"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" /> Timeline
                                                        </button>
                                                        <button
                                                            onClick={() => handleSendPromo(m.fullName, "We Miss You 10% Discount")}
                                                            className="p-1.5 bg-white/5 hover:bg-secondary text-white/60 hover:text-white rounded-lg transition-colors"
                                                            title="Send Personalized Discount"
                                                        >
                                                            <Send className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                        {filteredMembers.length === 0 && (
                                            <tr>
                                                <td colSpan="7" className="py-12 text-center text-white/40">
                                                    No members matching your search/segment criteria.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 2: Customer Growth ──────────────────────────────────────── */}
                {activeTab === 'growth' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                        {/* AI Summary Box */}
                        <div className="bg-gradient-to-r from-emerald-950/40 via-[#150F0A] to-[#150F0A] border border-emerald-500/30 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-2 text-emerald-400 font-bold text-sm">
                                <Sparkles className="w-4 h-4" /> AI Growth Intelligence Summary
                            </div>
                            <p className="text-xl font-display font-bold text-white">
                                "42 new members joined this week, a 15.4% increase compared to last week."
                            </p>
                            <p className="text-white/60 text-xs mt-2">
                                Organic referrals and birthday promo campaigns drove 68% of new account signups. Churn rate remains low at 1.2%.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-[#150F0A] border border-white/10 p-5 rounded-2xl text-center">
                                <span className="text-xs text-white/50 font-bold block mb-1">New Today</span>
                                <span className="text-3xl font-display font-black text-emerald-400">{newMembersToday}</span>
                                <span className="text-[10px] text-white/40 block mt-1">First-time registrations</span>
                            </div>
                            <div className="bg-[#150F0A] border border-white/10 p-5 rounded-2xl text-center">
                                <span className="text-xs text-white/50 font-bold block mb-1">New This Week</span>
                                <span className="text-3xl font-display font-black text-amber-400">42</span>
                                <span className="text-[10px] text-white/40 block mt-1">+15.4% vs last week</span>
                            </div>
                            <div className="bg-[#150F0A] border border-white/10 p-5 rounded-2xl text-center">
                                <span className="text-xs text-white/50 font-bold block mb-1">New This Month</span>
                                <span className="text-3xl font-display font-black text-indigo-400">148</span>
                                <span className="text-[10px] text-white/40 block mt-1">High conversion</span>
                            </div>
                            <div className="bg-[#150F0A] border border-white/10 p-5 rounded-2xl text-center">
                                <span className="text-xs text-white/50 font-bold block mb-1">Left / Deleted Accounts</span>
                                <span className="text-3xl font-display font-black text-rose-400">2</span>
                                <span className="text-[10px] text-white/40 block mt-1">Minimal churn (1.2%)</span>
                            </div>
                        </div>

                        {/* Returning vs First Time */}
                        <div className="bg-[#150F0A] border border-white/10 rounded-2xl p-6 space-y-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-amber-400" /> Returning vs. First-Time Customers Breakdown
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-1">
                                        <span className="text-amber-400">Returning Members (74%)</span>
                                        <span className="text-white">356 members</span>
                                    </div>
                                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '74%' }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-1">
                                        <span className="text-sky-400">First-Time Members (26%)</span>
                                        <span className="text-white">125 members</span>
                                    </div>
                                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-sky-500 rounded-full" style={{ width: '26%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 3: Customer Activity ────────────────────────────────────── */}
                {activeTab === 'activity' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                        {/* AI Insight */}
                        <div className="bg-gradient-to-r from-amber-950/40 via-[#150F0A] to-[#150F0A] border border-amber-500/30 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-2 text-amber-400 font-bold text-sm">
                                <Brain className="w-4 h-4" /> AI Activity Insight
                            </div>
                            <p className="text-xl font-display font-bold text-white">
                                "18 loyal customers haven't placed an order in the last month. Consider sending them a discount."
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Most Active Customers */}
                            <div className="bg-[#150F0A] border border-white/10 rounded-2xl p-6">
                                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                                    <Flame className="w-5 h-5 text-orange-500" /> Most Active Members (Weekly & Monthly)
                                </h3>
                                <div className="space-y-3">
                                    {members.slice(0, 4).map(m => (
                                        <div key={m.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 font-bold text-xs flex items-center justify-center">
                                                    {m.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-xs text-white block">{m.fullName}</span>
                                                    <span className="text-[10px] text-white/40">Orders every week</span>
                                                </div>
                                            </div>
                                            <span className="px-2.5 py-1 bg-orange-500/20 text-orange-300 font-black text-xs rounded-lg">
                                                {m.totalOrders} orders
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Inactive Alert */}
                            <div className="bg-[#150F0A] border border-white/10 rounded-2xl p-6">
                                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                                    <Moon className="w-5 h-5 text-rose-500" /> Customers Becoming Inactive (30+ Days)
                                </h3>
                                <div className="space-y-3">
                                    {members.filter(m => m.status.includes('Inactive')).map(m => (
                                        <div key={m.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-rose-500/20">
                                            <div>
                                                <span className="font-bold text-xs text-white block">{m.fullName}</span>
                                                <span className="text-[10px] text-rose-400 font-semibold">Last order: {m.latestOrderDate}</span>
                                            </div>
                                            <button
                                                onClick={() => handleSendPromo(m.fullName, "15% Re-engagement Discount")}
                                                className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition-all shadow-md"
                                            >
                                                Send Discount
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 4: Spending Analysis ───────────────────────────────────── */}
                {activeTab === 'spending' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                        {/* AI Example Insight */}
                        <div className="bg-gradient-to-r from-emerald-950/40 via-[#150F0A] to-[#150F0A] border border-emerald-500/30 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-2 text-emerald-400 font-bold text-sm">
                                <DollarSign className="w-4 h-4" /> AI Spending Analysis
                            </div>
                            <p className="text-xl font-display font-bold text-white">
                                "John Mwangi has spent $1,250 over the last 12 months, making him one of your top 10 customers."
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Highest Spending Leaderboard */}
                            <div className="bg-[#150F0A] border border-white/10 rounded-2xl p-6 md:col-span-2">
                                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                                    <Crown className="w-5 h-5 text-amber-400" /> Highest-Spending Members Leaderboard
                                </h3>
                                <div className="space-y-3">
                                    {[...members].sort((a,b) => b.totalSpent - a.totalSpent).slice(0, 5).map((m, idx) => (
                                        <div key={m.id} className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                                                    idx === 0 ? 'bg-amber-500 text-white' : idx === 1 ? 'bg-slate-300 text-slate-900' : 'bg-amber-700 text-white'
                                                }`}>
                                                    #{idx + 1}
                                                </span>
                                                <div>
                                                    <span className="font-bold text-xs text-white block">{m.fullName}</span>
                                                    <span className="text-[10px] text-white/40">Avg order: ${m.avgOrderValue}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-display font-black text-sm text-emerald-400 block">${m.totalSpent?.toFixed(2)}</span>
                                                <span className="text-[10px] text-purple-300 font-semibold">{m.loyaltyLevel}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className="space-y-4">
                                <div className="bg-[#150F0A] border border-white/10 p-6 rounded-2xl">
                                    <span className="text-xs text-white/50 font-bold block mb-1">Average Spend Per Member</span>
                                    <span className="text-3xl font-display font-black text-emerald-400">${avgSpendPerMember}</span>
                                    <p className="text-xs text-white/40 mt-2">Up 8.2% compared to last quarter</p>
                                </div>
                                <div className="bg-[#150F0A] border border-white/10 p-6 rounded-2xl">
                                    <span className="text-xs text-white/50 font-bold block mb-1">Lifetime Customer Value (LTV)</span>
                                    <span className="text-3xl font-display font-black text-amber-400">$640.00</span>
                                    <p className="text-xs text-white/40 mt-2">Projected 12-month value per member</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 5: Favorite Food Analysis ──────────────────────────────── */}
                {activeTab === 'favorites' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                        {/* AI Insight */}
                        <div className="bg-gradient-to-r from-purple-950/40 via-[#150F0A] to-[#150F0A] border border-purple-500/30 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-2 text-purple-400 font-bold text-sm">
                                <Brain className="w-4 h-4" /> AI Combination Intelligence
                            </div>
                            <p className="text-xl font-display font-bold text-white">
                                "75% of members who order burgers also purchase fries."
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-[#150F0A] border border-white/10 p-5 rounded-2xl">
                                <span className="text-xs text-amber-400 font-black uppercase tracking-wider block mb-2">🥇 Most Ordered Dish</span>
                                <h4 className="font-bold text-lg text-white">Gourmet Beef Burger</h4>
                                <p className="text-xs text-white/50 mt-1">Ordered 342 times by members</p>
                            </div>
                            <div className="bg-[#150F0A] border border-white/10 p-5 rounded-2xl">
                                <span className="text-xs text-indigo-400 font-black uppercase tracking-wider block mb-2">🍷 Favorite Drink</span>
                                <h4 className="font-bold text-lg text-white">House Red Wine & Iced Latte</h4>
                                <p className="text-xs text-white/50 mt-1">Preferred drink pairing</p>
                            </div>
                            <div className="bg-[#150F0A] border border-white/10 p-5 rounded-2xl">
                                <span className="text-xs text-emerald-400 font-black uppercase tracking-wider block mb-2">🍔 Best Combination</span>
                                <h4 className="font-bold text-lg text-white">Burger + Truffle Fries</h4>
                                <p className="text-xs text-white/50 mt-1">High upsell affinity (75%)</p>
                            </div>
                            <div className="bg-[#150F0A] border border-white/10 p-5 rounded-2xl">
                                <span className="text-xs text-pink-400 font-black uppercase tracking-wider block mb-2">☀️ Seasonal Favorite</span>
                                <h4 className="font-bold text-lg text-white">Herb-Crusted Salmon</h4>
                                <p className="text-xs text-white/50 mt-1">+35% demand in summer</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 6: Customer Segmentation ───────────────────────────────── */}
                {activeTab === 'segmentation' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white">Automated Customer Segmentation</h3>
                                <p className="text-xs text-white/60">AI groups members into dynamic cohorts based on purchasing frequency & behavior.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                { name: 'VIP Customers', count: vipMembersCount, desc: 'High spenders ($1000+) & frequent diners', color: 'border-purple-500/40 bg-purple-950/20' },
                                { name: 'Regular Customers', count: 4, desc: 'Orders 2-4 times a month consistently', color: 'border-amber-500/40 bg-amber-950/20' },
                                { name: 'New Customers', count: newMembersToday, desc: 'Registered in the last 7 days', color: 'border-emerald-500/40 bg-emerald-950/20' },
                                { name: 'Inactive Customers', count: inactiveMembersCount, desc: 'No orders placed in 30+ days', color: 'border-rose-500/40 bg-rose-950/20' },
                                { name: 'High-Spending Customers', count: 3, desc: 'Top tier average order value ($30+)', color: 'border-green-500/40 bg-green-950/20' },
                                { name: 'Budget Customers', count: 2, desc: 'Prefers promo items & combos', color: 'border-blue-500/40 bg-blue-950/20' },
                                { name: 'Weekend Customers', count: 4, desc: 'Orders mainly Friday to Sunday', color: 'border-orange-500/40 bg-orange-950/20' },
                                { name: 'Delivery-Only Customers', count: 2, desc: 'Prefers fast home delivery', color: 'border-sky-500/40 bg-sky-950/20' },
                                { name: 'Dine-In Customers', count: 4, desc: 'Enjoys table reservations & dining in', color: 'border-yellow-500/40 bg-yellow-950/20' },
                            ].map(seg => (
                                <div
                                    key={seg.name}
                                    onClick={() => { setSegmentFilter(seg.name); setActiveTab('directory'); }}
                                    className={`p-5 rounded-2xl border ${seg.color} cursor-pointer hover:scale-[1.02] transition-all`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold text-white text-sm">{seg.name}</h4>
                                        <span className="px-2.5 py-1 bg-white/10 rounded-full font-black text-xs text-white">{seg.count}</span>
                                    </div>
                                    <p className="text-xs text-white/60">{seg.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── TAB 7: Retention & Churn AI ────────────────────────────────── */}
                {activeTab === 'retention' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                        {/* AI Prediction Header */}
                        <div className="bg-gradient-to-r from-red-950/50 via-[#150F0A] to-[#150F0A] border border-red-500/30 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-2 text-red-400 font-bold text-sm">
                                <AlertTriangle className="w-4 h-4" /> AI Predictive Churn Intelligence
                            </div>
                            <p className="text-xl font-display font-bold text-white">
                                "23 members are likely to stop ordering within the next two weeks."
                            </p>
                            <p className="text-xs text-white/60 mt-2">
                                Indicators monitored: Fewer visits (-40%), reduced spending, no orders in 21+ days, declining app activity.
                            </p>
                        </div>

                        <div className="bg-[#150F0A] border border-white/10 rounded-2xl p-6">
                            <h3 className="text-base font-bold text-white mb-4">High Risk Churn Members</h3>
                            <div className="space-y-3">
                                {members.filter(m => m.churnRiskLevel === 'high' || m.churnRiskLevel === 'medium').map(m => (
                                    <div key={m.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/5 rounded-xl border border-red-500/20 gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-white text-sm">{m.fullName}</span>
                                                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-black rounded-full">
                                                    Risk: {m.churnRisk}
                                                </span>
                                            </div>
                                            <div className="text-xs text-white/50 mt-1">
                                                Indicators: Declining visits • Last order {m.latestOrderDate}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleSendPromo(m.fullName, "Special We Miss You Offer (20% Off)")}
                                            className="px-4 py-2 bg-secondary hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shrink-0"
                                        >
                                            Send Re-engagement Offer
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 8: Personalized Marketing Suggestions ──────────────────── */}
                {activeTab === 'marketing' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                        {/* AI Example */}
                        <div className="bg-gradient-to-r from-amber-950/40 via-[#150F0A] to-[#150F0A] border border-amber-500/30 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-2 text-amber-400 font-bold text-sm">
                                <Gift className="w-4 h-4" /> AI Marketing Recommendation
                            </div>
                            <p className="text-xl font-display font-bold text-white">
                                "Send a 10% discount to members who haven't ordered in 45 days."
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { title: '🎂 Birthday Coupons', desc: 'Auto-send 15% birthday discount voucher 3 days prior.', action: 'Send Birthday Campaign' },
                                { title: '❤️ "We Miss You" Discounts', desc: 'Re-engage members with 10% off after 30 days of inactivity.', action: 'Launch Re-engagement' },
                                { title: '🍕 Buy One Get One (BOGO)', desc: 'Offer BOGO pizza to weekend delivery customers on Fridays.', action: 'Trigger BOGO Offer' },
                                { title: '⭐ Loyalty Rewards Upsell', desc: 'Remind members with 1000+ points to redeem rewards.', action: 'Send Points Reminder' },
                                { title: '🍷 Wine Pairing Upsell', desc: 'Suggest wine pairings to members ordering steak or burgers.', action: 'Enable Smart Upsell' }
                            ].map(item => (
                                <div key={item.title} className="bg-[#150F0A] border border-white/10 rounded-2xl p-6 space-y-4">
                                    <h4 className="font-bold text-white text-base">{item.title}</h4>
                                    <p className="text-xs text-white/60">{item.desc}</p>
                                    <button
                                        onClick={() => showNotification(`Campaign "${item.title}" executed!`)}
                                        className="w-full py-2.5 bg-white/10 hover:bg-secondary text-white rounded-xl font-bold text-xs transition-all border border-white/10"
                                    >
                                        {item.action}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── TAB 9: Loyalty Program Intelligence ────────────────────────── */}
                {activeTab === 'loyalty' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[#150F0A] border border-white/10 p-6 rounded-2xl text-center">
                                <span className="text-xs text-amber-400 font-bold uppercase block mb-1">Total Points Earned</span>
                                <span className="text-3xl font-display font-black text-amber-300">12,450 pts</span>
                            </div>
                            <div className="bg-[#150F0A] border border-white/10 p-6 rounded-2xl text-center">
                                <span className="text-xs text-emerald-400 font-bold uppercase block mb-1">Total Points Redeemed</span>
                                <span className="text-3xl font-display font-black text-emerald-300">4,100 pts</span>
                            </div>
                            <div className="bg-[#150F0A] border border-white/10 p-6 rounded-2xl text-center">
                                <span className="text-xs text-purple-400 font-bold uppercase block mb-1">Members Close to Reward</span>
                                <span className="text-3xl font-display font-black text-purple-300">14 Members</span>
                            </div>
                        </div>

                        <div className="bg-[#150F0A] border border-white/10 rounded-2xl p-6">
                            <h3 className="text-base font-bold text-white mb-4">Members Nearing VIP Upgrade</h3>
                            <div className="space-y-3">
                                {members.slice(0, 3).map(m => (
                                    <div key={m.id} className="flex justify-between items-center p-3.5 bg-white/5 rounded-xl">
                                        <div>
                                            <span className="font-bold text-xs text-white block">{m.fullName}</span>
                                            <span className="text-[10px] text-amber-400 font-semibold">{m.rewardPoints} points balance</span>
                                        </div>
                                        <span className="text-xs text-white/50 font-bold">50 pts away from Gold Tier</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 10: Ordering Behavior ──────────────────────────────────── */}
                {activeTab === 'behavior' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                        <div className="bg-gradient-to-r from-blue-950/40 via-[#150F0A] to-[#150F0A] border border-blue-500/30 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-2 text-blue-400 font-bold text-sm">
                                <Clock className="w-4 h-4" /> AI Behavior Analytics
                            </div>
                            <p className="text-xl font-display font-bold text-white">
                                "Most members place orders between 12:00 PM and 2:00 PM."
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[#150F0A] border border-white/10 p-6 rounded-2xl">
                                <h4 className="font-bold text-sm text-white mb-3">Peak Ordering Hours</h4>
                                <ul className="space-y-2 text-xs text-white/70">
                                    <li className="flex justify-between"><span>12:00 PM - 2:00 PM (Lunch)</span><span className="font-bold text-amber-400">45%</span></li>
                                    <li className="flex justify-between"><span>7:00 PM - 9:30 PM (Dinner)</span><span className="font-bold text-amber-400">38%</span></li>
                                    <li className="flex justify-between"><span>3:00 PM - 5:00 PM (Snacks)</span><span className="font-bold text-white/40">17%</span></li>
                                </ul>
                            </div>

                            <div className="bg-[#150F0A] border border-white/10 p-6 rounded-2xl">
                                <h4 className="font-bold text-sm text-white mb-3">Preferred Payment Methods</h4>
                                <ul className="space-y-2 text-xs text-white/70">
                                    <li className="flex justify-between"><span>M-Pesa Mobile Money</span><span className="font-bold text-emerald-400">65%</span></li>
                                    <li className="flex justify-between"><span>Credit / Debit Card</span><span className="font-bold text-indigo-400">25%</span></li>
                                    <li className="flex justify-between"><span>Cash on Delivery</span><span className="font-bold text-white/40">10%</span></li>
                                </ul>
                            </div>

                            <div className="bg-[#150F0A] border border-white/10 p-6 rounded-2xl">
                                <h4 className="font-bold text-sm text-white mb-3">Fulfillment Preference</h4>
                                <ul className="space-y-2 text-xs text-white/70">
                                    <li className="flex justify-between"><span>Dine-In Table Reservation</span><span className="font-bold text-purple-400">50%</span></li>
                                    <li className="flex justify-between"><span>Home Delivery</span><span className="font-bold text-sky-400">30%</span></li>
                                    <li className="flex justify-between"><span>Quick Takeaway</span><span className="font-bold text-orange-400">20%</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 11: Feedback Analysis ──────────────────────────────────── */}
                {activeTab === 'feedback' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                        <div className="bg-gradient-to-r from-pink-950/40 via-[#150F0A] to-[#150F0A] border border-pink-500/30 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-2 text-pink-400 font-bold text-sm">
                                <MessageSquare className="w-4 h-4" /> AI Feedback Summary
                            </div>
                            <p className="text-xl font-display font-bold text-white">
                                "Customers frequently praise the pizza but mention slow delivery on weekends."
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-[#150F0A] border border-white/10 p-6 rounded-2xl">
                                <h4 className="font-bold text-emerald-400 text-sm mb-3 flex items-center gap-2">
                                    <ThumbsUp className="w-4 h-4" /> Top Compliments
                                </h4>
                                <ul className="space-y-2 text-xs text-white/70">
                                    <li>"Gourmet Beef Burger is exceptional quality."</li>
                                    <li>"Friendly ambiance & host service."</li>
                                    <li>"Fast online ordering interface."</li>
                                </ul>
                            </div>
                            <div className="bg-[#150F0A] border border-white/10 p-6 rounded-2xl">
                                <h4 className="font-bold text-rose-400 text-sm mb-3 flex items-center gap-2">
                                    <ThumbsDown className="w-4 h-4" /> Reported Complaints
                                </h4>
                                <ul className="space-y-2 text-xs text-white/70">
                                    <li>"Weekend delivery takes 10-15 minutes longer."</li>
                                    <li>"Need more gluten-free options on menu."</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 12: AI Recommendations ─────────────────────────────────── */}
                {activeTab === 'ai_recommendations' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { title: "Offer a lunch promotion on Tuesdays to increase sales.", type: "Promotional", action: "Launch Tuesday Promo" },
                                { title: "Increase stock for Chicken Alfredo; demand has risen 22%.", type: "Inventory Alert", action: "Adjust Inventory Thresholds" },
                                { title: "Reward your top 20 customers with exclusive offers.", type: "VIP Retention", action: "Grant Exclusive Voucher" },
                                { title: "Re-engage inactive members with a personalized email campaign.", type: "Re-engagement", action: "Start Automated Email Flow" }
                            ].map((rec, i) => (
                                <div key={i} className="bg-[#150F0A] border border-amber-500/30 rounded-2xl p-6 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-black rounded-full uppercase tracking-wider">
                                            {rec.type}
                                        </span>
                                        <Brain className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <p className="text-lg font-bold text-white">{rec.title}</p>
                                    <button
                                        onClick={() => showNotification(`Recommendation Applied: ${rec.action}`)}
                                        className="w-full py-3 bg-secondary hover:bg-orange-600 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg"
                                    >
                                        {rec.action}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </main>

            {/* ── MEMBER TIMELINE & PROFILE DRAWER MODAL ───────────────────────── */}
            {selectedMember && (
                <div className="fixed inset-0 z-[550] flex justify-end animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedMember(null)} />
                    
                    <div className="relative w-full max-w-lg bg-[#150F0A] border-l border-white/10 h-full overflow-y-auto p-6 space-y-6 z-10 shadow-2xl">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-2xl ${selectedMember.avatarColor || 'bg-amber-500'} flex items-center justify-center font-black text-lg text-white`}>
                                    {selectedMember.fullName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{selectedMember.fullName}</h3>
                                    <p className="text-xs text-amber-400 font-mono">@{selectedMember.username} • {selectedMember.id}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedMember(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/50 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Profile Info Details Grid */}
                        <div className="grid grid-cols-2 gap-3 text-xs bg-white/5 p-4 rounded-2xl border border-white/5">
                            <div>
                                <span className="text-white/40 block font-semibold">Date Joined:</span>
                                <span className="font-bold text-white">{selectedMember.dateJoined}</span>
                            </div>
                            <div>
                                <span className="text-white/40 block font-semibold">First Order:</span>
                                <span className="font-bold text-white">{selectedMember.firstOrderDate}</span>
                            </div>
                            <div>
                                <span className="text-white/40 block font-semibold">Latest Order:</span>
                                <span className="font-bold text-white">{selectedMember.latestOrderDate}</span>
                            </div>
                            <div>
                                <span className="text-white/40 block font-semibold">Last Login:</span>
                                <span className="font-bold text-white">{selectedMember.lastLogin}</span>
                            </div>
                            <div>
                                <span className="text-white/40 block font-semibold">Total Orders:</span>
                                <span className="font-bold text-white">{selectedMember.totalOrders}</span>
                            </div>
                            <div>
                                <span className="text-white/40 block font-semibold">Total Amount Spent:</span>
                                <span className="font-bold text-emerald-400">${selectedMember.totalSpent?.toFixed(2)}</span>
                            </div>
                            <div>
                                <span className="text-white/40 block font-semibold">Favorite Meal:</span>
                                <span className="font-bold text-white">{selectedMember.favoriteMeal}</span>
                            </div>
                            <div>
                                <span className="text-white/40 block font-semibold">Loyalty Level:</span>
                                <span className="font-bold text-purple-300">{selectedMember.loyaltyLevel}</span>
                            </div>
                            <div>
                                <span className="text-white/40 block font-semibold">Reward Points:</span>
                                <span className="font-bold text-amber-400">{selectedMember.rewardPoints} pts</span>
                            </div>
                            <div>
                                <span className="text-white/40 block font-semibold">Preferred Method:</span>
                                <span className="font-bold text-white">{selectedMember.preferredMethod}</span>
                            </div>
                        </div>

                        {/* Activity Timeline */}
                        <div>
                            <h4 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-400" /> Chronological Member Timeline
                            </h4>
                            <div className="space-y-4 relative pl-4 border-l border-amber-500/30">
                                {selectedMember.timeline?.map((event, i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                                        <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                                            <div className="flex justify-between items-center text-xs font-bold">
                                                <span className="text-white">{event.title}</span>
                                                <span className="text-[10px] text-white/40">{event.date}</span>
                                            </div>
                                            <p className="text-[11px] text-white/60">{event.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── ADD NEW MEMBER MODAL ────────────────────────────────────────── */}
            {showAddModal && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
                    
                    <div className="relative bg-[#18110A] border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-4 z-10 shadow-2xl">
                        <div className="flex justify-between items-center border-b border-white/10 pb-3">
                            <h3 className="font-bold text-white text-lg">Add New Member Account</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const fd = new FormData(e.target);
                            const newM = {
                                id: `MEM-${Math.floor(1000 + Math.random() * 9000)}`,
                                username: fd.get('username') || 'member',
                                fullName: fd.get('fullName') || 'New Member',
                                email: fd.get('email') || 'member@kolay.co.ke',
                                phone: fd.get('phone') || '+254 700 000 000',
                                dateJoined: new Date().toISOString().split('T')[0],
                                firstOrderDate: 'Pending',
                                latestOrderDate: 'Pending',
                                lastLogin: 'Just now',
                                totalOrders: 0,
                                totalSpent: 0,
                                avgOrderValue: 0,
                                favoriteMeal: 'Not determined',
                                loyaltyLevel: 'Bronze Member',
                                rewardPoints: 50,
                                preferredMethod: 'Dine-In',
                                segment: 'New Customers',
                                status: 'Active',
                                churnRisk: 'Low (0%)',
                                churnRiskLevel: 'low',
                                avatarColor: 'bg-emerald-500',
                                timeline: [{ title: 'Account Created', date: new Date().toLocaleString(), desc: 'Created manually by Admin' }]
                            };
                            updateMembersState([newM, ...members]);
                            setShowAddModal(false);
                            showNotification(`Member "${newM.fullName}" added successfully!`);
                        }} className="space-y-3 text-xs">
                            <div>
                                <label className="text-white/60 font-bold block mb-1">Full Name</label>
                                <input name="fullName" required className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-secondary" placeholder="e.g. Jane Doe" />
                            </div>
                            <div>
                                <label className="text-white/60 font-bold block mb-1">Username</label>
                                <input name="username" required className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-secondary" placeholder="jane_doe" />
                            </div>
                            <div>
                                <label className="text-white/60 font-bold block mb-1">Email</label>
                                <input name="email" type="email" required className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-secondary" placeholder="jane@example.com" />
                            </div>
                            <div>
                                <label className="text-white/60 font-bold block mb-1">Phone</label>
                                <input name="phone" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-secondary" placeholder="+254 712 345 678" />
                            </div>
                            <button type="submit" className="w-full py-3 bg-secondary hover:bg-orange-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all mt-2">
                                Save Member
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
