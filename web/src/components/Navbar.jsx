import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, RefreshCw, Shield, User } from 'lucide-react';

const Navbar = () => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const location = useLocation();

    const links = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Menu', path: '/pos' },
        { name: 'KDS', path: '/kds' },
        { name: 'Inventory', path: '/inventory' }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-primary text-white py-4 px-8 flex justify-between items-center shadow-lg sticky top-0 z-50 border-b border-white/10">
            {/* Logo Section */}
            <div className="flex items-center gap-3 w-1/4">
                <img src="/Logo.png" alt="Kolay Logo" className="h-10 w-auto rounded shadow-sm" />
                <span className="text-2xl font-display font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">KOLAY</span>
            </div>

            {/* Nav Links - Centered */}
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
            <div className="flex items-center gap-6 w-1/4 justify-end relative">
                <Link
                    to="/admin"
                    className={`bg-white/10 text-white px-5 py-2 rounded-xl text-[10px] font-black shadow-sm hover:bg-secondary hover:text-white transition-all border border-white/10 ${isActive('/admin') ? 'bg-secondary text-white border-secondary' : ''}`}
                >
                    ADMIN CONSOLE
                </Link>

                <div className="relative">
                    <div
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="h-10 w-10 rounded-full bg-primary-dark border-2 border-accent flex items-center justify-center cursor-pointer shadow-md hover:scale-105 hover:border-white transition-all duration-300"
                    >
                        <span className="font-black text-[10px] text-accent">FK</span>
                    </div>

                    {showProfileMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-[90]"
                                onClick={() => setShowProfileMenu(false)}
                            />
                            <div className="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-primary/5 py-4 z-[100] animate-in fade-in slide-in-from-top-4 duration-200">
                                <div className="px-6 py-3 border-b border-primary/5 mb-2 bg-bg-cream/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[10px] text-accent font-black">FK</div>
                                        <div>
                                            <p className="text-[10px] text-charcoal/40 font-black uppercase tracking-tighter">System Administrator</p>
                                            <p className="font-bold text-primary text-sm">Fidel Kyalo</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full text-left px-6 py-3 text-sm hover:bg-bg-cream transition-colors text-charcoal font-bold flex items-center gap-3">
                                    <Settings className="w-4 h-4 text-secondary" /> Profile Settings
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm('WARNING: This will clear all data and start the system fresh. Proceed?')) {
                                            localStorage.clear();
                                            window.location.reload();
                                        }
                                    }}
                                    className="w-full text-left px-6 py-3 text-sm hover:bg-red-50 transition-colors text-red-500 font-bold flex items-center gap-3"
                                >
                                    <RefreshCw className="w-4 h-4" /> Reset Factory Settings
                                </button>
                                <div className="mt-2 pt-2 border-t border-primary/5">
                                    <Link
                                        to="/login"
                                        className="w-full text-left px-6 py-3 text-sm hover:bg-bg-cream transition-colors text-charcoal font-bold flex items-center gap-3"
                                    >
                                        <Shield className="w-4 h-4 text-primary" /> Secure Sign Out
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
