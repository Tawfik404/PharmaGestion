<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreOrdonnanceRequest extends FormRequest
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
            'client_id' => ['required', 'exists:clients,id'],
            'medicament_id' => ['required', 'exists:medicaments,id'],
            'date_ordonnance' => ['required', 'date'],
            'dosage_medicament' => ['required', 'string', 'max:255'],
            'instructions_posologie' => ['required', 'string'],
            'scan' => ['sometimes', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:10240'],
            'notes' => ['sometimes', 'nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'required' => 'Le champ :attribute est obligatoire.',
            'exists' => 'La référence sélectionnée est introuvable.',
            'date' => 'La date de l’ordonnance doit être valide.',
            'max' => 'Le champ :attribute ne doit pas dépasser :max caractères.',
            'file' => 'Le scan doit être un fichier valide.',
            'mimes' => 'Le scan doit être au format :values.',
        ];
    }
}
