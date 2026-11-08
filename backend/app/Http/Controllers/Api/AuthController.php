<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function __construct(private readonly AuthService $auth)
    {
    }

    public function login(LoginRequest $request): JsonResponse
    {
        return response()->json($this->auth->login($request->validated()));
    }

    public function me(): UserResource
    {
        return new UserResource($this->auth->me());
    }

    public function refresh(): JsonResponse
    {
        return response()->json($this->auth->refresh());
    }

    public function logout(): JsonResponse
    {
        $this->auth->logout();

        return response()->json(['message' => 'Sesión cerrada correctamente.']);
    }
}
