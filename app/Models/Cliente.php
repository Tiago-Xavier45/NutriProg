<?php

namespace App\Models;

use Database\Factories\ClienteFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cliente extends Model
{
    /** @use HasFactory<ClienteFactory> */
    use HasFactory;

    protected $fillable = [
        'team_id',
        'name',
        'email',
        'phone',
        'age',
        'weight',
        'height',
        'plan',
        'status',
        'last_visit',
        'address',
        'city',
        'state',
        'zip',
    ];

    protected $casts = [
        'age' => 'integer',
        'last_visit' => 'date',
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function scopeForTeam(Builder $query, Team $team): Builder
    {
        return $query->whereBelongsTo($team);
    }

    protected $table = 'clientes';
}
