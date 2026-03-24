<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Registration;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
{
    return Inertia::render('Payments/Index', [
        // Load the deep relationship chain
        'payments' => Payment::with('registration.vehicle.owner')->latest()->get(),
        'registrations' => Registration::with('vehicle.owner')->get()
    ]);
}


    public function store(Request $request) {
        $request->validate([
            'registration_id' => 'required',
            'amount' => 'required|numeric',
            'payment_date' => 'required|date',
            'status' => 'required'
        ]);
        Payment::create($request->all());
        return redirect()->back();
    }

    public function update(Request $request, Payment $payment)
{
    $validated = $request->validate([
        'registration_id' => 'required|exists:registrations,id',
        'amount' => 'required|numeric|min:0',
        'payment_date' => 'required|date',
        'status' => 'required|string',
    ]);

    $payment->update($validated);
    return redirect()->back();
}
public function destroy(Payment $payment)
{
    $payment->delete();
    return redirect()->back();  
}

}