import { useState } from 'react';
import { router, usePage, Link } from '@inertiajs/react';
import { ChevronLeft, Plus, Trash2, X, Save, AlertTriangle, CheckCircle } from 'lucide-react';
import { PageHeader, ContentCard } from '@/components/ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Exame {
    id: number;
    data: string;
    dataRaw: string;
    glicemiaJejum: number | null;
    hemoglobinaGlicada: number | null;
    colesterolTotal: number | null;
    colesterolLdl: number | null;
    colesterolHdl: number | null;
    triglicerideos: number | null;
    hemoglobina: number | null;
    hematocrito: number | null;
    ferritina: number | null;
    vitaminaD: number | null;
    vitaminaB12: number | null;
    acidoFolico: number | null;
    zinco: number | null;
    magnesio: number | null;
    creatinina: number | null;
    ureia: number | null;
    tgo: number | null;
    tgp: number | null;
    tsh: number | null;
    t4Livre: number | null;
    observacoes: string | null;
}

interface Referencias {
    [key: string]: { min: number; max: number; unidade: string };
}

interface Props {
    cliente: { id: number; name: string };
    exames: Exame[];
    referencias: Referencias;
}

const inputClass = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30";
const labelClass = "mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground";

const emptyForm = {
    data_exame: new Date().toISOString().split('T')[0],
    glicemia_jejum: '', hemoglobina_glicada: '',
    colesterol_total: '', colesterol_ldl: '', colesterol_hdl: '', triglicerideos: '',
    hemoglobina: '', hematocrito: '', ferritina: '',
    vitamina_d: '', vitamina_b12: '', acido_folico: '', zinco: '', magnesio: '',
    creatinina: '', ureia: '', tgo: '', tgp: '',
    tsh: '', t4_livre: '', observacoes: '',
};

function StatusBadge({ value, refKey, refs }: { value: number | null; refKey: string; refs: Referencias }) {
    if (!value || !refs[refKey]) return <span className="text-sm text-muted-foreground">{value ?? '—'}</span>;
    const { min, max, unidade } = refs[refKey];
    const ok = value >= min && value <= max;
    return (
        <span className={`inline-flex items-center gap-1 text-sm font-medium ${ok ? 'text-primary' : 'text-destructive'}`}>
            {ok
                ? <CheckCircle className="h-3.5 w-3.5" />
                : <AlertTriangle className="h-3.5 w-3.5" />}
            {value} {unidade}
        </span>
    );
}

