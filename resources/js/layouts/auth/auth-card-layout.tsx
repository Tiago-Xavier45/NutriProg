import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh font-['DM_Sans',sans-serif] bg-background">
            {/* Painel esquerdo decorativo — fixo, intencional em ambos os modos */}
            <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] flex-col justify-between bg-[#2C4425] p-10 relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,rgba(107,155,94,0.25)_0%,transparent_65%),radial-gradient(ellipse_at_80%_10%,rgba(180,200,160,0.12)_0%,transparent_55%)]" />
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 38px, rgba(255,255,255,0.025) 38px, rgba(255,255,255,0.025) 39px)'
                    }}
                />

                {/* Logo */}
                <Link href={home()} className="relative z-10 flex items-baseline gap-0.5 w-fit">
                    <span className="font-['Cormorant_Garamond',serif] text-[20px] font-light tracking-[0.05em] text-white">
                        NutriPro
                    </span>
                    <span className="mb-0.5 ml-0.5 inline-block h-[5px] w-[5px] rounded-full bg-[#6B9B5E]" />
                </Link>

                {/* Quote central */}
                <div className="relative z-10">
                    <h2 className="font-['Cormorant_Garamond',serif] text-[38px] font-light leading-[1.12] text-white mb-4">
                        Nutrição com<br />
                        <em className="italic text-[#9DC98E]">inteligência</em><br />
                        e cuidado
                    </h2>
                    <p className="text-[13px] font-light text-white/50 leading-relaxed max-w-[240px]">
                        A plataforma que acompanha você e seus pacientes em cada etapa da jornada nutricional.
                    </p>
                </div>

                {/* Espaço vazio onde estavam os stats removidos */}
                <div />
            </div>

            {/* Painel direito — formulário */}
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-background">
                {/* Logo mobile */}
                <Link href={home()} className="flex lg:hidden items-baseline gap-0.5 mb-10">
                    <span className="font-['Cormorant_Garamond',serif] text-[22px] font-light tracking-wide text-foreground">
                        NutriPro
                    </span>
                    <span className="mb-0.5 ml-0.5 inline-block h-[5px] w-[5px] rounded-full bg-accent" />
                </Link>

                <div className="w-full max-w-[400px]">
                    {(title || description) && (
                        <div className="mb-8">
                            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-accent mb-2">
                                Bem-vindo de volta
                            </p>
                            {title && (
                                <h1 className="font-['Cormorant_Garamond',serif] text-[38px] font-light leading-[1.1] text-foreground">
                                    {title}
                                </h1>
                            )}
                            {description && (
                                <p className="mt-1.5 text-[13px] font-light text-muted-foreground leading-relaxed">
                                    {description}
                                </p>
                            )}
                        </div>
                    )}

                    {children}
                </div>
            </div>
        </div>
    );
}