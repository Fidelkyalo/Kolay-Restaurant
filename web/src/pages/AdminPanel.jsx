import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, Users, Shield, Database, Trash2, Home } from 'lucide-react';
import Navbar from '../components/Navbar';

function AdminPanel() {
    const navigate = useNavigate();

    // State for System Settings
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('kolay_settings');
        return saved ? JSON.parse(saved) : {
            restaurantName: 'Kolay Restaurant',
            currency: 'Kenya Shillings (KES)',
            taxRate: 16,
            isTaxInclusive: true
        };
    });

    // State for User Management
    const [users, setUsers] = useState(() => {
        const saved = localStorage.getItem('kolay_users');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Fidel Kyalo', role: 'SUPER ADMIN' }
        ];
    });

    // Editing State
    const [editConfig, setEditConfig] = useState(null); // { type: 'NAME' | 'CURRENCY' | 'USER', id?: number, value: string, role?: string }

    const handleClearArchive = () => {
        if (window.confirm('DANGER: This will permanently delete all historical data. Proceed?')) {
            localStorage.removeItem('kolay_archive');
            alert('Archive cleared successfully.');
        }
    };

    const handleSave = () => {
        if (!editConfig) return;

        if (editConfig.type === 'NAME') {
            const updated = { ...settings, restaurantName: editConfig.value };
            setSettings(updated);
            localStorage.setItem('kolay_settings', JSON.stringify(updated));
            // Dispatch event to notify Navbar and other components
            window.dispatchEvent(new Event('storage'));
        } else if (editConfig.type === 'CURRENCY') {
            const updated = { ...settings, currency: editConfig.value };
            setSettings(updated);
            localStorage.setItem('kolay_settings', JSON.stringify(updated));
        } else if (editConfig.type === 'TAX_RATE') {
            const updated = { ...settings, taxRate: parseFloat(editConfig.value) };
            setSettings(updated);
            localStorage.setItem('kolay_settings', JSON.stringify(updated));
        } else if (editConfig.type === 'TAX_MODE') {
            const updated = { ...settings, isTaxInclusive: editConfig.value === 'INCLUSIVE' };
            setSettings(updated);
            localStorage.setItem('kolay_settings', JSON.stringify(updated));
        } else if (editConfig.type === 'USER') {
            const updatedUsers = users.map(u =>
                u.id === editConfig.id ? { ...u, name: editConfig.value, role: editConfig.role } : u
            );
            setUsers(updatedUsers);
            localStorage.setItem('kolay_users', JSON.stringify(updatedUsers));
        }

        setEditConfig(null);
    };

    const handleLogout = () => {
        navigate('/login');
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
                                        <p className="text-sm text-charcoal/60">{settings.restaurantName}</p>
                                    </div>
                                    <button
                                        onClick={() => setEditConfig({ type: 'NAME', value: settings.restaurantName })}
                                        className="text-secondary font-bold text-sm hover:underline"
                                    >
                                        Update
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-bg-cream rounded-2xl border border-primary/5">
                                    <div>
                                        <h3 className="font-bold">Currency Setting</h3>
                                        <p className="text-sm text-charcoal/60">{settings.currency}</p>
                                    </div>
                                    <button
                                        onClick={() => setEditConfig({ type: 'CURRENCY', value: settings.currency })}
                                        className="text-secondary font-bold text-sm hover:underline"
                                    >
                                        Update
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-bg-cream rounded-2xl border border-primary/5">
                                    <div>
                                        <h3 className="font-bold">Tax Configuration</h3>
                                        <p className="text-sm text-charcoal/60">{settings.taxRate}% - {settings.isTaxInclusive ? 'Inclusive' : 'Exclusive'}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setEditConfig({ type: 'TAX_RATE', value: settings.taxRate })}
                                            className="text-secondary font-bold text-sm hover:underline"
                                        >
                                            Rate
                                        </button>
                                        <button
                                            onClick={() => setEditConfig({ type: 'TAX_MODE', value: settings.isTaxInclusive ? 'INCLUSIVE' : 'EXCLUSIVE' })}
                                            className="text-secondary font-bold text-sm hover:underline"
                                        >
                                            Toggle Mode
                                        </button>
                                    </div>
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
                                        {users.map(user => (
                                            <tr key={user.id} className="border-b border-primary/5 hover:bg-bg-cream/30 transition-colors">
                                                <td className="py-4 font-bold">{user.name}</td>
                                                <td className="py-4">
                                                    <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="py-4">
                                                    <button
                                                        onClick={() => setEditConfig({ type: 'USER', id: user.id, value: user.name, role: user.role })}
                                                        className="text-secondary text-sm font-bold hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
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

                {/* Edit Modal */}
                {editConfig && (
                    <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-8 animate-in zoom-in duration-200">
                            <h3 className="text-2xl font-bold text-primary mb-6">
                                {editConfig.type === 'USER' ? 'Edit User Profile' : 'Update Setting'}
                            </h3>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">
                                        {editConfig.type === 'NAME' ? 'Restaurant Name' : editConfig.type === 'CURRENCY' ? 'Currency' : 'Full Name'}
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full bg-bg-cream border border-primary/5 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-bold"
                                        value={editConfig.value}
                                        onChange={(e) => setEditConfig({ ...editConfig, value: e.target.value })}
                                    />
                                </div>

                                {editConfig.type === 'USER' && (
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">System Role</label>
                                        <select
                                            className="w-full bg-bg-cream border border-primary/5 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-bold appearance-none"
                                            value={editConfig.role}
                                            onChange={(e) => setEditConfig({ ...editConfig, role: e.target.value })}
                                        >
                                            <option>SUPER ADMIN</option>
                                            <option>ADMIN</option>
                                            <option>MANAGER</option>
                                            <option>STAFF</option>
                                        </select>
                                    </div>
                                )}

                                {editConfig.type === 'TAX_MODE' && (
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Pricing Strategy</label>
                                        <select
                                            className="w-full bg-bg-cream border border-primary/5 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-bold appearance-none"
                                            value={editConfig.value}
                                            onChange={(e) => setEditConfig({ ...editConfig, value: e.target.value })}
                                        >
                                            <option value="INCLUSIVE">Tax Inclusive (Prices include VAT)</option>
                                            <option value="EXCLUSIVE">Tax Exclusive (VAT added at checkout)</option>
                                        </select>
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => setEditConfig(null)}
                                        className="flex-1 py-3 font-bold text-charcoal/40 hover:text-primary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 bg-secondary text-white font-bold py-3 rounded-xl shadow-lg hover:bg-orange-600 transition-all active:scale-95"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminPanel;
