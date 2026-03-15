import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ auth, registrations, vehicles }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [viewReg, setViewReg] = useState(null);

    const { data, setData, post, put, delete: destroy, reset, errors, processing } = useForm({
        vehicle_id: '', 
        registration_date: '', 
        expiration_date: '', 
        status: 'Pending'
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('registrations.update', editId), {
                onSuccess: () => { reset(); setIsEditing(false); setEditId(null); }
            });
        } else {
            post(route('registrations.store'), { onSuccess: () => reset() });
        }
    };

    const handleEdit = (reg) => {
        setIsEditing(true);
        setEditId(reg.id);
        setData({
            vehicle_id: reg.vehicle_id,
            registration_date: reg.registration_date,
            expiration_date: reg.expiration_date,
            status: reg.status
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Filter Logic: Search by Plate or Owner Name
    const filteredRegistrations = registrations.filter(r => 
        r.vehicle?.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.vehicle?.owner?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusClasses = (status) => {
        if (status === 'Active') return 'bg-green-100 text-green-700';
        if (status === 'Expired') return 'bg-red-100 text-red-700';
        return 'bg-yellow-100 text-yellow-700';
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="text-xl font-bold text-gray-800">Registration Management</h2>}>
            <Head title="Registrations" />

            <div className="space-y-6">
                {/* --- FORM SECTION --- */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 tracking-tight">
                        {isEditing ? `Updating Record #${editId}` : 'Create New Registration'}
                    </h3>
                    
                    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Vehicle Plate</label>
                            <select className="w-full border-gray-300 rounded-lg shadow-sm" value={data.vehicle_id} onChange={e => setData('vehicle_id', e.target.value)} required>
                                <option value="">Select Plate Number</option>
                                {vehicles.map(v => (
                                    <option key={v.id} value={v.id}>{v.plate_number} ({v.owner?.full_name})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Issue Date</label>
                            <input type="date" className="w-full border-gray-300 rounded-lg" value={data.registration_date} onChange={e => setData('registration_date', e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Expiration Date</label>
                            <input type="date" className="w-full border-gray-300 rounded-lg" value={data.expiration_date} onChange={e => setData('expiration_date', e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Status</label>
                            <select className="w-full border-gray-300 rounded-lg" value={data.status} onChange={e => setData('status', e.target.value)}>
                                <option value="Pending">Pending</option>
                                <option value="Active">Active</option>
                                <option value="Expired">Expired</option>
                            </select>
                        </div>
                        <div className="lg:col-span-4 flex justify-end gap-3">
                            {isEditing && <button type="button" onClick={() => {reset(); setIsEditing(false);}} className="bg-gray-100 px-6 py-2 rounded-lg border">Cancel</button>}
                            <button disabled={processing} className={`px-8 py-2 rounded-lg text-white font-bold shadow-md ${isEditing ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                {processing ? '...' : (isEditing ? 'Update Record' : 'Save Record')}
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- TABLE SECTION --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 bg-gray-50/50 border-b flex flex-col md:flex-row justify-between items-center gap-4">
                        <h3 className="font-bold text-gray-700 uppercase text-xs tracking-wider">Registration Logs</h3>
                        <input type="text" placeholder="Search Owner or Plate..." className="border-gray-300 rounded-full text-sm px-5 py-2 w-full md:w-80" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>

                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Owner</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Plate</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Issued Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Expiry</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredRegistrations.map(r => (
                                <tr key={r.id} className="hover:bg-blue-50/20 transition text-sm">
                                    <td className="px-6 py-4 font-bold text-gray-800">{r.vehicle?.owner?.full_name}</td>
                                    <td className="px-6 py-4 font-mono font-bold text-blue-600">{r.vehicle?.plate_number}</td>
                                    <td className="px-6 py-4 text-gray-600">{r.registration_date}</td>
                                    <td className="px-6 py-4 text-gray-600">{r.expiration_date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusClasses(r.status)}`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button onClick={() => setViewReg(r)} className="text-gray-400 hover:text-blue-600 font-bold">View</button>
                                        <button onClick={() => handleEdit(r)} className="text-blue-500 hover:text-blue-700 font-bold">Edit</button>
                                        <button onClick={() => confirm('Delete?') && destroy(route('registrations.destroy', r.id))} className="text-red-400 hover:text-red-600 font-bold">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MASTER VIEW MODAL --- */}
            {viewReg && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                            <h3 className="text-lg font-bold">Registration Profile</h3>
                            <button onClick={() => setViewReg(null)} className="text-2xl hover:text-red-500 transition">&times;</button>
                        </div>
                        
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[70vh]">
                            {/* Owner Info */}
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Registered Owner</h4>
                                <p className="font-bold text-blue-900 text-lg leading-tight">{viewReg.vehicle?.owner?.full_name}</p>
                                <p className="text-xs text-blue-700 mt-1">License: {viewReg.vehicle?.owner?.license_number}</p>
                                <p className="text-xs text-blue-700">Contact: {viewReg.vehicle?.owner?.contact}</p>
                                <p className="text-xs text-blue-700">Address: {viewReg.vehicle?.owner?.address}</p>
                            </div>

                            {/* Vehicle Info */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Vehicle Specification</h4>
                                <p className="font-bold text-slate-900 text-lg leading-tight">{viewReg.vehicle?.plate_number}</p>
                                <p className="text-xs text-slate-600 mt-1">{viewReg.vehicle?.brand} • {viewReg.vehicle?.color}</p>
                                <p className="text-xs text-slate-600 italic">Type: {viewReg.vehicle?.type}</p>
                            </div>

                            {/* Reg Info */}
                            <div className="md:col-span-2 space-y-3 pt-4 border-t">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registration Status</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-white p-3 border rounded-lg">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Issued</p>
                                        <p className="font-bold text-gray-800">{viewReg.registration_date}</p>
                                    </div>
                                    <div className="bg-white p-3 border rounded-lg">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Expiry</p>
                                        <p className="font-bold text-red-600">{viewReg.expiration_date}</p>
                                    </div>
                                    <div className="bg-white p-3 border rounded-lg flex items-center justify-center">
                                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${getStatusClasses(viewReg.status)}`}>
                                            {viewReg.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t">
                            <button onClick={() => setViewReg(null)} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-black transition shadow-lg">Close Master Profile</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}