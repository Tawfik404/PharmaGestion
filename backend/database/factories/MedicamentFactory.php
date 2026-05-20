<?php

namespace Database\Factories;

use App\Models\Medicament;
use Illuminate\Database\Eloquent\Factories\Factory;

class MedicamentFactory extends Factory
{
    protected $model = Medicament::class;

    private static int $counter = 0;

    private static array $medicaments = [
        ['designation' => 'Doliprane 500mg', 'categorie' => 'Antalgique', 'prix_achat' => 1.80, 'prix_vente' => 4.00, 'taux_prise_en_charge' => 70, 'utilisations' => 'Traitement des douleurs légères à modérées et de la fièvre.', 'contre_indications' => 'Insuffisance hépatique sévère, allergie au paracétamol.', 'effets_secondaires' => 'Rare: éruption cutanée, hypotension. Exceptionnel: thrombopénie.'],
        ['designation' => 'Efferalgan 1g', 'categorie' => 'Antalgique', 'prix_achat' => 2.20, 'prix_vente' => 5.00, 'taux_prise_en_charge' => 70, 'utilisations' => 'Douleurs intenses, fièvre élevée chez l\'adulte.', 'contre_indications' => 'Insuffisance hépatique, alcoolisme chronique.', 'effets_secondaires' => 'Réactions cutanées rares. Risque de lésion hépatique en cas de surdosage.'],
        ['designation' => 'Dafalgan 500mg', 'categorie' => 'Antalgique', 'prix_achat' => 1.90, 'prix_vente' => 4.20, 'taux_prise_en_charge' => 70, 'utilisations' => 'Douleurs dentaires, maux de tête, états fébriles.', 'contre_indications' => 'Hypersensibilité au paracétamol.', 'effets_secondaires' => 'Rares réactions allergiques.'],
        ['designation' => 'Spasfon 80mg', 'categorie' => 'Antalgique', 'prix_achat' => 2.50, 'prix_vente' => 5.50, 'taux_prise_en_charge' => 65, 'utilisations' => 'Traitement des spasmes et douleurs abdominales.', 'contre_indications' => 'Glaucome à angle fermé, adénome prostatique.', 'effets_secondaires' => 'Sécheresse buccale, troubles de l\'accommodation.'],
        ['designation' => 'Augmentin 1g', 'categorie' => 'Antibiotique', 'prix_achat' => 5.50, 'prix_vente' => 11.00, 'taux_prise_en_charge' => 80, 'utilisations' => 'Infections ORL, respiratoires, urinaires et cutanées.', 'contre_indications' => 'Allergie aux pénicillines, mononucléose infectieuse.', 'effets_secondaires' => 'Diarrhée, nausées, éruption cutanée.'],
        ['designation' => 'Amoxicilline 500mg', 'categorie' => 'Antibiotique', 'prix_achat' => 3.00, 'prix_vente' => 6.50, 'taux_prise_en_charge' => 80, 'utilisations' => 'Infections bactériennes à germes sensibles.', 'contre_indications' => 'Allergie aux bêta-lactamines.', 'effets_secondaires' => 'Troubles digestifs, candidose, éruption cutanée.'],
        ['designation' => 'Azithromycine 500mg', 'categorie' => 'Antibiotique', 'prix_achat' => 7.00, 'prix_vente' => 14.00, 'taux_prise_en_charge' => 80, 'utilisations' => 'Infections respiratoires, angines, infections cutanées.', 'contre_indications' => 'Hypersensibilité aux macrolides, insuffisance hépatique.', 'effets_secondaires' => 'Troubles digestifs, maux de tête, altération du goût.'],
        ['designation' => 'Flagyl 250mg', 'categorie' => 'Antibiotique', 'prix_achat' => 3.50, 'prix_vente' => 7.00, 'taux_prise_en_charge' => 75, 'utilisations' => 'Infections à anaérobies, parasitoses intestinales.', 'contre_indications' => 'Hypersensibilité, alcoolisme.', 'effets_secondaires' => 'Goût métallique, nausées, neuropathie périphérique.'],
        ['designation' => 'Ibuprofène 400mg', 'categorie' => 'Anti-inflammatoire', 'prix_achat' => 2.80, 'prix_vente' => 6.00, 'taux_prise_en_charge' => 65, 'utilisations' => 'Douleurs inflammatoires, arthralgies, règles douloureuses.', 'contre_indications' => 'Ulcère gastroduodénal, insuffisance rénale, grossesse 3e trimestre.', 'effets_secondaires' => 'Troubles digestifs, risque cardiovasculaire.'],
        ['designation' => 'Naproxène 500mg', 'categorie' => 'Anti-inflammatoire', 'prix_achat' => 4.00, 'prix_vente' => 8.50, 'taux_prise_en_charge' => 65, 'utilisations' => 'Traitement des inflammations articulaires et musculaires.', 'contre_indications' => 'Insuffisance hépatique, antécédent d\'ulcère.', 'effets_secondaires' => 'Dyspepsie, vertiges, somnolence.'],
        ['designation' => 'Voltarène 50mg', 'categorie' => 'Anti-inflammatoire', 'prix_achat' => 3.20, 'prix_vente' => 7.00, 'taux_prise_en_charge' => 65, 'utilisations' => 'Rhumatismes inflammatoires, crises de goutte.', 'contre_indications' => 'Insuffisance cardiaque, rénale ou hépatique.', 'effets_secondaires' => 'Nausées, céphalées, rétention hydrosodée.'],
        ['designation' => 'Omeprazole 20mg', 'categorie' => 'Gastro', 'prix_achat' => 4.50, 'prix_vente' => 10.00, 'taux_prise_en_charge' => 75, 'utilisations' => 'Reflux gastro-oesophagien, ulcère gastroduodénal.', 'contre_indications' => 'Hypersensibilité, utilisation conjointe avec le nelfinavir.', 'effets_secondaires' => 'Maux de tête, diarrhée, douleurs abdominales.'],
        ['designation' => 'Gaviscon 250ml', 'categorie' => 'Gastro', 'prix_achat' => 5.00, 'prix_vente' => 11.00, 'taux_prise_en_charge' => 50, 'utilisations' => 'Brûlures d\'estomac, reflux acide.', 'contre_indications' => 'Hypersensibilité, insuffisance rénale sévère.', 'effets_secondaires' => 'Ballonnements, nausées.'],
        ['designation' => 'Smecta 3g', 'categorie' => 'Gastro', 'prix_achat' => 3.00, 'prix_vente' => 6.50, 'taux_prise_en_charge' => 60, 'utilisations' => 'Traitement des diarrhées aiguës et chroniques.', 'contre_indications' => 'Hypersensibilité, occlusion intestinale.', 'effets_secondaires' => 'Constipation légère.'],
        ['designation' => 'Metformine 850mg', 'categorie' => 'Antidiabétique', 'prix_achat' => 3.00, 'prix_vente' => 6.50, 'taux_prise_en_charge' => 85, 'utilisations' => 'Diabète de type 2, prédiabète.', 'contre_indications' => 'Insuffisance rénale, insuffisance hépatique, insuffisance cardiaque.', 'effets_secondaires' => 'Nausées, diarrhée, goût métallique.'],
        ['designation' => 'Amaryl 2mg', 'categorie' => 'Antidiabétique', 'prix_achat' => 6.00, 'prix_vente' => 13.00, 'taux_prise_en_charge' => 85, 'utilisations' => 'Diabète de type 2 non équilibré par le régime seul.', 'contre_indications' => 'Diabète de type 1, acidocétose.', 'effets_secondaires' => 'Hypoglycémie, troubles digestifs.'],
        ['designation' => 'Januvia 100mg', 'categorie' => 'Antidiabétique', 'prix_achat' => 25.00, 'prix_vente' => 50.00, 'taux_prise_en_charge' => 80, 'utilisations' => 'Diabète de type 2 en complément de la metformine.', 'contre_indications' => 'Insuffisance rénale sévère.', 'effets_secondaires' => 'Infection ORL, maux de tête, troubles digestifs.'],
        ['designation' => 'Ventoline 100µg', 'categorie' => 'Respiratoire', 'prix_achat' => 7.00, 'prix_vente' => 15.00, 'taux_prise_en_charge' => 90, 'utilisations' => 'Crise d\'asthme, bronchite asthmatiforme.', 'contre_indications' => 'Hypersensibilité au salbutamol.', 'effets_secondaires' => 'Tremblements, tachycardie, nervosité.'],
        ['designation' => 'Seretide 250µg', 'categorie' => 'Respiratoire', 'prix_achat' => 25.00, 'prix_vente' => 52.00, 'taux_prise_en_charge' => 85, 'utilisations' => 'Traitement de fond de l\'asthme persistant.', 'contre_indications' => 'Hypersensibilité, tuberculose pulmonaire.', 'effets_secondaires' => 'Candidose oropharyngée, raucité de la voix.'],
        ['designation' => 'Pulmicort 200µg', 'categorie' => 'Respiratoire', 'prix_achat' => 12.00, 'prix_vente' => 25.00, 'taux_prise_en_charge' => 85, 'utilisations' => 'Asthme, BPCO, rhinite allergique.', 'contre_indications' => 'Infection respiratoire non traitée.', 'effets_secondaires' => 'Irritation de la gorge, candidose buccale.'],
        ['designation' => 'Levothyrox 75µg', 'categorie' => 'Hormone', 'prix_achat' => 4.50, 'prix_vente' => 9.00, 'taux_prise_en_charge' => 80, 'utilisations' => 'Traitement de l\'hypothyroïdie, goitre euthyroïdien.', 'contre_indications' => 'Thyréotoxicose, insuffisance surrénalienne.', 'effets_secondaires' => 'Palpitations, insomnie, perte de poids en cas de surdosage.'],
        ['designation' => 'Dostinex 0.5mg', 'categorie' => 'Hormone', 'prix_achat' => 15.00, 'prix_vente' => 30.00, 'taux_prise_en_charge' => 70, 'utilisations' => 'Hyperprolactinémie, inhibition de la lactation.', 'contre_indications' => 'Hypersensibilité, hypertension non contrôlée.', 'effets_secondaires' => 'Nausées, vertiges, hypotension orthostatique.'],
        ['designation' => 'Duphaston 10mg', 'categorie' => 'Hormone', 'prix_achat' => 8.00, 'prix_vente' => 16.00, 'taux_prise_en_charge' => 75, 'utilisations' => 'Troubles du cycle, endométriose, ménopause.', 'contre_indications' => 'Tumeur hépatique, thrombophlébite.', 'effets_secondaires' => 'Saignements intermenstruels, sensibilité mammaire.'],
        ['designation' => 'Pioglitazone 30mg', 'categorie' => 'Antidiabétique', 'prix_achat' => 10.00, 'prix_vente' => 22.00, 'taux_prise_en_charge' => 80, 'utilisations' => 'Diabète de type 2, résistance à l\'insuline.', 'contre_indications' => 'Insuffisance cardiaque, maladie hépatique.', 'effets_secondaires' => 'Prise de poids, risque de fracture.'],
        ['designation' => 'Atrovent 0.025%', 'categorie' => 'Respiratoire', 'prix_achat' => 8.50, 'prix_vente' => 18.00, 'taux_prise_en_charge' => 85, 'utilisations' => 'BPCO, emphysème, bronchite chronique.', 'contre_indications' => 'Hypersensibilité aux anticholinergiques.', 'effets_secondaires' => 'Sécheresse buccale, toux.'],
        ['designation' => 'Molipaxin 100mg', 'categorie' => 'Hormone', 'prix_achat' => 6.00, 'prix_vente' => 12.00, 'taux_prise_en_charge' => 70, 'utilisations' => 'Traitement de la dépression, anxiété généralisée.', 'contre_indications' => 'Hypersensibilité, infarctus récent.', 'effets_secondaires' => 'Somnolence, sécheresse buccale, constipation.'],
        ['designation' => 'Dexeryl crème', 'categorie' => 'Antalgique', 'prix_achat' => 3.50, 'prix_vente' => 7.50, 'taux_prise_en_charge' => 50, 'utilisations' => 'Soins de la peau sèche, eczéma, psoriasis.', 'contre_indications' => 'Hypersensibilité', 'effets_secondaires' => 'Rares réactions cutanées.'],
    ];

