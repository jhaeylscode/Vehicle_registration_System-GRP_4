import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ auth, vehicles, owners }) {
    // 1. States for Search, Edit, and Viewing
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [viewVehicle, setViewVehicle] = useState(null); // State for the View Modal

    // 2. Form management
    const { data, setData, post, put, delete: destroy, reset, errors, processing } = useForm({
        owner_id: '',
        plate_number: '',
        type: '',
        brand: '',
        color: ''
    });

    // 3. Handle Submit (Create or Update)
    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('vehicles.update', editId), {
                onSuccess: () => { reset(); setIsEditing(false); setEditId(null); }
            });
        } else {
            post(route('vehicles.store'), { onSuccess: () => reset() });
        }
    };

    // 4. Action Handlers
    const handleEdit = (vehicle) => {
        setIsEditing(true);
        setEditId(vehicle.id);
        setData({
            owner_id: vehicle.owner_id,
            plate_number: vehicle.plate_number,
            type: vehicle.type,
            brand: vehicle.brand,
            color: vehicle.color
        });
    };

    // 5. Filter Logic
    const filteredVehicles = vehicles.filter(v => 
        v.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.owner?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={<h2 className="text-xl font-bold text-gray-800">Vehicle Management</h2>}
        >
            <Head title="Vehicles" />

            <div className="space-y-6">
                {/* --- ADD / EDIT VEHICLE CARD --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                        {isEditing ? `Editing Vehicle: ${data.plate_number}` : 'Add New Vehicle'}
                    </h3>
                    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                            <select className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500" value={data.owner_id} onChange={e => setData('owner_id', e.target.value)} required>
                                <option value="">Select Owner</option>
                                {owners.map(owner => <option key={owner.id} value={owner.id}>{owner.full_name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number</label>
                            <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm" value={data.plate_number} onChange={e => setData('plate_number', e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Brand & Model</label>
                            <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm" value={data.brand} onChange={e => setData('brand', e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                            <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm" value={data.type} onChange={e => setData('type', e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                            <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm" value={data.color} onChange={e => setData('color', e.target.value)} required />
                        </div>
                        <div className="flex items-end gap-2">
                            <button type="submit" disabled={processing} className={`flex-1 font-bold py-2 px-4 rounded-lg text-white transition ${isEditing ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                {isEditing ? 'Update Vehicle' : 'Register Vehicle'}
                            </button>
                            {isEditing && <button type="button" onClick={() => { reset(); setIsEditing(false); }} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Cancel</button>}
                        </div>
                    </form>
                </div>

                {/* --- VEHICLE LIST TABLE --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h3 className="font-bold text-gray-700 uppercase text-xs tracking-wider">Registered Vehicles</h3>
                        <input type="text" placeholder="Search..." className="border-gray-300 rounded-full text-sm px-4 py-2 w-full md:w-80" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                                <tr>
                                    <th className="px-6 py-4 text-left">Plate</th>
                                    <th className="px-6 py-4 text-left">Owner</th>
                                    <th className="px-6 py-4 text-left">Brand</th>
                                    <th className="px-6 py-4 text-left">Color</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {filteredVehicles.map(v => (
                                    <tr key={v.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-bold text-blue-600">{v.plate_number}</td>
                                        <td className="px-6 py-4 text-gray-700">{v.owner?.full_name}</td>
                                        <td className="px-6 py-4 text-gray-600">{v.brand}</td>
                                        <td className="px-6 py-4 text-gray-600">{v.color}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={() => setViewVehicle(v)} className="text-gray-600 hover:text-gray-900 font-bold text-sm">View</button>
                                            <button onClick={() => handleEdit(v)} className="text-blue-600 hover:text-blue-800 font-bold text-sm">Edit</button>
                                            <button onClick={() => confirm('Delete?') && destroy(route('vehicles.destroy', v.id))} className="text-red-500 hover:text-red-700 font-bold text-sm">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- VIEW INFORMATION MODAL --- */}
            {viewVehicle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                            <h3 className="text-xl font-bold">Vehicle Details</h3>
                            <button onClick={() => setViewVehicle(null)} className="text-slate-400 hover:text-white text-2xl">&times;</button>
                        </div>
                        <div className="p-8 space-y-4">
                            <div className="grid grid-cols-2 border-b pb-2">
                                <span className="text-gray-500 text-sm uppercase font-bold">Plate Number</span>
                                <span className="text-blue-600 font-bold text-lg">{viewVehicle.plate_number}</span>
                            </div>
                            <div className="grid grid-cols-2 border-b pb-2">
                                <span className="text-gray-500 text-sm uppercase font-bold">Registered Owner</span>
                                <span className="text-gray-900 font-medium">{viewVehicle.owner?.full_name}</span>
                            </div>
                            <div className="grid grid-cols-2 border-b pb-2">
                                <span className="text-gray-500 text-sm uppercase font-bold">Brand & Model</span>
                                <span className="text-gray-900 font-medium">{viewVehicle.brand}</span>
                            </div>
                            <div className="grid grid-cols-2 border-b pb-2">
                                <span className="text-gray-500 text-sm uppercase font-bold">Vehicle Type</span>
                                <span className="text-gray-900 font-medium">{viewVehicle.type}</span>
                            </div>
                            <div className="grid grid-cols-2 border-b pb-2">
                                <span className="text-gray-500 text-sm uppercase font-bold">Color</span>
                                <span className="text-gray-900 font-medium">{viewVehicle.color}</span>
                            </div>
                            <div className="pt-4">
                                <button 
                                    onClick={() => setViewVehicle(null)}
                                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition"
                                >
                                    Close Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}