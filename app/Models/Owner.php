<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Owner extends Model
{
    use HasFactory;

    // Mass assignable fields (must match your migration)
    protected $fillable = [
        'full_name',
        'address',
        'contact',
        'license_number'
    ];

    // Relationship: An Owner can own multiple Vehicles
    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }
}