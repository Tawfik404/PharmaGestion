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
            return response()->json(['message' => 'Utilisateur non autorise'], 403);
        }

        if ($user->role === 'pharmacien') {
            return $next($request);
        }

        if (! in_array($user->role, $roles, true)) {
            return response()->json(['message' => 'Utilisateur non autorise'], 403);
        }

        return $next($request);
    }
}
