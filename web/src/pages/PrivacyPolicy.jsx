import React, { useEffect } from 'react';
import { Shield, Lock, Eye, ArrowLeft, Mail, Database, Server, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function PrivacyPolicy() {
    const { t } = useLanguage();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            icon: Shield,
            title: t('privacy_sec1_title', '1. Introduction & Overview'),
            content: t('privacy_sec1_body', 'Welcome to Kolay Restaurant ("Kolay", "we", "our", or "us"). We respect your privacy and are committed to protecting the personal data of our guests, website visitors, job applicants, and platform users. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, place online orders, make table reservations, apply for career opportunities, or interact with our services.')
        },
        {
            icon: Eye,
            title: t('privacy_sec2_title', '2. Information We Collect'),
            content: t('privacy_sec2_body', 'We collect information that you voluntarily provide to us when using our platform. This includes:'),
            bullets: [
                t('privacy_bullet1', 'Guest Contact Information: Name, phone number, email address, and physical delivery address.'),
                t('privacy_bullet2', 'Order & Dining Preferences: Cart selections, order item notes, delivery vs. takeaway preferences, and specialty discounts.'),
                t('privacy_bullet3', 'Reservation Data: Requested date and time, guest counts, seating preferences, and special dietary requests.'),
                t('privacy_bullet4', 'Career & Job Applicant Data: Resumes, employment history, identification details, and contract renewal forms.'),
                t('privacy_bullet5', 'Technical & Storage Data: Preferred display language, local caching tokens, and device access parameters.')
            ]
        },
        {
            icon: Database,
            title: t('privacy_sec3_title', '3. How We Use Your Information'),
            content: t('privacy_sec3_body', 'We use the collected information for specific, legitimate operational purposes, including:'),
            bullets: [
                t('privacy_use1', 'Processing, fulfilling, and dispatching your food and beverage orders.'),
                t('privacy_use2', 'Managing table reservations and host table assignments.'),
                t('privacy_use3', 'Sending order status notifications and reservation confirmations.'),
                t('privacy_use4', 'Evaluating career applications and managing internal staff records.'),
                t('privacy_use5', 'Storing user language choices for an instant, localized browsing experience.')
            ]
        },
        {
            icon: Server,
            title: t('privacy_sec4_title', '4. Cookies & Browser Local Storage'),
            content: t('privacy_sec4_body', 'Kolay Restaurant utilizes browser Local Storage and minimal session cookies to deliver a fast, responsive user interface. Information stored locally includes your selected language preference (e.g., Swahili, Mandarin, Hindi, Spanish, French, etc.), active order draft, and authentication session tokens. You may clear your browser storage at any time via your browser settings.')
        },
        {
            icon: Lock,
            title: t('privacy_sec5_title', '5. Data Security & Third Parties'),
            content: t('privacy_sec5_body', 'We implement industry-standard administrative and technical security measures to protect your personal data against unauthorized access, disclosure, or alteration. We do NOT sell, rent, or trade personal guest data to third-party marketers. Data is disclosed only to essential service providers (such as backend database APIs and payment processing gateways) strictly for order fulfillment.')
        },
        {
            icon: CheckCircle,
            title: t('privacy_sec6_title', '6. Your Rights & Data Control'),
            content: t('privacy_sec6_body', 'You have the right to access, update, or request the deletion of your personal information stored with Kolay Restaurant. If you have an account, you can update your details directly or contact our support team at info@kolayrestaurant.com to request data removal.')
        }
    ];

    return (
        <div className="min-h-screen bg-[#0D0A07] text-white font-body selection:bg-[#E67E22] selection:text-white flex flex-col">
            <PublicNavbar />

            {/* Hero Header */}
            <section className="pt-36 pb-16 px-6 md:px-12 max-w-5xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-[#E67E22]/15 border border-[#E67E22]/30 px-4 py-2 rounded-full mb-6">
                    <Shield className="w-4 h-4 text-[#E67E22]" />
                    <span className="text-[#E67E22] text-xs font-black uppercase tracking-[0.2em]">
                        {t('privacy_badge', 'Legal & Trust')}
                    </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6 tracking-tight">
                    {t('privacy_title', 'Privacy Policy')}
                </h1>
                <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                    {t('privacy_subtitle', 'Transparency and security are at the heart of the Kolay experience. Learn how we handle and protect your personal information.')}
                </p>
                <div className="mt-6 text-xs font-bold text-white/30 uppercase tracking-widest">
                    {t('privacy_effective', 'Last Updated: September 2026')} • {t('privacy_version', 'Version 2.4')}
                </div>
            </section>

            {/* Main Content */}
            <main className="flex-1 max-w-5xl mx-auto px-6 md:px-12 pb-24 space-y-8 w-full">
                {sections.map((sec, idx) => {
                    const IconComp = sec.icon;
                    return (
                        <div key={idx} className="bg-[#1A1008] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl transition-all hover:border-[#E67E22]/20">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-[#E67E22]/15 border border-[#E67E22]/30 flex items-center justify-center text-[#E67E22]">
                                    <IconComp className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight">
                                    {sec.title}
                                </h2>
                            </div>
                            <p className="text-white/70 text-sm leading-relaxed font-medium mb-4">
                                {sec.content}
                            </p>
                            {sec.bullets && (
                                <ul className="space-y-3 mt-4">
                                    {sec.bullets.map((b, i) => (
                                        <li key={i} className="flex items-start gap-3 text-white/60 text-sm font-medium">
                                            <span className="w-2 h-2 rounded-full bg-[#E67E22] mt-2 shrink-0" />
                                            <span>{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    );
                })}

                {/* Contact Box */}
                <div className="bg-gradient-to-r from-[#E67E22]/20 to-[#1A1008] border border-[#E67E22]/30 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl">
                    <div>
                        <h3 className="text-xl font-display font-bold text-white mb-2">
                            {t('privacy_contact_title', 'Have Questions About Your Privacy?')}
                        </h3>
                        <p className="text-white/60 text-sm font-medium">
                            {t('privacy_contact_sub', 'Reach out to our Data Privacy team anytime for clarification or data requests.')}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
                        <a href="mailto:info@kolayrestaurant.com" className="inline-flex items-center justify-center gap-2 bg-[#E67E22] hover:bg-[#D4A017] text-white px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95">
                            <Mail className="w-4 h-4" /> {t('privacy_email_us', 'Email Privacy Team')}
                        </a>
                        <Link to="/" className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">
                            <ArrowLeft className="w-4 h-4" /> {t('privacy_back_home', 'Back to Home')}
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
