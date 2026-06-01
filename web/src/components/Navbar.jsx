import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Settings, RefreshCw, Shield, Menu, X, Home, LayoutGrid, Monitor,
    Package, ChevronRight, LogOut, Calendar, ExternalLink, Sparkles,
    Briefcase, Users, ClipboardList
} from 'lucide-react';
import { getRole, clearRole } from '../hooks/useRole';

// Links visible to STAFF only
const STAFF_LINKS = [
    { name: 'Dashboard',         path: '/dashboard',          icon: <Home className="w-4 h-4" /> },
    { name: 'Menu',              path: '/pos',                icon: <LayoutGrid className="w-4 h-4" /> },
    { name: 'KDS',               path: '/kds',                icon: <Monitor className="w-4 h-4" /> },
    { name: 'Inventory',         path: '/inventory',          icon: <Package className="w-4 h-4" /> },
    { name: 'Bookings',          path: '/admin/reservations', icon: <Calendar className="w-4 h-4" /> },
    { name: 'Specialties',       path: '/specialties',        icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Orders',            path: '/kds',                icon: <ClipboardList className="w-4 h-4" /> },
];

// Links visible to ADMIN only (full set)
const ADMIN_LINKS = [
    { name: 'Dashboard',         path: '/dashboard',          icon: <Home className="w-4 h-4" /> },
    { name: 'Menu',              path: '/pos',                icon: <LayoutGrid className="w-4 h-4" /> },
    { name: 'KDS',               path: '/kds',                icon: <Monitor className="w-4 h-4" /> },
    { name: 'Inventory',         path: '/inventory',          icon: <Package className="w-4 h-4" /> },
    { name: 'Bookings',          path: '/admin/reservations', icon: <Calendar className="w-4 h-4" /> },
    { name: 'Specialties',       path: '/specialties',        icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Careers',           path: '/admin/careers',      icon: <Briefcase className="w-4 h-4" /> },
    { name: 'Employees',         path: '/employees',          icon: <Users className="w-4 h-4" /> },
];

const Navbar = () => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [role, setRoleState] = useState(getRole);
    const location = useLocation();
    const navigate = useNavigate();

    const [restaurantName, setRestaurantName] = useState(() => {
        const saved = localStorage.getItem('kolay_settings');
        return saved ? JSON.parse(saved).restaurantName : 'KOLAY';
    });

    useEffect(() => {
        const handler = () => {
            const saved = localStorage.getItem('kolay_settings');
            if (saved) setRestaurantName(JSON.parse(saved).restaurantName);
            setRoleState(getRole());
        };
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, []);

    const isAdmin = role === 'admin';
    const links = isAdmin ? ADMIN_LINKS : STAFF_LINKS;
    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        clearRole();
        localStorage.removeItem('kolay_auth_user');
        navigate('/login');
    };

    const portalLabel = isAdmin ? 'Admin Portal' : 'Staff Portal';
    const portalColor = isAdmin ? 'bg-primary' : 'bg-secondary';

    // Get initials from stored user
    const storedUser = (() => { try { return JSON.parse(localStorage.getItem('kolay_auth_user')); } catch { return null; } })();
    const initials = storedUser?.username?.slice(0, 2).toUpperCase() || (isAdmin ? 'AD' : 'ST');

    return (
        <nav className="bg-primary text-white py-3 px-4 md:px-6 flex justify-between items-center shadow-lg sticky top-0 z-[100] border-b border-white/10">
            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo + Portal Badge */}
            <div className="flex items-center gap-2 md:gap-3 shrink-0">
                <img src="/Logo.png" alt="Kolay Logo" className="h-8 md:h-9 w-auto rounded shadow-sm" />
                <div>
                    <span className="text-lg md:text-xl font-display font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent uppercase block leading-tight">{restaurantName}</span>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${isAdmin ? 'bg-accent/20 text-accent' : 'bg-secondary/30 text-secondary'}`}>
                        {portalLabel}
                    </span>
                </div>
            </div>

            {/* Nav Links — Desktop (scrollable) */}
            <div className="hidden md:flex items-center gap-6 font-bold flex-1 justify-center overflow-x-auto px-4">
                {links.map((link) => (
                    <Link key={link.path + link.name} to={link.path}
                        className={`whitespace-nowrap transition-all duration-300 relative py-1 text-sm ${isActive(link.path) ? 'text-secondary font-black' : 'text-white/70 hover:text-white'}`}>
                        {link.name}
                        {isActive(link.path) && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-secondary rounded-full shadow-[0_0_10px_rgba(230,126,34,0.5)]" />}
                    </Link>
                ))}
                <Link to="/" className="whitespace-nowrap flex items-center gap-1.5 text-white/50 hover:text-secondary transition-all text-sm">
                    Client View <ExternalLink className="w-3 h-3" />
                </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 md:gap-4 shrink-0 relative">
                {isAdmin && (
                    <Link to="/admin"
                        className={`hidden sm:block bg-white/10 text-white px-4 py-1.5 rounded-xl text-[10px] font-black shadow-sm hover:bg-secondary hover:text-white transition-all border border-white/10 ${isActive('/admin') ? 'bg-secondary border-secondary' : ''}`}>
                        ADMIN CONSOLE
                    </Link>
                )}

                {/* Avatar */}
                <div className="relative">
                    <div onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className={`h-9 w-9 rounded-full border-2 border-accent flex items-center justify-center cursor-pointer shadow-md hover:scale-105 hover:border-white transition-all ${isAdmin ? 'bg-primary-dark' : 'bg-secondary/80'}`}>
                        <span className="font-black text-[10px] text-white">{initials}</span>
                    </div>

                    {showProfileMenu && (
                        <>
                            <div className="fixed inset-0 z-[90]" onClick={() => setShowProfileMenu(false)} />
                            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-primary/5 py-4 z-[100] animate-in fade-in slide-in-from-top-4 duration-200">
                                <div className="px-5 py-3 border-b border-primary/5 mb-2 bg-bg-cream/30">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] text-white font-black ${isAdmin ? 'bg-primary' : 'bg-secondary'}`}>{initials}</div>
                                        <div>
                                            <p className="text-[10px] text-charcoal/40 font-black uppercase tracking-tighter">{portalLabel}</p>
                                            <p className="font-bold text-primary text-sm capitalize">{storedUser?.username || 'User'}</p>
                                        </div>
                                    </div>
                                </div>
                                {isAdmin && (
                                    <Link to="/admin" onClick={() => setShowProfileMenu(false)}
                                        className="w-full text-left px-5 py-3 text-sm hover:bg-bg-cream transition-colors text-charcoal font-bold flex items-center gap-3">
                                        <Settings className="w-4 h-4 text-secondary" /> Settings
                                    </Link>
                                )}
                                {isAdmin && (
                                    <button onClick={() => { setShowProfileMenu(false); if (window.confirm('Reset all data?')) { localStorage.clear(); window.location.reload(); } }}
                                        className="w-full text-left px-5 py-3 text-sm hover:bg-red-50 transition-colors text-red-500 font-bold flex items-center gap-3">
                                        <RefreshCw className="w-4 h-4" /> Reset System
                                    </button>
                                )}
                                <div className="mt-2 pt-2 border-t border-primary/5">
                                    <button onClick={handleLogout}
                                        className="w-full text-left px-5 py-3 text-sm hover:bg-bg-cream transition-colors text-charcoal font-bold flex items-center gap-3">
                                        <LogOut className="w-4 h-4 text-primary" /> Sign Out
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Drawer */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[150] md:hidden">
                    <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
                    <div className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-primary shadow-2xl py-8 px-6 animate-in slide-in-from-left duration-300 overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <div className="flex items-center gap-3">
                                    <img src="/Logo.png" alt="Logo" className="h-8 w-auto rounded" />
                                    <span className="text-xl font-display font-bold uppercase">{restaurantName}</span>
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest mt-1 inline-block px-2 py-0.5 rounded-full ${isAdmin ? 'bg-accent/20 text-accent' : 'bg-secondary/30 text-secondary'}`}>
                                    {portalLabel}
                                </span>
                            </div>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-6 h-6" /></button>
                        </div>

                        <div className="space-y-2">
                            {links.map((link) => (
                                <Link key={link.path + link.name} to={link.path} onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center justify-between p-4 rounded-2xl transition-all ${isActive(link.path) ? 'bg-secondary text-white font-black' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                                    <div className="flex items-center gap-4">{link.icon}<span>{link.name}</span></div>
                                    <ChevronRight className={`w-4 h-4 ${isActive(link.path) ? 'opacity-100' : 'opacity-0'}`} />
                                </Link>
                            ))}
                            <Link to="/" onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-4 p-4 rounded-2xl text-white/50 hover:bg-white/5 hover:text-secondary transition-all">
                                <ExternalLink className="w-4 h-4" /><span>Client View</span>
                            </Link>
                        </div>

                        <div className="pt-6 mt-6 border-t border-white/10 space-y-2">
                            {isAdmin && (
                                <Link to="/admin" onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-4 p-4 text-accent font-black uppercase text-xs tracking-widest hover:bg-white/5 rounded-2xl transition-all">
                                    <Shield className="w-4 h-4" /> Admin Console
                                </Link>
                            )}
                            {isAdmin && (
                                <button onClick={() => { if (window.confirm('Reset all data?')) { localStorage.clear(); window.location.reload(); } }}
                                    className="w-full flex items-center gap-4 p-4 text-red-400 font-black uppercase text-xs tracking-widest hover:bg-white/5 rounded-2xl transition-all">
                                    <RefreshCw className="w-4 h-4" /> Reset System
                                </button>
                            )}
                            <button onClick={handleLogout}
                                className="w-full flex items-center gap-4 p-4 text-white/40 font-black uppercase text-xs tracking-widest hover:bg-white/5 rounded-2xl transition-all">
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
