import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function Footer({ variant = 'full' }) {
    const { t } = useLanguage();

    if (variant === 'compact') {
        return (
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
                        <Link to="/careers" className="hover:text-white transition-colors">{t('nav_careers', 'Careers')}</Link>
                        <Link to="/privacy-policy" className="hover:text-white transition-colors">{t('footer_privacy', 'Privacy Policy')}</Link>
                        <Link to="/terms-of-use" className="hover:text-white transition-colors">{t('footer_terms', 'Terms of Use')}</Link>
                        <Link to="/staff" className="hover:text-[#E67E22] transition-colors">{t('footer_staff_portal', 'Staff Portal')}</Link>
                    </div>
                </div>
            </footer>
        );
    }

    return (
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
                            <li><Link to="/privacy-policy" className="hover:text-white transition-colors">{t('footer_privacy', 'Privacy Policy')}</Link></li>
                            <li><Link to="/terms-of-use" className="hover:text-white transition-colors">{t('footer_terms', 'Terms of Use')}</Link></li>
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
                        <Link to="/privacy-policy" className="cursor-pointer hover:text-white/50 transition-colors">{t('footer_privacy', 'Privacy Policy')}</Link>
                        <Link to="/terms-of-use" className="cursor-pointer hover:text-white/50 transition-colors">{t('footer_terms', 'Terms of Use')}</Link>
                        <Link to="/staff" className="cursor-pointer hover:text-[#E67E22] transition-colors">{t('footer_staff_portal', 'Staff Portal')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
