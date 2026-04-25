import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, Users, Shield, Database, Trash2, Home } from 'lucide-react';
import Navbar from '../components/Navbar';

function AdminPanel() {
    const navigate = useNavigate();

    const handleClearArchive = () => {
        if (window.confirm('DANGER: This will permanently delete all historical data. Proceed?')) {
            localStorage.removeItem('kolay_archive');
            alert('Archive cleared successfully.');
        }
    };

    return (
        <div className="min-h-screen bg-bg-cream text-charcoal font-body">
            {/* nav */}
            <Navbar />

            <main className="max-w-6xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* System Overview */}
                    <div className="col-span-2 space-y-8">
                        <section className="bg-white p-8 rounded-3xl border border-primary/5 shadow-premium">
                            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                                <Settings className="text-secondary" /> System Settings
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-bg-cream rounded-2xl border border-primary/5">
                                    <div>
                                        <h3 className="font-bold">Restaurant Name</h3>
                                        <p className="text-sm text-charcoal/60">Kolay Restaurant</p>
                                    </div>
                                    <button className="text-secondary font-bold text-sm">Update</button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-bg-cream rounded-2xl border border-primary/5">
                                    <div>
                                        <h3 className="font-bold">Currency Setting</h3>
                                        <p className="text-sm text-charcoal/60">Kenya Shillings (KES)</p>
                                    </div>
                                    <button className="text-secondary font-bold text-sm">Update</button>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white p-8 rounded-3xl border border-primary/5 shadow-premium">
                            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                                <Users className="text-secondary" /> User Management
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-primary/5">
                                            <th className="py-4 text-xs uppercase text-charcoal/40">User</th>
                                            <th className="py-4 text-xs uppercase text-charcoal/40">Role</th>
                                            <th className="py-4 text-xs uppercase text-charcoal/40">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-primary/5">
                                            <td className="py-4 font-bold">Fidel Kyalo</td>
                                            <td className="py-4"><span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px] font-black">SUPER ADMIN</span></td>
                                            <td className="py-4 text-secondary text-sm font-bold cursor-pointer">Edit</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    {/* Security & Maintenance */}
                    <div className="space-y-8">
                        <section className="bg-primary text-white p-8 rounded-3xl shadow-glow">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <Shield className="text-accent" /> Maintenance
                            </h2>
                            <div className="space-y-4">
                                <button
                                    onClick={handleClearArchive}
                                    className="w-full flex items-center justify-between bg-white/10 hover:bg-red-500/20 p-4 rounded-2xl border border-white/5 transition-all text-left"
                                >
                                    <div>
                                        <h3 className="font-bold text-sm">Clear History Archive</h3>
                                        <p className="text-[10px] text-white/50">Permanently delete all sales records</p>
                                    </div>
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                                <button className="w-full flex items-center justify-between bg-white/10 p-4 rounded-2xl border border-white/5 text-left opacity-50 cursor-not-allowed">
                                    <div>
                                        <h3 className="font-bold text-sm">System Update</h3>
                                        <p className="text-[10px] text-white/50">Latest version installed (v2.4.1)</p>
                                    </div>
                                    <Database className="w-4 h-4 text-accent" />
                                </button>
                            </div>
                        </section>

                        <div className="bg-secondary p-8 rounded-3xl text-white">
                            <h3 className="font-black text-xs uppercase tracking-widest mb-2">Pro Tip</h3>
                            <p className="text-sm opacity-90 leading-relaxed font-medium"> Regularly export your data for off-site backup. Secure archives are the backbone of smart business intelligence.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminPanel;
