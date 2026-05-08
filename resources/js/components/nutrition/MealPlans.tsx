import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Clock, UtensilsCrossed, X, Save, Check, Download, Copy } from 'lucide-react';
import { usePage, router } from '@inertiajs/react';
import { PageHeader, ContentCard } from '@/components/ui';
import { FoodSearch } from '@/components/food-search';

interface Food {
    id: string;
    name: string;
    portion: string;
    calories: number;
    quantity: number;
    per100g?: {
        calorias: number;
        proteinas: number;
        carboidratos: number;
        gorduras: number;
    };
}

interface Meal {
    nome: string | number | readonly string[] | undefined;
    horario: string | number | readonly string[] | undefined;
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

const OBJECTIVES = ['Perda de peso', 'Ganho de massa muscular', 'Manutenção do peso', 'Controle glicêmico', 'Melhora da saúde geral', 'Recomposição corporal'];
const RESTRICTIONS = ['Glúten', 'Lactose', 'Açúcar', 'Frutos do mar', 'Vegetariano', 'Vegano', 'Halal', 'Kosher'];
const DEFAULT_MEALS = ['Café da Manhã', 'Lanche da Manhã', 'Almoço', 'Lanche da Tarde', 'Jantar', 'Ceia'];
const MEAL_TIMES = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

const generateId = () => Math.random().toString(36).substring(2, 15);

const initialFormState = {
    cliente_id: 0,
    patientName: '',
    planName: '',
    calories: 2000,
    objective: 'Manutenção do peso',
    restrictions: [] as string[],
    status: 'ativo' as 'ativo' | 'inativo',
    notes: '',
    meals: [
        { id: generateId(), nome: 'Café da Manhã', horario: '07:00', foods: [] as Food[] },
        { id: generateId(), nome: 'Almoço', horario: '12:30', foods: [] as Food[] },
        { id: generateId(), nome: 'Jantar', horario: '19:00', foods: [] as Food[] },
    ] as Meal[],
};

const inputClass = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30";
const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground";

export function MealPlans({ initialPlans = [], pacientes = [] }: MealPlansProps) {
    const [plans, setPlans] = useState<MealPlan[]>(initialPlans);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState<MealPlan | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const page = usePage();
    const baseUrl = page.props.currentTeam ? `/${page.props.currentTeam.slug}` : '';

    useEffect(() => { setPlans(initialPlans); }, [initialPlans]);

    const filteredPlans = plans.filter((plan) =>
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


    const handleDuplicate = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Deseja duplicar este plano? Uma cópia será criada como inativa.')) {
            router.post(`${baseUrl}/planos/${id}/duplicate`, {}, {
                onSuccess: () => window.location.reload(),
            });
        }
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
                name: m.name,
                time: m.time,
                foods: m.foods.map((f) => ({
                    id: f.id || generateId(),
                    name: f.name,
                    portion: f.portion,
                    calories: f.calories,
                    quantity: f.quantity ?? 100,
                    per100g: f.per100g,
                })),
            })),
        });
        setErrors({});
        setShowFormModal(true);
    };

    const handleViewDetail = (plan: MealPlan) => { setSelectedPlan(plan); setShowDetailModal(true); };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!selectedPatientId) newErrors.patientId = 'Selecione um paciente';
        if (!formData.planName.trim()) newErrors.planName = 'Nome do plano é obrigatório';
        if (formData.calories < 500 || formData.calories > 5000) newErrors.calories = 'Calorias deve ser entre 500 e 5000';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) return;
        const data = {
            cliente_id: parseInt(selectedPatientId),
            nome: formData.planName,
            calorias: formData.calories,
            objetivo: formData.objective,
            restricoes: formData.restrictions,
            observacoes: formData.notes,
            status: formData.status,
            meals: formData.meals.map((m, index) => ({
                nome: m.nome,
                horario: m.horario,
                ordem: index,
                alimentos: m.foods.map((f) => ({
                    nome: f.name,
                    porcao: f.portion || `${f.quantity ?? 100}g`,
                    calorias: f.calories,
                })),
            })),
        };
        if (editingPlan) {
            router.put(`${baseUrl}/planos/${editingPlan.id}`, data, { onSuccess: () => window.location.reload() });
        } else {
            router.post(`${baseUrl}/planos`, data, { onSuccess: () => window.location.reload() });
        }
    };

    const handleQuantityChange = (
        mealId: string,
        foodId: string,
        quantity: number
    ) => {
        setFormData((prev) => ({
            ...prev,
            meals: prev.meals.map((meal) => {
                if (meal.id !== mealId) return meal;

                return {
                    ...meal,
                    foods: meal.foods.map((food) => {
                        if (food.id !== foodId) return food;

                        if (!food.per100g) {
                            return { ...food, quantity };
                        }

                        const ratio = quantity / 100;

                        return {
                            ...food,
                            quantity,
                            calories: Math.round(food.per100g.calorias * ratio),
                        };
                    }),
                };
            }),
        }));
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Tem certeza que deseja excluir este plano?')) {
            router.delete(`${baseUrl}/planos/${id}`, { onSuccess: () => setPlans(plans.filter((p) => p.id !== id)) });
        }
    };

    const handleAddMeal = () => setFormData({ ...formData, meals: [...formData.meals, { id: generateId(), nome: '', horario: '12:00', name: '', time: '12:00', foods: [] }] });
    const handleRemoveMeal = (mealId: string) => { if (formData.meals.length <= 1) return; setFormData({ ...formData, meals: formData.meals.filter((m) => m.id !== mealId) }); };
    const handleUpdateMeal = (mealId: string, field: 'nome' | 'horario', value: string) => setFormData({ ...formData, meals: formData.meals.map((m) => m.id === mealId ? { ...m, [field]: value } : m) });
    const handleAddFood = (mealId: string) => setFormData({ ...formData, meals: formData.meals.map((m) => m.id === mealId ? { ...m, foods: [...m.foods, { id: generateId(), name: '', portion: '', calories: 0, quantity: 100, per100g: undefined }] } : m) });
    const handleUpdateFood = (mealId: string, foodId: string, field: keyof Food, value: string | number) => setFormData({ ...formData, meals: formData.meals.map((m) => m.id === mealId ? { ...m, foods: m.foods.map((f) => f.id === foodId ? { ...f, [field]: value } : f) } : m) });
    const handleRemoveFood = (mealId: string, foodId: string) => setFormData({ ...formData, meals: formData.meals.map((m) => m.id === mealId ? { ...m, foods: m.foods.filter((f) => f.id !== foodId) } : m) });
    const toggleRestriction = (restriction: string) => setFormData({ ...formData, restrictions: formData.restrictions.includes(restriction) ? formData.restrictions.filter((r) => r !== restriction) : [...formData.restrictions, restriction] });

    const handleUpdateFoodBatch = (mealId: string, foodId: string, updates: Partial<Food>) => {
        setFormData((prev) => ({
            ...prev,
            meals: prev.meals.map((m) =>
                m.id === mealId
                    ? { ...m, foods: m.foods.map((f) => f.id === foodId ? { ...f, ...updates } : f) }
                    : m,
            ),
        }));
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Planos Alimentares"
                count={`${plans.length} planos cadastrados`}
                action={{ label: 'Novo Plano', icon: Plus, onClick: handleOpenCreate }}
            />

            <ContentCard showSearch={{ placeholder: 'Buscar por paciente ou nome do plano...', value: searchTerm, onChange: setSearchTerm }}>
                <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPlans.map((plan) => (
                        <div
                            key={plan.id}
                            onClick={() => handleViewDetail(plan)}
                            className="cursor-pointer rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:bg-secondary"
                        >
                            <div className="mb-4 flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                                        <UtensilsCrossed className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">{plan.planName}</h3>
                                        <p className="text-sm text-muted-foreground">{plan.patientName}</p>
                                    </div>
                                </div>
                                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${plan.status === 'ativo' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                    {plan.status}
                                </span>
                            </div>

                            <div className="mb-4 grid grid-cols-3 gap-3 rounded-lg bg-muted/40 p-3">
                                <div className="text-center">
                                    <p className="text-lg font-bold text-foreground">{plan.calories}</p>
                                    <p className="text-xs text-muted-foreground">kcal</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-foreground">{plan.meals.length}</p>
                                    <p className="text-xs text-muted-foreground">refeições</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-primary">{plan.updatedAt}</p>
                                    <p className="text-xs text-muted-foreground">atualizado</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => handleOpenEdit(plan, e)}
                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                                >
                                    <Edit2 className="h-3.5 w-3.5" /> Editar
                                </button>
                                <button
                                    onClick={(e) => handleDuplicate(plan.id, e)}
                                    className="rounded-md p-2 text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
                                    title="Duplicar plano"
                                >
                                    <Copy className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={(e) => handleDelete(plan.id, e)}
                                    className="rounded-md p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredPlans.length === 0 && (
                    <div className="p-8 text-center">
                        <UtensilsCrossed className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">Nenhum plano alimentar encontrado</p>
                        <button onClick={handleOpenCreate} className="mt-3 text-sm text-primary hover:underline">
                            Criar primeiro plano
                        </button>
                    </div>
                )}
            </ContentCard>

            {/* Modal de criação/edição */}
            {showFormModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-border bg-card text-card-foreground shadow-xl">

                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-5">
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">
                                    {editingPlan ? 'Editar Plano Alimentar' : 'Novo Plano Alimentar'}
                                </h2>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {editingPlan ? `Editando: ${editingPlan.planName}` : 'Preencha os dados do plano'}
                                </p>
                            </div>
                            <button onClick={() => setShowFormModal(false)} className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-6 p-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className={labelClass}>Paciente *</label>
                                    <select
                                        value={selectedPatientId}
                                        onChange={(e) => setSelectedPatientId(e.target.value)}
                                        className={`${inputClass} ${errors.patientId ? 'border-destructive' : ''}`}
                                    >
                                        <option value="">Selecione um paciente</option>
                                        {pacientes.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                    {errors.patientId && <p className="mt-1 text-xs text-destructive">{errors.patientId}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Nome do Plano *</label>
                                    <input
                                        type="text"
                                        value={formData.planName}
                                        onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                                        className={`${inputClass} ${errors.planName ? 'border-destructive' : ''}`}
                                        placeholder="Ex: Plano Low Carb"
                                    />
                                    {errors.planName && <p className="mt-1 text-xs text-destructive">{errors.planName}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Calorias (kcal) *</label>
                                    <input
                                        type="number"
                                        value={formData.calories}
                                        onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
                                        className={`${inputClass} ${errors.calories ? 'border-destructive' : ''}`}
                                        placeholder="2000"
                                    />
                                    {errors.calories && <p className="mt-1 text-xs text-destructive">{errors.calories}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Objetivo</label>
                                    <select
                                        value={formData.objective}
                                        onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                                        className={inputClass}
                                    >
                                        {OBJECTIVES.map((obj) => <option key={obj} value={obj}>{obj}</option>)}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className={labelClass}>Restrições</label>
                                    <div className="mt-1 flex flex-wrap gap-2">
                                        {RESTRICTIONS.map((restriction) => (
                                            <button
                                                key={restriction}
                                                type="button"
                                                onClick={() => toggleRestriction(restriction)}
                                                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${formData.restrictions.includes(restriction)
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
                                                    }`}
                                            >
                                                {restriction}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Refeições */}
                            <div>
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="font-semibold text-foreground">Refeições</h3>
                                    <button
                                        type="button"
                                        onClick={handleAddMeal}
                                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                                    >
                                        <Plus className="h-4 w-4" /> Adicionar Refeição
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {formData.meals.map((meal) => (
                                        <div key={meal.id} className="rounded-lg border border-border bg-muted/30 p-4">
                                            <div className="mb-4 flex items-center gap-3">
                                                <div className="flex-1">
                                                    <select
                                                        value={meal.nome}
                                                        onChange={(e) => handleUpdateMeal(meal.id, 'nome', e.target.value)}
                                                        className={inputClass}
                                                    >
                                                        <option value="">Selecione</option>
                                                        {DEFAULT_MEALS.map((name) => <option key={name} value={name}>{name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="w-28">
                                                    <select
                                                        value={meal.horario}
                                                        onChange={(e) => handleUpdateMeal(meal.id, 'horario', e.target.value)}
                                                        className={inputClass}
                                                    >
                                                        {MEAL_TIMES.map((time) => <option key={time} value={time}>{time}</option>)}
                                                    </select>
                                                </div>
                                                {formData.meals.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveMeal(meal.id)}
                                                        className="rounded-md p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                {meal.foods.map((food) => (
                                                    <div key={food.id} className="rounded-md border border-border bg-background">
                                                        {/* Linha 1: busca + remover */}
                                                        <div className="flex items-center gap-2 px-2 pt-2">
                                                            <FoodSearch
                                                                value={food.name}
                                                                portion={food.portion}
                                                                calories={food.calories}
                                                                onChange={(name, portion, calories, per100g) =>
                                                                    handleUpdateFoodBatch(meal.id, food.id, {
                                                                        name,
                                                                        portion,
                                                                        calories,
                                                                        per100g,
                                                                        quantity: 100,
                                                                    })
                                                                }
                                                                onClear={() =>
                                                                    handleUpdateFoodBatch(meal.id, food.id, {
                                                                        name: '',
                                                                        portion: '',
                                                                        calories: 0,
                                                                        quantity: 100,
                                                                        per100g: undefined,
                                                                    })
                                                                }
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveFood(meal.id, food.id)}
                                                                className="flex-shrink-0 p-1 text-muted-foreground transition hover:text-destructive"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        </div>

                                                        {/* Linha 2: quantidade + porção + kcal */}
                                                        <div className="flex items-center gap-2 px-2 pb-2 pt-1">
                                                            <div className="flex items-center gap-1 rounded border border-border bg-muted/30 px-2 py-1">
                                                                <span className="text-xs text-muted-foreground">Qtd</span>
                                                                <input
                                                                    type="number"
                                                                    min={1}
                                                                    value={food.quantity ?? 100}
                                                                    onChange={(e) => handleQuantityChange(meal.id, food.id, Number(e.target.value))}
                                                                    className="w-14 bg-transparent text-center text-sm text-foreground outline-none"
                                                                />
                                                                <span className="text-xs text-muted-foreground">g</span>
                                                            </div>

                                                            <input
                                                                type="text"
                                                                value={food.portion}
                                                                onChange={(e) => {
                                                                    const newPortion = e.target.value;
                                                                    const match = newPortion.match(/(\d+)\s*g/i);
                                                                    const newGrams = match ? Number(match[1]) : food.quantity ?? 100;
                                                                    const newCalories = food.per100g
                                                                        ? Math.round(food.per100g.calorias * newGrams / 100)
                                                                        : food.calories;

                                                                    handleUpdateFoodBatch(meal.id, food.id, {
                                                                        portion: newPortion,
                                                                        quantity: newGrams,
                                                                        calories: newCalories,
                                                                    });
                                                                }}
                                                                className="flex-1 rounded border border-border bg-muted/30 px-2 py-1 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                                                                placeholder="Porção (ex: 1 fatia)"
                                                            />

                                                            <div className="flex items-center gap-1 rounded border border-border bg-muted/30 px-2 py-1">
                                                                <input
                                                                    type="number"
                                                                    value={food.calories || ''}
                                                                    onChange={(e) => handleUpdateFood(meal.id, food.id, 'calories', Number(e.target.value))}
                                                                    className="w-14 bg-transparent text-center text-sm text-foreground outline-none"
                                                                    placeholder="0"
                                                                />
                                                                <span className="text-xs text-muted-foreground">kcal</span>
                                                            </div>
                                                        </div>

                                                        {/* Linha 3: macros — só se tiver per100g */}
                                                        {food.per100g && (
                                                            <div className="flex items-center gap-3 border-t border-border/50 px-3 py-1.5">
                                                                <span className="text-xs text-muted-foreground">
                                                                    P: <span className="font-medium text-foreground">
                                                                        {((food.per100g.proteinas * (food.quantity ?? 100)) / 100).toFixed(1)}g
                                                                    </span>
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    C: <span className="font-medium text-foreground">
                                                                        {((food.per100g.carboidratos * (food.quantity ?? 100)) / 100).toFixed(1)}g
                                                                    </span>
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    G: <span className="font-medium text-foreground">
                                                                        {((food.per100g.gorduras * (food.quantity ?? 100)) / 100).toFixed(1)}g
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleAddFood(meal.id)}
                                                className="mt-3 flex items-center gap-1 text-sm text-muted-foreground transition hover:text-primary"
                                            >
                                                <Plus className="h-4 w-4" /> Adicionar Alimento
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 flex gap-3 border-t border-border bg-card px-6 py-5">
                            <button
                                onClick={() => setShowFormModal(false)}
                                className="flex-1 rounded-md border border-border bg-transparent px-4 py-2 text-sm text-foreground transition hover:bg-muted"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                            >
                                <Save className="h-4 w-4" />
                                {editingPlan ? 'Salvar alterações' : 'Criar Plano'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de detalhes */}
            {showDetailModal && selectedPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-border bg-card text-card-foreground shadow-xl">

                        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card px-6 py-5">
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">{selectedPlan.planName}</h2>
                                <p className="text-sm text-muted-foreground">{selectedPlan.patientName} · {selectedPlan.calories} kcal</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => window.open(`${baseUrl}/planos/${selectedPlan.id}/download`, '_blank')}
                                    className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                                >
                                    <Download className="h-4 w-4" /> Baixar PDF
                                </button>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="mb-6 flex flex-wrap items-center gap-2">
                                <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                    <Check className="h-3.5 w-3.5" /> {selectedPlan.objective}
                                </span>
                                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                                    {selectedPlan.meals.length} refeições
                                </span>
                                {selectedPlan.restrictions.length > 0 && (
                                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                        {selectedPlan.restrictions.join(', ')}
                                    </span>
                                )}
                            </div>

                            <h3 className="mb-4 font-semibold text-foreground">Refeições</h3>
                            <div className="space-y-4">
                                {selectedPlan.meals
                                    .filter((m) => m.foods.length > 0)
                                    .map((meal) => (
                                        <div key={meal.id} className="rounded-lg border border-border bg-muted/30 p-4">
                                            <div className="mb-3 flex items-center justify-between">
                                                <h4 className="font-medium text-foreground">{meal.name || 'Refeição'}</h4>
                                                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                    <Clock className="h-3.5 w-3.5" /> {meal.time}
                                                </span>
                                            </div>
                                            <ul className="space-y-2">
                                                {meal.foods.map((food) => (
                                                    <li key={food.id} className="flex items-center justify-between text-sm">
                                                        <span className="flex items-center gap-2 text-foreground">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                            {food.name}
                                                            {food.portion && (
                                                                <span className="text-muted-foreground">({food.portion})</span>
                                                            )}
                                                        </span>
                                                        <span className="text-muted-foreground">{food.calories} kcal</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <div className="sticky bottom-0 border-t border-border bg-card px-6 py-5">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="w-full rounded-md border border-border bg-transparent px-4 py-2 text-sm text-foreground transition hover:bg-muted"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}