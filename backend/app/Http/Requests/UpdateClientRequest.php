<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateClientRequest extends FormRequest
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
            'nom' => ['sometimes', 'string', 'max:255'],
            'prenom' => ['sometimes', 'string', 'max:255'],
            'date_naissance' => ['sometimes', 'nullable', 'date'],
            'telephone' => ['sometimes', 'string', 'max:50'],
            'email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'adresse' => ['sometimes', 'nullable', 'string'],
            'is_discounted' => ['sometimes', 'boolean'],
            'discount_rate' => ['sometimes', 'numeric', 'min:0', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'email' => 'L’adresse email doit être valide.',
            'date' => 'La date de naissance doit être valide.',
            'numeric' => 'Le taux de remise doit être un nombre valide.',
            'min' => 'Le champ :attribute doit être supérieur ou égal à :min.',
            'max' => 'Le champ :attribute ne doit pas dépasser :max.',
            'boolean' => 'Le champ :attribute doit être vrai ou faux.',
        ];
    }
}
