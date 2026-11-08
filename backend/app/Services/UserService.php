<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpKernel\Exception\HttpException;

class UserService
{
    public function __construct(private readonly UserRepositoryInterface $users)
    {
    }

    public function list(?string $search, int $perPage = 10): LengthAwarePaginator
    {
        return $this->users->paginate($search, max(1, min($perPage, 100)));
    }

    public function show(int $id): User
    {
        return $this->users->findOrFail($id);
    }

    public function create(array $data): User
    {
        return $this->users->create($data);
    }

    public function update(int $id, array $data): User
    {
        $user = $this->users->findOrFail($id);

        // Si no se envía contraseña, se conserva la actual.
        if (empty($data['password'])) {
            unset($data['password']);
        }

        return $this->users->update($user, $data);
    }

    public function delete(int $id, int $actingUserId): void
    {
        if ($id === $actingUserId) {
            throw new HttpException(422, 'No puedes eliminar tu propio usuario.');
        }

        $this->users->delete($this->users->findOrFail($id));
    }
}
