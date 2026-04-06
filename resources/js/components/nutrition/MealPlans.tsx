import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Copy, Calendar, Clock, UtensilsCrossed, X, Save, AlertCircle, Check } from 'lucide-react';
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
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
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
        { id: generateId(), nome: 'Café da Manhã', horario: '07:00', foods: [] as Food[] },
        { id: generateId(), nome: 'Almoço', horario: '12:30', foods: [] as Food[] },
        { id: generateId(), nome: 'Jantar', horario: '19:00', foods: [] as Food[] },
    ] as Meal[],
};

export function MealPlans({ initialPlans = [] }: MealPlansProps) {
    const [plans, setPlans] = useState<MealPlan[]>(initialPlans);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState<MealPlan | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const page = usePage();
    const baseUrl = page.props.currentTeam ? `/${page.props.currentTeam.slug}` : '';

    useEffect(() => {
        setPlans(initialPlans);
    }, [initialPlans]);

    const filteredPlans = plans.filter((plan) =>
        plan.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.planName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenCreate = () => {
        setEditingPlan(null);
        setFormData(initialFormState);
        setErrors({});
        setShowFormModal(true);
    };

    const handleOpenEdit = (plan: MealPlan, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingPlan(plan);
        setFormData({
            cliente_id: parseInt(plan.patientId) || 0,
            patientName: plan.patientName,
            planName: plan.planName,
            calories: plan.calories,
            objective: plan.objective,
            restrictions: [...plan.restrictions],
            status: plan.status,
            notes: plan.notes,
            meals: plan.meals.map(m => ({
                id: m.id || generateId(),
                nome: m.name,
                horario: m.time,
                foods: m.foods.map(f => ({
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
        
        if (!formData.patientName.trim()) newErrors.patientName = 'Nome do paciente é obrigatório';
        if (!formData.planName.trim()) newErrors.planName = 'Nome do plano é obrigatório';
        if (formData.calories < 500 || formData.calories > 5000) newErrors.calories = 'Calorias deve ser entre 500 e 5000';
        
        const hasFoods = formData.meals.some(m => m.foods.length > 0);
        if (!hasFoods) newErrors.meals = 'Adicione pelo menos um alimento a alguma refeição';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) return;

        const mealsData = formData.meals.map((m, index) => ({
            nome: m.nome,
            horario: m.horario,
            ordem: index,
            alimentos: m.foods.map(f => ({
                nome: f.name,
                porcao: f.portion,
                calorias: f.calories,
            })),
        }));

        const data = {
            cliente_id: formData.cliente_id || 1,
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
                    setPlans(plans.filter(p => p.id !== id));
                },
            });
        }
    };

    const handleAddMeal = () => {
        setFormData({
            ...formData,
            meals: [...formData.meals, { id: generateId(), nome: '', horario: '12:00', foods: [] }],
        });
    };

    const handleRemoveMeal = (mealId: string) => {
        if (formData.meals.length <= 1) return;
        setFormData({
            ...formData,
            meals: formData.meals.filter(m => m.id !== mealId),
        });
    };

    const handleUpdateMeal = (mealId: string, field: 'nome' | 'horario', value: string) => {
        setFormData({
            ...formData,
            meals: formData.meals.map(m =>
                m.id === mealId ? { ...m, [field]: value } : m
            ),
        });
    };

    const handleAddFood = (mealId: string) => {
        setFormData({
            ...formData,
            meals: formData.meals.map(m =>
                m.id === mealId ? { ...m, foods: [...m.foods, { id: generateId(), name: '', portion: '', calories: 0 }] } : m
            ),
        });
    };

    const handleUpdateFood = (mealId: string, foodId: string, field: keyof Food, value: string | number) => {
        setFormData({
            ...formData,
            meals: formData.meals.map(m =>
                m.id === mealId ? {
                    ...m,
                    foods: m.foods.map(f =>
                        f.id === foodId ? { ...f, [field]: value } : f
                    ),
                } : m
            ),
        });
    };

    const handleRemoveFood = (mealId: string, foodId: string) => {
        setFormData({
            ...formData,
            meals: formData.meals.map(m =>
                m.id === mealId ? {
                    ...m,
                    foods: m.foods.filter(f => f.id !== foodId),
                } : m
            ),
        });
    };

    const toggleRestriction = (restriction: string) => {
        setFormData({
            ...formData,
            restrictions: formData.restrictions.includes(restriction)
                ? formData.restrictions.filter(r => r !== restriction)
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {filteredPlans.map((plan) => (
                        <div
                            key={plan.id}
                            onClick={() => handleViewDetail(plan)}
                            className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-all cursor-pointer border border-transparent hover:border-emerald-200"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <UtensilsCrossed className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{plan.planName}</h3>
                                        <p className="text-sm text-gray-500">{plan.patientName}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    plan.status === 'ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'
                                }`}>
                                    {plan.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <div className="text-center">
                                    <p className="text-lg font-bold text-gray-900">{plan.calories}</p>
                                    <p className="text-xs text-gray-500">kcal</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-gray-900">{plan.meals.length}</p>
                                    <p className="text-xs text-gray-500">refeições</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-emerald-600">{plan.updatedAt}</p>
                                    <p className="text-xs text-gray-500">atualizado</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => handleOpenEdit(plan, e)}
                                    className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Editar
                                </button>
                                <button
                                    onClick={(e) => handleDelete(plan.id, e)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Excluir"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredPlans.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        <UtensilsCrossed className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Nenhum plano alimentar encontrado</p>
                        <button onClick={handleOpenCreate} className="mt-3 text-emerald-600 hover:underline">
                            Criar primeiro plano
                        </button>
                    </div>
                )}
            </ContentCard>

            {showFormModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {editingPlan ? 'Editar Plano Alimentar' : 'Novo Plano Alimentar'}
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    {editingPlan ? `Editando: ${editingPlan.planName}` : 'Preencha os dados do plano'}
                                </p>
                            </div>
                            <button onClick={() => setShowFormModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Paciente *</label>
                                    <input
                                        type="text"
                                        value={formData.patientName}
                                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none ${
                                            errors.patientName ? 'border-red-500' : ''
                                        }`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Plano *</label>
                                    <input
                                        type="text"
                                        value={formData.planName}
                                        onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none ${
                                            errors.planName ? 'border-red-500' : ''
                                        }`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Calorias (kcal) *</label>
                                    <input
                                        type="number"
                                        value={formData.calories}
                                        onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo</label>
                                    <select
                                        value={formData.objective}
                                        onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    >
                                        {OBJECTIVES.map(obj => (
                                            <option key={obj} value={obj}>{obj}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Restrições</label>
                                    <div className="flex flex-wrap gap-2">
                                        {RESTRICTIONS.map(restriction => (
                                            <button
                                                key={restriction}
                                                type="button"
                                                onClick={() => toggleRestriction(restriction)}
                                                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                                                    formData.restrictions.includes(restriction)
                                                        ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                                                        : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300'
                                                }`}
                                            >
                                                {restriction}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-900">Refeições</h3>
                                    <button type="button" onClick={handleAddMeal} className="flex items-center gap-1 text-sm text-emerald-600">
                                        <Plus className="w-4 h-4" /> Adicionar Refeição
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {formData.meals.map((meal) => (
                                        <div key={meal.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="flex-1">
                                                    <select
                                                        value={meal.nome}
                                                        onChange={(e) => handleUpdateMeal(meal.id, 'nome', e.target.value)}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    >
                                                        <option value="">Selecione</option>
                                                        {DEFAULT_MEALS.map(name => (
                                                            <option key={name} value={name}>{name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="w-24">
                                                    <select
                                                        value={meal.horario}
                                                        onChange={(e) => handleUpdateMeal(meal.id, 'horario', e.target.value)}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    >
                                                        {MEAL_TIMES.map(time => (
                                                            <option key={time} value={time}>{time}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {formData.meals.length > 1 && (
                                                    <button type="button" onClick={() => handleRemoveMeal(meal.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                {meal.foods.map((food) => (
                                                    <div key={food.id} className="flex items-center gap-2 bg-white p-2 rounded border">
                                                        <input
                                                            type="text"
                                                            value={food.name}
                                                            onChange={(e) => handleUpdateFood(meal.id, food.id, 'name', e.target.value)}
                                                            className="flex-1 px-2 py-1 border rounded text-sm"
                                                            placeholder="Alimento"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={food.portion}
                                                            onChange={(e) => handleUpdateFood(meal.id, food.id, 'portion', e.target.value)}
                                                            className="w-28 px-2 py-1 border rounded text-sm"
                                                            placeholder="Porção"
                                                        />
                                                        <input
                                                            type="number"
                                                            value={food.calories}
                                                            onChange={(e) => handleUpdateFood(meal.id, food.id, 'calories', Number(e.target.value))}
                                                            className="w-20 px-2 py-1 border rounded text-sm"
                                                            placeholder="kcal"
                                                        />
                                                        <button type="button" onClick={() => handleRemoveFood(meal.id, food.id)} className="p-1 text-red-400 hover:text-red-600">
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <button type="button" onClick={() => handleAddFood(meal.id)} className="mt-2 flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600">
                                                <Plus className="w-4 h-4" /> Adicionar Alimento
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 p-6 border-t sticky bottom-0 bg-white">
                            <button onClick={() => setShowFormModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
                                Cancelar
                            </button>
                            <button onClick={handleSave} className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2">
                                <Save className="w-4 h-4" />
                                {editingPlan ? 'Salvar' : 'Criar Plano'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDetailModal && selectedPlan && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
                            <div>
                                <h2 className="text-xl font-semibold">{selectedPlan.planName}</h2>
                                <p className="text-gray-500">{selectedPlan.patientName} • {selectedPlan.calories} kcal</p>
                            </div>
                            <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                                <span className="flex items-center gap-1 text-gray-600">
                                    <Check className="w-4 h-4 text-emerald-500" />
                                    {selectedPlan.objective}
                                </span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                    {selectedPlan.meals.length} refeições
                                </span>
                                {selectedPlan.restrictions.length > 0 && (
                                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                                        {selectedPlan.restrictions.join(', ')}
                                    </span>
                                )}
                            </div>

                            <h3 className="font-semibold text-gray-900 mb-4">Refeições</h3>
                            <div className="space-y-4">
                                {selectedPlan.meals.filter(m => m.foods.length > 0).map((meal) => (
                                    <div key={meal.id} className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-medium text-gray-900">{meal.name || 'Refeição'}</h4>
                                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                                <Clock className="w-4 h-4" /> {meal.time}
                                            </span>
                                        </div>
                                        <ul className="space-y-2">
                                            {meal.foods.map((food) => (
                                                <li key={food.id} className="flex items-center justify-between text-sm">
                                                    <span className="flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                        {food.name}
                                                        {food.portion && <span className="text-gray-400">({food.portion})</span>}
                                                    </span>
                                                    <span className="text-gray-500">{food.calories} kcal</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 p-6 border-t sticky bottom-0 bg-white">
                            <button onClick={() => setShowDetailModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Fechar</button>
                            <button onClick={(e) => { setShowDetailModal(false); handleOpenEdit(selectedPlan, e); }} className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg flex items-center justify-center gap-2">
                                <Edit2 className="w-4 h-4" /> Editar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
