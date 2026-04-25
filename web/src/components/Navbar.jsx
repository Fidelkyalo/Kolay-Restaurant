import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, RefreshCw, Shield, Menu, X, Home, LayoutGrid, Monitor, Package, ChevronRight, LogOut } from 'lucide-react';

const Navbar = () => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const links = [
        { name: 'Dashboard', path: '/dashboard', icon: <Home className="w-4 h-4" /> },
        { name: 'Menu', path: '/pos', icon: <LayoutGrid className="w-4 h-4" /> },
        { name: 'KDS', path: '/kds', icon: <Monitor className="w-4 h-4" /> },
        { name: 'Inventory', path: '/inventory', icon: <Package className="w-4 h-4" /> }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-primary text-white py-4 px-6 md:px-8 flex justify-between items-center shadow-lg sticky top-0 z-[100] border-b border-white/10">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo Section */}
            <div className="flex items-center gap-2 md:gap-3 md:w-1/4">
                <img src="/Logo.png" alt="Kolay Logo" className="h-8 md:h-10 w-auto rounded shadow-sm" />
                <span className="text-xl md:text-2xl font-display font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">KOLAY</span>
            </div>

            {/* Nav Links - Centered (Desktop) */}
            <div className="hidden md:flex gap-10 font-bold justify-center flex-1">
                {links.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`transition-all duration-300 relative py-1 ${isActive(link.path)
                            ? 'text-secondary font-black'
                            : 'text-white/70 hover:text-white'
                            }`}
                    >
                        {link.name}
                        {isActive(link.path) && (
                            <span className="absolute -bottom-1 left-0 w-full h-1 bg-secondary rounded-full shadow-[0_0_10px_rgba(230,126,34,0.5)]" />
                        )}
                    </Link>
                ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 md:gap-6 md:w-1/4 justify-end relative">
                <Link
                    to="/admin"
                    className={`hidden sm:block bg-white/10 text-white px-5 py-2 rounded-xl text-[10px] font-black shadow-sm hover:bg-secondary hover:text-white transition-all border border-white/10 ${isActive('/admin') ? 'bg-secondary text-white border-secondary' : ''}`}
                >
                    ADMIN CONSOLE
                </Link>

                <div className="relative">
                    <div
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-primary-dark border-2 border-accent flex items-center justify-center cursor-pointer shadow-md hover:scale-105 hover:border-white transition-all duration-300"
                    >
                        <span className="font-black text-[10px] text-accent">FK</span>
                    </div>

                    {showProfileMenu && (
                        <>
                            <div className="fixed inset-0 z-[90]" onClick={() => setShowProfileMenu(false)} />
                            <div className="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-primary/5 py-4 z-[100] animate-in fade-in slide-in-from-top-4 duration-200">
                                <div className="px-6 py-3 border-b border-primary/5 mb-2 bg-bg-cream/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[10px] text-accent font-black">FK</div>
                                        <div>
                                            <p className="text-[10px] text-charcoal/40 font-black uppercase tracking-tighter">Admin</p>
                                            <p className="font-bold text-primary text-sm">Fidel Kyalo</p>
                                        </div>
                                    </div>
                                </div>
                                <Link to="/admin" onClick={() => setShowProfileMenu(false)} className="w-full text-left px-6 py-3 text-sm hover:bg-bg-cream transition-colors text-charcoal font-bold flex items-center gap-3">
                                    <Settings className="w-4 h-4 text-secondary" /> Settings
                                </Link>
                                <button
                                    onClick={() => {
                                        if (window.confirm('Reset all data?')) {
                                            localStorage.clear();
                                            window.location.reload();
                                        }
                                    }}
                                    className="w-full text-left px-6 py-3 text-sm hover:bg-red-50 transition-colors text-red-500 font-bold flex items-center gap-3"
                                >
                                    <RefreshCw className="w-4 h-4" /> Reset System
                                </button>
                                <div className="mt-2 pt-2 border-t border-primary/5">
                                    <Link to="/login" className="w-full text-left px-6 py-3 text-sm hover:bg-bg-cream transition-colors text-charcoal font-bold flex items-center gap-3">
                                        <Shield className="w-4 h-4 text-primary" /> Logout
                                    </Link>
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
                    <div className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-primary shadow-2xl py-8 px-6 animate-in slide-in-from-left duration-300">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-3">
                                <img src="/Logo.png" alt="Logo" className="h-8 w-auto rounded" />
                                <span className="text-xl font-display font-bold">KOLAY</span>
                            </div>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-lg">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {links.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center justify-between p-4 rounded-2xl transition-all ${isActive(link.path)
                                        ? 'bg-secondary text-white font-black shadow-glow'
                                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        {link.icon}
                                        <span>{link.name}</span>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 ${isActive(link.path) ? 'opacity-100' : 'opacity-0'}`} />
                                </Link>
                            ))}
                            <div className="pt-6 mt-6 border-t border-white/10 space-y-4">
                                <Link
                                    to="/admin"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-4 p-4 text-accent font-black uppercase text-xs tracking-widest hover:bg-white/5 rounded-2xl transition-all"
                                >
                                    <Shield className="w-4 h-4" /> Admin Console
                                </Link>
                                <button
                                    onClick={() => {
                                        if (window.confirm('Reset all data?')) {
                                            localStorage.clear();
                                            window.location.reload();
                                        }
                                    }}
                                    className="w-full flex items-center gap-4 p-4 text-red-400 font-black uppercase text-xs tracking-widest hover:bg-white/5 rounded-2xl transition-all"
                                >
                                    <RefreshCw className="w-4 h-4" /> Reset System
                                </button>
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-4 p-4 text-white/40 font-black uppercase text-xs tracking-widest hover:bg-white/5 rounded-2xl transition-all"
                                >
                                    <LogOut className="w-4 h-4" /> Logout
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