export default function Exames({ cliente, exames, referencias }: Props) {
    const page = usePage();
    const baseUrl = page.props.currentTeam ? `/${page.props.currentTeam.slug}` : '';
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [activeChart, setActiveChart] = useState<'glicemia' | 'lipidios' | 'vitaminas'>('glicemia');

    const handleSave = () => {
        router.post(`${baseUrl}/clientes/${cliente.id}/exames`, form, {
            onSuccess: () => { setShowModal(false); setForm(emptyForm); },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Excluir este exame?')) {
            router.delete(`${baseUrl}/clientes/${cliente.id}/exames/${id}`);
        }
    };

    const f = (key: keyof typeof form) => ({
        value: form[key],
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setForm({ ...form, [key]: e.target.value }),
    });

    // Dados para gráfico — ordem cronológica
    const chartData = [...exames].reverse().map(e => ({
        data:             e.data,
        glicemia:         e.glicemiaJejum,
        hemoglobinaGlic:  e.hemoglobinaGlicada,
        colesterolTotal:  e.colesterolTotal,
        ldl:              e.colesterolLdl,
        hdl:              e.colesterolHdl,
        triglicerideos:   e.triglicerideos,
        vitaminaD:        e.vitaminaD,
        vitaminaB12:      e.vitaminaB12,
    }));

    // Campos do formulário organizados por grupo
    const grupos = [
        {
            titulo: 'Glicemia',
            campos: [
                { label: 'Glicemia em Jejum (mg/dL)', key: 'glicemia_jejum',      placeholder: 'Ex: 95' },
                { label: 'Hemoglobina Glicada (%)',    key: 'hemoglobina_glicada', placeholder: 'Ex: 5.4' },
            ],
        },
        {
            titulo: 'Lipidograma',
            campos: [
                { label: 'Colesterol Total (mg/dL)', key: 'colesterol_total', placeholder: 'Ex: 180' },
                { label: 'LDL (mg/dL)',              key: 'colesterol_ldl',   placeholder: 'Ex: 110' },
                { label: 'HDL (mg/dL)',              key: 'colesterol_hdl',   placeholder: 'Ex: 55'  },
                { label: 'Triglicerídeos (mg/dL)',   key: 'triglicerideos',   placeholder: 'Ex: 120' },
            ],
        },
        {
            titulo: 'Hemograma',
            campos: [
                { label: 'Hemoglobina (g/dL)', key: 'hemoglobina', placeholder: 'Ex: 14.5' },
                { label: 'Hematócrito (%)',     key: 'hematocrito', placeholder: 'Ex: 43'   },
                { label: 'Ferritina (ng/mL)',   key: 'ferritina',   placeholder: 'Ex: 80'   },
            ],
        },
        {
            titulo: 'Vitaminas e Minerais',
            campos: [
                { label: 'Vitamina D (ng/mL)',  key: 'vitamina_d',   placeholder: 'Ex: 35'  },
                { label: 'Vitamina B12 (pg/mL)',key: 'vitamina_b12', placeholder: 'Ex: 400' },
                { label: 'Ácido Fólico',        key: 'acido_folico', placeholder: 'Ex: 7'   },
                { label: 'Zinco (µg/dL)',       key: 'zinco',        placeholder: 'Ex: 90'  },
                { label: 'Magnésio (mg/dL)',    key: 'magnesio',     placeholder: 'Ex: 2.1' },
            ],
        },
        {
            titulo: 'Função Renal e Hepática',
            campos: [
                { label: 'Creatinina (mg/dL)', key: 'creatinina', placeholder: 'Ex: 0.9' },
                { label: 'Ureia (mg/dL)',       key: 'ureia',      placeholder: 'Ex: 35'  },
                { label: 'TGO (U/L)',           key: 'tgo',        placeholder: 'Ex: 28'  },
                { label: 'TGP (U/L)',           key: 'tgp',        placeholder: 'Ex: 25'  },
            ],
        },
        {
            titulo: 'Tireoide',
            campos: [
                { label: 'TSH (mUI/L)',   key: 'tsh',      placeholder: 'Ex: 2.5'  },
                { label: 'T4 Livre (ng/dL)', key: 't4_livre', placeholder: 'Ex: 1.2' },
            ],
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Link href={`${baseUrl}/pacientes`} className="flex items-center gap-1 rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground">
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <PageHeader
                    title={`Exames — ${cliente.name}`}
                    count={`${exames.length} exames registrados`}
                    action={{ label: 'Novo Exame', icon: Plus, onClick: () => setShowModal(true) }}
                />
            </div>

            {/* Gráfico de evolução */}
            {exames.length >= 2 && (
                <ContentCard>
                    <div className="p-4">
                        <div className="mb-4 flex gap-2">
                            {(['glicemia', 'lipidios', 'vitaminas'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveChart(tab)}
                                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                                        activeChart === tab
                                            ? 'bg-primary text-primary-foreground'
                                            : 'border border-border text-muted-foreground hover:bg-muted'
                                    }`}
                                >
                                    {tab === 'glicemia' ? 'Glicemia' : tab === 'lipidios' ? 'Lipidograma' : 'Vitaminas'}
                                </button>
                            ))}
                        </div>
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
                                <XAxis dataKey="data" tick={{ fontSize: 11 }} stroke="var(--color-text-tertiary)" />
                                <YAxis tick={{ fontSize: 11 }} stroke="var(--color-text-tertiary)" />
                                <Tooltip contentStyle={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-secondary)', borderRadius: '8px', fontSize: '12px' }} />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                {activeChart === 'glicemia' && <>
                                    <Line type="monotone" dataKey="glicemia"        name="Glicemia jejum" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                                    <Line type="monotone" dataKey="hemoglobinaGlic" name="HbA1c %"        stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                                </>}
                                {activeChart === 'lipidios' && <>
                                    <Line type="monotone" dataKey="colesterolTotal" name="Col. Total" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                                    <Line type="monotone" dataKey="ldl"            name="LDL"        stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                                    <Line type="monotone" dataKey="hdl"            name="HDL"        stroke="#3D5C33" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                                    <Line type="monotone" dataKey="triglicerideos" name="Triglicerídeos" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                                </>}
                                {activeChart === 'vitaminas' && <>
                                    <Line type="monotone" dataKey="vitaminaD"   name="Vitamina D"   stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                                    <Line type="monotone" dataKey="vitaminaB12" name="Vitamina B12" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                                </>}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </ContentCard>
            )}

            {/* Tabela de histórico */}
            <ContentCard>
                {exames.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-sm text-muted-foreground">Nenhum exame registrado ainda.</p>
                        <button onClick={() => setShowModal(true)} className="mt-3 text-sm text-primary hover:underline">
                            Registrar primeiro exame
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-muted/40">
                                    {['Data', 'Glicemia', 'Col. Total', 'LDL', 'HDL', 'Triglicerídeos', 'Vitamina D', 'TSH', 'Ações'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {exames.map(e => (
                                    <tr key={e.id} className="hover:bg-muted/20 transition">
                                        <td className="px-4 py-3 text-sm font-medium text-foreground whitespace-nowrap">{e.data}</td>
                                        <td className="px-4 py-3"><StatusBadge value={e.glicemiaJejum}   refKey="glicemia_jejum"   refs={referencias} /></td>
                                        <td className="px-4 py-3"><StatusBadge value={e.colesterolTotal} refKey="colesterol_total" refs={referencias} /></td>
                                        <td className="px-4 py-3"><StatusBadge value={e.colesterolLdl}   refKey="colesterol_ldl"   refs={referencias} /></td>
                                        <td className="px-4 py-3"><StatusBadge value={e.colesterolHdl}   refKey="colesterol_hdl"   refs={referencias} /></td>
                                        <td className="px-4 py-3"><StatusBadge value={e.triglicerideos}  refKey="triglicerideos"   refs={referencias} /></td>
                                        <td className="px-4 py-3"><StatusBadge value={e.vitaminaD}       refKey="vitamina_d"       refs={referencias} /></td>
                                        <td className="px-4 py-3"><StatusBadge value={e.tsh}             refKey="tsh"              refs={referencias} /></td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => handleDelete(e.id)} className="rounded-md p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </ContentCard>

            {/* Modal novo exame */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card text-card-foreground shadow-xl">

                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-5">
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">Novo Exame Laboratorial</h2>
                                <p className="mt-0.5 text-xs text-muted-foreground">{cliente.name} — preencha apenas os campos disponíveis</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-6 p-6">
                            <div>
                                <label className={labelClass}>Data do Exame *</label>
                                <input type="date" {...f('data_exame')} className={inputClass} />
                            </div>

                            {grupos.map(({ titulo, campos }) => (
                                <div key={titulo}>
                                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{titulo}</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {campos.map(({ label, key, placeholder }) => (
                                            <div key={key}>
                                                <label className={labelClass}>{label}</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder={placeholder}
                                                    {...f(key as keyof typeof form)}
                                                    className={inputClass}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div>
                                <label className={labelClass}>Observações</label>
                                <textarea rows={3} placeholder="Anotações sobre os exames..." {...f('observacoes')} className={`${inputClass} resize-none`} />
                            </div>
                        </div>

                        <div className="sticky bottom-0 flex gap-3 border-t border-border bg-card px-6 py-5">
                            <button onClick={() => setShowModal(false)} className="flex-1 rounded-md border border-border bg-transparent px-4 py-2 text-sm text-foreground transition hover:bg-muted">
                                Cancelar
                            </button>
                            <button onClick={handleSave} className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
                                <Save className="h-4 w-4" /> Salvar Exame
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

Exames.layout = {
    breadcrumbs: [
        { title: 'Pacientes', href: '#' },
        { title: 'Exames', href: '#' },
    ],
};