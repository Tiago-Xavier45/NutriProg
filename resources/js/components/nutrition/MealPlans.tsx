import { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Copy,
    Calendar,
    Clock,
    UtensilsCrossed,
    X,
    Save,
    AlertCircle,
    Check,
    Download,
} from 'lucide-react';
import { usePage, router } from '@inertiajs/react';
import { PageHeader, ContentCard } from '@/components/ui';

interface Food {
    id: string;
    name: string;
    portion: string;
    calories: number;
}

interface Meal {
    id: string;
    name: string;
    time: string;
    foods: Food[];
}

interface MealPlan {
    id: string;
    patientId: string;
    patientName: string;
    planName: string;
    calories: number;
    objective: string;
    restrictions: string[];
    meals: Meal[];
    notes: string;
    status: 'ativo' | 'inativo';
    createdAt: string;
    updatedAt: string;
}

interface MealPlansProps {
    initialPlans?: MealPlan[];
    pacientes?: Array<{ id: string; name: string }>;
}

const OBJECTIVES = [
    'Perda de peso',
    'Ganho de massa muscular',
    'Manutenção do peso',
    'Controle glicêmico',
    'Melhora da saúde geral',
    'Recomposição corporal',
];

const RESTRICTIONS = [
    'Glúten',
    'Lactose',
    'Açúcar',
    'Frutos do mar',
    'Vegetariano',
    'Vegano',
    'Halal',
    'Kosher',
];

const DEFAULT_MEALS = [
    'Café da Manhã',
    'Lanche da Manhã',
    'Almoço',
    'Lanche da Tarde',
    'Jantar',
    'Ceia',
];

const MEAL_TIMES = [
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
];

const generateId = () => Math.random().toString(36).substring(2, 15);

const initialFormState = {
    cliente_id: 0,
    patientName: '',
    planName: '',
    calories: 2000,
    objective: 'Manutenção do peso',
    restrictions: [] as string[],
    status: 'ativo' as const,
    notes: '',
    meals: [
        {
            id: generateId(),
            nome: 'Café da Manhã',
            horario: '07:00',
            foods: [] as Food[],
        },
        {
            id: generateId(),
            nome: 'Almoço',
            horario: '12:30',
            foods: [] as Food[],
        },
        {
            id: generateId(),
            nome: 'Jantar',
            horario: '19:00',
            foods: [] as Food[],
        },
    ] as Meal[],
};

