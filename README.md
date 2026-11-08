# Nodo · Laravel (API + JWT) + React

```
proyecto/
├── backend-overlay/   # archivos que se copian encima de un Laravel recién creado
└── frontend/          # React + Vite
```

## Arquitectura del backend

`Controller → FormRequest → Service → Repository (interfaz) → Eloquent`

- **S**: cada clase hace una cosa (validar, orquestar, persistir, formatear).
- **O/L**: puedes cambiar la persistencia creando otra implementación de `UserRepositoryInterface`.
- **I**: la interfaz del repositorio solo expone lo que el servicio usa.
- **D**: `UserService` depende de la interfaz; el binding vive en `RepositoryServiceProvider`.

## 1. Backend (PHP 8.2+, Composer)

```bash
composer create-project laravel/laravel backend
cd backend
composer require php-open-source-saver/jwt-auth
php artisan vendor:publish --provider="PHPOpenSourceSaver\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret

# copia los archivos del proyecto encima (Linux/Mac)
cp -r ../backend-overlay/app ../backend-overlay/routes ../backend-overlay/database .
```

Edita a mano (hay ejemplos en `backend-overlay/config-snippets/`):

1. `config/auth.php`: guard `api` con driver `jwt` y úsalo como guard por defecto.
2. `bootstrap/providers.php`: registra `App\Providers\RepositoryServiceProvider::class`.
3. `bootstrap/app.php`: dentro de `withRouting(...)` agrega `api: __DIR__.'/../routes/api.php',`.

```bash
php artisan migrate --seed
php artisan serve
```

Usuario inicial: `admin@demo.com` / `Admin12345` (cámbialo en producción).

### Endpoints

| Método | Ruta | Protegida |
|---|---|---|
| POST | `/api/auth/login` | No |
| GET | `/api/auth/me` | Sí |
| POST | `/api/auth/refresh` | Sí |
| POST | `/api/auth/logout` | Sí |
| GET/POST | `/api/users` | Sí |
| GET/PUT/DELETE | `/api/users/{id}` | Sí |

## 2. Frontend (Node 18+)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Abre http://localhost:5173
