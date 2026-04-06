import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Phone, Mail, Calendar, X } from 'lucide-react';
import { usePage, router } from '@inertiajs/react';
import { PageHeader, ContentCard } from '@/components/ui';

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
    initialFilters?: {
        search: string;
        status: string;
    };
}

export function Patients({ initialPatients = [], initialFilters = { search: '', status: 'all' } }: PatientsProps) {
    const [patients, setPatients] = useState<Patient[]>(initialPatients);
    const [searchTerm, setSearchTerm] = useState(initialFilters.search);
    const [showModal, setShowModal] = useState(false);
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        age: '',
        weight: '',
        height: '',
        plan: '',
        status: 'Ativo' as Patient['status'],
    });

    const page = usePage();
    const baseUrl = page.props.currentTeam ? `/${page.props.currentTeam.slug}` : '';

    useEffect(() => {
        setPatients(initialPatients);
    }, [initialPatients]);

    const filteredPatients = patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (patient?: Patient) => {
        if (patient) {
            setEditingPatient(patient);
            setFormData({
                name: patient.name,
                email: patient.email,
                phone: patient.phone,
                age: String(patient.age),
                weight: patient.weight,
                height: patient.height,
                plan: patient.plan,
                status: patient.status,
            });
        } else {
            setEditingPatient(null);
            setFormData({
                name: '',
                email: '',
                phone: '',
                age: '',
                weight: '',
                height: '',
                plan: '',
                status: 'Ativo',
            });
        }
        setShowModal(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.email) return;

        const data = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            age: formData.age ? parseInt(formData.age) : null,
            weight: formData.weight || null,
            height: formData.height || null,
            plan: formData.plan || null,
            status: formData.status,
        };

        if (editingPatient) {
            router.put(`${baseUrl}/clientes/${editingPatient.id}`, data, {
                onSuccess: () => {
                    setPatients(patients.map(p => 
                        p.id === editingPatient.id 
                            ? { ...p, ...data, age: Number(formData.age) }
                            : p
                    ));
                    setShowModal(false);
                },
            });
        } else {
            router.post(`${baseUrl}/clientes`, data, {
                onSuccess: () => {
                    const newPatient: Patient = {
                        id: Date.now(),
                        ...data,
                        age: Number(formData.age),
                        lastVisit: new Date().toLocaleDateString('pt-BR'),
                    };
                    setPatients([newPatient, ...patients]);
                    setShowModal(false);
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Tem certeza que deseja excluir este paciente?')) {
            router.delete(`${baseUrl}/clientes/${id}`, {
                onSuccess: () => {
                    setPatients(patients.filter(p => p.id !== id));
                },
            });
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Pacientes"
                count={`${patients.length} pacientes cadastrados`}
                action={{
                    label: 'Novo Paciente',
                    icon: Plus,
                    onClick: () => handleOpenModal(),
                }}
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
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contato</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Idade</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medidas</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plano</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Última Visita</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <span className="text-emerald-700 font-medium">
                                                    {patient.name.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <span className="ml-3 font-medium text-gray-900">{patient.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600 flex items-center gap-1">
                                            <Mail className="w-4 h-4" />
                                            {patient.email}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                            <Phone className="w-4 h-4" />
                                            {patient.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{patient.age} anos</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {patient.weight} / {patient.height}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{patient.plan}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            patient.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' :
                                            patient.status === 'Pendente' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {patient.lastVisit}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleOpenModal(patient)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(patient.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredPatients.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        Nenhum paciente encontrado
                    </div>
                )}
            </ContentCard>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-semibold">
                                {editingPatient ? 'Editar Paciente' : 'Novo Paciente'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                                    <input
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Peso</label>
                                    <input
                                        type="text"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Altura</label>
                                    <input
                                        type="text"
                                        value={formData.height}
                                        onChange={(e) => setFormData({...formData, height: e.target.value})}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Plano Alimentar</label>
                                    <select
                                        value={formData.plan}
                                        onChange={(e) => setFormData({...formData, plan: e.target.value})}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    >
                                        <option value="">Selecione</option>
                                        <option value="Low Carb">Low Carb</option>
                                        <option value="Mediterrânea">Mediterrânea</option>
                                        <option value="Vegetariana">Vegetariana</option>
                                        <option value="Halal">Halal</option>
                                        <option value="Low FODMAP">Low FODMAP</option>
                                        <option value="Dash">Dash</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value as Patient['status']})}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    >
                                        <option value="Ativo">Ativo</option>
                                        <option value="Pendente">Pendente</option>
                                        <option value="Inativo">Inativo</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 p-6 border-t">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
