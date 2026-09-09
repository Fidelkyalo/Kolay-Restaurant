import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Utensils, Shield, FileText, X, ExternalLink, ArrowRight, Lock, 
    CheckSquare, Eye, Database, Server, CheckCircle, ShoppingBag, 
    Calendar, UserCheck, ShieldAlert, Award, ChefHat, Sparkles, Wine, Coffee 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function Footer({ variant = 'full' }) {
    const { t } = useLanguage();
    const [activeModal, setActiveModal] = useState(null); // 'privacy' | 'terms' | null

    const privacySections = [
        {
            icon: Shield,
            title: t('privacy_sec1_title', '1. Introduction & Culinary Privacy Commitment'),
            content: t('privacy_sec1_body', 'Welcome to Kolay Restaurant ("Kolay", "we", "our", or "us"). We respect your privacy and are committed to protecting the personal data of our guests, website visitors, job applicants, and platform users. This policy governs all digital interactions across our online ordering platform, reservation systems, and mobile guest services.')
        },
        {
            icon: Eye,
            title: t('privacy_sec2_title', '2. Information We Collect'),
            content: t('privacy_sec2_body', 'We collect personal information voluntarily provided during guest interactions and order placement:'),
            bullets: [
                t('privacy_bullet1', 'Guest Contact Details: Full name, phone number, email address, and physical delivery address.'),
                t('privacy_bullet2', 'Order & Dining Preferences: Cart items, dietary notes, delivery vs. takeaway instructions, and member discounts.'),
                t('privacy_bullet3', 'Table Reservation Details: Party sizes, requested seating times, occasion tags, and seating preferences.'),
                t('privacy_bullet4', 'Career & Employment Submissions: Resumes, work history, credentials, and staff contract renewal applications.'),
                t('privacy_bullet5', 'Preference Storage: Selected display language and active cart state stored locally for effortless browsing.')
            ]
        },
        {
            icon: Database,
            title: t('privacy_sec3_title', '3. Purpose & Use of Data'),
            content: t('privacy_sec3_body', 'Your information is used strictly to deliver an exceptional artisan dining experience:'),
            bullets: [
                t('privacy_use1', 'Preparing, dispatching, and fulfilling your food and beverage orders accurately.'),
                t('privacy_use2', 'Securing table reservations and notifying host staff of special arrival requests.'),
                t('privacy_use3', 'Sending order status updates, digital receipts, and reservation confirmations.'),
                t('privacy_use4', 'Evaluating career submissions and processing employee contract renewals.')
            ]
        },
        {
            icon: Server,
            title: t('privacy_sec4_title', '4. Browser Local Storage & Cookies'),
            content: t('privacy_sec4_body', 'Kolay Restaurant utilizes browser Local Storage and minimal session tokens to ensure instant responsiveness. Data cached includes language selections, draft cart items, and authorization tokens. You can clear local storage anytime in browser settings.')
        },
        {
            icon: Lock,
            title: t('privacy_sec5_title', '5. Data Safeguards & Third-Party Non-Disclosure'),
            content: t('privacy_sec5_body', 'We employ enterprise-grade encryption and administrative safeguards. We NEVER sell, lease, or trade guest personal data to third-party advertisers. Data is shared exclusively with essential infrastructure services (such as cloud backend APIs and secure payment gateways) strictly for service delivery.')
        }
    ];

    const termsSections = [
        {
            icon: FileText,
            title: t('terms_sec1_title', '1. Acceptance of Terms'),
            content: t('terms_sec1_body', 'By accessing or using Kolay Restaurant\'s digital platform, Point of Sale (POS) tools, online ordering, or table reservation engines, you agree to be bound by these Terms of Use and all applicable laws and regulations in Kenya.')
        },
        {
            icon: ShoppingBag,
            title: t('terms_sec2_title', '2. Online Orders, Pricing & Member Discounts'),
            content: t('terms_sec2_body', 'All orders are subject to culinary item availability and chef confirmation. Please review key terms:'),
            bullets: [
                t('terms_bullet1', 'All menu prices are displayed in Kenyan Shillings (KES) and include 16% Value Added Tax (VAT).'),
                t('terms_bullet2', 'Registered Kolay members enjoy 10% discount on seasonal menu specialties.'),
                t('terms_bullet3', 'Payment methods include cash on delivery/collection and supported M-Pesa or card payments.'),
                t('terms_bullet4', 'Order changes cannot be guaranteed once an order enters "Preparing" status on our Kitchen Display System (KDS).')
            ]
        },
        {
            icon: Calendar,
            title: t('terms_sec3_title', '3. Table Reservations & 15-Min Grace Period'),
            content: t('terms_sec3_body', 'Table reservations booked via our platform are held for a maximum grace period of 15 minutes past the scheduled arrival time. If running late, please notify our reception team. Cancellations should be submitted at least 1 hour in advance via the "My Bookings" portal.')
        },
        {
            icon: UserCheck,
            title: t('terms_sec4_title', '4. Portal Access & Account Confidentiality'),
            content: t('terms_sec4_body', 'Users are responsible for safeguarding their login credentials. The Kolay Staff Portal, Kitchen Display System (KDS), POS engine, and Admin Console are strictly restricted to authorized Kolay personnel.')
        },
        {
            icon: Award,
            title: t('terms_sec5_title', '5. Career Applications & Staff Contract Renewals'),
            content: t('terms_sec5_body', 'Applicants submitting employment applications or staff contract renewal forms certify that all submitted credentials, work experience records, and personal representations are accurate and authentic.')
        },
        {
            icon: ShieldAlert,
            title: t('terms_sec6_title', '6. Intellectual Property & Governing Law'),
            content: t('terms_sec6_body', 'All branding, logos, culinary menus, photography, UI design, and underlying software are the proprietary intellectual property of Kolay Restaurant. These terms are governed by the laws of Kenya.')
        }
    ];

    const renderModal = () => {
        if (!activeModal) return null;
        const isPrivacy = activeModal === 'privacy';
        const modalTitle = isPrivacy ? t('footer_privacy', 'Privacy Policy') : t('footer_terms', 'Terms of Use');
        const badgeLabel = isPrivacy ? 'KOLAY PRIVACY EXTENSION' : 'KOLAY TERMS EXTENSION';
        const modalSections = isPrivacy ? privacySections : termsSections;
        const fullLink = isPrivacy ? '/privacy-policy' : '/terms-of-use';
        const IconComponent = isPrivacy ? Shield : CheckSquare;

        return (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-[#090604]/85 backdrop-blur-xl transition-all"
                    onClick={() => setActiveModal(null)}
                />

                {/* Modal Container */}
                <div className="relative bg-gradient-to-b from-[#1F140A] to-[#120B05] border border-[#E67E22]/30 rounded-[2.5rem] w-full max-w-2xl max-h-[85vh] flex flex-col shadow-[0_0_80px_rgba(230,126,34,0.2)] overflow-hidden animate-in zoom-in-95 duration-300">
                    
                    {/* Header */}
                    <div className="p-6 sm:p-8 border-b border-white/10 flex justify-between items-center bg-[#140D06] relative">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E67E22] to-[#B8860B] p-0.5 shadow-lg shadow-[#E67E22]/20">
                                <div className="w-full h-full bg-[#1A1008] rounded-[0.9rem] flex items-center justify-center text-[#E67E22]">
                                    <IconComponent className="w-6 h-6 animate-pulse" />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E67E22] bg-[#E67E22]/10 border border-[#E67E22]/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                        <Utensils className="w-2.5 h-2.5" /> {badgeLabel}
                                    </span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-display font-black text-white">{modalTitle}</h3>
                                <p className="text-white/40 text-xs font-medium">Kolay Restaurant • {t('privacy_effective', 'Effective September 2026')}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setActiveModal(null)}
                            className="p-3 bg-white/5 hover:bg-[#E67E22] rounded-2xl text-white/50 hover:text-white transition-all duration-200 hover:rotate-90"
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Scrollable Body */}
                    <div className="p-6 sm:p-8 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
                        {modalSections.map((sec, idx) => {
                            const SecIcon = sec.icon;
                            return (
                                <div 
                                    key={idx} 
                                    className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-[#E67E22]/30 rounded-2xl p-5 sm:p-6 space-y-3 transition-all duration-300 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-[#E67E22]/15 border border-[#E67E22]/30 flex items-center justify-center text-[#E67E22] group-hover:scale-110 transition-transform">
                                            <SecIcon className="w-4 h-4" />
                                        </div>
                                        <h4 className="font-bold text-white text-base tracking-tight">{sec.title}</h4>
                                    </div>
                                    <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-medium pl-11">
                                        {sec.content}
                                    </p>
                                    {sec.bullets && (
                                        <ul className="space-y-2.5 pt-2 pl-11">
                                            {sec.bullets.map((b, i) => (
                                                <li key={i} className="flex items-start gap-2.5 text-white/60 text-xs font-medium">
                                                    <Sparkles className="w-3.5 h-3.5 text-[#E67E22] shrink-0 mt-0.5" />
                                                    <span>{b}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-white/10 bg-[#140D06] flex flex-col sm:flex-row justify-between items-center gap-3">
                        <Link
                            to={fullLink}
                            onClick={() => { setActiveModal(null); window.scrollTo(0, 0); }}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#E67E22] to-[#D4A017] hover:from-[#cf6d17] hover:to-[#b58810] text-white px-7 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-[#E67E22]/30 hover:scale-[1.02] active:scale-95"
                        >
                            <ChefHat className="w-4 h-4" /> {t('modal_open_full', 'Open Full Page')} <ExternalLink className="w-4 h-4 ml-1" />
                        </Link>
                        <button
                            onClick={() => setActiveModal(null)}
                            className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all"
                        >
                            {t('modal_close', 'Close Extension')}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (variant === 'compact') {
        return (
            <>
                <footer className="w-full bg-[#090604] border-t border-white/5 py-6 px-6 mt-auto">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-white/40 font-bold tracking-wider">
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#E67E22] to-[#B8860B] flex items-center justify-center shadow-md shadow-[#E67E22]/30 hover:rotate-12 transition-transform">
                                <Utensils className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white font-black tracking-widest text-xs">KOLAY</span>
                            <span>© 2026 Kolay Restaurant. {t('footer_copyright', 'All rights reserved.')}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-5">
                            <LanguageSelector variant="dark" />
                            <Link to="/" className="hover:text-white transition-colors">{t('nav_home', 'Home')}</Link>
                            <Link to="/order" className="hover:text-white transition-colors">{t('nav_menu', 'Menu')}</Link>
                            <Link to="/reservations" className="hover:text-white transition-colors">{t('nav_reservations', 'Reservations')}</Link>
                            <button 
                                onClick={() => setActiveModal('privacy')} 
                                className="hover:text-[#E67E22] transition-colors cursor-pointer flex items-center gap-1 group"
                            >
                                <Shield className="w-3 h-3 text-[#E67E22]/60 group-hover:text-[#E67E22]" />
                                {t('footer_privacy', 'Privacy Policy')}
                            </button>
                            <button 
                                onClick={() => setActiveModal('terms')} 
                                className="hover:text-[#E67E22] transition-colors cursor-pointer flex items-center gap-1 group"
                            >
                                <FileText className="w-3 h-3 text-[#E67E22]/60 group-hover:text-[#E67E22]" />
                                {t('footer_terms', 'Terms of Use')}
                            </button>
                            <Link to="/staff" className="hover:text-[#E67E22] transition-colors">{t('footer_staff_portal', 'Staff Portal')}</Link>
                        </div>
                    </div>
                </footer>
                {renderModal()}
            </>
        );
    }

    return (
        <>
            <footer className="w-full bg-gradient-to-b from-[#0F0B07] to-[#070503] border-t border-white/5 text-white pt-16 pb-8 px-6 mt-auto relative">
                {/* Subtle Background Glow & Floating Culinary Motif Icons */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E67E22]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#B8860B]/5 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto space-y-12 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        {/* Brand */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 group">
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E67E22] to-[#B8860B] flex items-center justify-center shadow-lg shadow-[#E67E22]/25 group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
                                    <Utensils className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <span className="text-xl font-display font-black text-white tracking-wider block leading-none">KOLAY</span>
                                    <span className="text-[9px] text-[#E67E22] font-black uppercase tracking-[0.2em]">Fine Culinary & Dining</span>
                                </div>
                            </div>
                            <p className="text-white/50 text-xs leading-relaxed font-medium">
                                {t('footer_tagline', 'Artisan culinary experiences crafted for those who appreciate the finer things in life. Exquisite dining, online orders, and table reservations.')}
                            </p>
                            <div className="pt-2 flex items-center gap-2 text-white/30 text-xs font-semibold">
                                <Wine className="w-3.5 h-3.5 text-[#E67E22]" />
                                <span>Fine Wines & Gourmet Specialties</span>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-4">
                            <h4 className="text-white font-black text-xs uppercase tracking-[0.25em] flex items-center gap-2">
                                <ChefHat className="w-3.5 h-3.5 text-[#E67E22]" />
                                {t('footer_navigate', 'NAVIGATE')}
                            </h4>
                            <ul className="space-y-2.5 text-xs text-white/50 font-medium">
                                <li>
                                    <Link to="/" className="hover:text-white hover:translate-x-1 inline-block transition-all">{t('nav_home', 'Home')}</Link>
                                </li>
                                <li>
                                    <Link to="/order" className="hover:text-white hover:translate-x-1 inline-block transition-all">{t('nav_menu', 'Menu')}</Link>
                                </li>
                                <li>
                                    <Link to="/reservations" className="hover:text-white hover:translate-x-1 inline-block transition-all">{t('nav_reservations', 'Reservations')}</Link>
                                </li>
                                <li>
                                    <Link to="/specialties" className="hover:text-white hover:translate-x-1 inline-block transition-all">{t('nav_specialties', 'Specialties')}</Link>
                                </li>
                                <li>
                                    <Link to="/careers" className="hover:text-white hover:translate-x-1 inline-block transition-all">{t('nav_careers', 'Careers')}</Link>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => setActiveModal('privacy')} 
                                        className="hover:text-[#E67E22] hover:translate-x-1 transition-all text-left flex items-center gap-1.5 group cursor-pointer"
                                    >
                                        <Shield className="w-3.5 h-3.5 text-[#E67E22]/60 group-hover:text-[#E67E22] transition-colors" />
                                        <span>{t('footer_privacy', 'Privacy Policy')}</span>
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => setActiveModal('terms')} 
                                        className="hover:text-[#E67E22] hover:translate-x-1 transition-all text-left flex items-center gap-1.5 group cursor-pointer"
                                    >
                                        <FileText className="w-3.5 h-3.5 text-[#E67E22]/60 group-hover:text-[#E67E22] transition-colors" />
                                        <span>{t('footer_terms', 'Terms of Use')}</span>
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Contact & Hours */}
                        <div className="space-y-4">
                            <h4 className="text-white font-black text-xs uppercase tracking-[0.25em] flex items-center gap-2">
                                <Coffee className="w-3.5 h-3.5 text-[#E67E22]" />
                                {t('footer_hours', 'HOURS & CONTACT')}
                            </h4>
                            <ul className="space-y-2.5 text-xs text-white/50 font-medium">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" /> Nairobi, Kenya
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" /> +254 102 039 121
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" /> info@kolayrestaurant.com
                                </li>
                                <li className="pt-1 text-[#E67E22] font-bold flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>{t('footer_every_day', 'Every Day')}: {t('footer_open_247', 'Open 24/7 Hospitality')}</span>
                                </li>
                            </ul>
                        </div>

                        {/* Language & Preferences */}
                        <div className="space-y-4">
                            <h4 className="text-white font-black text-xs uppercase tracking-[0.25em]">{t('footer_language', 'Language')} / Preferences</h4>
                            <p className="text-white/40 text-xs">Select your preferred language for the Kolay experience:</p>
                            <LanguageSelector variant="dark" />
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-white/30 font-black uppercase tracking-widest">
                        <p>© 2026 Kolay Restaurant. {t('footer_copyright', 'All rights reserved.')}</p>
                        <div className="flex flex-wrap items-center gap-6">
                            <button 
                                onClick={() => setActiveModal('privacy')} 
                                className="cursor-pointer hover:text-[#E67E22] transition-all flex items-center gap-1.5 py-1 px-2.5 rounded-xl hover:bg-white/5"
                            >
                                <Shield className="w-3.5 h-3.5 text-[#E67E22]" />
                                <span>{t('footer_privacy', 'Privacy Policy')}</span>
                            </button>
                            <button 
                                onClick={() => setActiveModal('terms')} 
                                className="cursor-pointer hover:text-[#E67E22] transition-all flex items-center gap-1.5 py-1 px-2.5 rounded-xl hover:bg-white/5"
                            >
                                <FileText className="w-3.5 h-3.5 text-[#E67E22]" />
                                <span>{t('footer_terms', 'Terms of Use')}</span>
                            </button>
                            <Link 
                                to="/staff" 
                                className="cursor-pointer hover:text-[#E67E22] transition-all py-1 px-2.5 rounded-xl hover:bg-white/5"
                            >
                                {t('footer_staff_portal', 'Staff Portal')}
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
            {renderModal()}
        </>
    );
}
