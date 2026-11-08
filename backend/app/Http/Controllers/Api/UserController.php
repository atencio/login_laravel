<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UserController extends Controller
{
    public function __construct(private readonly UserService $users)
    {
    }

    public function index(Request $request)
    {
        return UserResource::collection(
            $this->users->list($request->query('search'), (int) $request->query('per_page', 10))
        );
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->users->create($request->validated());

        return (new UserResource($user))->response()->setStatusCode(201);
    }

    public function show(int $user): UserResource
    {
        return new UserResource($this->users->show($user));
    }

    public function update(UpdateUserRequest $request, int $user): UserResource
    {
        return new UserResource($this->users->update($user, $request->validated()));
    }

    public function destroy(int $user): Response
    {
        $this->users->delete($user, (int) auth('api')->id());

        return response()->noContent();
    }
}
