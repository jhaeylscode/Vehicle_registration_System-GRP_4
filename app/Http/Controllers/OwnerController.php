<?php

namespace App\Http\Controllers;

use App\Models\Owner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OwnerController extends Controller
{
    public function index() {
        return Inertia::render('Owners/Index', [
        // This deep-loads: Owner -> Vehicles -> Registrations -> Payments
        'owners' => Owner::with('vehicles.registration.payment')->latest()->get()
    ]);
    }
    public function store(Request $request) {
        $request->validate([
            'full_name' => 'required',
            'address' => 'required',
            'contact' => 'required',
            'license_number' => 'required|unique:owners',
        ]);
        Owner::create($request->all());
        return redirect()->back()->with('message', 'Owner added successfully!');
    }

    public function update(Request $request, Owner $owner) {
        $validated = $request->validate([
        'full_name' => 'required|string|max:255',
        'address' => 'required|string',
        'contact' => 'required|string',
        'license_number' => 'required|string|unique:owners,license_number,' . $owner->id,
    ]);

    $owner->update($validated);
    return redirect()->back();
    }
    

    public function destroy(Owner $owner) {
        $owner->delete();
        return redirect()->back();
    }
}