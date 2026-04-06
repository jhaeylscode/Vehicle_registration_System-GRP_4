import React, { useState, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    
    // Desktop: Sidebar starts expanded. Mobile: Sidebar starts closed.
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Sidebar Items Configuration
    const navItems = [
        { name: 'Dashboard', route: 'dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'Owners', route: 'owners.index', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { name: 'Vehicles', route: 'vehicles.index', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
        { name: 'Registrations', route: 'registrations.index', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { name: 'Payments', route: 'payments.index', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    ];

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            
            {/* --- MOBILE OVERLAY --- */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 md:hidden" 
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* --- SIDEBAR --- */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 transform bg-slate-900 text-white transition-all duration-300 ease-in-out
                md:relative md:translate-x-0
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                ${isSidebarOpen ? 'w-64' : 'w-20'}
            `}>
                <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
                    <div className="flex items-center gap-3">
                        <ApplicationLogo className="w-8 h-8 fill-current text-blue-400" />
                        {isSidebarOpen && <span className="text-xl font-bold tracking-tight">VS System</span>}
                    </div>
                </div>

                <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
                    {isSidebarOpen && <div className="mb-2 px-3 text-xs font-semibold uppercase text-slate-500">Menu</div>}
                    
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={route(item.route)}
                            className={`
                                flex items-center gap-4 rounded-lg px-3 py-2.5 transition-colors duration-200
                                ${route().current(item.route) ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                            `}
                        >
                            <svg className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                            </svg>
                            {isSidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Collapse Toggle Button (Desktop Only) */}
                <div className="hidden md:block border-t border-slate-800 p-4">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                        className="flex w-full items-center justify-center rounded bg-slate-800 p-2 text-slate-400 hover:text-white transition"
                    >
                    {isSidebarOpen ? <span>← Close</span> : <span>→</span>}
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex flex-1 flex-col overflow-hidden">
                
                {/* TOP HEADER */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-8">
                    
                    {/* Hamburger Button (Mobile) */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="rounded p-2 text-gray-600 hover:bg-gray-100 md:hidden"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className="text-sm md:text-base">{header}</div>

                    <div className="flex items-center gap-4">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition">
                                    <span className="hidden sm:inline">{user.name}</span>
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                        {user.name[0]}
                                    </div>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}