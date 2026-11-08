<?php

namespace App\Providers;

use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Eloquent\UserRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Inversión de dependencias: los servicios dependen de la interfaz, no de Eloquent.
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
    }
}
