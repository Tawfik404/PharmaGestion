<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Http\Requests\StoreAdminRequest;
use App\Http\Requests\UpdateAdminRequest;
use Illuminate\Support\Facades\Hash;

class AdminController
{
    public function index()
    {
        return response()->json(Admin::all());
    }

    public function create()
    {
        //
    }

    public function store(StoreAdminRequest $request)
    {
        $donnees = $request->validated();
        $donnees['password'] = Hash::make($donnees['password']);

        return response()->json([
            'message' => 'Utilisateur ajouté avec succès',
            'donnees' => Admin::create($donnees),
        ], 201);
    }

    public function show(Admin $admin)
    {
        return response()->json(['donnees' => $admin]);
    }

    public function edit(Admin $admin)
    {
        //
    }

    public function update(UpdateAdminRequest $request, Admin $admin)
    {
        $donnees = $request->validated();

        if (isset($donnees['password'])) {
            $donnees['password'] = Hash::make($donnees['password']);
        }

        $admin->update($donnees);

        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès',
            'donnees' => $admin,
        ]);
    }

    public function destroy(Admin $admin)
    {
        $admin->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }
}
