<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ], [
            'email.required' => 'L adresse email est obligatoire.',
            'email.email' => 'L adresse email doit etre valide.',
            'password.required' => 'Le mot de passe est obligatoire.',
        ]);

        $utilisateur = Admin::where('email', $request->email)->first();

        if (! $utilisateur || ! Hash::check($request->password, $utilisateur->password)) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        $token = $utilisateur->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion reussie',
            'utilisateur' => $utilisateur,
            'token' => $token,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'utilisateur' => $request->user(),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Deconnexion effectuee avec succes',
        ]);
    }
}
