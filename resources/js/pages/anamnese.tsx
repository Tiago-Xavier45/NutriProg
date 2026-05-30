import { useState, useEffect } from 'react';
import { router, usePage, Link } from '@inertiajs/react';
import { ChevronLeft, Save, Calculator, Info } from 'lucide-react';
import { PageHeader, ContentCard } from '@/components/ui';

interface Cliente {
    id: number;
    name: string;
    age: number | null;
    weight: string | null;
    height: string | null;
}

interface AnamneseData {
    sexo: string | null;
    nivel_atividade: string | null;
    doencas_preexistentes: string | null;
    medicamentos: string | null;
    alergias_alimentares: string | null;
    intolerâncias: string | null;
    historico_familiar: string | null;
    rotina_alimentar: string | null;
    alimentos_preferidos: string | null;
    alimentos_nao_gosta: string | null;
    refeicoes_por_dia: number | null;
    atividade_fisica_descricao: string | null;
    horas_sono: number | null;
    nivel_estresse: string | null;
    objetivo_tratamento: string | null;
    observacoes: string | null;
    tmb: number | null;
    get: number | null;
    meta_calorica: number | null;
    meta_proteina: number | null;
    meta_carboidrato: number | null;
    meta_gordura: number | null;
}

interface Props {
    cliente: Cliente;
    anamnese: AnamneseData | null;
}

const inputClass = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30";
const labelClass = "mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground";
const textareaClass = `${inputClass} resize-none`;

const NIVEIS_ATIVIDADE = [
    { value: 'sedentario',           label: 'Sedentário',              desc: 'Pouco ou nenhum exercício' },
    { value: 'levemente_ativo',      label: 'Levemente ativo',         desc: 'Exercício leve 1–3x/semana' },
    { value: 'moderadamente_ativo',  label: 'Moderadamente ativo',     desc: 'Exercício moderado 3–5x/semana' },
    { value: 'muito_ativo',          label: 'Muito ativo',             desc: 'Exercício intenso 6–7x/semana' },
    { value: 'extremamente_ativo',   label: 'Extremamente ativo',      desc: 'Atleta ou trabalho físico pesado' },
];

const FATORES = {
    sedentario: 1.2, levemente_ativo: 1.375,
    moderadamente_ativo: 1.55, muito_ativo: 1.725, extremamente_ativo: 1.9,
};

