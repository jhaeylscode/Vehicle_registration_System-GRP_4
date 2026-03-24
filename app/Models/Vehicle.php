<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    // These fields must match your database columns exactly
    protected $fillable = [
        'owner_id', 
        'plate_number', 
        'type', 
        'brand', 
        'color'
    ];
    public function registration()
    {
        return $this->hasMany(Registration::class);
    }

    public function owner()
    {
        return $this->belongsTo(Owner::class);
    }
}