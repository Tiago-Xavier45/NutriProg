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
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <div className="flex items-center justify-center mb-8">
                    <div className="bg-emerald-100 p-3 rounded-xl">
                        <UtensilsCrossed className="w-10 h-10 text-emerald-600" />
                    </div>
                </div>
                
                <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
                    NutriPro
                </h1>
                <p className="text-center text-gray-500 mb-8">
                    Sistema de Gestão Nutricional
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Senha
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all pr-12"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Entrando...
                            </span>
                        ) : (
                            'Entrar'
                        )}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-400 mt-6">
                    Nutricare Software © 2024
                </p>
            </div>
        </div>
    );
}
