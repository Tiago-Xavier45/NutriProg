import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Plus, Trash2, X, Save, TrendingUp, TrendingDown, Minus, ChevronLeft,} from 'lucide-react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid,Tooltip, ResponsiveContainer, Legend,} from 'recharts';
import { PageHeader, ContentCard } from '@/components/ui';
import { Link } from '@inertiajs/react';

interface Avaliacao {
    id: number;
    data: string;
    dataRaw: string;
    peso: number | null;
    altura: number | null;
    imc: number | null;
    imcClassificacao: string | null;
    percentualGordura: number | null;
    massaGorda: number | null;
    massaMagra: number | null;
    percentualMassaMuscular: number | null;
    circAbdominal: number | null;
    circQuadril: number | null;
    circBraco: number | null;
    circCoxa: number | null;
    rcq: number | null;
    dobraTricipital: number | null;
    dobraSubescapular: number | null;
    dobraAbdominal: number | null;
    dobraSuprailiaca: number | null;
    dobraCoxa: number | null;
    observacoes: string | null;
}

interface Cliente {
    id: number;
    name: string;
    age: number | null;
    weight: string | null;
    height: string | null;
}

interface Props {
    cliente: Cliente;
    avaliacoes: Avaliacao[];
}

const inputClass = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30";
const labelClass = "mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground";

const emptyForm = {
    data_avaliacao: new Date().toISOString().split('T')[0],
    peso: '', altura: '',
    percentual_gordura: '', massa_gorda: '', massa_magra: '',
    percentual_massa_muscular: '',
    circ_abdominal: '', circ_quadril: '', circ_braco: '', circ_coxa: '',
    dobra_tricipital: '', dobra_subescapular: '', dobra_abdominal: '',
    dobra_suprailiaca: '', dobra_coxa: '',
    observacoes: '',
};

function imcColor(imc: number) {
    if (imc < 18.5) return 'text-blue-500';
    if (imc < 25)   return 'text-primary';
    if (imc < 30)   return 'text-amber-500';
    return 'text-destructive';
}

