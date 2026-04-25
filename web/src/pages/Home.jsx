import React, { useState } from 'react';
import { Utensils, Star, Clock, MapPin, Phone, Camera, MessageCircle, Send, ArrowRight, Calendar, ChevronDown, Check } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import { Link } from 'react-router-dom';

const Home = () => {
    const [reservationSuccess, setReservationSuccess] = useState(false);

    const featuredMeals = [
        { id: 1, name: 'Gourmet Beef Burger', price: 1200, desc: 'Aged wagyu beef, truffle aioli, melted brie.', image: '/assets/burger.png' },
        { id: 2, name: 'Herb-Crusted Salmon', price: 2100, desc: 'Fresh Atlantic salmon with seasonal vegetables.', image: '/assets/salmon.png' },
        { id: 3, name: 'Signature Steak', price: 3500, desc: 'Prime ribeye with garlic herb butter.', image: '/assets/steak.png' }
    ];

    const menuCategories = [
        {
            name: 'Starters',
            items: [
                { name: 'Bruschetta', price: 650, desc: 'Fresh tomatoes, garlic, basil on toasted bread.' },
                { name: 'Calamari', price: 850, desc: 'Crispy fried with spicy marinara.' }
            ]
        },
        {
            name: 'Mains',
            items: [
                { name: 'Pasta Carbonara', price: 1100, desc: 'Classic Roman style with pancetta.' },
                { name: 'Roasted Chicken', price: 1600, desc: 'Half chicken with lemon and thyme.' }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-bg-cream font-body selection:bg-secondary selection:text-white">
            <PublicNavbar />

            {/* HERO SECTION */}
            <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-primary/60 z-10" />
                    <img
                        src="/assets/hero.png"
                        alt="Hero Background"
                        className="w-full h-full object-cover scale-105 animate-[slowZoom_20s_infinite]"
                    />
                </div>

                <div className="relative z-20 text-center max-w-4xl px-6">
                    <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <span className="inline-block bg-accent/20 backdrop-blur-md text-accent px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-6 border border-accent/30 shadow-glow">
                            Fine Dining Experience
                        </span>
                        <h1 className="text-6xl md:text-8xl font-display font-black text-white leading-tight mb-8 drop-shadow-2xl">
                            Authentic Flavors,<br />
                            <span className="text-secondary italic">Modern Dining</span>
                        </h1>
                        <p className="text-xl text-white/80 font-medium max-w-2xl mx-auto mb-12 drop-shadow-lg">
                            Experience the perfect blend of traditional recipes and contemporary culinary artistry in the heart of the city.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link
                                to="/order"
                                className="group bg-secondary hover:bg-white text-white hover:text-primary px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-glow flex items-center justify-center gap-3"
                            >
                                Order Now <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </Link>
                            <a
                                href="#reservations"
                                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest transition-all text-center"
                            >
                                Book a Table
                            </a>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce cursor-pointer">
                    <ChevronDown className="text-white w-8 h-8 opacity-50" />
                </div>
            </section>

            {/* SPECIALS SECTION */}
            <section id="specials" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-xs font-black text-secondary uppercase tracking-[0.5em] mb-4">Chef's Selection</h2>
                    <h3 className="text-4xl md:text-5xl font-display font-black text-primary leading-tight">Current Specials</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {featuredMeals.map((meal) => (
                        <div key={meal.id} className="group relative bg-white rounded-[3rem] overflow-hidden shadow-premium hover:shadow-glow transition-all duration-500 hover:-translate-y-4">
                            <div className="h-80 overflow-hidden">
                                <img src={meal.image} alt={meal.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            </div>
                            <div className="p-10">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-2xl font-black text-primary group-hover:text-secondary transition-colors">{meal.name}</h4>
                                    <span className="text-xl font-black text-secondary">KES {meal.price}</span>
                                </div>
                                <p className="text-charcoal/60 leading-relaxed mb-8">{meal.desc}</p>
                                <div className="flex items-center gap-1 text-accent">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ABOUT SECTION */}
            <section id="about" className="py-32 bg-primary relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/10 skew-x-[-15deg] translate-x-20" />
                <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
                    <div className="relative">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
                        <img
                            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800"
                            alt="Chef"
                            className="rounded-[3rem] shadow-glow relative z-10"
                        />
                        <div className="absolute -bottom-10 -right-10 bg-white p-10 rounded-[2.5rem] shadow-premium z-20 animate-bounce">
                            <p className="text-5xl font-black text-secondary mb-1">15+</p>
                            <p className="text-xs font-black text-primary uppercase tracking-widest">Years of Craft</p>
                        </div>
                    </div>

                    <div className="text-white space-y-8">
                        <h2 className="text-xs font-black text-accent uppercase tracking-[0.5em]">The Kolay Story</h2>
                        <h3 className="text-4xl md:text-6xl font-display font-black leading-tight">Elevating Every<br /> Single Dish.</h3>
                        <p className="text-lg text-white/70 leading-relaxed">
                            Founded on the principle of accessibility and quality, Kolay began as a small vision to bring premium dining to everyone. Our mission is to create moments that matter through tastes that trigger memories.
                        </p>
                        <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/10">
                            <div>
                                <h4 className="font-black text-accent uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                                    <Check className="w-4 h-4" /> Fresh Ingredients
                                </h4>
                                <p className="text-sm text-white/50">Daily organic farm sourcing.</p>
                            </div>
                            <div>
                                <h4 className="font-black text-accent uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                                    <Check className="w-4 h-4" /> Global Flavors
                                </h4>
                                <p className="text-sm text-white/50">Curated world-class recipes.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MENU SECTION */}
            <section id="menu" className="py-32 bg-bg-cream">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-xs font-black text-secondary uppercase tracking-[0.5em] mb-4">Our Menu</h2>
                        <h3 className="text-4xl md:text-5xl font-display font-black text-primary">Explore Categories</h3>
                    </div>

                    <div className="space-y-20">
                        {menuCategories.map((cat) => (
                            <div key={cat.name}>
                                <h4 className="text-2xl font-black text-secondary mb-10 flex items-center gap-4">
                                    <span className="h-1 flex-1 bg-cream rounded-full" />
                                    {cat.name}
                                    <span className="h-1 flex-1 bg-cream rounded-full" />
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
                                    {cat.items.map((item) => (
                                        <div key={item.name} className="flex justify-between items-start group cursor-pointer">
                                            <div className="flex-1">
                                                <h5 className="font-bold text-lg text-primary group-hover:text-secondary transition-colors mb-2">{item.name}</h5>
                                                <p className="text-sm text-charcoal/40 pr-10">{item.desc}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-black text-primary">KES {item.price}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* RESERVATIONS SECTION */}
            <section id="reservations" className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-xs font-black text-secondary uppercase tracking-[0.5em] mb-4">Reservations</h2>
                        <h3 className="text-4xl md:text-6xl font-display font-black text-primary leading-tight mb-8">Secure Your Table For The Evening.</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-6 p-6 bg-bg-cream rounded-3xl border border-cream transition-all hover:bg-white hover:shadow-premium">
                                <div className="bg-secondary p-4 rounded-2xl text-white shadow-glow">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-charcoal/40 uppercase tracking-widest mb-1">Call for support</p>
                                    <p className="text-xl font-bold text-primary">+254 700 000 000</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 p-6 bg-bg-cream rounded-3xl border border-cream transition-all hover:bg-white hover:shadow-premium">
                                <div className="bg-primary p-4 rounded-2xl text-white shadow-glow">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-charcoal/40 uppercase tracking-widest mb-1">Our Location</p>
                                    <p className="text-xl font-bold text-primary">Greenfield Plaza, Nairobi</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-bg-cream p-12 rounded-[3rem] shadow-premium border border-cream">
                        {reservationSuccess ? (
                            <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                                <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-glow">
                                    <Check className="w-10 h-10" />
                                </div>
                                <h4 className="text-3xl font-black text-primary mb-4">Request Sent!</h4>
                                <p className="text-charcoal/60 mb-10">Our host will call you within 15 minutes to confirm your table.</p>
                                <button
                                    onClick={() => setReservationSuccess(false)}
                                    className="text-secondary font-black text-sm uppercase tracking-widest hover:underline"
                                >
                                    Make another booking
                                </button>
                            </div>
                        ) : (
                            <form
                                className="space-y-6"
                                onSubmit={(e) => { e.preventDefault(); setReservationSuccess(true); }}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input required placeholder="Name" className="w-full bg-white border border-cream p-4 rounded-2xl outline-none focus:ring-2 focus:ring-secondary/20 font-bold" />
                                    <input required type="tel" placeholder="Phone" className="w-full bg-white border border-cream p-4 rounded-2xl outline-none focus:ring-2 focus:ring-secondary/20 font-bold" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input required type="date" className="w-full bg-white border border-cream p-4 rounded-2xl outline-none focus:ring-2 focus:ring-secondary/20 font-bold" />
                                    <select className="w-full bg-white border border-cream p-4 rounded-2xl outline-none focus:ring-2 focus:ring-secondary/20 font-bold">
                                        <option>2 People</option>
                                        <option>4 People</option>
                                        <option>6+ People</option>
                                    </select>
                                </div>
                                <textarea placeholder="Special Requests..." className="w-full h-32 bg-white border border-cream p-4 rounded-2xl outline-none focus:ring-2 focus:ring-secondary/20 font-bold resize-none" />
                                <button className="w-full bg-primary hover:bg-secondary text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95 text-xl tracking-widest uppercase">
                                    Check Availability
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* GALLERY SECTION */}
            <section id="gallery" className="py-32 bg-bg-cream overflow-hidden">
                <div className="px-6 mb-20 text-center">
                    <h2 className="text-xs font-black text-secondary uppercase tracking-[0.5em] mb-4">Glimpse</h2>
                    <h3 className="text-4xl md:text-5xl font-display font-black text-primary">Ambience & Craft</h3>
                </div>
                <div className="flex gap-8 px-6 animate-[scroll_40s_linear_infinite] w-[200%]">
                    {[1, 2, 3, 4, 1, 2, 3, 4].map((i, idx) => (
                        <div key={idx} className="w-[400px] h-[500px] shrink-0 rounded-[3rem] overflow-hidden shadow-premium group relative">
                            <img
                                src={`https://images.unsplash.com/photo-${[
                                    '1517248135467-4c7edcad34c4',
                                    '1559339352-11d035aa65de',
                                    '1550966841-aee8cb1b54ed',
                                    '1424847651672-bf20a4b0982b'
                                ][i - 1]}?auto=format&fit=crop&q=80&w=600`}
                                alt="Gallery"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                            />
                            <Camera className="text-white w-12 h-12" />
                        </div>
                    ))}
                </div>
            </section>

            {/* CONTACT / FOOTER */}
            <footer id="contact" className="bg-primary pt-32 pb-12 px-6 md:px-12 text-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <Utensils className="text-secondary w-8 h-8" />
                            <span className="text-3xl font-display font-black tracking-tighter uppercase italic text-accent">KOLAY</span>
                        </div>
                        <p className="text-white/50 leading-relaxed font-medium">
                            Bringing artisan culinary experiences to your soul. Join us for a feast of the senses.
                        </p>
                        <div className="flex gap-6">
                            <button className="bg-white/5 hover:bg-accent hover:text-primary p-3 rounded-xl transition-all"><Camera className="w-5 h-5" /></button>
                            <button className="bg-white/5 hover:bg-accent hover:text-primary p-3 rounded-xl transition-all"><MessageCircle className="w-5 h-5" /></button>
                            <button className="bg-white/5 hover:bg-accent hover:text-primary p-3 rounded-xl transition-all"><Send className="w-5 h-5" /></button>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h4 className="text-xs font-black text-accent uppercase tracking-[0.3em]">Quick Links</h4>
                        <ul className="space-y-4">
                            {['Home', 'About', 'Menu', 'Gallery', 'Reservations'].map(l => (
                                <li key={l}>
                                    <a href={`#${l.toLowerCase()}`} className="text-white/60 hover:text-white transition-colors">{l}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-8">
                        <h4 className="text-xs font-black text-accent uppercase tracking-[0.3em]">Opening Hours</h4>
                        <ul className="space-y-4 text-white/60">
                            <li className="flex justify-between"><span>Mon - Thu</span> <span className="font-bold text-white">10am - 10pm</span></li>
                            <li className="flex justify-between"><span>Fri - Sat</span> <span className="font-bold text-white">10am - 12pm</span></li>
                            <li className="flex justify-between"><span>Sunday</span> <span className="font-bold text-white">Closed</span></li>
                        </ul>
                    </div>

                    <div className="space-y-8 font-black">
                        <h4 className="text-xs font-black text-accent uppercase tracking-[0.3em]">Newsletter</h4>
                        <p className="text-white/50 text-sm">Join for exclusive offers and events.</p>
                        <div className="relative">
                            <input placeholder="Email..." className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none" />
                            <button className="absolute right-2 top-2 bottom-2 bg-secondary text-white px-4 rounded-xl shadow-lg font-black text-[10px] uppercase">Join</button>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 h-px w-full mb-12" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/30 font-black tracking-widest uppercase">
                    <p>&copy; 2026 Kolay Restaurant. Handcrafted with passion.</p>
                    <div className="flex gap-10">
                        <span className="cursor-pointer hover:text-white">Privacy Policy</span>
                        <span className="cursor-pointer hover:text-white">Terms of Use</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
