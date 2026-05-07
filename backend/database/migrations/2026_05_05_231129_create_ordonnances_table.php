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
        Schema::create('ordonnances', function (Blueprint $table) {
            $table->id();
            $table->foreignId("client_id")->constrained()->onDelete("cascade");
            $table->foreignId("medicament_id")->constrained()->onDelete("cascade");
            $table->date("date_ordonnance");
            $table->string("dosage_medicament");
            $table->text("instructions_posologie");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ordonnances');
    }
};
