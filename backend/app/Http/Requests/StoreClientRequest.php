<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreClientRequest extends FormRequest
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
            'nom' => ['required', 'string', 'max:255'],
            'prenom' => ['required', 'string', 'max:255'],
            'date_naissance' => ['nullable', 'date'],
            'telephone' => ['required', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'adresse' => ['nullable', 'string'],
            'is_discounted' => ['sometimes', 'boolean'],
            'discount_rate' => ['sometimes', 'numeric', 'min:0', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'required' => 'Le champ :attribute est obligatoire.',
            'email' => 'L’adresse email doit être valide.',
            'date' => 'La date de naissance doit être valide.',
            'numeric' => 'Le taux de remise doit être un nombre valide.',
            'min' => 'Le champ :attribute doit être supérieur ou égal à :min.',
            'max' => 'Le champ :attribute ne doit pas dépasser :max.',
            'boolean' => 'Le champ :attribute doit être vrai ou faux.',
        ];
    }
}
