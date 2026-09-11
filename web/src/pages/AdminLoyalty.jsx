import React, { useState, useEffect, useRef } from 'react';
import {
    Zap, Users, TrendingUp, Gift, Search, RefreshCw,
    Crown, Award, ChevronDown, ChevronUp, Download, ArrowUpCircle, ArrowDownCircle, History
} from 'lucide-react';
import JsBarcode from 'jsbarcode';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import {
    getAllLoyalty, getLoyaltyRecord, awardPoints, getTier, TIERS, ptsToKES, REDEEM,
    seedWelcomePtsToAllMembers
} from '../utils/loyaltyUtils';

// ── merge loyalty store with kolay_members for full name display ──────────────
function getMergedMembers() {
    const loyaltyAll = getAllLoyalty();                       // [{ username, balance, lifetime, history, tier }]
    const members = (() => {
        try { return JSON.parse(localStorage.getItem('kolay_members') || '[]'); } catch { return []; }
    })();

    // Build a map username → member record
    const memberMap = {};
    members.forEach(m => { if (m.username) memberMap[m.username.toLowerCase()] = m; });

    // Merge: loyalty entries first, then add any members that have no loyalty record
    const merged = loyaltyAll.map(l => ({
        ...l,
        fullName:  memberMap[l.username]?.fullName  || '',
        email:     memberMap[l.username]?.email     || '',
        phone:     memberMap[l.username]?.phone     || '',
        dateJoined: memberMap[l.username]?.dateJoined || '',
        avatarColor: memberMap[l.username]?.avatarColor || 'bg-[#E67E22]',
    }));

    // Also include members who haven't earned any points yet
    members.forEach(m => {
        if (!m.username) return;
        const key = m.username.toLowerCase();
        if (!merged.find(x => x.username === key)) {
            const rec = getLoyaltyRecord(m.username);
            merged.push({
                username:   m.username,
                balance:    rec.balance,
                lifetime:   rec.lifetime,
                history:    rec.history,
                tier:       getTier(rec.lifetime),
                fullName:   m.fullName  || '',
                email:      m.email     || '',
                phone:      m.phone     || '',
                dateJoined: m.dateJoined || '',
                avatarColor: m.avatarColor || 'bg-[#E67E22]',
            });
        }
    });

    return merged.sort((a, b) => b.balance - a.balance);
}

// ── Mini barcode per member using JsBarcode ──────────────────────────────────
function MiniBarcode({ username, size = 80 }) {
    const ref = useRef(null);
    useEffect(() => {
        if (!ref.current || !username) return;
        const value = `KOLAY-${username.toUpperCase().replace(/[^A-Z0-9]/g, '')}-000000`;
        try {
            JsBarcode(ref.current, value, {
                format:       'CODE128',
                width:         1.2,
                height:        size * 0.6,
                displayValue:  false,
                background:    '#ffffff',
                lineColor:     '#1a1a1a',
                margin:        4,
            });
        } catch { /* silent */ }
    }, [username]);
    return <canvas ref={ref} className="rounded" />;
}

