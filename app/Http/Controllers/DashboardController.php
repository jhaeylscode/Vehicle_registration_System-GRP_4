<?php

namespace App\Http\Controllers;

use App\Models\Owner;
use App\Models\Vehicle;
use App\Models\Registration;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request for the Dashboard.
     */
    public function index()
    {
        return Inertia::render('Dashboard', [
            'stats' => [
                // Summary Cards
                'totalOwners' => Owner::count(),
                'totalVehicles' => Vehicle::count(),
                'pendingRegistrations' => Registration::where('status', 'Pending')->count(),
                'totalRevenue' => Payment::sum('amount') ?? 0,
                
                // Data for the Bar Chart
                'vehicleBrandData' => Vehicle::select('brand', DB::raw('count(*) as count'))
                    ->groupBy('brand')
                    ->orderBy('count', 'desc')
                    ->take(6) 
                    ->get(),
            ]
        ]);
    }
}