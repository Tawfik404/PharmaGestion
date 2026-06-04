<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            \Log::warning('Auth check failed: No user found.');
            return response()->json(['message' => 'Utilisateur non autorise'], 403);
        }

        $userRole = strtolower(trim($user->role));

        $normalizedRoles = array_map(fn($r) => strtolower(trim($r)), $roles);

        // Gestionnaire est le super-admin (acces complet), sauf pour les modules
        // ou il n'est pas explicitement autorise (Ordonnance, Point de vente).
        if ($userRole === 'gestionnaire' && in_array('gestionnaire', $normalizedRoles, true)) {
            return $next($request);
        }

        if (! in_array($userRole, $normalizedRoles, true)) {
            \Log::warning('Auth check failed: Role mismatch.', [
                'user_role' => $user->role,
                'normalized_user_role' => $userRole,
                'required_roles' => $normalizedRoles
            ]);
            return response()->json(['message' => 'Utilisateur non autorise'], 403);
        }

        return $next($request);
    }
}