export default function AdminLoyalty() {
    const { t } = useLanguage();
    const [members, setMembers] = useState([]);
    const [search, setSearch] = useState('');
    const [tierFilter, setTierFilter] = useState('ALL');
    const [expandedUser, setExpandedUser] = useState(null);
    const [grantUser, setGrantUser] = useState(null);   // username for manual grant modal
    const [grantPts, setGrantPts]   = useState(50);
    const [grantReason, setGrantReason] = useState('');
    const [grantMsg, setGrantMsg] = useState(null);

    const load = () => setMembers(getMergedMembers());

    useEffect(() => {
        seedWelcomePtsToAllMembers(); // give 100 pts to any member who doesn't have them yet
        load();
        window.addEventListener('storage', load);
        return () => window.removeEventListener('storage', load);
    }, []);

    const filtered = members.filter(m => {
        const q = search.toLowerCase();
        const matchSearch = !q || m.username.includes(q) || m.fullName.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
        const matchTier = tierFilter === 'ALL' || m.tier.name === tierFilter;
        return matchSearch && matchTier;
    });

    // Summary stats
    const totalPts   = members.reduce((s, m) => s + m.balance, 0);
    const totalRedeemable = ptsToKES(totalPts);
    const vipCount   = members.filter(m => m.tier.name === 'VIP Platinum').length;
    const goldCount  = members.filter(m => m.tier.name === 'Gold Member').length;

    const handleGrant = () => {
        if (!grantUser || grantPts < 1 || !grantReason.trim()) return;
        awardPoints(grantUser, grantPts, `Admin: ${grantReason.trim()}`);
        load();
        setGrantMsg({ ok: true, text: `✓ Granted ${grantPts} pts to ${grantUser}` });
        setTimeout(() => { setGrantMsg(null); setGrantUser(null); setGrantPts(50); setGrantReason(''); }, 3000);
    };

    const exportCSV = () => {
        const rows = [['Username','Full Name','Email','Balance (pts)','Lifetime (pts)','Tier','Worth (KES)']];
        members.forEach(m => rows.push([m.username, m.fullName, m.email, m.balance, m.lifetime, m.tier.name, ptsToKES(m.balance)]));
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'kolay_loyalty_points.csv'; a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-bg-cream font-body">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

                {/* ── Header ── */}
                <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                    <div>
                        <p className="text-secondary text-[10px] font-black uppercase tracking-[0.4em] mb-1">Admin Portal</p>
                        <h1 className="text-3xl md:text-4xl font-display font-black text-primary flex items-center gap-3">
                            <Zap className="w-8 h-8 text-secondary fill-secondary" /> Loyalty Points
                        </h1>
                        <p className="text-charcoal/40 text-sm mt-1 italic">Deliciously Earned</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={load}
                            className="flex items-center gap-2 border border-primary/20 text-primary hover:bg-primary hover:text-white font-black text-xs uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all">
                            <RefreshCw className="w-3.5 h-3.5" /> Refresh
                        </button>
                        <button onClick={exportCSV}
                            className="flex items-center gap-2 bg-secondary hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all shadow-md">
                            <Download className="w-3.5 h-3.5" /> Export CSV
                        </button>
                    </div>
                </div>

                {/* ── Stats ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Members',    value: members.length,                icon: <Users className="w-5 h-5" />,   color: 'text-primary' },
                        { label: 'Points in Circulation', value: totalPts.toLocaleString(), icon: <Zap className="w-5 h-5" />,     color: 'text-secondary' },
                        { label: 'Redeemable Value', value: `KES ${totalRedeemable.toLocaleString()}`, icon: <Gift className="w-5 h-5" />, color: 'text-green-600' },
                        { label: 'VIP / Gold',       value: `${vipCount} / ${goldCount}`,  icon: <Crown className="w-5 h-5" />,   color: 'text-amber-500' },
                    ].map(s => (
                        <div key={s.label} className="bg-white border border-cream rounded-2xl p-5 shadow-sm">
                            <span className={s.color}>{s.icon}</span>
                            <p className="text-primary font-black text-2xl mt-2">{s.value}</p>
                            <p className="text-charcoal/40 text-[10px] font-black uppercase tracking-widest mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* ── Tier breakdown ── */}
                <div className="bg-white border border-cream rounded-2xl p-5 mb-8 shadow-sm">
                    <p className="text-[10px] font-black uppercase text-charcoal/40 tracking-widest mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-secondary" /> Tier Breakdown
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {TIERS.map(tier => {
                            const count = members.filter(m => m.tier.name === tier.name).length;
                            const pct = members.length ? Math.round((count / members.length) * 100) : 0;
                            return (
                                <div key={tier.name}
                                    onClick={() => setTierFilter(tierFilter === tier.name ? 'ALL' : tier.name)}
                                    className={`cursor-pointer rounded-xl p-4 border transition-all ${tierFilter === tier.name ? 'border-secondary bg-secondary/5' : 'border-cream hover:border-secondary/30'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xl">{tier.icon}</span>
                                        <span className="text-xs font-black text-charcoal/40">{pct}%</span>
                                    </div>
                                    <p className="font-black text-primary text-sm">{tier.name}</p>
                                    <p className="text-charcoal/40 text-xs">{count} member{count !== 1 ? 's' : ''}</p>
                                    <div className="h-1.5 bg-cream rounded-full mt-2 overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: tier.color }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Search + filter ── */}
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                    <div className="relative flex-1 min-w-48">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
                        <input
                            type="text"
                            placeholder="Search by username, name or email…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-cream rounded-xl text-sm font-semibold outline-none focus:border-secondary transition-all"
                        />
                    </div>
                    {tierFilter !== 'ALL' && (
                        <button onClick={() => setTierFilter('ALL')}
                            className="flex items-center gap-1.5 bg-secondary/10 border border-secondary/30 text-secondary font-black text-xs uppercase tracking-widest px-3 py-2.5 rounded-xl">
                            {TIERS.find(t => t.name === tierFilter)?.icon} {tierFilter} ✕
                        </button>
                    )}
                    <p className="text-charcoal/40 text-xs font-semibold">{filtered.length} member{filtered.length !== 1 ? 's' : ''}</p>
                </div>

                {/* ── Members table ── */}
                {filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <Zap className="w-10 h-10 text-charcoal/15 mx-auto mb-3" />
                        <p className="text-charcoal/30 font-black uppercase tracking-widest text-sm">No members found</p>
                        <p className="text-charcoal/20 text-xs mt-1">Members appear here after they register or earn points.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map(m => {
                            const isExp = expandedUser === m.username;
                            return (
                                <div key={m.username} className="bg-white border border-cream rounded-2xl shadow-sm overflow-hidden">
                                    {/* Row */}
                                    <div className="flex items-center gap-4 p-5 cursor-pointer hover:bg-bg-cream/40 transition-colors"
                                        onClick={() => setExpandedUser(isExp ? null : m.username)}>
                                        {/* Avatar */}
                                        <div className={`w-10 h-10 ${m.avatarColor || 'bg-secondary'} rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0`}>
                                            {m.username[0].toUpperCase()}
                                        </div>
                                        {/* Name + email */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-primary font-black text-sm">{m.fullName || m.username}</p>
                                            <p className="text-charcoal/40 text-xs truncate">{m.email || `@${m.username}`}</p>
                                        </div>
                                        {/* Points */}
                                        <div className="text-right shrink-0">
                                            <p className="text-secondary font-black text-lg flex items-center gap-1 justify-end">
                                                <Zap className="w-4 h-4 fill-secondary" /> {m.balance.toLocaleString()}
                                            </p>
                                            <p className="text-charcoal/30 text-[10px]">KES {ptsToKES(m.balance)} redeemable</p>
                                        </div>
                                        {/* Tier badge */}
                                        <div className="hidden sm:block shrink-0 text-center w-24">
                                            <span className="text-lg">{m.tier.icon}</span>
                                            <p className="text-[10px] font-black text-charcoal/50">{m.tier.name}</p>
                                        </div>
                                        {/* Expand */}
                                        {isExp ? <ChevronUp className="w-4 h-4 text-charcoal/30 shrink-0" /> : <ChevronDown className="w-4 h-4 text-charcoal/30 shrink-0" />}
                                    </div>

                                    {/* Expanded detail */}
                                    {isExp && (
                                        <div className="border-t border-cream px-5 pb-5 pt-4 grid md:grid-cols-2 gap-6">
                                            {/* QR + card info */}
                                            <div className="flex items-start gap-4">
                                                <MiniBarcode username={m.username} size={80} />
                                                <div className="space-y-1.5 text-xs">
                                                    <div className="flex gap-2"><span className="text-charcoal/40 font-semibold w-20">Username</span><span className="font-black text-primary">{m.username}</span></div>
                                                    <div className="flex gap-2"><span className="text-charcoal/40 font-semibold w-20">Balance</span><span className="font-black text-secondary">{m.balance.toLocaleString()} pts</span></div>
                                                    <div className="flex gap-2"><span className="text-charcoal/40 font-semibold w-20">Lifetime</span><span className="font-bold text-charcoal/70">{m.lifetime.toLocaleString()} pts</span></div>
                                                    <div className="flex gap-2"><span className="text-charcoal/40 font-semibold w-20">Tier</span><span className="font-black">{m.tier.icon} {m.tier.name}</span></div>
                                                    <div className="flex gap-2"><span className="text-charcoal/40 font-semibold w-20">Worth</span><span className="font-bold text-green-600">KES {ptsToKES(m.balance)}</span></div>
                                                    {m.dateJoined && <div className="flex gap-2"><span className="text-charcoal/40 font-semibold w-20">Joined</span><span className="font-semibold text-charcoal/60">{m.dateJoined}</span></div>}
                                                </div>
                                            </div>

                                            {/* History + grant */}
                                            <div>
                                                {/* Manual grant button */}
                                                <button
                                                    onClick={() => { setGrantUser(m.username); setGrantMsg(null); }}
                                                    className="w-full mb-4 flex items-center justify-center gap-2 bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 text-secondary font-black text-xs uppercase tracking-widest py-2.5 rounded-xl transition-all"
                                                >
                                                    <Award className="w-3.5 h-3.5" /> Grant Points Manually
                                                </button>

                                                {/* Recent history */}
                                                {m.history.length > 0 ? (
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase text-charcoal/30 tracking-widest mb-2 flex items-center gap-1.5">
                                                            <History className="w-3.5 h-3.5" /> Recent History
                                                        </p>
                                                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                                                            {m.history.slice(0, 8).map((evt, i) => (
                                                                <div key={i} className="flex items-center gap-2 py-1.5 border-b border-cream last:border-0">
                                                                    {evt.type === 'earn'
                                                                        ? <ArrowDownCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                                                        : <ArrowUpCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                                                                    }
                                                                    <span className="text-charcoal/60 text-[11px] flex-1 truncate">{evt.reason}</span>
                                                                    <span className={`font-black text-xs shrink-0 ${evt.pts > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                                        {evt.pts > 0 ? '+' : ''}{evt.pts}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-charcoal/25 text-xs italic">No points history yet.</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Manual Grant Modal ── */}
            {grantUser && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setGrantUser(null)} />
                    <div className="relative bg-white rounded-[2rem] border border-cream shadow-2xl w-full max-w-sm p-8 animate-in zoom-in duration-200">
                        <h3 className="text-xl font-black text-primary mb-1 flex items-center gap-2">
                            <Award className="w-5 h-5 text-secondary" /> Grant Points
                        </h3>
                        <p className="text-charcoal/40 text-xs mb-6">Manually awarding to <strong className="text-secondary">{grantUser}</strong></p>

                        {grantMsg && (
                            <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm font-bold rounded-xl">
                                {grantMsg.text}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-charcoal/50 mb-1.5 block">Points to award</label>
                                <div className="flex items-center gap-2 border border-cream rounded-xl px-4 py-2.5">
                                    <button onClick={() => setGrantPts(v => Math.max(1, v - 10))} className="text-charcoal/40 hover:text-secondary">
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    <input type="number" min="1" value={grantPts}
                                        onChange={e => setGrantPts(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="flex-1 text-center font-black text-primary outline-none text-lg"
                                    />
                                    <button onClick={() => setGrantPts(v => v + 10)} className="text-charcoal/40 hover:text-secondary">
                                        <ChevronUp className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-charcoal/30 text-[10px] mt-1 text-center">= KES {ptsToKES(grantPts)} redeemable value</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-charcoal/50 mb-1.5 block">Reason</label>
                                <input type="text" placeholder="e.g. Birthday bonus, Compensation…"
                                    value={grantReason} onChange={e => setGrantReason(e.target.value)}
                                    className="w-full px-4 py-3 border border-cream rounded-xl text-sm font-semibold outline-none focus:border-secondary transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setGrantUser(null)}
                                className="flex-1 py-3 border border-cream text-charcoal/50 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-bg-cream transition-all">
                                Cancel
                            </button>
                            <button onClick={handleGrant} disabled={!grantReason.trim()}
                                className="flex-1 bg-secondary hover:bg-orange-600 disabled:opacity-40 text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl transition-all active:scale-95 shadow-md">
                                Grant
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
