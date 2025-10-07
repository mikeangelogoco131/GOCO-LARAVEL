<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ProfileUpdateTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function guest_cannot_update_profile()
    {
        $response = $this->post('/profile', [
            'name' => 'Guest',
            'email' => 'guest@example.com',
        ], ['Accept' => 'application/json']);

        $response->assertStatus(401); // JSON requests get 401 Unauthenticated
    }

    /** @test */
    public function user_can_update_name_and_email()
    {
        /** @var User $user */
        $user = User::factory()->create([
            'name' => 'Old Name',
            'email' => 'old@example.com',
            'password' => Hash::make('password'),
        ]);

        $this->actingAs($user);

        $response = $this->post('/profile', [
            'name' => 'New Name',
            'email' => 'new@example.com',
        ], ['Accept' => 'application/json']);

        $response->assertStatus(200);
        $response->assertJsonPath('user.name', 'New Name');
        $response->assertJsonPath('user.email', 'new@example.com');
    }

    /** @test */
    public function user_can_update_password_with_confirmation()
    {
        /** @var User $user */
        $user = User::factory()->create([
            'password' => Hash::make('oldpass'),
        ]);

        $this->actingAs($user);

        $response = $this->post('/profile', [
            'name' => $user->name,
            'email' => $user->email,
            'password' => 'newpass123',
            'password_confirmation' => 'newpass123',
        ], ['Accept' => 'application/json']);

        $response->assertStatus(200);
        $this->assertTrue(Hash::check('newpass123', $user->fresh()->password));
    }
}
