import React, { useState } from 'react';
import { Calendar, Clock, Users, MessageSquare, Phone, Mail, User, CheckCircle2, ArrowRight } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import { ReservationService } from '../services/api';

const Reservations = () => {
    const [formData, setFormData] = useState({
        guestName: '',
        email: '',
        phone: '',
        reservationDate: '',
        reservationTime: '',
        numberOfGuests: 2,
        specialRequests: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await ReservationService.create(formData);
            setShowSuccess(true);
            setFormData({
                guestName: '',
                email: '',
                phone: '',
                reservationDate: '',
                reservationTime: '',
                numberOfGuests: 2,
                specialRequests: ''
            });
            setTimeout(() => setShowSuccess(false), 5000);
        } catch (error) {
            console.error("Booking failed:", error);
            alert("Booking failed. Please try again later.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-cream font-body pt-0">
            <PublicNavbar />

            {/* Hero Section */}
            <div className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-primary/40 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2070"
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Restaurant Interior"
                />
                <div className="relative z-20 text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-4 drop-shadow-lg">
                        RESERVE A TABLE
                    </h1>
                    <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow">
                        Join us for an unforgettable dining experience.
                        Secure your spot today.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-16 -mt-20 relative z-30">
                <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-primary/5">
                    <div className="grid md:grid-cols-5">
                        {/* Info Sidebar */}
                        <div className="md:col-span-2 bg-primary p-8 md:p-12 text-white">
                            <h2 className="text-2xl font-display font-bold mb-8">Booking Info</h2>
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-3 rounded-xl">
                                        <Clock className="w-6 h-6 text-secondary" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm uppercase tracking-widest text-white/50 mb-1">Hours</p>
                                        <p className="text-white/90">Mon - Sun: 8:00 AM - 11:00 PM</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-3 rounded-xl">
                                        <Phone className="w-6 h-6 text-secondary" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm uppercase tracking-widest text-white/50 mb-1">Call Us</p>
                                        <p className="text-white/90">+254 102 039 121</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-3 rounded-xl">
                                        <Mail className="w-6 h-6 text-secondary" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm uppercase tracking-widest text-white/50 mb-1">Email</p>
                                        <p className="text-white/90">reservations@kolay.com</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 p-6 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-sm italic text-white/70">
                                    "For large parties (8+ guests), please contact us directly via phone to ensure optimal seating arrangements."
                                </p>
                            </div>
                        </div>

                        {/* Booking Form */}
                        <div className="md:col-span-3 p-8 md:p-12 bg-white">
                            {showSuccess ? (
                                <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-display font-bold text-primary mb-2">Booking Confirmed!</h3>
                                    <p className="text-charcoal/60 mb-8 lowercase">We've received your request and look forward to seeing you soon.</p>
                                    <button
                                        onClick={() => setShowSuccess(false)}
                                        className="text-secondary font-bold flex items-center gap-2 hover:gap-3 transition-all"
                                    >
                                        Make another booking <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6 lowercase">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-primary/40 uppercase tracking-widest flex items-center gap-2">
                                                <User className="w-3 h-3" /> Full Name
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. John Doe"
                                                className="w-full px-5 py-4 bg-bg-cream/50 border border-primary/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-bold"
                                                value={formData.guestName}
                                                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-primary/40 uppercase tracking-widest flex items-center gap-2">
                                                    <Mail className="w-3 h-3" /> Email
                                                </label>
                                                <input
                                                    required
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    className="w-full px-5 py-4 bg-bg-cream/50 border border-primary/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-bold"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-primary/40 uppercase tracking-widest flex items-center gap-2">
                                                    <Phone className="w-3 h-3" /> Phone
                                                </label>
                                                <input
                                                    required
                                                    type="tel"
                                                    placeholder="+254..."
                                                    className="w-full px-5 py-4 bg-bg-cream/50 border border-primary/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-bold"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="col-span-1 space-y-2">
                                                <label className="text-xs font-black text-primary/40 uppercase tracking-widest flex items-center gap-2">
                                                    <Calendar className="w-3 h-3" /> Date
                                                </label>
                                                <input
                                                    required
                                                    type="date"
                                                    className="w-full px-4 py-4 bg-bg-cream/50 border border-primary/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-bold"
                                                    value={formData.reservationDate}
                                                    onChange={(e) => setFormData({ ...formData, reservationDate: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-span-1 space-y-2">
                                                <label className="text-xs font-black text-primary/40 uppercase tracking-widest flex items-center gap-2">
                                                    <Clock className="w-3 h-3" /> Time
                                                </label>
                                                <input
                                                    required
                                                    type="time"
                                                    className="w-full px-4 py-4 bg-bg-cream/50 border border-primary/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-bold"
                                                    value={formData.reservationTime}
                                                    onChange={(e) => setFormData({ ...formData, reservationTime: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-span-1 space-y-2">
                                                <label className="text-xs font-black text-primary/40 uppercase tracking-widest flex items-center gap-2">
                                                    <Users className="w-3 h-3" /> Guests
                                                </label>
                                                <select
                                                    className="w-full px-4 py-4 bg-bg-cream/50 border border-primary/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-bold appearance-none"
                                                    value={formData.numberOfGuests}
                                                    onChange={(e) => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) })}
                                                >
                                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                                        <option key={n} value={n}>{n} Persons</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-primary/40 uppercase tracking-widest flex items-center gap-2">
                                                <MessageSquare className="w-3 h-3" /> Special Requests
                                            </label>
                                            <textarea
                                                rows="3"
                                                placeholder="Any allergies or seat preferences?"
                                                className="w-full px-5 py-4 bg-bg-cream/50 border border-primary/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-bold resize-none"
                                                value={formData.specialRequests}
                                                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                                            ></textarea>
                                        </div>
                                    </div>

                                    <button
                                        disabled={submitting}
                                        className="w-full bg-secondary text-white py-5 rounded-2xl font-black uppercase text-sm tracking-widest shadow-lg hover:bg-secondary-dark hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
                                    >
                                        {submitting ? 'Confirming...' : 'Confirm Reservation'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reservations;
