import React, { useState, useEffect, useRef } from 'react';
import {
    Users, Plus, Edit3, Trash2, Search, X, Check,
    Phone, Mail, MapPin, Calendar, Clock, Award,
    ChevronDown, ChevronUp, Image, Link, Upload, Eye
} from 'lucide-react';
import Navbar from '../components/Navbar';

// ── Persistence helpers ───────────────────────────────────────────────────────
const LS_KEY = 'kolay_employees';
const loadEmployees = () => { try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; } };
const persist = (list) => { localStorage.setItem(LS_KEY, JSON.stringify(list)); };

// ── Seed demo data on first load ──────────────────────────────────────────────
const SEED = [
    {
        id: 1, empNo: 'KLY-001', firstName: 'Amara', lastName: 'Osei',
        designation: 'Executive Chef', department: 'Kitchen',
        email: 'amara.osei@kolay.co.ke', phone: '+254 711 000 001',
        nationalId: '12345678', gender: 'Male', dob: '1985-03-12',
        address: 'Westlands, Nairobi', emergencyContact: 'Grace Osei — +254 722 000 001',
        contractStart: '2020-01-15', contractEnd: '2025-01-14',
        contractYears: 5, salary: 120000, status: 'Active',
        notes: 'French & Pan-African fusion specialist.', image: '',
    },
    {
        id: 2, empNo: 'KLY-002', firstName: 'Lena', lastName: 'Mwangi',
        designation: 'Pastry Chef', department: 'Kitchen',
        email: 'lena.mwangi@kolay.co.ke', phone: '+254 711 000 002',
        nationalId: '23456789', gender: 'Female', dob: '1990-07-22',
        address: 'Kilimani, Nairobi', emergencyContact: 'James Mwangi — +254 722 000 002',
        contractStart: '2021-03-01', contractEnd: '2026-02-28',
        contractYears: 5, salary: 95000, status: 'Active',
        notes: 'Artisan desserts & baked goods.', image: '',
    },
    {
        id: 3, empNo: 'KLY-003', firstName: 'Daniel', lastName: 'Kiprop',
        designation: 'Sous Chef', department: 'Kitchen',
        email: 'daniel.kiprop@kolay.co.ke', phone: '+254 711 000 003',
        nationalId: '34567890', gender: 'Male', dob: '1992-11-05',
        address: 'Parklands, Nairobi', emergencyContact: 'Mary Kiprop — +254 722 000 003',
        contractStart: '2022-06-01', contractEnd: '2027-05-31',
        contractYears: 5, salary: 80000, status: 'Active',
        notes: 'Grills, meats & open-fire cooking.', image: '',
    },
];

const ensureSeed = () => {
    const existing = loadEmployees();
    if (existing.length === 0) { persist(SEED); return SEED; }
    return existing;
};

// ── Utilities ─────────────────────────────────────────────────────────────────
const generateEmpNo = (list) => {
    const nums = list.map(e => parseInt(e.empNo?.replace('KLY-', '') || '0')).filter(n => !isNaN(n));
    const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `KLY-${String(next).padStart(3, '0')}`;
};

const yearsMonths = (startDate) => {
    if (!startDate) return '—';
    const start = new Date(startDate);
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    if (months < 0) { years--; months += 12; }
    if (years < 0) return 'Not started';
    if (years === 0) return `${months} month${months !== 1 ? 's' : ''}`;
    return `${years} yr${years !== 1 ? 's' : ''} ${months > 0 ? `${months} mo` : ''}`.trim();
};

const contractStatus = (end) => {
    if (!end) return { label: 'No End Date', color: 'bg-charcoal/10 text-charcoal/50' };
    const diff = (new Date(end) - new Date()) / (1000 * 60 * 60 * 24);
    if (diff < 0) return { label: 'Expired', color: 'bg-red-100 text-red-600' };
    if (diff < 90) return { label: 'Expiring Soon', color: 'bg-yellow-100 text-yellow-700' };
    return { label: 'Active', color: 'bg-green-100 text-green-700' };
};

