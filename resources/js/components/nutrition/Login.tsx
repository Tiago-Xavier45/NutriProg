import { useState } from 'react';
import { useAuth } from './AuthContext';
import { UtensilsCrossed, Eye, EyeOff, AlertCircle } from 'lucide-react';

export function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Digite seu email');
            return;
        }
        if (password.length < 4) {
            setError('Senha deve ter pelo menos 4 caracteres');
            return;
        }

        setLoading(true);
        const success = await login(email, password);
        setLoading(false);

        if (!success) {
            setError('Email ou senha incorretos');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-gray-100 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <div className="mb-8 flex items-center justify-center">
                    <div className="rounded-xl bg-emerald-100 p-3">
                        <UtensilsCrossed className="h-10 w-10 text-emerald-600" />
                    </div>
                </div>

                <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
                    NutriPro
                </h1>
                <p className="mb-8 text-center text-gray-500">
                    Sistema de Gestão Nutricional
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Senha
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 transition-all outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-emerald-600 py-3 font-medium text-white transition-all hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg
                                    className="h-5 w-5 animate-spin"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>
                                Entrando...
                            </span>
                        ) : (
                            'Entrar'
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-gray-400">
                    Nutricare Software © 2024
                </p>
            </div>
        </div>
    );
}
