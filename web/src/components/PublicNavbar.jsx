import React, { useState, useEffect } from 'react';
import { Menu, X, UserPlus, LogIn, ChevronRight, Star } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const PublicNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Any logged-in user (customer or staff)
    const authUser = (() => {
        try { return JSON.parse(localStorage.getItem('kolay_auth_user')) || null; }
        catch { return null; }
    })();

    // Customer = registered via backend (has accessToken); staff/admin do not
    const isCustomer = !!(authUser?.accessToken && authUser?.username);
    const isLoggedIn = !!(authUser?.username);
    const loggedInUsername = authUser?.username || null;

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'About',        href: '/#about' },
        { name: 'Menu',         href: '/#menu' },
        { name: 'Reservations', href: '/reservations' },
        { name: 'Gallery',      href: '/#gallery' },
        { name: 'Contact',      href: '/#contact' },
        { name: 'Careers',      href: '/careers' },
    ];

    // Smooth-scroll for hash links on the same page
    const handleHashLink = (e, href) => {
        if (href.startsWith('/#')) {
            e.preventDefault();
            setIsMobileMenuOpen(false);
            const id = href.replace('/#', '');
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            else window.location.href = href;
        }
    };

    // Scroll to ratings section (on home page) or navigate home then scroll
    const handleRateUs = (e) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        const scrollToRatings = () => {
            const el = document.getElementById('ratings');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        };
        if (location.pathname === '/') {
            scrollToRatings();
        } else {
            navigate('/');
            setTimeout(scrollToRatings, 300);
        }
    };

    // Logo click — scroll to hero if already on home, else navigate home
    const handleLogoClick = (e) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        if (location.pathname === '/') {
            const el = document.getElementById('home');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            else window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/');
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
        }
    };

    const linkCls = "text-white/75 hover:text-white font-semibold text-[11px] uppercase tracking-widest transition-colors duration-200 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#E67E22] hover:after:w-full after:transition-all after:duration-300 py-1";

    const renderLink = (link, onClick) =>
        link.href.startsWith('/#') ? (
            <a key={link.name} href={link.href} onClick={(e) => { handleHashLink(e, link.href); onClick?.(); }} className={linkCls}>
                {link.name}
            </a>
        ) : (
            <Link key={link.name} to={link.href} onClick={onClick} className={linkCls}>
                {link.name}
            </Link>
        );

    return (
        <nav className={`fixed w-full z-[100] transition-all duration-500 ${
            isScrolled
                ? 'bg-[#1a0e08]/97 backdrop-blur-md shadow-2xl border-b border-white/5'
                : 'bg-gradient-to-b from-black/60 to-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                <div className="flex items-center justify-between h-16 md:h-18 gap-8">

                    {/* ── LEFT: Logo ── */}
                    <a href="/" onClick={handleLogoClick} className="flex items-center gap-3 shrink-0 group cursor-pointer" aria-label="Go to Home">
                        <img
                            src="/Logo.png"
                            alt="Kolay"
                            className="h-10 w-auto rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="text-white font-display font-black text-xl tracking-tight uppercase leading-none hidden sm:block">
                            Kolay
                        </span>
                    </a>

                    {/* ── CENTRE: Nav links ── */}
                    <div className="hidden lg:flex items-center gap-8 flex-1 justify-end pr-10">
                        {navLinks.map(link => renderLink(link))}
                    </div>

                    {/* ── RIGHT: Actions ── */}
                    <div className="hidden md:flex items-center gap-3 shrink-0">
                        {isCustomer ? (
                            /* Customer logged in — show avatar + Rate Us button */
                            <>
                                <div className="flex items-center gap-2 bg-white/8 border border-white/15 rounded-full pl-1.5 pr-4 py-1.5">
                                    <span className="w-7 h-7 bg-[#E67E22] rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0">
                                        {loggedInUsername?.[0]?.toUpperCase() || '?'}
                                    </span>
                                    <span className="text-white/80 text-xs font-bold truncate max-w-[80px]">
                                        {loggedInUsername}
                                    </span>
                                </div>
                                <a
                                    href="#ratings"
                                    onClick={handleRateUs}
                                    className="flex items-center gap-1.5 bg-[#E67E22] hover:bg-[#cf6d17] text-white text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-[#E67E22]/40 hover:shadow-lg active:scale-95 cursor-pointer"
                                >
                                    <Star className="w-3.5 h-3.5" /> Rate Us
                                </a>
                            </>
                        ) : isLoggedIn ? (
                            /* Staff/admin logged in — just show avatar pill */
                            <div className="flex items-center gap-2 bg-white/8 border border-white/15 rounded-full pl-1.5 pr-4 py-1.5">
                                <span className="w-7 h-7 bg-[#E67E22] rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0">
                                    {loggedInUsername?.[0]?.toUpperCase() || '?'}
                                </span>
                                <span className="text-white/80 text-xs font-bold truncate max-w-[80px]">
                                    {loggedInUsername}
                                </span>
                            </div>
                        ) : (
                            /* Not logged in — Sign In + Create Account */
                            <>
                                <Link
                                    to="/customer-login"
                                    className="flex items-center gap-1.5 text-white/75 hover:text-white text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-white/15 hover:border-white/30 hover:bg-white/8 transition-all duration-200"
                                >
                                    <LogIn className="w-3.5 h-3.5" /> Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center gap-1.5 bg-[#E67E22] hover:bg-[#cf6d17] text-white text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-[#E67E22]/40 hover:shadow-lg active:scale-95"
                                >
                                    <UserPlus className="w-3.5 h-3.5" /> Create Account
                                </Link>
                            </>
                        )}
                    </div>

                    {/* ── MOBILE: Hamburger ── */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* ── MOBILE DRAWER ── */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-[#1a0e08]/98 backdrop-blur-md border-t border-white/8 shadow-2xl animate-in slide-in-from-top-2 duration-200">
                    <div className="max-w-7xl mx-auto px-6 py-5 space-y-1">
                        {navLinks.map(link =>
                            link.href.startsWith('/#') ? (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => handleHashLink(e, link.href)}
                                    className="flex items-center justify-between py-3 px-4 rounded-xl text-white/70 hover:text-white hover:bg-white/5 font-semibold text-sm uppercase tracking-widest transition-all"
                                >
                                    {link.name}
                                    <ChevronRight className="w-4 h-4 opacity-30" />
                                </a>
                            ) : (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between py-3 px-4 rounded-xl text-white/70 hover:text-white hover:bg-white/5 font-semibold text-sm uppercase tracking-widest transition-all"
                                >
                                    {link.name}
                                    <ChevronRight className="w-4 h-4 opacity-30" />
                                </Link>
                            )
                        )}

                        {/* Mobile action buttons */}
                        <div className="pt-4 mt-2 border-t border-white/8 space-y-3">
                            {isCustomer ? (
                                <>
                                    <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3">
                                        <span className="w-8 h-8 bg-[#E67E22] rounded-full flex items-center justify-center text-sm font-black text-white shrink-0">
                                            {loggedInUsername?.[0]?.toUpperCase() || '?'}
                                        </span>
                                        <span className="text-white font-bold text-sm">{loggedInUsername}</span>
                                    </div>
                                    <a
                                        href="#ratings"
                                        onClick={handleRateUs}
                                        className="flex items-center justify-center gap-2 bg-[#E67E22] hover:bg-[#cf6d17] text-white font-black text-sm py-3.5 rounded-2xl transition-all shadow-lg w-full"
                                    >
                                        <Star className="w-4 h-4" /> Rate Us
                                    </a>
                                </>
                            ) : isLoggedIn ? (
                                <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3">
                                    <span className="w-8 h-8 bg-[#E67E22] rounded-full flex items-center justify-center text-sm font-black text-white shrink-0">
                                        {loggedInUsername?.[0]?.toUpperCase() || '?'}
                                    </span>
                                    <span className="text-white font-bold text-sm">{loggedInUsername}</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        to="/customer-login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 bg-white/8 hover:bg-white/12 border border-white/15 text-white font-bold text-sm py-3 rounded-2xl transition-all"
                                    >
                                        <LogIn className="w-4 h-4" /> Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 bg-[#E67E22] hover:bg-[#cf6d17] text-white font-bold text-sm py-3 rounded-2xl transition-all shadow-lg"
                                    >
                                        <UserPlus className="w-4 h-4" /> Create Account
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default PublicNavbar;
