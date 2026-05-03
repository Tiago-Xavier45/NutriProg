import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Phone, Mail, Calendar, X } from 'lucide-react';
import { usePage, router } from '@inertiajs/react';
import { PageHeader, ContentCard } from '@/components/ui';

const formatHeightForDisplay = (height: string | number): string => {
    if (!height) return '';
    return String(height).replace('.', ',');
};

const formatHeightForBackend = (height: string): string => {
    return height.replace(',', '.');
};

interface Patient {
    id: number;
    name: string;
    email: string;
    phone: string;
    age: number;
    weight: string;
    height: string;
    plan: string;
    status: 'Ativo' | 'Pendente' | 'Inativo';
    lastVisit: string;
}

interface PatientsProps {
    initialPatients?: Patient[];
    initialFilters?: { search: string; status: string };
}

export function Patients({
    initialPatients = [],
    initialFilters = { search: '', status: 'all' },
}: PatientsProps) {
    const [patients, setPatients] = useState<Patient[]>(initialPatients);
    const [searchTerm, setSearchTerm] = useState(initialFilters.search);
    const [showModal, setShowModal] = useState(false);
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', age: '',
        weight: '', height: '', plan: '', status: 'Ativo' as Patient['status'],
    });

    const page = usePage();
    const baseUrl = page.props.currentTeam ? `/${page.props.currentTeam.slug}` : '';

    useEffect(() => { setPatients(initialPatients); }, [initialPatients]);

    const filteredPatients = patients.filter(
        (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleOpenModal = (patient?: Patient) => {
        if (patient) {
            setEditingPatient(patient);
            setFormData({
                name: patient.name, email: patient.email, phone: patient.phone,
                age: String(patient.age), weight: patient.weight,
                height: formatHeightForDisplay(patient.height),
                plan: patient.plan, status: patient.status,
            });
        } else {
            setEditingPatient(null);
            setFormData({ name: '', email: '', phone: '', age: '', weight: '', height: '', plan: '', status: 'Ativo' });
        }
        setShowModal(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.email) return;
        const data = {
            name: formData.name, email: formData.email, phone: formData.phone,
            age: parseInt(formData.age) || 0,
            weight: formData.weight || '',
            height: formatHeightForBackend(formData.height),
            plan: formData.plan || '', status: formData.status,
        };
        if (editingPatient) {
            router.post(`${baseUrl}/clientes/${editingPatient.id}`, { _method: 'PUT', ...data }, {
                onSuccess: () => {
                    setPatients(patients.map((p) => p.id === editingPatient.id ? { ...p, ...data, age: Number(formData.age) } : p));
                    setShowModal(false);
                },
            });
        } else {
            router.post(`${baseUrl}/clientes`, data, {
                onSuccess: () => {
                    setPatients([{ id: Date.now(), ...data, age: Number(formData.age), lastVisit: new Date().toLocaleDateString('pt-BR') }, ...patients]);
                    setShowModal(false);
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Tem certeza que deseja excluir este paciente?')) {
            router.post(`${baseUrl}/clientes/${id}`, { _method: 'DELETE' }, {
                onSuccess: () => setPatients(patients.filter((p) => p.id !== id)),
            });
        }
    };

    // Classes reutilizáveis
    const inputClass = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30";
    const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground";

    return (
        <div className="space-y-6">
            <PageHeader
                title="Pacientes"
                count={`${patients.length} pacientes cadastrados`}
                action={{ label: 'Novo Paciente', icon: Plus, onClick: () => handleOpenModal() }}
            />

            <ContentCard
                showSearch={{
                    placeholder: 'Buscar por nome ou email...',
                    value: searchTerm,
                    onChange: setSearchTerm,
                }}
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                {['Paciente', 'Contato', 'Idade', 'Medidas', 'Plano', 'Status', 'Última Visita', 'Ações'].map((h) => (
                                    <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="transition-colors hover:bg-muted/30">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                                {patient.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                                            </div>
                                            <span className="font-medium text-foreground">{patient.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <Mail className="h-3.5 w-3.5" />{patient.email}
                                        </div>
                                        <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <Phone className="h-3.5 w-3.5" />{patient.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{patient.age} anos</td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{patient.weight} / {patient.height}</td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{patient.plan}</td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                            patient.status === 'Ativo'
                                                ? 'bg-primary/10 text-primary'
                                                : patient.status === 'Pendente'
                                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                : 'bg-muted text-muted-foreground'
                                        }`}>
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5" />{patient.lastVisit}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => handleOpenModal(patient)} className="rounded-md p-2 text-muted-foreground transition hover:bg-primary/10 hover:text-primary">
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(patient.id)} className="rounded-md p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredPatients.length === 0 && (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                        Nenhum paciente encontrado
                    </div>
                )}
            </ContentCard>

            {/* Modal — agora com tokens do tema */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card text-card-foreground shadow-xl">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-border px-6 py-5">
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">
                                    {editingPatient ? 'Editar Paciente' : 'Novo Paciente'}
                                </h2>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    Preencha os dados do paciente
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="space-y-5 p-6">
                            <div>
                                <label className={labelClass}>Nome</label>
                                <input type="text" value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={inputClass} placeholder="Nome completo" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Email</label>
                                    <input type="email" value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={inputClass} placeholder="email@exemplo.com" />
                                </div>
                                <div>
                                    <label className={labelClass}>Telefone</label>
                                    <input type="tel" value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className={inputClass} placeholder="(11) 99999-9999" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className={labelClass}>Idade</label>
                                    <input type="number" value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        className={inputClass} placeholder="25" />
                                </div>
                                <div>
                                    <label className={labelClass}>Peso</label>
                                    <div className="relative">
                                        <input type="text" value={formData.weight}
                                            onChange={(e) => setFormData({ ...formData, weight: e.target.value.replace(/kg$/i, '').trim() })}
                                            placeholder="75,5"
                                            className={`${inputClass} pr-9`} />
                                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">kg</span>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Altura (m)</label>
                                    <input type="text" value={formData.height} maxLength={4}
                                        onChange={(e) => {
                                            let val = e.target.value.replace(/[^\d]/g, '');
                                            if (val.length >= 2) val = val.substring(0, 1) + ',' + val.substring(1, 3);
                                            if (val.length > 4) val = val.substring(0, 4);
                                            setFormData({ ...formData, height: val });
                                        }}
                                        placeholder="1,75" className={inputClass} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Plano Alimentar</label>
                                    <select value={formData.plan}
                                        onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                                        className={inputClass}>
                                        <option value="">Selecione</option>
                                        {['Low Carb', 'Mediterrânea', 'Vegetariana', 'Halal', 'Low FODMAP', 'Dash'].map((p) => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Status</label>
                                    <select value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as Patient['status'] })}
                                        className={inputClass}>
                                        <option value="Ativo">Ativo</option>
                                        <option value="Pendente">Pendente</option>
                                        <option value="Inativo">Inativo</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 border-t border-border px-6 py-5">
                            <button onClick={() => setShowModal(false)}
                                className="flex-1 rounded-md border border-border bg-transparent px-4 py-2 text-sm text-foreground transition hover:bg-muted">
                                Cancelar
                            </button>
                            <button onClick={handleSave}
                                className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
                                {editingPatient ? 'Salvar alterações' : 'Salvar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}