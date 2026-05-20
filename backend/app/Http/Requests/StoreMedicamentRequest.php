<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMedicamentRequest extends FormRequest
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
            'numero' => ['required', 'integer'],
            'designation' => ['required', 'string', 'max:255'],
            'categorie' => ['sometimes', 'nullable', 'string', 'max:255'],
            'prix_achat' => ['required', 'numeric', 'min:0'],
            'prix_vente' => ['required', 'numeric', 'min:0'],
            'qte_min' => ['required', 'integer', 'min:0'],
            'qte_dispo' => ['required', 'integer', 'min:0'],
            'utilisations' => ['required', 'string'],
            'contre_indications' => ['required', 'string'],
            'effets_secondaires' => ['required', 'string'],
            'taux_prise_en_charge' => ['required', 'numeric'],
            'code_barre' => ['required', 'string', 'max:50'],
            'date_expiration' => ['required', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'required' => 'Le champ :attribute est obligatoire.',
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