const age = (dob) => {
    if (!dob) return '—';
    return Math.floor((new Date() - new Date(dob)) / (1000 * 60 * 60 * 24 * 365.25));
};

const EMPTY_FORM = {
    firstName: '', lastName: '', designation: '', department: '',
    email: '', phone: '', nationalId: '', gender: 'Male', dob: '',
    address: '', emergencyContact: '', contractStart: '', contractEnd: '',
    contractYears: 5, salary: '', status: 'Active', notes: '', image: '',
};

const DEPARTMENTS = ['Kitchen', 'Front of House', 'Management', 'Bar', 'Delivery', 'Cleaning', 'Security', 'Finance', 'HR'];
const DESIGNATIONS = ['Executive Chef', 'Sous Chef', 'Pastry Chef', 'Line Cook', 'Kitchen Porter',
    'Head Waiter', 'Waiter', 'Cashier', 'Bartender', 'Host/Hostess',
    'Manager', 'Assistant Manager', 'Supervisor', 'Delivery Driver', 'Security Guard', 'Cleaner'];

// ── Image Picker sub-component ────────────────────────────────────────────────
function ImagePicker({ value, onChange, applicationImage }) {
    const [tab, setTab] = useState(applicationImage ? 'app' : 'url');
    const [urlInput, setUrlInput] = useState('');
    const fileRef = useRef();

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => onChange(ev.target.result);
        reader.readAsDataURL(file);
    };

    const applyUrl = () => { if (urlInput.trim()) { onChange(urlInput.trim()); } };

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                {applicationImage && (
                    <button type="button" onClick={() => setTab('app')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${tab === 'app' ? 'bg-secondary text-white' : 'bg-bg-cream text-charcoal/50 hover:text-primary'}`}>
                        <Image className="w-3 h-3" /> From Application
                    </button>
                )}
                <button type="button" onClick={() => setTab('url')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${tab === 'url' ? 'bg-secondary text-white' : 'bg-bg-cream text-charcoal/50 hover:text-primary'}`}>
                    <Link className="w-3 h-3" /> Image URL
                </button>
                <button type="button" onClick={() => setTab('upload')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${tab === 'upload' ? 'bg-secondary text-white' : 'bg-bg-cream text-charcoal/50 hover:text-primary'}`}>
                    <Upload className="w-3 h-3" /> Upload
                </button>
            </div>

            {tab === 'app' && applicationImage && (
                <div className="flex items-center gap-4 p-3 bg-bg-cream rounded-xl border border-primary/10">
                    <img src={applicationImage} alt="Application" className="w-14 h-14 rounded-xl object-cover border border-primary/10" />
                    <div className="flex-1">
                        <p className="text-xs font-bold text-charcoal/60 mb-2">Photo from job application</p>
                        <button type="button" onClick={() => onChange(applicationImage)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${value === applicationImage ? 'bg-green-100 text-green-700' : 'bg-secondary text-white hover:bg-orange-600'}`}>
                            {value === applicationImage ? '✓ Using this photo' : 'Use this photo'}
                        </button>
                    </div>
                </div>
            )}

            {tab === 'url' && (
                <div className="flex gap-2">
                    <input type="url" placeholder="https://example.com/photo.jpg"
                        className="flex-1 bg-bg-cream border border-primary/10 px-3 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-semibold text-sm"
                        value={urlInput} onChange={e => setUrlInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyUrl())} />
                    <button type="button" onClick={applyUrl}
                        className="px-4 py-2.5 bg-secondary text-white rounded-xl text-xs font-black hover:bg-orange-600 transition-all">
                        Apply
                    </button>
                </div>
            )}

            {tab === 'upload' && (
                <div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                    <button type="button" onClick={() => fileRef.current.click()}
                        className="w-full border-2 border-dashed border-primary/20 hover:border-secondary/40 rounded-xl py-4 text-charcoal/40 hover:text-secondary text-sm font-bold transition-all flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4" /> Click to choose a file
                    </button>
                </div>
            )}

            {value && (
                <div className="flex items-center gap-3 p-2 bg-bg-cream rounded-xl border border-primary/10">
                    <img src={value} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-primary/10"
                        onError={e => { e.target.style.display = 'none'; }} />
                    <p className="text-xs text-charcoal/50 font-semibold flex-1 truncate">Image set</p>
                    <button type="button" onClick={() => onChange('')}
                        className="p-1 hover:bg-red-50 rounded-lg text-red-400 transition-colors">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
        </div>
    );
}

