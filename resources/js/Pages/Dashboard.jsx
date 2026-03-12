import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

export default function Dashboard({ auth, stats }) {
    // Colors for the chart bars
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];


     const data = stats || {
        totalOwners: 0,
        totalVehicles: 0,
        pendingRegistrations: 0,
        totalRevenue: 0,
        vehicleBrandData: []
    };
    const statCards = [
    { name: 'Total Owners', value: data.totalOwners, color: 'bg-blue-500', icon: 'O' },
    { name: 'Vehicles Registered', value: data.totalVehicles, color: 'bg-green-500', icon: 'V' },
    { name: 'Pending Registrations', value: data.pendingRegistrations, color: 'bg-yellow-500', icon: 'R' },
    { 
        name: 'Total Revenue', 
        value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(data.totalRevenue),
            color: 'bg-purple-500', 
            icon: '₱' 
        
        
        },

        
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">System Overview</h2>}
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat) => (
                        <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center transition-transform hover:scale-105">
                            <div className={`w-12 h-12 rounded-lg ${stat.color} mr-4 flex items-center justify-center text-white font-bold text-xl`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Welcome Section (Spans 2 columns) */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-2 font-sans uppercase tracking-wide">
                            Welcome Back, {auth.user.name}!
                        </h3>
                        <p className="text-gray-600">
                            The dashboard is currently displaying live data. There are <strong>{data.pendingRegistrations}</strong> registrations that require your attention.
                        </p>
                        
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 border border-blue-100 bg-blue-50 rounded-lg">
                                <h4 className="font-bold text-blue-800 italic">Quick Action</h4>
                                <p className="text-sm text-blue-600 mb-3 font-medium">Add a new vehicle to the system.</p>
                                <a href={route('vehicles.index')} className="text-xs font-black text-blue-700 uppercase tracking-tighter hover:underline">Go to Vehicles →</a>
                            </div>
                            <div className="p-4 border border-green-100 bg-green-50 rounded-lg">
                                <h4 className="font-bold text-green-800 italic">Revenue Tracking</h4>
                                <p className="text-sm text-green-600 mb-3 font-medium">Check the latest payment history.</p>
                                <a href={route('payments.index')} className="text-xs font-black text-green-700 uppercase tracking-tighter hover:underline">Go to Payments →</a>
                            </div>
                        </div>
                    </div>

                    {/* NEW: VEHICLE MODEL CHART (Spans 1 column) */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-black text-gray-700 mb-6 uppercase tracking-widest flex items-center">
                           Model  Distribution
                        </h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.vehicleBrandData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis 
                                        dataKey="brand" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#6b7280', fontSize: 11}} 
                                    />
                                    <YAxis hide />
                                    <Tooltip 
                                        cursor={{fill: 'transparent'}}
                                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                    />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={35}>
                                        {data.vehicleBrandData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                            {data.vehicleBrandData.slice(0, 3).map((item, index) => (
                                <div key={item.brand} className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500 font-medium">{item.brand}</span>
                                    <span className="font-bold text-gray-700">{item.count} Units</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}