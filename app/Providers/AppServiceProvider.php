<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDates();
        $this->configureCommands();
        $this->configureModels();
        $this->configureUrl();
        $this->configureVite();
        $this->configurePasswords();
    }

    private function configureDates(): void {
        Date::use(CarbonImmutable::class);
    }

    private function configureCommands(): void
    {
        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );
    }

    private function configureModels(): void
    {
        Model::shouldBeStrict();
        Model::unguard();
    }

    private function configureUrl(): void
    {
        if (app()->isProduction()) {
            URL::forceScheme('https');
        }
    }

    private function configureVite(): void
    {
        Vite::usePrefetchStrategy('aggressive');
    }

    private function configurePasswords(): void
    {
        Password::defaults(function () {
            return Password::min(12)
                ->mixedCase()
                ->numbers()
                ->symbols()
                ->uncompromised();
        });
    }
}
