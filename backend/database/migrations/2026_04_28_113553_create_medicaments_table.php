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
            $table->string("numero")->unique();
            $table->string("designation");
            $table->string("categorie")->nullable();
            $table->decimal("prix_achat", 12, 2)->default(0);
            $table->decimal("prix_vente", 12, 2)->default(0);
            $table->integer("qte_min")->default(0);
            $table->integer("qte_dispo")->default(0);
            $table->text("utilisations")->nullable();
            $table->text("contre_indications")->nullable();
            $table->text("effets_secondaires")->nullable();
            $table->decimal("taux_prise_en_charge", 5, 2)->default(0);
            $table->string("code_barre")->nullable();
            $table->date("date_expiration")->nullable();
            $table->string("photo")->nullable();
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
