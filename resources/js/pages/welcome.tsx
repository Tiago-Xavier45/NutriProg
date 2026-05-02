import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth, currentTeam } = usePage().props;
    const dashboardUrl = currentTeam ? dashboard(currentTeam.slug) : '/';

    return (
        <>
            <Head title="NutriPro">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="relative min-h-screen overflow-hidden bg-[#F7F5F0] font-['DM_Sans',sans-serif] text-[#1a1a18]">
                {/* Círculos de fundo */}
                <div className="pointer-events-none absolute -top-20 -right-16 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(134,166,120,0.13)_0%,transparent_70%)]" />
                <div className="pointer-events-none absolute bottom-0 left-5 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(180,160,110,0.10)_0%,transparent_70%)]" />

                {/* Nav */}
                <nav className="relative z-10 flex items-center justify-between px-12 py-7">
                    <div className="flex items-baseline gap-0.5">
                        <span className="font-['Cormorant_Garamond',serif] text-[22px] font-light tracking-wide">
                            NutriPro
                        </span>
                        <span className="mb-0.5 ml-0.5 inline-block h-[5px] w-[5px] rounded-full bg-[#6B9B5E]" />
                    </div>

                    <div className="flex items-center gap-3">
                        {auth.user ? (
                            <Link
                                href={dashboardUrl}
                                className="rounded-sm bg-[#3D5C33] px-5 py-2 text-[13px] font-medium tracking-wide text-white transition hover:-translate-y-px hover:bg-[#2e4526]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="px-5 py-2 text-[13px] text-[#555] tracking-wide transition hover:text-[#1a1a18]"
                                >
                                    Entrar
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="rounded-sm bg-[#3D5C33] px-5 py-2 text-[13px] font-medium tracking-wide text-white transition hover:-translate-y-px hover:bg-[#2e4526]"
                                    >
                                        Criar conta
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero */}
                <section className="relative z-10 flex flex-col items-center px-12 pt-16 pb-10 text-center">
                    {/* Eyebrow */}
                    <div className="mb-5 flex animate-[fadeUp_0.6s_ease_0.1s_both] items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#6B9B5E]">
                        <span className="h-px w-7 bg-[#6B9B5E] opacity-60" />
                        Plataforma de nutrição
                        <span className="h-px w-7 bg-[#6B9B5E] opacity-60" />
                    </div>

                    {/* Headline */}
                    <h1 className="mb-2 max-w-[560px] animate-[fadeUp_0.7s_ease_0.22s_both] font-['Cormorant_Garamond',serif] text-[64px] font-light leading-[1.08]">
                        Cuide dos seus{' '}
                        <em className="italic text-[#6B9B5E]">pacientes</em>{' '}
                        com precisão
                    </h1>

                    {/* Subtítulo */}
                    <p className="mb-9 mt-2 max-w-[380px] animate-[fadeUp_0.6s_ease_0.38s_both] text-[15px] font-light leading-[1.7] text-[#6b6b63]">
                        Gerencie consultas, planos alimentares e evolução
                        nutricional em um único lugar — simples, elegante e eficiente.
                    </p>

                    {/* CTAs */}
                    <div className="mb-16 flex animate-[fadeUp_0.6s_ease_0.5s_both] items-center gap-3.5">
                        {auth.user ? (
                            <Link
                                href={dashboardUrl}
                                className="rounded-sm bg-[#3D5C33] px-8 py-3 text-[14px] font-medium tracking-wide text-white transition hover:-translate-y-px hover:bg-[#2e4526]"
                            >
                                Acessar dashboard
                            </Link>
                        ) : (
                            <>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="rounded-sm bg-[#3D5C33] px-8 py-3 text-[14px] font-medium tracking-wide text-white transition hover:-translate-y-px hover:bg-[#2e4526]"
                                    >
                                        Começar agora
                                    </Link>
                                )}
                                <Link
                                    href={login()}
                                    className="rounded-sm border border-[rgba(61,92,51,0.4)] px-7 py-3 text-[14px] tracking-wide text-[#3D5C33] transition hover:border-[#3D5C33] hover:bg-[rgba(61,92,51,0.05)]"
                                >
                                    Fazer login
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="mb-12 flex w-full max-w-[480px] animate-[fadeUp_0.5s_ease_0.62s_both] items-center gap-5">
                        <div className="h-px flex-1 bg-[rgba(0,0,0,0.08)]" />
                        <span className="text-[11px] uppercase tracking-[0.08em] text-[#aaa]">
                            O que você encontra
                        </span>
                        <div className="h-px flex-1 bg-[rgba(0,0,0,0.08)]" />
                    </div>

                    {/* Features */}
                    <div className="grid w-full max-w-[560px] animate-[fadeUp_0.6s_ease_0.72s_both] grid-cols-3 gap-px overflow-hidden rounded-sm border border-[rgba(0,0,0,0.07)] bg-[rgba(0,0,0,0.07)]">
                        {[
                            {
                                title: 'Gestão de clientes',
                                desc: 'Histórico completo e evolução de cada paciente',
                                icon: (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#6B9B5E" strokeWidth="1.5" strokeLinecap="round" className="mb-2.5 h-7 w-7 opacity-70">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                        <circle cx="9" cy="7" r="4"/>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                                    </svg>
                                ),
                            },
                            {
                                title: 'Planos alimentares',
                                desc: 'Crie e ajuste dietas com facilidade',
                                icon: (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#6B9B5E" strokeWidth="1.5" strokeLinecap="round" className="mb-2.5 h-7 w-7 opacity-70">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                        <polyline points="14 2 14 8 20 8"/>
                                        <line x1="16" y1="13" x2="8" y2="13"/>
                                        <line x1="16" y1="17" x2="8" y2="17"/>
                                    </svg>
                                ),
                            },
                            {
                                title: 'Evolução & métricas',
                                desc: 'Acompanhe resultados ao longo do tempo',
                                icon: (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#6B9B5E" strokeWidth="1.5" strokeLinecap="round" className="mb-2.5 h-7 w-7 opacity-70">
                                        <line x1="18" y1="20" x2="18" y2="10"/>
                                        <line x1="12" y1="20" x2="12" y2="4"/>
                                        <line x1="6" y1="20" x2="6" y2="14"/>
                                    </svg>
                                ),
                            },
                        ].map((f) => (
                            <div
                                key={f.title}
                                className="bg-[#F7F5F0] p-5 text-left transition hover:bg-[#f0ede6]"
                            >
                                {f.icon}
                                <div className="text-[13px] font-medium tracking-wide">{f.title}</div>
                                <div className="mt-1 text-[12px] font-light leading-relaxed text-[#888]">{f.desc}</div>
                            </div>
                        ))}
                    </div>

                    <p className="mt-8 text-[11px] tracking-wide text-[#bbb]">
                        Seguro · Rápido · Feito para nutricionistas
                    </p>
                </section>
            </div>
        </>
    );
}