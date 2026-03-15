import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ auth, owners }) {
    // 1. States for Search, Edit, and Viewing
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [viewOwner, setViewOwner] = useState(null); // State for the View Modal

    // 2. Form Setup
    const { data, setData, post, put, delete: destroy, reset, errors, processing } = useForm({
        full_name: '', address: '', contact: '', license_number: ''
    });

    // 3. Handle Create or Update
    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('owners.update', editId), {
                onSuccess: () => { reset(); setIsEditing(false); setEditId(null); }
            });
        } else {
            post(route('owners.store'), { onSuccess: () => reset() });
        }
    };

    // 4. Enter Edit Mode
    const handleEdit = (owner) => {
        setIsEditing(true);
        setEditId(owner.id);
        setData({
            full_name: owner.full_name,
            license_number: owner.license_number,
            contact: owner.contact,
            address: owner.address
        });
    };

    // 5. Filter Logic (Search)
    const filteredOwners = owners.filter(owner => 
        owner.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.license_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={<h2 className="text-xl font-bold text-gray-800">Owner Management</h2>}
        >
            <Head title="Owners" />

            <div className="space-y-6">
                {/* --- FORM SECTION --- */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                        {isEditing ? `Editing Record: ${data.full_name}` : 'Register New Owner'}
                    </h3>
                    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                            <input type="text" placeholder="John Doe" className="w-full border-gray-300 rounded-lg p-2 focus:ring-blue-500" value={data.full_name} onChange={e => setData('full_name', e.target.value)} required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">License Number</label>
                            <input type="text" placeholder="ABC-123-456" className="w-full border-gray-300 rounded-lg p-2 focus:ring-blue-500" value={data.license_number} onChange={e => setData('license_number', e.target.value)} required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Contact Number</label>
                            <input type="text" placeholder="09123456789" className="w-full border-gray-300 rounded-lg p-2 focus:ring-blue-500" value={data.contact} onChange={e => setData('contact', e.target.value)} required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Complete Address</label>
                            <input type="text" placeholder="Street, City, Province" className="w-full border-gray-300 rounded-lg p-2 focus:ring-blue-500" value={data.address} onChange={e => setData('address', e.target.value)} required />
                        </div>
                        
                        <div className="md:col-span-2 flex gap-2 pt-2">
                            <button 
                                disabled={processing}
                                className={`px-8 py-2 rounded-lg text-white font-bold shadow-md transition-all ${isEditing ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {processing ? 'Processing...' : (isEditing ? 'Update Record' : 'Save Owner')}
                            </button>
                            {isEditing && (
                                <button type="button" onClick={() => { reset(); setIsEditing(false); }} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg font-bold border border-gray-200">Cancel</button>
                            )}
                        </div>
                    </form>
                </div>

                {/* --- SEARCH & TABLE SECTION --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h3 className="font-bold text-gray-700 uppercase text-xs tracking-wider">Database Records</h3>
                        <input 
                            type="text" 
                            placeholder="Search Name or License..." 
                            className="border-gray-300 rounded-full text-sm px-5 py-2 w-full md:w-80 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50/30">
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Full Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">License</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100 text-sm">
                            {filteredOwners.length > 0 ? filteredOwners.map(owner => (
                                <tr key={owner.id} className="hover:bg-blue-50/20 transition">
                                    <td className="px-6 py-4 font-bold text-gray-800">{owner.full_name}</td>
                                    <td className="px-6 py-4 text-gray-500 font-mono tracking-tighter">{owner.license_number}</td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button onClick={() => setViewOwner(owner)} className="text-gray-400 hover:text-blue-600 font-bold transition">View</button>
                                        <button onClick={() => handleEdit(owner)} className="text-blue-500 hover:text-blue-700 font-bold transition">Edit</button>
                                        <button onClick={() => confirm('Are you sure?') && destroy(route('owners.destroy', owner.id))} className="text-red-400 hover:text-red-600 font-bold transition">Delete</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center text-gray-400 italic">No records matching your search.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- VIEW OWNER MODAL --- */}
            {/* --- DETAILED VIEW OWNER MODAL --- */}
{viewOwner && (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center shrink-0">
                <div>
                    <h3 className="text-xl font-bold">Owner Master Record</h3>
                    <p className="text-slate-400 text-xs">Complete history of vehicles, registrations, and payments</p>
                </div>
                <button onClick={() => setViewOwner(null)} className="text-2xl hover:text-red-400 transition">&times;</button>
            </div>

            {/* Modal Content (Scrollable) */}
            <div className="p-8 overflow-y-auto space-y-8">
                
                {/* SECTION 1: BASIC INFO */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase">Full Name</label>
                        <p className="font-bold text-slate-900">{viewOwner.full_name}</p>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase">License No.</label>
                        <p className="font-mono text-blue-600">{viewOwner.license_number}</p>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase">Contact</label>
                        <p className="text-slate-700">{viewOwner.contact}</p>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase">Address</label>
                        <p className="text-slate-700 text-sm italic">{viewOwner.address}</p>
                    </div>
                </div>

                {/* SECTION 2: VEHICLES & HISTORY */}
                <div className="space-y-4">
                    <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">{viewOwner.vehicles?.length || 0}</span>
                        Owned Vehicles
                    </h4>

                    {viewOwner.vehicles && viewOwner.vehicles.length > 0 ? (
                        viewOwner.vehicles.map((vehicle) => (
                            <div key={vehicle.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                {/* Vehicle Header */}
                                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                                    <span className="font-bold text-blue-700">{vehicle.plate_number}</span>
                                    <span className="text-xs font-medium text-slate-500">{vehicle.brand} ({vehicle.color})</span>
                                </div>

                                {/* Nesting Registrations for this Vehicle */}
                                <div className="p-4 bg-white">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Registration & Payment History</p>
                                    
                                    {vehicle.registrations && vehicle.registrations.length > 0 ? (
                                        <div className="space-y-3">
                                            {vehicle.registrations.map((reg) => (
                                                <div key={reg.id} className="bg-slate-50/50 p-3 rounded-lg border border-slate-100 flex flex-col md:flex-row justify-between gap-4">
                                                    <div>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${reg.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {reg.status}
                                                        </span>
                                                        <p className="text-xs mt-1 text-slate-600">Expires: <b>{reg.expiration_date}</b></p>
                                                    </div>

                                                    {/* Nesting Payments for this Registration */}
                                                    <div className="flex-1 text-right">
                                                        {reg.payments && reg.payments.length > 0 ? (
                                                            reg.payments.map(pay => (
                                                                <div key={pay.id} className="text-xs">
                                                                    <span className="text-slate-400">Paid:</span> <b className="text-green-600">${pay.amount}</b> 
                                                                    <span className="text-slate-400 ml-2">on {pay.payment_date}</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <span className="text-[10px] text-red-400 italic font-bold uppercase">No Payment Recorded</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">No registration records for this vehicle.</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-400">This owner currently has no registered vehicles.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 shrink-0">
                <button 
                    onClick={() => setViewOwner(null)}
                    className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-black transition"
                >
                    Close Master Record
                </button>
            </div>
        </div>
    </div>
)}
        </AuthenticatedLayout>
    );
}