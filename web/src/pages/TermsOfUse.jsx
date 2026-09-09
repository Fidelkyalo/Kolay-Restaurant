import React, { useEffect } from 'react';
import { FileText, CheckSquare, ShoppingBag, Calendar, UserCheck, ShieldAlert, Award, ArrowLeft, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function TermsOfUse() {
    const { t } = useLanguage();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            icon: FileText,
            title: t('terms_sec1_title', '1. Acceptance of Terms'),
            content: t('terms_sec1_body', 'By accessing or using the website, Point of Sale (POS) portal, online ordering engine, or table reservation services operated by Kolay Restaurant ("Kolay", "we", "our"), you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.')
        },
        {
            icon: ShoppingBag,
            title: t('terms_sec2_title', '2. Online Orders & Pricing Policy'),
            content: t('terms_sec2_body', 'All orders placed through Kolay Restaurant are subject to acceptance and item availability. Please note:'),
            bullets: [
                t('terms_bullet1', 'All prices are listed in Kenyan Shillings (KES) and include applicable taxes (16% VAT) unless explicitly stated otherwise.'),
                t('terms_bullet2', 'Registered Kolay account members are entitled to exclusive seasonal discounts (e.g., 10% off member specialties).'),
                t('terms_bullet3', 'Payment Options: Payments may be completed upon delivery or collection via cash or supported electronic options.'),
                t('terms_bullet4', 'Order Modifications: Once an order status is marked as "PREPARING" or sent to the kitchen display, modifications may be limited.')
            ]
        },
        {
            icon: Calendar,
            title: t('terms_sec3_title', '3. Table Reservations & Cancellation Policy'),
            content: t('terms_sec3_body', 'Table reservations booked through our platform are held for a maximum grace period of 15 minutes beyond the scheduled reservation time. If your party is delayed, please notify the restaurant team directly. Cancellations should be submitted through the "My Bookings" portal at least 1 hour prior to the reservation time.')
        },
        {
            icon: UserCheck,
            title: t('terms_sec4_title', '4. User Accounts & Portal Security'),
            content: t('terms_sec4_body', 'You are responsible for maintaining the confidentiality of your account credentials (whether guest account or staff portal access). You agree to accept responsibility for all activities that occur under your account. Staff and Admin portals are strictly reserved for authorized Kolay personnel.')
        },
        {
            icon: Award,
            title: t('terms_sec5_title', '5. Career Applications & Renewal Requests'),
            content: t('terms_sec5_body', 'Applicants submitting job applications or employee contract renewal requests via our Careers portal certify that all provided information, qualification details, and work experience representations are truthful, complete, and accurate.')
        },
        {
            icon: ShieldAlert,
            title: t('terms_sec6_title', '6. Intellectual Property & Governing Law'),
            content: t('terms_sec6_body', 'All content on this website—including logos, trademarks, menu designs, graphics, code, and text—is the exclusive intellectual property of Kolay Restaurant. These terms are governed by and construed in accordance with the laws of Kenya.')
        }
    ];

    return (
        <div className="min-h-screen bg-[#0D0A07] text-white font-body selection:bg-[#E67E22] selection:text-white flex flex-col">
            <PublicNavbar />

            {/* Hero Header */}
            <section className="pt-36 pb-16 px-6 md:px-12 max-w-5xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-[#E67E22]/15 border border-[#E67E22]/30 px-4 py-2 rounded-full mb-6">
                    <CheckSquare className="w-4 h-4 text-[#E67E22]" />
                    <span className="text-[#E67E22] text-xs font-black uppercase tracking-[0.2em]">
                        {t('terms_badge', 'Terms & Conditions')}
                    </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6 tracking-tight">
                    {t('terms_title', 'Terms of Use')}
                </h1>
                <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                    {t('terms_subtitle', 'Please review the rules and guidelines that govern your use of Kolay Restaurant ordering, reservations, and digital services.')}
                </p>
                <div className="mt-6 text-xs font-bold text-white/30 uppercase tracking-widest">
                    {t('terms_effective', 'Last Updated: September 2026')} • {t('terms_version', 'Version 2.4')}
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
                            {t('terms_contact_title', 'Questions Regarding Our Terms?')}
                        </h3>
                        <p className="text-white/60 text-sm font-medium">
                            {t('terms_contact_sub', 'If you have questions about our dining or service terms, contact our management team.')}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
                        <a href="mailto:info@kolayrestaurant.com" className="inline-flex items-center justify-center gap-2 bg-[#E67E22] hover:bg-[#D4A017] text-white px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95">
                            <Mail className="w-4 h-4" /> {t('terms_contact_btn', 'Contact Support')}
                        </a>
                        <Link to="/" className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">
                            <ArrowLeft className="w-4 h-4" /> {t('terms_back_home', 'Back to Home')}
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
