import React, { useState, useEffect } from 'react';
import { Menu, X, Utensils, Calendar, MapPin, Phone, Camera, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Menu', href: '#menu' },
        { name: 'Reservations', href: '#reservations' },
        { name: 'Gallery', href: '#gallery' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav className={`fixed w-full z-[100] transition-all duration-500 ${isScrolled ? 'bg-primary/95 backdrop-blur-md py-4 shadow-2xl' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                    <img src="/Logo.png" alt="Kolay Logo" className="h-10 w-auto rounded group-hover:rotate-12 transition-transform duration-300 shadow-glow" />
                    <span className="text-white text-2xl font-display font-black tracking-tighter uppercase">Kolay</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-white/80 hover:text-accent font-black text-[10px] uppercase tracking-widest transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-accent hover:after:w-full after:transition-all after:duration-300"
                        >
                            {link.name}
                        </a>
                    ))}
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
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-2xl font-black text-white hover:text-accent transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
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
