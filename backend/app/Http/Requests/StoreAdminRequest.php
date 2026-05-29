<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAdminRequest extends FormRequest
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
            'email' => ['required', 'email', 'max:255', 'unique:admins,email'],
            'password' => ['required', 'string', 'min:6'],
            'telephone' => ['required', 'string', 'max:50'],
            'role' => ['required', 'in:gestionnaire,caissier,pharmacien'],
        ];
    }

    public function messages(): array
    {
        return [
            'required' => 'Le champ :attribute est obligatoire.',
            'email' => 'L’adresse email doit être valide.',
            'unique' => 'Cette adresse email est déjà utilisée.',
            'min' => 'Le champ :attribute doit contenir au moins :min caractères.',
            'max' => 'Le champ :attribute ne doit pas dépasser :max caractères.',
            'role.in' => 'Le rôle sélectionné est invalide.',
        ];
    }
}
