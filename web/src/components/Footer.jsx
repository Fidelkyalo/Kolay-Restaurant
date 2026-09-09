import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Shield, FileText, X, ExternalLink, ArrowRight, Lock, CheckSquare, Eye, Database, Server, CheckCircle, ShoppingBag, Calendar, UserCheck, ShieldAlert, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function Footer({ variant = 'full' }) {
    const { t } = useLanguage();
    const [activeModal, setActiveModal] = useState(null); // 'privacy' | 'terms' | null

    const privacySections = [
        {
            icon: Shield,
            title: t('privacy_sec1_title', '1. Introduction & Overview'),
            content: t('privacy_sec1_body', 'Welcome to Kolay Restaurant ("Kolay", "we", "our", or "us"). We respect your privacy and are committed to protecting the personal data of our guests, website visitors, job applicants, and platform users.')
        },
        {
            icon: Eye,
            title: t('privacy_sec2_title', '2. Information We Collect'),
            content: t('privacy_sec2_body', 'We collect information that you voluntarily provide when using our platform:'),
            bullets: [
                t('privacy_bullet1', 'Guest Contact Information: Name, phone number, email address, and physical delivery address.'),
                t('privacy_bullet2', 'Order & Dining Preferences: Cart selections, order item notes, delivery vs. takeaway preferences, and specialty discounts.'),
                t('privacy_bullet3', 'Reservation Data: Requested date and time, guest counts, seating preferences, and special dietary requests.'),
                t('privacy_bullet4', 'Career & Job Applicant Data: Resumes, employment history, identification details, and contract renewal forms.')
            ]
        },
        {
            icon: Database,
            title: t('privacy_sec3_title', '3. How We Use Your Information'),
            content: t('privacy_sec3_body', 'We use collected information for processing orders, fulfilling table reservations, notifying order statuses, and evaluating career applications.')
        },
        {
            icon: Server,
            title: t('privacy_sec4_title', '4. Cookies & Browser Local Storage'),
            content: t('privacy_sec4_body', 'Kolay Restaurant utilizes browser Local Storage to deliver a fast, responsive user interface (language choices, active order draft, and authentication session tokens).')
        },
        {
            icon: Lock,
            title: t('privacy_sec5_title', '5. Data Security & Third Parties'),
            content: t('privacy_sec5_body', 'We implement industry-standard security measures. We do NOT sell, rent, or trade personal guest data to third-party marketers.')
        }
    ];

    const termsSections = [
        {
            icon: FileText,
            title: t('terms_sec1_title', '1. Acceptance of Terms'),
            content: t('terms_sec1_body', 'By accessing or using the website, Point of Sale (POS) portal, online ordering engine, or table reservation services operated by Kolay Restaurant, you agree to be bound by these Terms of Use.')
        },
        {
            icon: ShoppingBag,
            title: t('terms_sec2_title', '2. Online Orders & Pricing Policy'),
            content: t('terms_sec2_body', 'All orders placed through Kolay Restaurant are subject to item availability. Prices are listed in KES and include 16% VAT. Registered members receive 10% off seasonal specialties.')
        },
        {
            icon: Calendar,
            title: t('terms_sec3_title', '3. Table Reservations & Cancellation Policy'),
            content: t('terms_sec3_body', 'Table reservations are held for a maximum grace period of 15 minutes beyond the scheduled reservation time. Cancellations should be made at least 1 hour prior.')
        },
        {
            icon: UserCheck,
            title: t('terms_sec4_title', '4. User Accounts & Portal Security'),
            content: t('terms_sec4_body', 'Users are responsible for maintaining the confidentiality of their credentials. Staff and Admin portals are strictly reserved for authorized Kolay personnel.')
        },
        {
            icon: Award,
            title: t('terms_sec5_title', '5. Career Applications'),
            content: t('terms_sec5_body', 'Applicants submitting job applications or contract renewals certify that all provided qualifications and work experience details are truthful and accurate.')
        }
    ];

    const renderModal = () => {
        if (!activeModal) return null;
        const isPrivacy = activeModal === 'privacy';
        const modalTitle = isPrivacy ? t('footer_privacy', 'Privacy Policy') : t('footer_terms', 'Terms of Use');
        const modalSections = isPrivacy ? privacySections : termsSections;
        const fullLink = isPrivacy ? '/privacy-policy' : '/terms-of-use';
        const IconComponent = isPrivacy ? Shield : CheckSquare;

        return (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-[#0D0A07]/80 backdrop-blur-md"
                    onClick={() => setActiveModal(null)}
                />

                {/* Modal Container */}
                <div className="relative bg-[#1A1008] border border-white/10 rounded-[2.5rem] w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                    {/* Header */}
                    <div className="p-6 sm:p-8 border-b border-white/5 flex justify-between items-center bg-[#140D06]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#E67E22]/15 border border-[#E67E22]/30 flex items-center justify-center text-[#E67E22]">
                                <IconComponent className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-2xl font-display font-black text-white">{modalTitle}</h3>
                                <p className="text-white/40 text-xs font-medium">Kolay Restaurant • {t('privacy_effective', 'September 2026')}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setActiveModal(null)}
                            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl text-white/50 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Scrollable Body */}
                    <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                        {modalSections.map((sec, idx) => {
                            const SecIcon = sec.icon;
                            return (
                                <div key={idx} className="bg-white/3 border border-white/5 rounded-2xl p-5 sm:p-6 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <SecIcon className="w-4 h-4 text-[#E67E22] shrink-0" />
                                        <h4 className="font-bold text-white text-base">{sec.title}</h4>
                                    </div>
                                    <p className="text-white/60 text-xs sm:text-sm leading-relaxed font-medium">
                                        {sec.content}
                                    </p>
                                    {sec.bullets && (
                                        <ul className="space-y-2 pt-1">
                                            {sec.bullets.map((b, i) => (
                                                <li key={i} className="flex items-start gap-2 text-white/50 text-xs">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22] mt-1.5 shrink-0" />
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
                    <div className="p-6 border-t border-white/5 bg-[#140D06] flex flex-col sm:flex-row justify-between items-center gap-3">
                        <Link
                            to={fullLink}
                            onClick={() => { setActiveModal(null); window.scrollTo(0, 0); }}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E67E22] hover:bg-[#D4A017] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95"
                        >
                            {t('modal_open_full', 'Open Full Page')} <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={() => setActiveModal(null)}
                            className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-colors"
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
                <footer className="w-full bg-[#0A0704] border-t border-white/5 py-4 px-6 mt-auto">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-white/30 font-bold tracking-wider">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-[#E67E22] flex items-center justify-center">
                                <Utensils className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-white font-black tracking-widest text-xs">KOLAY</span>
                            <span>© 2026 Kolay Restaurant. {t('footer_copyright', 'All rights reserved.')}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <LanguageSelector variant="dark" />
                            <Link to="/" className="hover:text-white transition-colors">{t('nav_home', 'Home')}</Link>
                            <Link to="/order" className="hover:text-white transition-colors">{t('nav_menu', 'Menu')}</Link>
                            <Link to="/reservations" className="hover:text-white transition-colors">{t('nav_reservations', 'Reservations')}</Link>
                            <button onClick={() => setActiveModal('privacy')} className="hover:text-white transition-colors">{t('footer_privacy', 'Privacy Policy')}</button>
                            <button onClick={() => setActiveModal('terms')} className="hover:text-white transition-colors">{t('footer_terms', 'Terms of Use')}</button>
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
            <footer className="w-full bg-[#0A0704] border-t border-white/5 text-white pt-16 pb-8 px-6 mt-auto">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        {/* Brand */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-[#E67E22] flex items-center justify-center shadow-lg shadow-[#E67E22]/30">
                                    <Utensils className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-display font-black text-white tracking-wider">KOLAY</span>
                            </div>
                            <p className="text-white/40 text-xs leading-relaxed font-medium">
                                {t('footer_tagline', 'Artisan culinary experiences crafted for those who appreciate the finer things in life.')}
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-4">
                            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">{t('footer_navigate', 'NAVIGATE')}</h4>
                            <ul className="space-y-2.5 text-xs text-white/40 font-medium">
                                <li><Link to="/" className="hover:text-white transition-colors">{t('nav_home', 'Home')}</Link></li>
                                <li><Link to="/order" className="hover:text-white transition-colors">{t('nav_menu', 'Menu')}</Link></li>
                                <li><Link to="/reservations" className="hover:text-white transition-colors">{t('nav_reservations', 'Reservations')}</Link></li>
                                <li><Link to="/specialties" className="hover:text-white transition-colors">{t('nav_specialties', 'Specialties')}</Link></li>
                                <li><Link to="/careers" className="hover:text-white transition-colors">{t('nav_careers', 'Careers')}</Link></li>
                                <li><button onClick={() => setActiveModal('privacy')} className="hover:text-white transition-colors text-left">{t('footer_privacy', 'Privacy Policy')}</button></li>
                                <li><button onClick={() => setActiveModal('terms')} className="hover:text-white transition-colors text-left">{t('footer_terms', 'Terms of Use')}</button></li>
                            </ul>
                        </div>

                        {/* Contact & Hours */}
                        <div className="space-y-4">
                            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">{t('footer_hours', 'HOURS')}</h4>
                            <ul className="space-y-2.5 text-xs text-white/40 font-medium">
                                <li>Nairobi, Kenya</li>
                                <li>+254 102 039 121</li>
                                <li>info@kolayrestaurant.com</li>
                                <li>{t('footer_every_day', 'Every Day')}: {t('footer_open_247', 'Open 24/7')}</li>
                            </ul>
                        </div>

                        {/* Language & Preferences */}
                        <div className="space-y-4">
                            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">{t('footer_language', 'Language')} / Preferences</h4>
                            <p className="text-white/40 text-xs">Select your preferred language for the Kolay experience:</p>
                            <LanguageSelector variant="dark" />
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-white/20 font-black uppercase tracking-widest">
                        <p>© 2026 Kolay Restaurant. {t('footer_copyright', 'All rights reserved.')}</p>
                        <div className="flex flex-wrap items-center gap-6">
                            <button onClick={() => setActiveModal('privacy')} className="cursor-pointer hover:text-white/50 transition-colors">{t('footer_privacy', 'Privacy Policy')}</button>
                            <button onClick={() => setActiveModal('terms')} className="cursor-pointer hover:text-white/50 transition-colors">{t('footer_terms', 'Terms of Use')}</button>
                            <Link to="/staff" className="cursor-pointer hover:text-[#E67E22] transition-colors">{t('footer_staff_portal', 'Staff Portal')}</Link>
                        </div>
                    </div>
                </div>
            </footer>
            {renderModal()}
        </>
    );
}
