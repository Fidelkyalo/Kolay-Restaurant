import React, { useState, useEffect } from 'react';
import { Menu, X, Utensils, Calendar, MapPin, Phone, Camera, MessageCircle, UserPlus, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Check if user is already logged in
    const isLoggedIn = (() => {
        try {
            const u = JSON.parse(localStorage.getItem('kolay_auth_user'));
            return !!(u && (u.accessToken || u.username));
        } catch { return false; }
    })();

    const loggedInUsername = (() => {
        try {
            const u = JSON.parse(localStorage.getItem('kolay_auth_user'));
            return u?.username || null;
        } catch { return null; }
    })();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'About', href: '/#about' },
        { name: 'Menu', href: '/#menu' },
        { name: 'Reservations', href: '/reservations' },
        { name: 'Gallery', href: '/#gallery' },
        { name: 'Contact', href: '/#contact' },
        { name: 'Careers', href: '/careers' },
    ];

    return (
        <nav className={`fixed w-full z-[100] transition-all duration-500 ${isScrolled ? 'bg-primary/95 backdrop-blur-md py-4 shadow-2xl' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                    <img src="/Logo.png" alt="Kolay Logo" className="h-10 w-auto rounded group-hover:rotate-12 transition-transform duration-300 shadow-glow" />
                    <span className="text-white text-2xl font-display font-black tracking-tighter uppercase">Kolay</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        link.href.startsWith('/#') ? (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-white/80 hover:text-accent font-black text-[10px] uppercase tracking-widest transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-accent hover:after:w-full after:transition-all after:duration-300"
                            >
                                {link.name}
                            </a>
                        ) : (
                            <Link
                                key={link.name}
                                to={link.href}
                                className="text-white/80 hover:text-accent font-black text-[10px] uppercase tracking-widest transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-accent hover:after:w-full after:transition-all after:duration-300"
                            >
                                {link.name}
                            </Link>
                        )
                    ))}

                    {/* Auth buttons */}
                    {isLoggedIn ? (
                        <Link
                            to="/order"
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all"
                        >
                            <span className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center text-[9px] font-black">
                                {loggedInUsername?.[0]?.toUpperCase() || '?'}
                            </span>
                            {loggedInUsername}
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/staff"
                                className="flex items-center gap-1.5 text-white/70 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors px-3 py-2 rounded-full hover:bg-white/10"
                            >
                                <LogIn className="w-3.5 h-3.5" /> Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="flex items-center gap-1.5 bg-secondary hover:bg-orange-500 text-white px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-lg hover:scale-105 active:scale-95"
                            >
                                <UserPlus className="w-3.5 h-3.5" /> Create Account
                            </Link>
                        </div>
                    )}

                    <Link
                        to="/order"
                        className="bg-accent hover:bg-white text-primary px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-glow hover:scale-105 active:scale-95"
                    >
                        Order Online
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden text-white p-2"
                >
                    {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-primary p-8 space-y-6 animate-in slide-in-from-top duration-300 shadow-2xl border-t border-white/5">
                    {navLinks.map((link) => (
                        link.href.startsWith('/#') ? (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-2xl font-black text-white hover:text-accent transition-colors"
                            >
                                {link.name}
                            </a>
                        ) : (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-2xl font-black text-white hover:text-accent transition-colors"
                            >
                                {link.name}
                            </Link>
                        )
                    ))}

                    {/* Mobile auth buttons */}
                    {!isLoggedIn && (
                        <div className="flex gap-3 pt-2 border-t border-white/10">
                            <Link
                                to="/staff"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white p-4 rounded-2xl font-black text-sm"
                            >
                                <LogIn className="w-4 h-4" /> Sign In
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex-1 flex items-center justify-center gap-2 bg-secondary text-white p-4 rounded-2xl font-black text-sm shadow-lg"
                            >
                                <UserPlus className="w-4 h-4" /> Create Account
                            </Link>
                        </div>
                    )}

                    <Link
                        to="/order"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block bg-secondary text-white p-4 rounded-2xl font-black text-center text-xl shadow-lg"
                    >
                        Order Online
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default PublicNavbar;