export function MealPlans({ initialPlans = [], pacientes = [] }: MealPlansProps) {
    const [plans, setPlans] = useState<MealPlan[]>(initialPlans);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState<MealPlan | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);
    const [selectedPatientId, setSelectedPatientId] = useState<string>('');
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const page = usePage();
    const baseUrl = page.props.currentTeam
        ? `/${page.props.currentTeam.slug}`
        : '';

    useEffect(() => {
        setPlans(initialPlans);
    }, [initialPlans]);

    const filteredPlans = plans.filter(
        (plan) =>
            plan.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.planName.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleOpenCreate = () => {
        setEditingPlan(null);
        setSelectedPatientId('');
        setFormData(initialFormState);
        setErrors({});
        setShowFormModal(true);
    };

    const handleOpenEdit = (plan: MealPlan, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingPlan(plan);
        setSelectedPatientId(plan.patientId);
        setFormData({
            cliente_id: parseInt(plan.patientId) || 0,
            patientName: plan.patientName,
            planName: plan.planName,
            calories: plan.calories,
            objective: plan.objective,
            restrictions: [...plan.restrictions],
            status: plan.status,
            notes: plan.notes,
            meals: plan.meals.map((m) => ({
                id: m.id || generateId(),
                nome: m.name,
                horario: m.time,
                foods: m.foods.map((f) => ({
                    id: f.id || generateId(),
                    name: f.name,
                    portion: f.portion,
                    calories: f.calories,
                })),
            })),
        });
        setErrors({});
        setShowFormModal(true);
    };

    const handleViewDetail = (plan: MealPlan) => {
        setSelectedPlan(plan);
        setShowDetailModal(true);
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!selectedPatientId)
            newErrors.patientId = 'Selecione um paciente';
        if (!formData.planName.trim())
            newErrors.planName = 'Nome do plano é obrigatório';
        if (formData.calories < 500 || formData.calories > 5000)
            newErrors.calories = 'Calorias deve ser entre 500 e 5000';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) return;

        const selectedPatient = pacientes.find(p => p.id === selectedPatientId);
        const mealsData = formData.meals.map((m, index) => ({
            nome: m.nome,
            horario: m.horario,
            ordem: index,
            alimentos: m.foods.map((f) => ({
                nome: f.name,
                porcao: f.portion,
                calorias: f.calories,
            })),
        }));

        const data = {
            cliente_id: parseInt(selectedPatientId),
            nome: formData.planName,
            calorias: formData.calories,
            objetivo: formData.objective,
            restricoes: formData.restrictions,
            observacoes: formData.notes,
            status: formData.status,
            meals: mealsData,
        };

        if (editingPlan) {
            router.put(`${baseUrl}/planos/${editingPlan.id}`, data, {
                onSuccess: () => {
                    window.location.reload();
                },
            });
        } else {
            router.post(`${baseUrl}/planos`, data, {
                onSuccess: () => {
                    window.location.reload();
                },
            });
        }
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Tem certeza que deseja excluir este plano?')) {
            router.delete(`${baseUrl}/planos/${id}`, {
                onSuccess: () => {
                    setPlans(plans.filter((p) => p.id !== id));
                },
            });
        }
    };

    const handleAddMeal = () => {
        setFormData({
            ...formData,
            meals: [
                ...formData.meals,
                { id: generateId(), nome: '', horario: '12:00', foods: [] },
            ],
        });
    };

    const handleRemoveMeal = (mealId: string) => {
        if (formData.meals.length <= 1) return;
        setFormData({
            ...formData,
            meals: formData.meals.filter((m) => m.id !== mealId),
        });
    };

    const handleUpdateMeal = (
        mealId: string,
        field: 'nome' | 'horario',
        value: string,
    ) => {
        setFormData({
            ...formData,
            meals: formData.meals.map((m) =>
                m.id === mealId ? { ...m, [field]: value } : m,
            ),
        });
    };

    const handleAddFood = (mealId: string) => {
        setFormData({
            ...formData,
            meals: formData.meals.map((m) =>
                m.id === mealId
                    ? {
                          ...m,
                          foods: [
                              ...m.foods,
                              {
                                  id: generateId(),
                                  name: '',
                                  portion: '',
                                  calories: 0,
                              },
                          ],
                      }
                    : m,
            ),
        });
    };

    const handleUpdateFood = (
        mealId: string,
        foodId: string,
        field: keyof Food,
        value: string | number,
    ) => {
        setFormData({
            ...formData,
            meals: formData.meals.map((m) =>
                m.id === mealId
                    ? {
                          ...m,
                          foods: m.foods.map((f) =>
                              f.id === foodId ? { ...f, [field]: value } : f,
                          ),
                      }
                    : m,
            ),
        });
    };

    const handleRemoveFood = (mealId: string, foodId: string) => {
        setFormData({
            ...formData,
            meals: formData.meals.map((m) =>
                m.id === mealId
                    ? {
                          ...m,
                          foods: m.foods.filter((f) => f.id !== foodId),
                      }
                    : m,
            ),
        });
    };

    const toggleRestriction = (restriction: string) => {
        setFormData({
            ...formData,
            restrictions: formData.restrictions.includes(restriction)
                ? formData.restrictions.filter((r) => r !== restriction)
                : [...formData.restrictions, restriction],
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Planos Alimentares"
                count={`${plans.length} planos cadastrados`}
                action={{
                    label: 'Novo Plano',
                    icon: Plus,
                    onClick: handleOpenCreate,
                }}
            />

            <ContentCard
                showSearch={{
                    placeholder: 'Buscar por paciente ou nome do plano...',
                    value: searchTerm,
                    onChange: setSearchTerm,
                }}
            >
                <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPlans.map((plan) => (
                        <div
                            key={plan.id}
                            onClick={() => handleViewDetail(plan)}
                            className="cursor-pointer rounded-xl border border-transparent bg-gray-50 p-5 transition-all hover:border-emerald-200 hover:bg-gray-100"
                        >
                            <div className="mb-4 flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                                        <UtensilsCrossed className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {plan.planName}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {plan.patientName}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                                        plan.status === 'ativo'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-gray-200 text-gray-600'
                                    }`}
                                >
                                    {plan.status}
                                </span>
                            </div>

                            <div className="mb-4 grid grid-cols-3 gap-3">
                                <div className="text-center">
                                    <p className="text-lg font-bold text-gray-900">
                                        {plan.calories}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        kcal
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-gray-900">
                                        {plan.meals.length}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        refeições
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-emerald-600">
                                        {plan.updatedAt}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        atualizado
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => handleOpenEdit(plan, e)}
                                    className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-green-200 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-green-200"
                                >
                                    <Edit2 className="h-4 w-4" />
                                    Editar
                                </button>
                                <button
                                    onClick={(e) => handleDelete(plan.id, e)}
                                    className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                                    title="Excluir"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredPlans.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        <UtensilsCrossed className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                        <p>Nenhum plano alimentar encontrado</p>
                        <button
                            onClick={handleOpenCreate}
                            className="mt-3 text-emerald-600 hover:underline"
                        >
                            Criar primeiro plano
                        </button>
                    </div>
                )}
            </ContentCard>

            {showFormModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white">
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-6">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {editingPlan
                                        ? 'Editar Plano Alimentar'
                                        : 'Novo Plano Alimentar'}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {editingPlan
                                        ? `Editando: ${editingPlan.planName}`
                                        : 'Preencha os dados do plano'}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowFormModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-6 p-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Paciente *
                                    </label>
                                    <select
                                        value={selectedPatientId}
                                        onChange={(e) => setSelectedPatientId(e.target.value)}
                                        className={`w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 ${
                                            errors.patientId
                                                ? 'border-red-500'
                                                : ''
                                        }`}
                                    >
                                        <option value="">Selecione um paciente</option>
                                        {pacientes.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    {errors.patientId && (
                                        <p className="mt-1 text-sm text-red-500">{errors.patientId}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Nome do Plano *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.planName}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                planName: e.target.value,
                                            })
                                        }
                                        className={`w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 ${
                                            errors.planName
                                                ? 'border-red-500'
                                                : ''
                                        }`}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Calorias (kcal) *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.calories}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                calories: Number(
                                                    e.target.value,
                                                ),
                                            })
                                        }
                                        className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Objetivo
                                    </label>
                                    <select
                                        value={formData.objective}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                objective: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        {OBJECTIVES.map((obj) => (
                                            <option key={obj} value={obj}>
                                                {obj}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Restrições
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {RESTRICTIONS.map((restriction) => (
                                            <button
                                                key={restriction}
                                                type="button"
                                                onClick={() =>
                                                    toggleRestriction(
                                                        restriction,
                                                    )
                                                }
                                                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                                                    formData.restrictions.includes(
                                                        restriction,
                                                    )
                                                        ? 'border-emerald-300 bg-emerald-100 text-emerald-700'
                                                        : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300'
                                                }`}
                                            >
                                                {restriction}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900">
                                        Refeições
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={handleAddMeal}
                                        className="flex items-center gap-1 text-sm text-emerald-600"
                                    >
                                        <Plus className="h-4 w-4" /> Adicionar
                                        Refeição
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {formData.meals.map((meal) => (
                                        <div
                                            key={meal.id}
                                            className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                                        >
                                            <div className="mb-4 flex items-center gap-4">
                                                <div className="flex-1">
                                                    <select
                                                        value={meal.nome}
                                                        onChange={(e) =>
                                                            handleUpdateMeal(
                                                                meal.id,
                                                                'nome',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-lg border px-3 py-2"
                                                    >
                                                        <option value="">
                                                            Selecione
                                                        </option>
                                                        {DEFAULT_MEALS.map(
                                                            (name) => (
                                                                <option
                                                                    key={name}
                                                                    value={name}
                                                                >
                                                                    {name}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                </div>
                                                <div className="w-24">
                                                    <select
                                                        value={meal.horario}
                                                        onChange={(e) =>
                                                            handleUpdateMeal(
                                                                meal.id,
                                                                'horario',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-lg border px-3 py-2"
                                                    >
                                                        {MEAL_TIMES.map(
                                                            (time) => (
                                                                <option
                                                                    key={time}
                                                                    value={time}
                                                                >
                                                                    {time}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                </div>
                                                {formData.meals.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveMeal(
                                                                meal.id,
                                                            )
                                                        }
                                                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                {meal.foods.map((food) => (
                                                    <div
                                                        key={food.id}
                                                        className="flex items-center gap-2 rounded border bg-white p-2"
                                                    >
                                                        <input
                                                            type="text"
                                                            value={food.name}
                                                            onChange={(e) =>
                                                                handleUpdateFood(
                                                                    meal.id,
                                                                    food.id,
                                                                    'name',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="flex-1 rounded border px-2 py-1 text-sm"
                                                            placeholder="Alimento"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={food.portion}
                                                            onChange={(e) =>
                                                                handleUpdateFood(
                                                                    meal.id,
                                                                    food.id,
                                                                    'portion',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-28 rounded border px-2 py-1 text-sm"
                                                            placeholder="Porção"
                                                        />
                                                        <input
                                                            type="number"
                                                            value={
                                                                food.calories
                                                            }
                                                            onChange={(e) =>
                                                                handleUpdateFood(
                                                                    meal.id,
                                                                    food.id,
                                                                    'calories',
                                                                    Number(
                                                                        e.target
                                                                            .value,
                                                                    ),
                                                                )
                                                            }
                                                            className="w-20 rounded border px-2 py-1 text-sm"
                                                            placeholder="kcal"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveFood(
                                                                    meal.id,
                                                                    food.id,
                                                                )
                                                            }
                                                            className="p-1 text-red-400 hover:text-red-600"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleAddFood(meal.id)
                                                }
                                                className="mt-2 flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600"
                                            >
                                                <Plus className="h-4 w-4" />{' '}
                                                Adicionar Alimento
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 flex gap-3 border-t bg-white p-6">
                            <button
                                onClick={() => setShowFormModal(false)}
                                className="flex-1 rounded-lg border px-4 py-2 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
                            >
                                <Save className="h-4 w-4" />
                                {editingPlan ? 'Salvar' : 'Criar Plano'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDetailModal && selectedPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white">
                        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-6">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {selectedPlan.planName}
                                </h2>
                                <p className="text-gray-500">
                                    {selectedPlan.patientName} •{' '}
                                    {selectedPlan.calories} kcal
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => window.open(`${baseUrl}/planos/${selectedPlan.id}/download`, '_blank')}
                                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                                >
                                    <Download className="h-4 w-4" />
                                    Baixar PDF
                                </button>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
                                <span className="flex items-center gap-1 text-gray-600">
                                    <Check className="h-4 w-4 text-emerald-500" />
                                    {selectedPlan.objective}
                                </span>
                                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                                    {selectedPlan.meals.length} refeições
                                </span>
                                {selectedPlan.restrictions.length > 0 && (
                                    <span className="rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-700">
                                        {selectedPlan.restrictions.join(', ')}
                                    </span>
                                )}
                            </div>

                            <h3 className="mb-4 font-semibold text-gray-900">
                                Refeições
                            </h3>
                            <div className="space-y-4">
                                {selectedPlan.meals
                                    .filter((m) => m.foods.length > 0)
                                    .map((meal) => (
                                        <div
                                            key={meal.id}
                                            className="rounded-lg bg-gray-50 p-4"
                                        >
                                            <div className="mb-3 flex items-center justify-between">
                                                <h4 className="font-medium text-gray-900">
                                                    {meal.name || 'Refeição'}
                                                </h4>
                                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                                    <Clock className="h-4 w-4" />{' '}
                                                    {meal.time}
                                                </span>
                                            </div>
                                            <ul className="space-y-2">
                                                {meal.foods.map((food) => (
                                                    <li
                                                        key={food.id}
                                                        className="flex items-center justify-between text-sm"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                            {food.name}
                                                            {food.portion && (
                                                                <span className="text-gray-400">
                                                                    (
                                                                    {
                                                                        food.portion
                                                                    }
                                                                    )
                                                                </span>
                                                            )}
                                                        </span>
                                                        <span className="text-gray-500">
                                                            {food.calories} kcal
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <div className="sticky bottom-0 flex gap-3 border-t bg-white p-6">
    
            
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
