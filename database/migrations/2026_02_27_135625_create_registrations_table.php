<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('registrations', function (Blueprint $table) {
    $table->id();
    $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
    $table->date('registration_date');
    $table->date('expiration_date');
    $table->enum('status', ['Active', 'Expired', 'Pending'])->default('Pending');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registrations');
    }
};
