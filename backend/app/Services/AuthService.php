<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Auth\AuthenticationException;

class AuthService
{
    public function login(array $credentials): array
    {
        $token = auth('api')->attempt($credentials);

        if (! $token) {
            throw new AuthenticationException('Correo o contraseña incorrectos.');
        }

        return $this->tokenPayload($token);
    }

    public function refresh(): array
    {
        return $this->tokenPayload(auth('api')->refresh());
    }

    public function logout(): void
    {
        auth('api')->logout();
    }

    public function me(): User
    {
        return auth('api')->user();
    }

    private function tokenPayload(string $token): array
    {
        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
        ];
    }
}
