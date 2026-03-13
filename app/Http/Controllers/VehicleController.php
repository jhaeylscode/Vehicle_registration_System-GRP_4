<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Models\Owner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VehicleController extends Controller
{
    // Load the page with Data
    public function index()
    {
        return Inertia::render('Vehicles/Index', [
            // Get all vehicles and include the owner's name
            'vehicles' => Vehicle::with('owner')->latest()->get(),
            // Get all owners for the dropdown
            'owners' => Owner::all(),
        ]);
    }

    // Save the data to Database
    public function store(Request $request)
    {
        // 1. Validate the incoming data
        $validated = $request->validate([
            'owner_id'     => 'required|exists:owners,id',
            'plate_number' => 'required|unique:vehicles,plate_number',
            'type'         => 'required|string',
            'brand'        => 'required|string',
            'color'        => 'required|string',
        ]);

        // 2. Create the record in MySQL
        Vehicle::create($validated);

        // 3. Redirect back to update the UI list automatically
        return redirect()->back()->with('message', 'Vehicle added successfully!');
    }

    public function update(Request $request, Vehicle $vehicle)
{
    $validated = $request->validate([
        'owner_id' => 'required|exists:owners,id',
        'plate_number' => 'required|string|unique:vehicles,plate_number,' . $vehicle->id,
        'type' => 'required|string',
        'brand' => 'required|string',
        'color' => 'required|string',
    ]);

    $vehicle->update($validated);
    return redirect()->back();
}

    // Delete functionality
    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();
        return redirect()->back();
    }
}