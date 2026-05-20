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
            $table->string("numero")->unique();
            $table->foreignId("client_id")->constrained()->onDelete("cascade");
            $table->foreignId("medecin_id")->nullable()->constrained()->nullOnDelete();
            $table->date("date_ordonnance");
            $table->string("statut")->default("En attente"); // En attente, Traitée, Annulée
            $table->string("scan_path")->nullable();
            $table->text("notes")->nullable();
            $table->timestamps();
        });

        Schema::create('ordonnance_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId("ordonnance_id")->constrained()->onDelete("cascade");
            $table->foreignId("medicament_id")->constrained()->onDelete("cascade");
            $table->string("dosage_medicament")->nullable();
            $table->text("instructions_posologie")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ordonnance_items');
        Schema::dropIfExists('ordonnances');
    }
};
