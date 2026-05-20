<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMedicamentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'photo' => ['sometimes', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'numero' => ['sometimes', 'integer'],
            'designation' => ['sometimes', 'string', 'max:255'],
            'categorie' => ['sometimes', 'nullable', 'string', 'max:255'],
            'prix_achat' => ['sometimes', 'numeric', 'min:0'],
            'prix_vente' => ['sometimes', 'numeric', 'min:0'],
            'qte_min' => ['sometimes', 'integer', 'min:0'],
            'qte_dispo' => ['sometimes', 'integer', 'min:0'],
            'utilisations' => ['sometimes', 'string'],
            'contre_indications' => ['sometimes', 'string'],
            'effets_secondaires' => ['sometimes', 'string'],
            'taux_prise_en_charge' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'code_barre' => ['sometimes', 'string', 'max:50'],
            'date_expiration' => ['sometimes', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'integer' => 'Le champ :attribute doit être un nombre entier.',
            'numeric' => 'Le champ :attribute doit être un nombre valide.',
            'min' => 'Le champ :attribute doit être supérieur ou égal à :min.',
            'max' => 'Le champ :attribute ne doit pas dépasser :max caractères.',
            'date' => 'Le champ :attribute doit être une date valide.',
            'image' => 'La photo doit être une image valide.',
            'mimes' => 'Le fichier doit être au format :values.',
        ];
    }
}