    public function definition(): array
    {
        self::$counter++;
        $index = (self::$counter - 1) % count(self::$medicaments);
        $med = self::$medicaments[$index];
        $dateExp = fake()->dateTimeBetween('-6 months', '+18 months');

        return [
            'numero' => str_pad((string) self::$counter, 3, '0', STR_PAD_LEFT),
            'designation' => $med['designation'],
            'categorie' => $med['categorie'],
            'prix_achat' => $med['prix_achat'],
            'prix_vente' => $med['prix_vente'],
            'qte_min' => fake()->randomElement([10, 15, 20, 25, 30, 50]),
            'qte_dispo' => fake()->randomElement([0, 2, 5, 8, 12, 25, 45, 60, 100, 150, 200, 300]),
            'taux_prise_en_charge' => $med['taux_prise_en_charge'],
            'code_barre' => fake()->numerify('6###########'),
            'date_expiration' => $dateExp->format('Y-m-d'),
            'utilisations' => $med['utilisations'],
            'contre_indications' => $med['contre_indications'],
            'effets_secondaires' => $med['effets_secondaires'],
            'photo' => null,
        ];
    }

    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'qte_dispo' => fake()->randomElement([0, 1, 2, 3, 5]),
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'date_expiration' => fake()->dateTimeBetween('-12 months', '-1 day')->format('Y-m-d'),
            'qte_dispo' => fake()->randomElement([0, 5, 10, 20]),
        ]);
    }

    public function wellStocked(): static
    {
        return $this->state(fn (array $attributes) => [
            'qte_dispo' => fake()->randomElement([100, 150, 200, 300, 500]),
        ]);
    }
}
