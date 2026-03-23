<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'registration_date',
        'expiration_date',
        'status'
    ];

    // Relationship: Registration belongs to one Vehicle
    
    // Relationship: A registration record can have many payments (e.g., installments or penalties)
    public function payment()
    {
        return $this->hasMany(Payment::class);
    
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}