export default function Anamnese({ cliente, anamnese }: Props) {
    const page = usePage();
    const baseUrl = page.props.currentTeam ? `/${page.props.currentTeam.slug}` : '';

    const [form, setForm] = useState({
        sexo:                       anamnese?.sexo ?? '',
        nivel_atividade:            anamnese?.nivel_atividade ?? '',
        doencas_preexistentes:      anamnese?.doencas_preexistentes ?? '',
        medicamentos:               anamnese?.medicamentos ?? '',
        alergias_alimentares:       anamnese?.alergias_alimentares ?? '',
        'intolerâncias':            anamnese?.['intolerâncias'] ?? '',
        historico_familiar:         anamnese?.historico_familiar ?? '',
        rotina_alimentar:           anamnese?.rotina_alimentar ?? '',
        alimentos_preferidos:       anamnese?.alimentos_preferidos ?? '',
        alimentos_nao_gosta:        anamnese?.alimentos_nao_gosta ?? '',
        refeicoes_por_dia:          anamnese?.refeicoes_por_dia?.toString() ?? '',
        atividade_fisica_descricao: anamnese?.atividade_fisica_descricao ?? '',
        horas_sono:                 anamnese?.horas_sono?.toString() ?? '',
        nivel_estresse:             anamnese?.nivel_estresse ?? '',
        objetivo_tratamento:        anamnese?.objetivo_tratamento ?? '',
        observacoes:                anamnese?.observacoes ?? '',
        meta_calorica:              anamnese?.meta_calorica?.toString() ?? '',
    });

    // Cálculo TMB/GET em tempo real
    const [tmb, setTmb] = useState<number | null>(anamnese?.tmb ?? null);
    const [get, setGet] = useState<number | null>(anamnese?.get ?? null);
    const [macros, setMacros] = useState({
        proteina:    anamnese?.meta_proteina    ?? null,
        carboidrato: anamnese?.meta_carboidrato ?? null,
        gordura:     anamnese?.meta_gordura     ?? null,
    });

    useEffect(() => {
        if (!form.sexo || !form.nivel_atividade || !cliente.age || !cliente.weight || !cliente.height) {
            setTmb(null); setGet(null);
            return;
        }
        const peso   = parseFloat(cliente.weight!);
        const altura = parseFloat(String(cliente.height).replace(',', '.')) * 100; // cm
        const idade  = cliente.age;

        let tmbCalc = (10 * peso) + (6.25 * altura) - (5 * idade);
        tmbCalc += form.sexo === 'masculino' ? 5 : -161;
        tmbCalc = Math.round(tmbCalc * 100) / 100;

        const fator = FATORES[form.nivel_atividade as keyof typeof FATORES] ?? 1.2;
        const getCalc = Math.round(tmbCalc * fator * 100) / 100;

        setTmb(tmbCalc);
        setGet(getCalc);

        const meta = parseFloat(form.meta_calorica) || getCalc;
        setMacros({
            proteina:    Math.round((meta * 0.25) / 4 * 10) / 10,
            carboidrato: Math.round((meta * 0.50) / 4 * 10) / 10,
            gordura:     Math.round((meta * 0.25) / 9 * 10) / 10,
        });
    }, [form.sexo, form.nivel_atividade, form.meta_calorica, cliente]);

    const handleSave = () => {
        router.post(`${baseUrl}/clientes/${cliente.id}/anamnese`, {
            ...form,
            tmb, get,
            meta_calorica:    parseFloat(form.meta_calorica) || get,
            meta_proteina:    macros.proteina,
            meta_carboidrato: macros.carboidrato,
            meta_gordura:     macros.gordura,
        }, { onSuccess: () => {} });
    };

    const f = (key: keyof typeof form) => ({
        value: form[key],
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
            setForm({ ...form, [key]: e.target.value }),
    });

    return (
        <div className="space-y-6 pb-10">
            <div className="flex items-center gap-3">
                <Link href={`${baseUrl}/pacientes`} className="flex items-center gap-1 rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground">
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <PageHeader
                    title={`Anamnese — ${cliente.name}`}
                    description="Ficha clínica e nutricional do paciente"
                />
            </div>

            {/* TMB/GET — calculadora em destaque */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                <div className="mb-4 flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Cálculo de TMB / GET</h3>
                    <span className="text-xs text-muted-foreground">— Fórmula Mifflin-St Jeor</span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className={labelClass}>Sexo *</label>
                        <select {...f('sexo')} className={inputClass}>
                            <option value="">Selecione</option>
                            <option value="masculino">Masculino</option>
                            <option value="feminino">Feminino</option>
                            <option value="outro">Outro</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Nível de Atividade *</label>
                        <select {...f('nivel_atividade')} className={inputClass}>
                            <option value="">Selecione</option>
                            {NIVEIS_ATIVIDADE.map(n => (
                                <option key={n.value} value={n.value}>{n.label} — {n.desc}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Dados do paciente usados no cálculo */}
                <div className="mt-3 flex flex-wrap gap-3">
                    {[
                        { label: 'Idade', value: cliente.age ? `${cliente.age} anos` : null },
                        { label: 'Peso', value: cliente.weight ? `${cliente.weight} kg` : null },
                        { label: 'Altura', value: cliente.height ? `${cliente.height} m` : null },
                    ].map(({ label, value }) => (
                        <div key={label} className={`rounded-md border px-3 py-1.5 text-xs ${value ? 'border-border bg-card' : 'border-destructive/30 bg-destructive/5'}`}>
                            <span className="text-muted-foreground">{label}: </span>
                            <span className={value ? 'font-medium text-foreground' : 'text-destructive'}>
                                {value ?? 'não informado — edite o paciente'}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Resultado */}
                {tmb && get ? (
                    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="rounded-lg bg-card border border-border p-3 text-center">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">TMB</p>
                            <p className="text-xl font-bold text-foreground">{tmb}</p>
                            <p className="text-xs text-muted-foreground">kcal/dia</p>
                        </div>
                        <div className="rounded-lg bg-card border border-primary/30 p-3 text-center">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">GET</p>
                            <p className="text-xl font-bold text-primary">{get}</p>
                            <p className="text-xs text-muted-foreground">kcal/dia</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClass}>Meta Calórica (ajuste se necessário)</label>
                            <input
                                type="number"
                                placeholder={`Sugerido: ${get}`}
                                {...f('meta_calorica')}
                                className={inputClass}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                        <Info className="h-4 w-4 flex-shrink-0" />
                        Preencha sexo, nível de atividade e certifique-se que o paciente tem idade, peso e altura cadastrados.
                    </div>
                )}

                {/* Macros calculados */}
                {macros.proteina && (
                    <div className="mt-4">
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Distribuição de Macros Sugerida
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: 'Proteína', value: macros.proteina,    color: 'text-blue-500',  pct: '25%' },
                                { label: 'Carboidrato', value: macros.carboidrato, color: 'text-amber-500', pct: '50%' },
                                { label: 'Gordura', value: macros.gordura,    color: 'text-rose-500',  pct: '25%' },
                            ].map(({ label, value, color, pct }) => (
                                <div key={label} className="rounded-lg border border-border bg-card p-3 text-center">
                                    <p className="text-xs text-muted-foreground">{label} <span className="text-[10px]">({pct})</span></p>
                                    <p className={`text-lg font-bold ${color}`}>{value}g</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Histórico clínico */}
            <ContentCard>
                <div className="space-y-5 p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Histórico Clínico</p>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className={labelClass}>Doenças Preexistentes</label>
                            <textarea rows={3} placeholder="Ex: Diabetes tipo 2, hipertensão..." {...f('doencas_preexistentes')} className={textareaClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Medicamentos em Uso</label>
                            <textarea rows={3} placeholder="Ex: Metformina 500mg, Losartana..." {...f('medicamentos')} className={textareaClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Alergias Alimentares</label>
                            <textarea rows={2} placeholder="Ex: Amendoim, frutos do mar..." {...f('alergias_alimentares')} className={textareaClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Intolerâncias</label>
                            <textarea rows={2} placeholder="Ex: Lactose, glúten..." {...f('intolerâncias')} className={textareaClass} />
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClass}>Histórico Familiar</label>
                            <textarea rows={2} placeholder="Ex: Diabetes, obesidade, doenças cardiovasculares..." {...f('historico_familiar')} className={textareaClass} />
                        </div>
                    </div>
                </div>
            </ContentCard>

            {/* Hábitos */}
            <ContentCard>
                <div className="space-y-5 p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Hábitos Alimentares e de Vida</p>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className={labelClass}>Rotina Alimentar</label>
                            <textarea rows={3} placeholder="Descreva como é a alimentação diária..." {...f('rotina_alimentar')} className={textareaClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Alimentos Preferidos</label>
                            <textarea rows={3} placeholder="O que o paciente mais gosta de comer..." {...f('alimentos_preferidos')} className={textareaClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Alimentos que Não Gosta</label>
                            <textarea rows={2} placeholder="O que o paciente não come ou evita..." {...f('alimentos_nao_gosta')} className={textareaClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Atividade Física</label>
                            <textarea rows={2} placeholder="Ex: Caminhada 3x/semana, musculação..." {...f('atividade_fisica_descricao')} className={textareaClass} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Refeições por Dia</label>
                                <input type="number" min={1} max={10} placeholder="Ex: 5" {...f('refeicoes_por_dia')} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Horas de Sono</label>
                                <input type="number" min={1} max={24} placeholder="Ex: 7" {...f('horas_sono')} className={inputClass} />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Nível de Estresse</label>
                            <select {...f('nivel_estresse')} className={inputClass}>
                                <option value="">Selecione</option>
                                <option value="baixo">Baixo</option>
                                <option value="moderado">Moderado</option>
                                <option value="alto">Alto</option>
                                <option value="muito_alto">Muito alto</option>
                            </select>
                        </div>
                    </div>
                </div>
            </ContentCard>

            {/* Objetivo */}
            <ContentCard>
                <div className="space-y-4 p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Objetivo do Tratamento</p>
                    <div>
                        <label className={labelClass}>Objetivo Principal</label>
                        <textarea rows={3} placeholder="O que o paciente deseja alcançar com o acompanhamento nutricional..." {...f('objetivo_tratamento')} className={textareaClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Observações Gerais</label>
                        <textarea rows={3} placeholder="Anotações adicionais do nutricionista..." {...f('observacoes')} className={textareaClass} />
                    </div>
                </div>
            </ContentCard>

            {/* Botão salvar fixo */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg transition hover:bg-primary/90 hover:shadow-xl"
                >
                    <Save className="h-4 w-4" /> Salvar Anamnese
                </button>
            </div>
        </div>
    );
}

Anamnese.layout = {
    breadcrumbs: [
        { title: 'Pacientes', href: '#' },
        { title: 'Anamnese', href: '#' },
    ],
};