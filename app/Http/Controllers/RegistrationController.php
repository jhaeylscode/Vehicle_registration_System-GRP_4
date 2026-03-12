<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegistrationController extends Controller
{
       public function index()
{
    return Inertia::render('Registrations/Index', [
        // Load Registration -> Vehicle -> Owner
        'registrations' => Registration::with('vehicle.owner')->latest()->get(),
        'vehicles' => Vehicle::with('owner')->get() 
    ]);
}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'registration_date' => 'required|date',
            'expiration_date' => 'required|date|after:registration_date',
            'status' => 'required|string',
        ]);

        Registration::create($validated);

        return redirect()->back();
    }
    public function update(Request $request, Registration $registration)
{
    $validated = $request->validate([
        'vehicle_id' => 'required|exists:vehicles,id',
        'registration_date' => 'required|date',
        'expiration_date' => 'required|date',
        'status' => 'required|string',
    ]);

    $registration->update($validated);
    return redirect()->back();
}
public function destroy(Registration $registration)
{
    $registration->delete();
    return redirect()->back();
}
}