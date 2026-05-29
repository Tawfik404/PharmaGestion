<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'telephone',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}