function Delta({ current, previous, unit = '' }: { current: number | null; previous: number | null; unit?: string }) {
    if (!current || !previous) return null;
    const diff = current - previous;
    if (Math.abs(diff) < 0.01) return <span className="flex items-center gap-0.5 text-xs text-muted-foreground"><Minus className="h-3 w-3" /> estável</span>;
    const positive = diff > 0;
    return (
        <span className={`flex items-center gap-0.5 text-xs ${positive ? 'text-destructive' : 'text-primary'}`}>
            {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {positive ? '+' : ''}{diff.toFixed(1)}{unit}
        </span>
    );
}

export default function Avaliacoes({ cliente, avaliacoes }: Props) {
    const page = usePage();
    const baseUrl = page.props.currentTeam ? `/${page.props.currentTeam.slug}` : '';
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [activeChart, setActiveChart] = useState<'peso' | 'gordura' | 'circunferencias'>('peso');

    // IMC calculado em tempo real no form
    const imcPreview = form.peso && form.altura
        ? (parseFloat(form.peso) / (parseFloat(form.altura) ** 2)).toFixed(1)
        : null;

    const handleSave = () => {
        router.post(`${baseUrl}/clientes/${cliente.id}/avaliacoes`, form, {
            onSuccess: () => { setShowModal(false); setForm(emptyForm); },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Excluir esta avaliação?')) {
            router.delete(`${baseUrl}/clientes/${cliente.id}/avaliacoes/${id}`);
        }
    };

    const ultima  = avaliacoes[avaliacoes.length - 1] ?? null;
    const penultima = avaliacoes[avaliacoes.length - 2] ?? null;

    // Dados para os gráficos
    const chartData = avaliacoes.map(a => ({
        data:        a.data,
        peso:        a.peso,
        gordura:     a.percentualGordura,
        muscular:    a.percentualMassaMuscular,
        abdominal:   a.circAbdominal,
        quadril:     a.circQuadril,
        imc:         a.imc,
    }));

    return (
        <div className="space-y-6">
            {/* Header com voltar */}
            <div className="flex items-center gap-3">
                <Link
                    href={`${baseUrl}/pacientes`}
                    className="flex items-center gap-1 rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <PageHeader
                    title={`Avaliações — ${cliente.name}`}
                    count={`${avaliacoes.length} avaliações registradas`}
                    action={{ label: 'Nova Avaliação', icon: Plus, onClick: () => setShowModal(true) }}
                />
            </div>

            {/* Cards de resumo da última avaliação */}
            {ultima && (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                        { label: 'Peso', value: ultima.peso, unit: 'kg', prev: penultima?.peso ?? null },
                        { label: 'IMC', value: ultima.imc, unit: '', prev: penultima?.imc ?? null, extra: ultima.imcClassificacao },
                        { label: '% Gordura', value: ultima.percentualGordura, unit: '%', prev: penultima?.percentualGordura ?? null },
                        { label: 'Circ. Abdominal', value: ultima.circAbdominal, unit: 'cm', prev: penultima?.circAbdominal ?? null },
                    ].map(({ label, value, unit, prev, extra }) => (
                        <div key={label} className="rounded-xl border border-border bg-card p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                            <p className={`mt-1 text-2xl font-bold ${label === 'IMC' && value ? imcColor(value) : 'text-foreground'}`}>
                                {value != null ? `${value}${unit}` : '—'}
                            </p>
                            {extra && <p className="text-xs text-muted-foreground">{extra}</p>}
                            <Delta current={value} previous={prev} unit={unit} />
                        </div>
                    ))}
                </div>
            )}

            {/* Gráficos */}
            {avaliacoes.length >= 2 && (
                <ContentCard>
                    <div className="p-4">
                        {/* Tabs de gráfico */}
                        <div className="mb-4 flex gap-2">
                            {(['peso', 'gordura', 'circunferencias'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveChart(tab)}
                                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                                        activeChart === tab
                                            ? 'bg-primary text-primary-foreground'
                                            : 'border border-border text-muted-foreground hover:bg-muted'
                                    }`}
                                >
                                    {tab === 'peso' ? 'Peso & IMC' : tab === 'gordura' ? 'Composição Corporal' : 'Circunferências'}
                                </button>
                            ))}
                        </div>

                        <ResponsiveContainer width="100%" height={260}>
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
                                <XAxis dataKey="data" tick={{ fontSize: 11 }} stroke="var(--color-text-tertiary)" />
                                <YAxis tick={{ fontSize: 11 }} stroke="var(--color-text-tertiary)" />
                                <Tooltip
                                    contentStyle={{
                                        background: 'var(--color-background-primary)',
                                        border: '0.5px solid var(--color-border-secondary)',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                    }}
                                />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />

                                {activeChart === 'peso' && <>
                                    <Line type="monotone" dataKey="peso" name="Peso (kg)" stroke="#3D5C33" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} connectNulls />
                                    <Line type="monotone" dataKey="imc"  name="IMC"       stroke="#6B9B5E" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="4 4" connectNulls />
                                </>}

                                {activeChart === 'gordura' && <>
                                    <Line type="monotone" dataKey="gordura"  name="% Gordura"  stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                                    <Line type="monotone" dataKey="muscular" name="% Muscular" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                                </>}

                                {activeChart === 'circunferencias' && <>
                                    <Line type="monotone" dataKey="abdominal" name="Abdominal (cm)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                                    <Line type="monotone" dataKey="quadril"   name="Quadril (cm)"   stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                                </>}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </ContentCard>
            )}

            {/* Tabela de histórico */}
            <ContentCard>
                <div className="overflow-x-auto">
                    {avaliacoes.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-sm text-muted-foreground">Nenhuma avaliação registrada ainda.</p>
                            <button onClick={() => setShowModal(true)} className="mt-3 text-sm text-primary hover:underline">
                                Registrar primeira avaliação
                            </button>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-muted/40">
                                    {['Data', 'Peso', 'IMC', '% Gordura', '% Muscular', 'C. Abdominal', 'C. Quadril', 'RCQ', 'Ações'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {[...avaliacoes].reverse().map((a) => (
                                    <tr key={a.id} className="hover:bg-muted/20 transition">
                                        <td className="px-4 py-3 text-sm font-medium text-foreground">{a.data}</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">{a.peso != null ? `${a.peso} kg` : '—'}</td>
                                        <td className="px-4 py-3 text-sm">
                                            {a.imc != null
                                                ? <span className={`font-medium ${imcColor(a.imc)}`}>{a.imc}</span>
                                                : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">{a.percentualGordura != null ? `${a.percentualGordura}%` : '—'}</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">{a.percentualMassaMuscular != null ? `${a.percentualMassaMuscular}%` : '—'}</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">{a.circAbdominal != null ? `${a.circAbdominal} cm` : '—'}</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">{a.circQuadril != null ? `${a.circQuadril} cm` : '—'}</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">{a.rcq != null ? a.rcq : '—'}</td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => handleDelete(a.id)} className="rounded-md p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </ContentCard>

            {/* Modal nova avaliação */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card text-card-foreground shadow-xl">

                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-5">
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">Nova Avaliação</h2>
                                <p className="mt-0.5 text-xs text-muted-foreground">{cliente.name}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-6 p-6">
                            {/* Data */}
                            <div>
                                <label className={labelClass}>Data da Avaliação *</label>
                                <input type="date" value={form.data_avaliacao}
                                    onChange={e => setForm({ ...form, data_avaliacao: e.target.value })}
                                    className={inputClass} />
                            </div>

                            {/* Básico */}
                            <div>
                                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Medidas Básicas</p>
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                    <div>
                                        <label className={labelClass}>Peso (kg)</label>
                                        <input type="number" step="0.1" placeholder="Ex: 75.5"
                                            value={form.peso} onChange={e => setForm({ ...form, peso: e.target.value })}
                                            className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Altura (m)</label>
                                        <input type="number" step="0.01" placeholder="Ex: 1.75"
                                            value={form.altura} onChange={e => setForm({ ...form, altura: e.target.value })}
                                            className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>IMC</label>
                                        <div className={`${inputClass} bg-muted/40 cursor-not-allowed flex items-center justify-between`}>
                                            <span className={imcPreview ? imcColor(parseFloat(imcPreview)) : 'text-muted-foreground'}>
                                                {imcPreview ?? 'Calculado auto.'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Composição corporal */}
                            <div>
                                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Composição Corporal</p>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: '% Gordura', key: 'percentual_gordura', placeholder: 'Ex: 22.5' },
                                        { label: 'Massa Gorda (kg)', key: 'massa_gorda', placeholder: 'Ex: 16.8' },
                                        { label: 'Massa Magra (kg)', key: 'massa_magra', placeholder: 'Ex: 58.7' },
                                        { label: '% Massa Muscular', key: 'percentual_massa_muscular', placeholder: 'Ex: 38.2' },
                                    ].map(({ label, key, placeholder }) => (
                                        <div key={key}>
                                            <label className={labelClass}>{label}</label>
                                            <input type="number" step="0.1" placeholder={placeholder}
                                                value={(form as any)[key]}
                                                onChange={e => setForm({ ...form, [key]: e.target.value })}
                                                className={inputClass} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Circunferências */}
                            <div>
                                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Circunferências (cm)</p>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Abdominal', key: 'circ_abdominal', placeholder: 'Ex: 88' },
                                        { label: 'Quadril', key: 'circ_quadril', placeholder: 'Ex: 100' },
                                        { label: 'Braço', key: 'circ_braco', placeholder: 'Ex: 32' },
                                        { label: 'Coxa', key: 'circ_coxa', placeholder: 'Ex: 55' },
                                    ].map(({ label, key, placeholder }) => (
                                        <div key={key}>
                                            <label className={labelClass}>{label}</label>
                                            <input type="number" step="0.1" placeholder={placeholder}
                                                value={(form as any)[key]}
                                                onChange={e => setForm({ ...form, [key]: e.target.value })}
                                                className={inputClass} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Dobras cutâneas */}
                            <div>
                                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Dobras Cutâneas (mm)</p>
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                    {[
                                        { label: 'Tricipital', key: 'dobra_tricipital' },
                                        { label: 'Subescapular', key: 'dobra_subescapular' },
                                        { label: 'Abdominal', key: 'dobra_abdominal' },
                                        { label: 'Suprailíaca', key: 'dobra_suprailiaca' },
                                        { label: 'Coxa', key: 'dobra_coxa' },
                                    ].map(({ label, key }) => (
                                        <div key={key}>
                                            <label className={labelClass}>{label}</label>
                                            <input type="number" step="0.1" placeholder="mm"
                                                value={(form as any)[key]}
                                                onChange={e => setForm({ ...form, [key]: e.target.value })}
                                                className={inputClass} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Observações */}
                            <div>
                                <label className={labelClass}>Observações</label>
                                <textarea rows={3} placeholder="Anotações da consulta..."
                                    value={form.observacoes}
                                    onChange={e => setForm({ ...form, observacoes: e.target.value })}
                                    className={`${inputClass} resize-none`} />
                            </div>
                        </div>

                        <div className="sticky bottom-0 flex gap-3 border-t border-border bg-card px-6 py-5">
                            <button onClick={() => setShowModal(false)}
                                className="flex-1 rounded-md border border-border bg-transparent px-4 py-2 text-sm text-foreground transition hover:bg-muted">
                                Cancelar
                            </button>
                            <button onClick={handleSave}
                                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
                                <Save className="h-4 w-4" /> Salvar Avaliação
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

Avaliacoes.layout = {
    breadcrumbs: [
        { title: 'Pacientes', href: '#' },
        { title: 'Avaliações', href: '#' },
    ],
};