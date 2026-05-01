<?php

namespace Database\Factories;

use App\Models\Cliente;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Cliente>
 */
class ClienteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'team_id' => Team::factory(),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'age' => fake()->numberBetween(18, 80),
            'weight' => (string) fake()->numberBetween(50, 110),
            'height' => (string) fake()->numberBetween(150, 195),
            'plan' => fake()->randomElement(['Mensal', 'Trimestral', 'Anual']),
            'status' => fake()->randomElement(['Ativo', 'Pendente', 'Inativo']),
            'last_visit' => fake()->optional()->date(),
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'state' => fake()->state(),
            'zip' => fake()->postcode(),
        ];
    }
}
