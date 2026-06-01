import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Trash2, Edit3, Check, X, Users, FileText, Clock, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import Navbar from '../components/Navbar';

const EMPTY_JOB = {
    id: null,
    title: '',
    department: '',
    type: 'Full-Time',          // Full-Time | Part-Time | Contract
    contractYears: 5,
    location: 'On-site',
    description: '',
    requirements: '',           // newline-separated
    responsibilities: '',       // newline-separated
    deadline: '',
    isOpen: true,
};

const getJobs = () => {
    try { return JSON.parse(localStorage.getItem('kolay_jobs') || '[]'); }
    catch { return []; }
};

const saveJobs = (list) => {
    localStorage.setItem('kolay_jobs', JSON.stringify(list));
    window.dispatchEvent(new Event('storage'));
};

const getApplications = () => {
    try { return JSON.parse(localStorage.getItem('kolay_applications') || '[]'); }
    catch { return []; }
};

export default function AdminCareers() {
    const [jobs, setJobs] = useState(getJobs);
    const [applications, setApplications] = useState(getApplications);
    const [form, setForm] = useState(EMPTY_JOB);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [activeTab, setActiveTab] = useState('jobs');   // 'jobs' | 'applications'
    const [expandedApp, setExpandedApp] = useState(null);

    useEffect(() => {
        const handler = () => {
            setJobs(getJobs());
            setApplications(getApplications());
        };
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        const entry = { ...form, id: editingId || Date.now() };
        const updated = editingId
            ? jobs.map(j => j.id === editingId ? entry : j)
            : [...jobs, entry];
        setJobs(updated);
        saveJobs(updated);
        setForm(EMPTY_JOB);
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (job) => {
        setForm({ ...job });
        setEditingId(job.id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (!window.confirm('Delete this job posting?')) return;
        const updated = jobs.filter(j => j.id !== id);
        setJobs(updated);
        saveJobs(updated);
    };

    const toggleOpen = (id) => {
        const updated = jobs.map(j => j.id === id ? { ...j, isOpen: !j.isOpen } : j);
        setJobs(updated);
        saveJobs(updated);
    };

    const updateAppStatus = (appId, status) => {
        const updated = applications.map(a => a.id === appId ? { ...a, status } : a);
        setApplications(updated);
        localStorage.setItem('kolay_applications', JSON.stringify(updated));
    };

    const handleCancel = () => {
        setForm(EMPTY_JOB);
        setEditingId(null);
        setShowForm(false);
    };

    const newApps = applications.filter(a => a.status === 'Pending').length;
    const renewals = applications.filter(a => a.type === 'renewal');
    const newHires = applications.filter(a => a.type === 'new');

    return (
        <div className="min-h-screen bg-bg-cream text-charcoal font-body">
            <Navbar />
            <main className="max-w-6xl mx-auto px-8 py-12">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-primary flex items-center gap-3">
                            <Briefcase className="text-secondary" /> Careers
                        </h1>
                        <p className="text-charcoal/50 mt-1 text-sm">Post job openings and manage applications & contract renewals.</p>
                    </div>
                    {activeTab === 'jobs' && !showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-orange-600 transition-all active:scale-95"
                        >
                            <Plus className="w-4 h-4" /> Post a Job
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex bg-white p-1.5 rounded-2xl border border-primary/5 shadow-sm w-fit mb-8 gap-1">
                    {[
                        { key: 'jobs', label: 'Job Postings', icon: Briefcase, count: jobs.length },
                        { key: 'applications', label: 'Applications', icon: Users, count: newApps > 0 ? newApps : applications.length },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === tab.key ? 'bg-secondary text-white shadow' : 'text-charcoal/50 hover:text-primary'}`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-white/20' : 'bg-secondary/10 text-secondary'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ── JOBS TAB ── */}
                {activeTab === 'jobs' && (
                    <>
                        {/* Form */}
                        {showForm && (
                            <div className="bg-white rounded-3xl border border-primary/5 shadow-premium p-8 mb-8 animate-in fade-in slide-in-from-top-4 duration-200">
                                <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                                    {editingId ? <Edit3 className="w-5 h-5 text-secondary" /> : <Plus className="w-5 h-5 text-secondary" />}
                                    {editingId ? 'Edit Job Posting' : 'New Job Posting'}
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Job Title *</label>
                                            <input required type="text" placeholder="e.g. Head Chef, Waiter, Cashier"
                                                className="w-full bg-bg-cream border border-primary/10 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-semibold"
                                                value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Department</label>
                                            <input type="text" placeholder="e.g. Kitchen, Front of House, Management"
                                                className="w-full bg-bg-cream border border-primary/10 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-semibold"
                                                value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Employment Type</label>
                                            <select className="w-full bg-bg-cream border border-primary/10 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-semibold appearance-none"
                                                value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                                <option>Full-Time</option>
                                                <option>Part-Time</option>
                                                <option>Contract</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Contract Duration (Years)</label>
                                            <input type="number" min="1" max="10"
                                                className="w-full bg-bg-cream border border-primary/10 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-semibold"
                                                value={form.contractYears} onChange={e => setForm({ ...form, contractYears: parseInt(e.target.value) })} />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Location</label>
                                            <input type="text" placeholder="e.g. On-site, Nairobi"
                                                className="w-full bg-bg-cream border border-primary/10 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-semibold"
                                                value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Application Deadline</label>
                                            <input type="date"
                                                className="w-full bg-bg-cream border border-primary/10 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-semibold"
                                                value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Job Description *</label>
                                        <textarea required rows={3} placeholder="Describe the role and what the candidate will be doing..."
                                            className="w-full bg-bg-cream border border-primary/10 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-semibold resize-none"
                                            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Requirements (one per line)</label>
                                        <textarea rows={4} placeholder={"e.g.\n3+ years experience in a professional kitchen\nFood handler's certificate\nAbility to work weekends"}
                                            className="w-full bg-bg-cream border border-primary/10 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-semibold resize-none"
                                            value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-charcoal/40 mb-2">Responsibilities (one per line)</label>
                                        <textarea rows={4} placeholder={"e.g.\nPrepare and cook menu items to standard\nMaintain kitchen hygiene\nTrain junior staff"}
                                            className="w-full bg-bg-cream border border-primary/10 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-semibold resize-none"
                                            value={form.responsibilities} onChange={e => setForm({ ...form, responsibilities: e.target.value })} />
                                    </div>
                                    <div className="flex gap-4 pt-2">
                                        <button type="button" onClick={handleCancel}
                                            className="flex-1 py-3 font-bold text-charcoal/40 hover:text-primary border border-primary/10 rounded-xl transition-colors">
                                            Cancel
                                        </button>
                                        <button type="submit"
                                            className="flex-1 bg-secondary text-white font-bold py-3 rounded-xl shadow-lg hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-2">
                                            <Check className="w-4 h-4" /> {editingId ? 'Save Changes' : 'Post Job'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Jobs List */}
                        {jobs.length === 0 ? (
                            <div className="bg-white rounded-3xl border border-primary/5 p-16 text-center shadow-sm">
                                <Briefcase className="w-12 h-12 text-charcoal/20 mx-auto mb-4" />
                                <p className="text-charcoal/40 font-bold text-lg">No job postings yet</p>
                                <p className="text-charcoal/30 text-sm mt-1">Post a job to start receiving applications.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {jobs.map(job => {
                                    const appCount = applications.filter(a => a.jobId === job.id).length;
                                    const isExpired = job.deadline && new Date(job.deadline) < new Date();
                                    return (
                                        <div key={job.id} className={`bg-white rounded-3xl border shadow-sm p-6 transition-all ${job.isOpen && !isExpired ? 'border-primary/5' : 'border-primary/5 opacity-60'}`}>
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 flex-wrap mb-1">
                                                        <h3 className="font-black text-primary text-lg">{job.title}</h3>
                                                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${job.isOpen && !isExpired ? 'bg-green-100 text-green-700' : 'bg-charcoal/10 text-charcoal/40'}`}>
                                                            {isExpired ? 'Expired' : job.isOpen ? 'Open' : 'Closed'}
                                                        </span>
                                                        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-secondary/10 text-secondary uppercase">{job.type}</span>
                                                    </div>
                                                    <p className="text-charcoal/50 text-sm mb-2">{job.department} · {job.location} · {job.contractYears}-year contract</p>
                                                    {job.deadline && <p className="text-[11px] text-charcoal/40">Deadline: {new Date(job.deadline).toLocaleDateString()}</p>}
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className="text-[11px] text-charcoal/40 font-bold">{appCount} application{appCount !== 1 ? 's' : ''}</span>
                                                    <button onClick={() => toggleOpen(job.id)}
                                                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${job.isOpen ? 'bg-charcoal/10 text-charcoal/50 hover:bg-red-50 hover:text-red-400' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                                                        {job.isOpen ? 'Close' : 'Reopen'}
                                                    </button>
                                                    <button onClick={() => handleEdit(job)}
                                                        className="p-2 bg-bg-cream hover:bg-secondary/10 text-primary rounded-xl transition-colors">
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(job.id)}
                                                        className="p-2 bg-bg-cream hover:bg-red-50 text-red-400 rounded-xl transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

                {/* ── APPLICATIONS TAB ── */}
                {activeTab === 'applications' && (
                    <div className="space-y-6">
                        {/* Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {[
                                { label: 'Total Applications', value: applications.length, color: 'bg-primary text-white' },
                                { label: 'New Hires', value: newHires.length, color: 'bg-secondary text-white' },
                                { label: 'Contract Renewals', value: renewals.length, color: 'bg-green-600 text-white' },
                            ].map(s => (
                                <div key={s.label} className={`${s.color} rounded-2xl p-5`}>
                                    <p className="text-3xl font-black">{s.value}</p>
                                    <p className="text-sm opacity-70 font-bold mt-1">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {applications.length === 0 ? (
                            <div className="bg-white rounded-3xl border border-primary/5 p-16 text-center shadow-sm">
                                <Users className="w-12 h-12 text-charcoal/20 mx-auto mb-4" />
                                <p className="text-charcoal/40 font-bold text-lg">No applications yet</p>
                            </div>
                        ) : (
                            applications.map(app => {
                                const job = jobs.find(j => j.id === app.jobId);
                                const isExpanded = expandedApp === app.id;
                                return (
                                    <div key={app.id} className="bg-white rounded-3xl border border-primary/5 shadow-sm overflow-hidden">
                                        <div className="flex items-center justify-between p-6 cursor-pointer" onClick={() => setExpandedApp(isExpanded ? null : app.id)}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm text-white ${app.type === 'renewal' ? 'bg-green-600' : 'bg-secondary'}`}>
                                                    {app.type === 'renewal' ? '↻' : 'N'}
                                                </div>
                                                <div>
                                                    <p className="font-black text-primary">{app.fullName}</p>
                                                    <p className="text-charcoal/50 text-xs">{app.type === 'renewal' ? 'Contract Renewal' : `New Application — ${job?.title || 'Unknown Role'}`} · {new Date(app.submittedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <select
                                                    value={app.status}
                                                    onClick={e => e.stopPropagation()}
                                                    onChange={e => updateAppStatus(app.id, e.target.value)}
                                                    className={`text-xs font-black px-3 py-1.5 rounded-xl border-0 outline-none appearance-none cursor-pointer ${
                                                        app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                        app.status === 'Rejected' ? 'bg-red-100 text-red-500' :
                                                        'bg-secondary/10 text-secondary'
                                                    }`}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Approved">Approved</option>
                                                    <option value="Rejected">Rejected</option>
                                                </select>
                                                {isExpanded ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="border-t border-primary/5 p-6 bg-bg-cream/30 space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    {Object.entries(app.answers || {}).map(([q, a]) => (
                                                        <div key={q} className="bg-white rounded-2xl p-4 border border-primary/5">
                                                            <p className="text-[10px] font-black uppercase text-charcoal/40 mb-1">{q}</p>
                                                            <p className="font-semibold text-primary">{a || '—'}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
