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
        Schema::create('medicaments', function (Blueprint $table) {
            $table->id();
            $table->integer("numero");
            $table->string("photo");
            $table->string("designation");
            $table->integer("prix_achat");
            $table->integer("prix_vente");
            $table->integer("qte_min");
            $table->integer("qte_dispo");
            $table->string("utilisations");
            $table->string("contre-indications");
            $table->string("effets_secondaires");
            $table->decimal("taux_prise_en_charge",5,2);
            $table->integer("code_barre");
            $table->date("date_expiration");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicaments');
    }
};
