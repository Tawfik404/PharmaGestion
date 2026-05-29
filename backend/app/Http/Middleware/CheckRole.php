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

        // Gestionnaire est le super-admin (acces complet)
        if ($userRole === 'gestionnaire') {
            return $next($request);
        }

        $normalizedRoles = array_map(fn($r) => strtolower(trim($r)), $roles);

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