// ── Employee Profile Modal ────────────────────────────────────────────────────
function EmployeeProfileModal({ emp, onClose, onEdit }) {
    const cs = contractStatus(emp.contractEnd);
    const initials = `${emp.firstName?.[0] || ''}${emp.lastName?.[0] || ''}`.toUpperCase();

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-primary/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl animate-in zoom-in duration-200 max-h-[92vh] overflow-y-auto">
                {/* Header banner */}
                <div className="bg-primary rounded-t-[2rem] px-8 pt-8 pb-6 relative">
                    <button onClick={onClose} className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-end gap-5">
                        {emp.image ? (
                            <img src={emp.image} alt={`${emp.firstName} ${emp.lastName}`}
                                className="w-24 h-24 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
                                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                        ) : null}
                        <div className={`w-24 h-24 rounded-2xl bg-secondary flex items-center justify-center text-white font-black text-2xl border-4 border-white/20 shadow-lg shrink-0 ${emp.image ? 'hidden' : 'flex'}`}>
                            {initials}
                        </div>
                        <div className="pb-1">
                            <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-1">{emp.empNo}</p>
                            <h2 className="text-2xl font-display font-black text-white">{emp.firstName} {emp.lastName}</h2>
                            <p className="text-white/70 font-semibold text-sm mt-0.5">{emp.designation || '—'} · {emp.department || '—'}</p>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4 flex-wrap">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${emp.status === 'Active' ? 'bg-green-400/20 text-green-200' : emp.status === 'On Leave' ? 'bg-blue-400/20 text-blue-200' : emp.status === 'Suspended' ? 'bg-yellow-400/20 text-yellow-200' : 'bg-red-400/20 text-red-200'}`}>
                            {emp.status}
                        </span>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full bg-white/10 text-white/70`}>{cs.label}</span>
                        {emp.salary && <span className="text-[10px] font-black px-3 py-1 rounded-full bg-secondary/30 text-white">KES {Number(emp.salary).toLocaleString()} / mo</span>}
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6">
                    {/* Contact */}
                    <div>
                        <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-3">Contact Information</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                { icon: Mail,   label: 'Email',             value: emp.email },
                                { icon: Phone,  label: 'Phone',             value: emp.phone },
                                { icon: MapPin, label: 'Address',           value: emp.address },
                                { icon: Phone,  label: 'Emergency Contact', value: emp.emergencyContact },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex items-start gap-3 bg-bg-cream rounded-2xl p-4 border border-primary/5">
                                    <Icon className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-charcoal/40">{label}</p>
                                        <p className="font-semibold text-primary text-sm mt-0.5">{value || '—'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Personal */}
                    <div>
                        <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-3">Personal Details</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                                { icon: Calendar, label: 'Date of Birth', value: emp.dob ? `${emp.dob} (Age ${age(emp.dob)})` : '—' },
                                { icon: Users,    label: 'Gender',        value: emp.gender },
                                { icon: Award,    label: 'National ID',   value: emp.nationalId },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex items-start gap-3 bg-bg-cream rounded-2xl p-4 border border-primary/5">
                                    <Icon className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-charcoal/40">{label}</p>
                                        <p className="font-semibold text-primary text-sm mt-0.5">{value || '—'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contract */}
                    <div>
                        <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-3">Contract Details</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                                { icon: Calendar, label: 'Start Date',    value: emp.contractStart || '—' },
                                { icon: Calendar, label: 'End Date',      value: emp.contractEnd || 'Ongoing' },
                                { icon: Clock,    label: 'Time Served',   value: yearsMonths(emp.contractStart) },
                                { icon: Clock,    label: 'Duration',      value: emp.contractYears ? `${emp.contractYears} years` : '—' },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex items-start gap-3 bg-bg-cream rounded-2xl p-4 border border-primary/5">
                                    <Icon className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-charcoal/40">{label}</p>
                                        <p className="font-semibold text-primary text-sm mt-0.5">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {emp.notes && (
                        <div className="bg-bg-cream rounded-2xl p-4 border border-primary/5">
                            <p className="text-[10px] font-black uppercase text-charcoal/40 mb-1">Notes</p>
                            <p className="font-semibold text-primary text-sm">{emp.notes}</p>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button onClick={onClose} className="flex-1 py-3 font-bold text-charcoal/40 hover:text-primary border border-primary/10 rounded-xl transition-colors text-sm">
                            Close
                        </button>
                        <button onClick={() => { onClose(); onEdit(emp); }}
                            className="flex-1 bg-secondary text-white font-bold py-3 rounded-xl shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 text-sm">
                            <Edit3 className="w-4 h-4" /> Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Employees() {
    const [employees, setEmployees] = useState(ensureSeed);
    const [search, setSearch] = useState('');
    const [filterDept, setFilterDept] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [profileEmp, setProfileEmp] = useState(null); // employee to show in profile modal

    useEffect(() => { persist(employees); }, [employees]);

    const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    // Find application image for an employee being edited (matched by email)
    const getApplicationImage = () => {
        try {
            const apps = JSON.parse(localStorage.getItem('kolay_applications') || '[]');
            const match = apps.find(a => a.email === form.email && a.profileImage);
            return match?.profileImage || null;
        } catch { return null; }
    };

    const openAdd = () => {
        setForm({ ...EMPTY_FORM, empNo: generateEmpNo(employees) });
        setEditingId(null);
        setShowForm(true);
    };

    const openEdit = (emp) => {
        setForm({ ...emp });
        setEditingId(emp.id);
        setShowForm(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!form.firstName.trim() || !form.lastName.trim()) return;
        if (editingId) {
            setEmployees(prev => prev.map(e => e.id === editingId ? { ...form, id: editingId } : e));
        } else {
            setEmployees(prev => [...prev, { ...form, id: Date.now() }]);
        }
        setShowForm(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
    };

    const handleDelete = (id) => {
        if (!window.confirm('Permanently delete this employee record?')) return;
        setEmployees(prev => prev.filter(e => e.id !== id));
    };

    const handleCancel = () => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); };

    const filtered = employees.filter(e => {
        const q = search.toLowerCase();
        const matchSearch = !q ||
            `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
            e.empNo?.toLowerCase().includes(q) ||
            e.designation?.toLowerCase().includes(q) ||
            e.department?.toLowerCase().includes(q) ||
            e.email?.toLowerCase().includes(q);
        const matchDept = filterDept === 'All' || e.department === filterDept;
        const matchStatus = filterStatus === 'All' || e.status === filterStatus;
        return matchSearch && matchDept && matchStatus;
    });

    const active = employees.filter(e => e.status === 'Active').length;
    const expiringSoon = employees.filter(e => contractStatus(e.contractEnd).label === 'Expiring Soon').length;
    const expired = employees.filter(e => contractStatus(e.contractEnd).label === 'Expired').length;
    const depts = [...new Set(employees.map(e => e.department).filter(Boolean))];

    const inputCls = 'w-full bg-bg-cream border border-primary/10 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 font-semibold text-sm';
    const labelCls = 'block text-[10px] font-black uppercase text-charcoal/40 mb-1.5';
    const selectCls = `${inputCls} appearance-none`;

    return (
        <div className="min-h-screen bg-bg-cream text-charcoal font-body">
            <Navbar />
            <main className="max-w-7xl mx-auto px-6 md:px-8 py-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-primary flex items-center gap-3">
                            <Users className="text-secondary" /> Employees
                        </h1>
                        <p className="text-charcoal/50 mt-1 text-sm">
                            {employees.length} total · {active} active ·{' '}
                            {expiringSoon > 0 && <span className="text-yellow-600 font-bold">{expiringSoon} expiring soon · </span>}
                            {expired > 0 && <span className="text-red-500 font-bold">{expired} expired</span>}
                        </p>
                    </div>
                    <button onClick={openAdd}
                        className="flex items-center gap-2 bg-secondary text-white px-7 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:bg-orange-600 transition-all active:scale-95">
                        <Plus className="w-4 h-4" /> Add Employee
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Staff',       value: employees.length, color: 'bg-primary text-white' },
                        { label: 'Active',            value: active,           color: 'bg-green-600 text-white' },
                        { label: 'Expiring Soon',     value: expiringSoon,     color: 'bg-yellow-500 text-white' },
                        { label: 'Expired Contracts', value: expired,          color: 'bg-red-500 text-white' },
                    ].map(s => (
                        <div key={s.label} className={`${s.color} rounded-2xl p-5 shadow-sm`}>
                            <p className="text-3xl font-black">{s.value}</p>
                            <p className="text-sm opacity-75 font-bold mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
                        <input type="text" placeholder="Search by name, employee no., role, department..."
                            className="w-full pl-11 pr-4 py-3 bg-white border border-primary/5 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-secondary/20 font-semibold text-sm"
                            value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
                        className="bg-white border border-primary/5 rounded-2xl px-4 py-3 font-bold text-sm outline-none focus:ring-2 focus:ring-secondary/20 shadow-sm appearance-none min-w-[160px]">
                        <option value="All">All Departments</option>
                        {depts.map(d => <option key={d}>{d}</option>)}
                    </select>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                        className="bg-white border border-primary/5 rounded-2xl px-4 py-3 font-bold text-sm outline-none focus:ring-2 focus:ring-secondary/20 shadow-sm appearance-none min-w-[140px]">
                        <option value="All">All Statuses</option>
                        <option>Active</option><option>On Leave</option><option>Terminated</option><option>Suspended</option>
                    </select>
                </div>

                {/* Employee Table */}
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-primary/5 p-16 text-center shadow-sm">
                        <Users className="w-12 h-12 text-charcoal/20 mx-auto mb-4" />
                        <p className="text-charcoal/40 font-bold text-lg">No employees found</p>
                        <p className="text-charcoal/30 text-sm mt-1">Try adjusting your search or filters, or add a new employee.</p>
                        <button onClick={openAdd} className="mt-6 flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:bg-orange-600 transition-all mx-auto">
                            <Plus className="w-4 h-4" /> Add Employee
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-primary/5 shadow-sm overflow-hidden">
                        <div className="grid grid-cols-[2fr_1.2fr_1.2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 bg-bg-cream border-b border-primary/5 text-[10px] font-black uppercase text-charcoal/40 tracking-widest">
                            <span>Employee</span><span>Role / Dept</span><span>Contract</span>
                            <span>Time Served</span><span>Status</span><span>Salary (KES)</span><span></span>
                        </div>

                        {filtered.map(emp => {
                            const cs = contractStatus(emp.contractEnd);
                            const initials = `${emp.firstName?.[0] || ''}${emp.lastName?.[0] || ''}`.toUpperCase();
                            return (
                                <div key={emp.id} className="border-b border-primary/5 last:border-0">
                                    <div className="grid grid-cols-[2fr_1.2fr_1.2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 items-center hover:bg-bg-cream/40 transition-colors cursor-pointer"
                                        onClick={() => setProfileEmp(emp)}>
                                        {/* Avatar + name */}
                                        <div className="flex items-center gap-3">
                                            {emp.image ? (
                                                <img src={emp.image} alt={`${emp.firstName} ${emp.lastName}`}
                                                    className="w-10 h-10 rounded-2xl object-cover border border-primary/10 shrink-0"
                                                    onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                            ) : null}
                                            <div className={`w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-xs shrink-0 ${emp.image ? 'hidden' : 'flex'}`}>
                                                {initials}
                                            </div>
                                            <div>
                                                <p className="font-black text-primary text-sm">{emp.firstName} {emp.lastName}</p>
                                                <p className="text-[11px] text-charcoal/40 font-bold">{emp.empNo}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-charcoal">{emp.designation || '—'}</p>
                                            <p className="text-[11px] text-charcoal/40">{emp.department || '—'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-charcoal">{emp.contractStart || '—'}</p>
                                            <p className="text-[11px] text-charcoal/40">→ {emp.contractEnd || 'Ongoing'}</p>
                                        </div>
                                        <p className="text-sm font-bold text-charcoal">{yearsMonths(emp.contractStart)}</p>
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full w-fit ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : emp.status === 'On Leave' ? 'bg-blue-100 text-blue-600' : emp.status === 'Suspended' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-500'}`}>
                                                {emp.status}
                                            </span>
                                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full w-fit ${cs.color}`}>{cs.label}</span>
                                        </div>
                                        <p className="text-sm font-black text-secondary">{emp.salary ? Number(emp.salary).toLocaleString() : '—'}</p>
                                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                            <button onClick={() => setProfileEmp(emp)} className="p-2 bg-bg-cream hover:bg-secondary/10 text-primary rounded-xl transition-colors" title="View Profile">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => openEdit(emp)} className="p-2 bg-bg-cream hover:bg-secondary/10 text-primary rounded-xl transition-colors" title="Edit">
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(emp.id)} className="p-2 bg-bg-cream hover:bg-red-50 text-red-400 rounded-xl transition-colors" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {filtered.length > 0 && (
                    <div className="flex justify-center mt-6">
                        <button onClick={openAdd}
                            className="flex items-center gap-2 bg-secondary text-white px-7 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:bg-orange-600 transition-all active:scale-95">
                            <Plus className="w-4 h-4" /> Add Employee
                        </button>
                    </div>
                )}

                {/* Add / Edit Modal */}
                {showForm && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={handleCancel} />
                        <div className="relative bg-white rounded-[2rem] w-full max-w-3xl shadow-2xl animate-in zoom-in duration-200 max-h-[92vh] overflow-y-auto">
                            <div className="flex justify-between items-center px-8 pt-8 pb-5 sticky top-0 bg-white z-10 border-b border-primary/5">
                                <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                                    {editingId ? <Edit3 className="w-5 h-5 text-secondary" /> : <Plus className="w-5 h-5 text-secondary" />}
                                    {editingId ? 'Edit Employee' : 'Add New Employee'}
                                </h2>
                                <button onClick={handleCancel} className="p-2 bg-bg-cream hover:bg-red-50 rounded-xl text-charcoal/40 hover:text-red-400 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="px-8 py-6 space-y-6">
                                {/* Profile Photo */}
                                <div>
                                    <p className="text-xs font-black uppercase text-secondary tracking-widest mb-4">Profile Photo</p>
                                    <ImagePicker
                                        value={form.image}
                                        onChange={v => f('image', v)}
                                        applicationImage={getApplicationImage()}
                                    />
                                </div>

                                {/* Personal Info */}
                                <div>
                                    <p className="text-xs font-black uppercase text-secondary tracking-widest mb-4">Personal Information</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelCls}>Employee No.</label>
                                            <input type="text" className={`${inputCls} bg-bg-cream/60 text-charcoal/50`} value={form.empNo} readOnly />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Status</label>
                                            <select className={selectCls} value={form.status} onChange={e => f('status', e.target.value)}>
                                                <option>Active</option><option>On Leave</option><option>Suspended</option><option>Terminated</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelCls}>First Name *</label>
                                            <input required type="text" placeholder="First name" className={inputCls} value={form.firstName} onChange={e => f('firstName', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Last Name *</label>
                                            <input required type="text" placeholder="Last name" className={inputCls} value={form.lastName} onChange={e => f('lastName', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Gender</label>
                                            <select className={selectCls} value={form.gender} onChange={e => f('gender', e.target.value)}>
                                                <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelCls}>Date of Birth</label>
                                            <input type="date" className={inputCls} value={form.dob} onChange={e => f('dob', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>National ID</label>
                                            <input type="text" placeholder="ID number" className={inputCls} value={form.nationalId} onChange={e => f('nationalId', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Phone</label>
                                            <input type="tel" placeholder="+254 ..." className={inputCls} value={form.phone} onChange={e => f('phone', e.target.value)} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className={labelCls}>Email</label>
                                            <input type="email" placeholder="employee@kolay.co.ke" className={inputCls} value={form.email} onChange={e => f('email', e.target.value)} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className={labelCls}>Residential Address</label>
                                            <input type="text" placeholder="e.g. Westlands, Nairobi" className={inputCls} value={form.address} onChange={e => f('address', e.target.value)} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className={labelCls}>Emergency Contact (Name & Phone)</label>
                                            <input type="text" placeholder="e.g. Jane Doe — +254 722 000 000" className={inputCls} value={form.emergencyContact} onChange={e => f('emergencyContact', e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                                {/* Employment Info */}
                                <div>
                                    <p className="text-xs font-black uppercase text-secondary tracking-widest mb-4">Employment Details</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelCls}>Designation / Role</label>
                                            <input type="text" list="designations-list" placeholder="e.g. Head Waiter" className={inputCls} value={form.designation} onChange={e => f('designation', e.target.value)} />
                                            <datalist id="designations-list">{DESIGNATIONS.map(d => <option key={d} value={d} />)}</datalist>
                                        </div>
                                        <div>
                                            <label className={labelCls}>Department</label>
                                            <input type="text" list="departments-list" placeholder="e.g. Kitchen" className={inputCls} value={form.department} onChange={e => f('department', e.target.value)} />
                                            <datalist id="departments-list">{DEPARTMENTS.map(d => <option key={d} value={d} />)}</datalist>
                                        </div>
                                        <div>
                                            <label className={labelCls}>Contract Start Date</label>
                                            <input type="date" className={inputCls} value={form.contractStart} onChange={e => f('contractStart', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Contract End Date</label>
                                            <input type="date" className={inputCls} value={form.contractEnd} onChange={e => f('contractEnd', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Contract Duration (Years)</label>
                                            <input type="number" min="1" max="10" className={inputCls} value={form.contractYears} onChange={e => f('contractYears', parseInt(e.target.value))} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Monthly Salary (KES)</label>
                                            <input type="number" min="0" placeholder="e.g. 80000" className={inputCls} value={form.salary} onChange={e => f('salary', e.target.value)} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className={labelCls}>Notes / Remarks</label>
                                            <textarea rows={2} placeholder="Any additional notes..." className={`${inputCls} resize-none`} value={form.notes} onChange={e => f('notes', e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-2 sticky bottom-0 bg-white pb-2">
                                    <button type="button" onClick={handleCancel} className="flex-1 py-3 font-bold text-charcoal/40 hover:text-primary border border-primary/10 rounded-xl transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" className="flex-1 bg-secondary text-white font-bold py-3 rounded-xl shadow-lg hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-2">
                                        <Check className="w-4 h-4" /> {editingId ? 'Save Changes' : 'Add Employee'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Profile Modal */}
                {profileEmp && (
                    <EmployeeProfileModal
                        emp={profileEmp}
                        onClose={() => setProfileEmp(null)}
                        onEdit={openEdit}
                    />
                )}
            </main>
        </div>
    );
}
