import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ auth, payments, registrations }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [viewPay, setViewPay] = useState(null);

    // 1. Form Setup (Status is included)
    const { data, setData, post, put, delete: destroy, reset, errors, processing } = useForm({
        registration_id: '',
        amount: '',
        payment_date: '',
        status: 'Paid',
    });

    // 2. LOGIC: Group payments by Registration (Plate/Owner)
    const groupedPayments = payments.reduce((acc, curr) => {
        const regId = curr.registration_id;
        if (!acc[regId]) {
            acc[regId] = {
                ...curr,
                totalAmount: 0,
                latestStatus: curr.status,
                latestId: curr.id, // Store ID for editing latest
                history: []
            };
        }
        acc[regId].totalAmount += parseFloat(curr.amount);
        acc[regId].history.push(curr);
        return acc;
    }, {});

    const displayPayments = Object.values(groupedPayments).filter(p => 
        p.registration?.vehicle?.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.registration?.vehicle?.owner?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 3. Handle Submit
    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('payments.update', editId), { onSuccess: () => { reset(); setIsEditing(false); setEditId(null); } });
        } else {
            post(route('payments.store'), { onSuccess: () => reset() });
        }
    };

    // 4. Handle Edit (Targets latest record of that group)
    const handleEdit = (p) => {
        setIsEditing(true);
        setEditId(p.latestId);
        setData({
            registration_id: p.registration_id,
            amount: p.amount,
            payment_date: p.payment_date,
            status: p.status
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Helper for Status Badge Styling
    const getStatusStyle = (status) => {
        if (status === 'Paid') return 'bg-green-100 text-green-700';
        if (status === 'Partial') return 'bg-yellow-100 text-yellow-700';
        return 'bg-red-100 text-red-700';
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="text-xl font-bold text-gray-800">Transactions</h2>}>
            <Head title="Payments" />

            <div className="space-y-6">
                {/* --- FORM SECTION --- */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all">
                    <h3 className="text-lg font-bold mb-4">{isEditing ? `Editing Transaction #${editId}` : 'New Payment'}</h3>
                    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400">Select Vehicle / Owner</label>
                            <select className="w-full border-gray-300 rounded-lg text-sm" value={data.registration_id} onChange={e => setData('registration_id', e.target.value)} required>
                                <option value="">Select Plate</option>
                                {registrations.map(reg => (
                                    <option key={reg.id} value={reg.id}>{reg.vehicle?.plate_number} - {reg.vehicle?.owner?.full_name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400">Amount</label>
                            <input type="number" className="w-full border-gray-300 rounded-lg" value={data.amount} onChange={e => setData('amount', e.target.value)} required />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400">Date</label>
                            <input type="date" className="w-full border-gray-300 rounded-lg" value={data.payment_date} onChange={e => setData('payment_date', e.target.value)} required />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400">Status</label>
                            <select className="w-full border-gray-300 rounded-lg" value={data.status} onChange={e => setData('status', e.target.value)}>
                                <option value="Paid">Paid</option>
                                
                                <option value="Partial">Partial</option>
                            </select>
                        </div>
                        <div className="flex items-end gap-2">
                            <button className={`flex-1 text-white font-bold py-2 rounded-lg ${isEditing ? 'bg-orange-500 hover:bg-orange-600' : 'bg-purple-600 hover:bg-purple-700'}`}>
                                {isEditing ? 'Update' : 'Save'}
                            </button>
                            {isEditing && <button type="button" onClick={() => {reset(); setIsEditing(false);}} className="bg-gray-400 text-white py-2 px-4 rounded-lg">X</button>}
                        </div>
                    </form>
                </div>

                {/* --- TABLE SECTION --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest italic"> Transaction Records</span>
                        <input type="text" placeholder="Search Owner or Plate..." className="border-gray-300 rounded-full text-sm w-full md:w-80 px-5 py-2" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Owner</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Plate</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Paid</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {displayPayments.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 font-bold text-gray-800">{p.registration?.vehicle?.owner?.full_name}</td>
                                    <td className="px-6 py-4 text-blue-600 font-mono font-bold tracking-tight">{p.registration?.vehicle?.plate_number}</td>
                                    <td className="px-6 py-4 font-black text-green-600">₱{p.totalAmount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${getStatusStyle(p.latestStatus)}`}>
                                            {p.latestStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button onClick={() => setViewPay(p)} className="text-slate-400 hover:text-slate-900 font-bold text-xs uppercase">View Full Info</button>
                                        <button onClick={() => handleEdit(p)} className="text-blue-500 hover:text-blue-700 font-bold text-xs uppercase">Edit</button>
                                        <button onClick={() => confirm('Delete latest transaction?') && destroy(route('payments.destroy', p.latestId))} className="text-red-400 hover:text-red-600 text-xs transition">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- VIEW FULL INFO MODAL --- */}
            {viewPay && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="bg-slate-900 p-6 text-white flex justify-between">
                            <div>
                                <h3 className="text-xl font-bold italic tracking-tighter">MASTER LEDGER RECORD</h3>
                                <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">Registry Info: {viewPay.registration?.vehicle?.plate_number}</p>
                            </div>
                            <button onClick={() => setViewPay(null)} className="text-3xl leading-none">&times;</button>
                        </div>
                        
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto max-h-[70vh]">
                            {/* OWNER DETAILS */}
                            <div className="space-y-3 bg-blue-50 p-5 rounded-2xl border border-blue-100 shadow-inner">
                                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Owner Information</h4>
                                <p className="font-bold text-blue-900 text-lg leading-tight">{viewPay.registration?.vehicle?.owner?.full_name}</p>
                                <p className="text-xs text-blue-700">License: <b>{viewPay.registration?.vehicle?.owner?.license_number}</b></p>
                                <p className="text-xs text-blue-700 italic">{viewPay.registration?.vehicle?.owner?.address}</p>
                            </div>

                            {/* VEHICLE DETAILS */}
                            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle Information</h4>
                                <p className="font-bold text-slate-900 text-lg leading-tight">{viewPay.registration?.vehicle?.plate_number}</p>
                                <p className="text-xs text-slate-600">Model: {viewPay.registration?.vehicle?.brand}</p>
                                <p className="text-xs text-slate-600">Color: {viewPay.registration?.vehicle?.color}</p>
                            </div>

                            {/* TRANSACTION HISTORY */}
                            <div className="col-span-1 md:col-span-2 space-y-3">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Detailed History</h4>
                                <div className="space-y-2">
                                    {viewPay.history.map((h, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-4 border rounded-xl bg-white shadow-sm hover:border-purple-200 transition">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs font-bold text-gray-800">{h.payment_date}</p>
                                                    <span className={`text-[8px] font-black px-2 rounded-full uppercase ${getStatusStyle(h.status)}`}>
                                                        {h.status}
                                                    </span>
                                                </div>
                                                <p className="text-[9px] text-gray-400">TXN-ID: #{h.id}</p>
                                            </div>
                                            <span className="font-black text-green-600 text-lg">₱{parseFloat(h.amount).toLocaleString()}</span>
                                        </div>
                                    ))}
                                    
                                    <div className="flex justify-between items-center p-5 bg-green-600 text-white rounded-2xl shadow-xl mt-6">
                                        <span className="font-black uppercase text-xs tracking-tighter">Total Accumulated Balance</span>
                                        <span className="text-3xl font-black">₱{viewPay.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 border-t">
                            <button onClick={() => setViewPay(null)} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-black transition shadow-lg">Close Ledger View</button>
                        </div>
                    </div>
                </div>
            )}
        
    
        </AuthenticatedLayout>
);
}