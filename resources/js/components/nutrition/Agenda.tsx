import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, Plus, X, Check, AlertCircle, Trash2, Edit2, } from 'lucide-react';
import { usePage, router } from '@inertiajs/react';
import { PageHeader, ContentCard } from '@/components/ui';

interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    phone: string;
    time: string;
    date?: string;
    duration: number;
    type: 'consulta' | 'retorno' | 'avaliacao';
    status: 'confirmado' | 'pendente' | 'cancelado';
    notes: string;
}

interface DayData {
    date: string;
    slots: string[];
    appointments: Appointment[];
}

interface AgendaProps {
    initialAppointments?: Appointment[];
    initialMonth?: number;
    initialYear?: number;
    pacientes?: Array<{ id: string; name: string; phone: string }>;
}

const DEFAULT_SLOTS = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
];
const generateId = () => Math.random().toString(36).substring(2, 15);

const typeColors = {
    consulta: {
        bg: 'bg-blue-50/80 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-700 dark:text-blue-300',
        badge: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
    },
    retorno: {
        bg: 'bg-purple-50/80 dark:bg-purple-900/20',
        border: 'border-purple-200 dark:border-purple-800',
        text: 'text-purple-700 dark:text-purple-300',
        badge: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200',
    },
    avaliacao: {
        bg: 'bg-amber-50/80 dark:bg-amber-900/20',
        border: 'border-amber-200 dark:border-amber-800',
        text: 'text-amber-700 dark:text-amber-300',
        badge: 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-200',
    },
};

const inputClass = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30";
const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground";

export function Agenda({ initialAppointments = [], initialMonth, initialYear, pacientes = [] }: AgendaProps) {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(
        initialMonth && initialYear ? new Date(initialYear, initialMonth - 1, 1) : today,
    );
    const [allAppointments, setAllAppointments] = useState<Appointment[]>(initialAppointments);
    const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showNewAppointment, setShowNewAppointment] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [newAppointment, setNewAppointment] = useState({
        patientName: '', phone: '', time: '', duration: 60,
        type: 'consulta' as Appointment['type'], notes: '',
    });

    const page = usePage();
    const baseUrl = page.props.currentTeam ? `/${page.props.currentTeam.slug}` : '';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long' });
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const monthData = getMonthData(year, month, allAppointments);
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    useEffect(() => { setAllAppointments(initialAppointments); }, [initialAppointments]);

    const goToPrevMonth = useCallback(() => setCurrentDate(new Date(year, month - 1, 1)), [year, month]);
    const goToNextMonth = useCallback(() => setCurrentDate(new Date(year, month + 1, 1)), [year, month]);

    const handleDayClick = (day: number) => {
        const data = monthData[day - 1];
        if (data) { setSelectedDay(data); setShowModal(true); setShowNewAppointment(false); setEditingAppointment(null); }
    };

    const resetForm = () => {
        setNewAppointment({ patientName: '', phone: '', time: '', duration: 60, type: 'consulta', notes: '' });
        setSelectedPatientId('');
    };

    const handleAddAppointment = () => {
        if (!selectedDay || !selectedPatientId || !newAppointment.time) return;
        const selectedPatient = pacientes.find((p) => p.id === selectedPatientId);
        router.post(`${baseUrl}/consultas`, {
            cliente_id: selectedPatientId, data: selectedDay.date,
            horario: newAppointment.time, duracao: newAppointment.duration,
            tipo: newAppointment.type, status: 'pendente',
            observacoes: newAppointment.notes, telefone: newAppointment.phone,
        }, {
            onSuccess: () => {
                setAllAppointments([...allAppointments, {
                    id: generateId(), patientId: selectedPatientId,
                    patientName: selectedPatient?.name || '', phone: newAppointment.phone,
                    time: newAppointment.time, date: selectedDay.date,
                    duration: newAppointment.duration, type: newAppointment.type,
                    status: 'pendente', notes: newAppointment.notes,
                }]);
                resetForm(); setShowNewAppointment(false); setShowModal(false);
            },
        });
    };

    const handleSaveEdit = () => {
        if (!editingAppointment || !newAppointment.time || !selectedPatientId) return;
        const selectedPatient = pacientes.find((p) => p.id === selectedPatientId);
        router.put(`${baseUrl}/consultas/${editingAppointment.id}`, {
            cliente_id: selectedPatientId, horario: newAppointment.time,
            duracao: newAppointment.duration, tipo: newAppointment.type,
            status: 'pendente', observacoes: newAppointment.notes,
        }, {
            onSuccess: () => {
                setAllAppointments(allAppointments.map((apt) =>
                    apt.id === editingAppointment.id
                        ? Object.assign({}, apt, newAppointment, {
                            patientId: selectedPatientId,
                            patientName: selectedPatient?.name || apt.patientName,
                        })
                        : apt,
                ));
                setEditingAppointment(null); setShowNewAppointment(false);
                setShowModal(false); resetForm();
            },
        });
    };

    const handleDeleteAppointment = (aptId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const handleDeleteAppointment = (aptId: string, e: React.MouseEvent) => {
            e.stopPropagation();
            setDeleteId(aptId);
        }; {
            router.delete(`${baseUrl}/consultas/${aptId}`, {
                onSuccess: () => {
                    // Atualiza a lista geral
                    const updated = allAppointments.filter((apt) => apt.id !== aptId);
                    setAllAppointments(updated);

                    // Atualiza o selectedDay para refletir no modal imediatamente
                    if (selectedDay) {
                        const newAppointments = selectedDay.appointments.filter(
                            (apt) => apt.id !== aptId,
                        );
                        const usedSlots = newAppointments
                            .filter((a) => a.status !== 'cancelado')
                            .map((a) => a.time);
                        const availableSlots = DEFAULT_SLOTS.filter(
                            (s) => !usedSlots.includes(s),
                        );
                        setSelectedDay({
                            ...selectedDay,
                            appointments: newAppointments,
                            slots: availableSlots,
                        });
                    }
                },
            });
        }
    };

    const confirmDelete = () => {
        if (!deleteId) return;

        setIsDeleting(true);

        router.delete(`${baseUrl}/consultas/${deleteId}`, {
            onSuccess: () => {
                const updated = allAppointments.filter((apt) => apt.id !== deleteId);
                setAllAppointments(updated);

                if (selectedDay) {
                    const newAppointments = selectedDay.appointments.filter(
                        (apt) => apt.id !== deleteId,
                    );

                    const usedSlots = newAppointments
                        .filter((a) => a.status !== 'cancelado')
                        .map((a) => a.time);

                    const availableSlots = DEFAULT_SLOTS.filter(
                        (s) => !usedSlots.includes(s),
                    );

                    setSelectedDay({
                        ...selectedDay,
                        appointments: newAppointments,
                        slots: availableSlots,
                    });
                }

                setDeleteId(null);
                setIsDeleting(false);
            },
            onError: () => {
                setIsDeleting(false);
            }
        });
    };



    const handleCancelAppointment = (aptId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        router.put(`${baseUrl}/consultas/${aptId}`, { status: 'cancelado' }, {
            onSuccess: () => {
                // Atualiza lista geral
                const updated = allAppointments.map((apt) =>
                    apt.id === aptId ? { ...apt, status: 'cancelado' as const } : apt,
                );
                setAllAppointments(updated);

                // Atualiza selectedDay imediatamente
                if (selectedDay) {
                    const newAppointments = selectedDay.appointments.map((apt) =>
                        apt.id === aptId ? { ...apt, status: 'cancelado' as const } : apt,
                    );
                    const usedSlots = newAppointments
                        .filter((a) => a.status !== 'cancelado')
                        .map((a) => a.time);
                    const availableSlots = DEFAULT_SLOTS.filter(
                        (s) => !usedSlots.includes(s),
                    );
                    setSelectedDay({
                        ...selectedDay,
                        appointments: newAppointments,
                        slots: availableSlots,
                    });
                }
            },
        });
    };
    const handleCloseModal = () => {
        setShowModal(false); setSelectedDay(null);
        setShowNewAppointment(false); setEditingAppointment(null);
    };

    const renderCalendarDays = () => {
        const days = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-20 md:h-24" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayData = monthData[day - 1];
            const dayOfWeek = new Date(year, month, day).getDay();

            const currentDayDate = new Date(year, month, day);
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);

            const isSunday = dayOfWeek === 0;
            const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();

            const isPast = currentDayDate < todayDate;

            // 🎨 Estilos base
            let bgClass = 'bg-card hover:bg-muted';
            let dotClass = '';
            let countClass = 'text-muted-foreground';
            let opacityClass = '';

            // 🚫 Dias passados
            if (isPast) {
                bgClass = 'bg-muted/50';
                opacityClass = 'opacity-50';
            }
            // 🚫 Domingo
            else if (isSunday) {
                bgClass = 'bg-muted/50';
            }
            // 📅 Dias com dados
            else if (dayData) {
                const active = dayData.appointments.filter(
                    (a) => a.status !== 'cancelado'
                );

                if (dayData.slots.length > 0) {
                    bgClass = 'bg-primary/5 hover:bg-primary/10';
                    dotClass = 'bg-primary';
                    countClass = 'text-primary';
                } else if (active.length > 0) {
                    bgClass =
                        'bg-blue-50/60 hover:bg-blue-100/60 dark:bg-blue-900/10 dark:hover:bg-blue-900/20';
                    dotClass = 'bg-blue-500';
                    countClass = 'text-blue-600 dark:text-blue-400';
                }
            }

            days.push(
                <div
                    key={day}
                    onClick={() =>
                        !isSunday && !isPast && handleDayClick(day)
                    }
                    className={`h-20 rounded-lg border border-border p-2 transition-all md:h-24 
                    ${bgClass}
                    ${opacityClass}
                    ${isSunday || isPast
                            ? 'cursor-not-allowed'
                            : 'cursor-pointer hover:shadow-sm'}
                    ${isToday ? 'ring-2 ring-primary' : ''}
                `}
                >
                    <div className="flex items-center justify-between">
                        <span
                            className={`text-sm font-medium ${isPast
                                    ? 'text-muted-foreground'
                                    : isToday
                                        ? 'text-primary'
                                        : 'text-foreground'
                                }`}
                        >
                            {day}
                        </span>

                        {!isPast && dotClass && (
                            <div className={`h-2 w-2 rounded-full ${dotClass}`} />
                        )}
                    </div>

                    {dayData && !isSunday && (
                        <div className={`mt-1 text-xs ${countClass}`}>
                            {!isPast &&
                                dayData.appointments.filter(
                                    (a) => a.status !== 'cancelado'
                                ).length > 0 && (
                                    <span className="text-blue-600 dark:text-blue-400">
                                        {
                                            dayData.appointments.filter(
                                                (a) => a.status !== 'cancelado'
                                            ).length
                                        }{' '}
                                        consul.
                                    </span>
                                )}

                            {!isPast && dayData.slots.length > 0 && (
                                <span
                                    className={
                                        dayData.appointments.filter(
                                            (a) => a.status !== 'cancelado'
                                        ).length > 0
                                            ? 'text-muted-foreground'
                                            : 'text-primary'
                                    }
                                >
                                    {' '}
                                    {dayData.slots.length} vagas
                                </span>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Agenda" description="Gerencie suas consultas e disponibilidade" />

            <ContentCard>
                {/* Navegação do mês */}
                <div className="flex items-center justify-between border-b border-border p-4">
                    <button onClick={goToPrevMonth} className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h2 className="text-base font-semibold capitalize text-foreground">{monthName} {year}</h2>
                    <button onClick={goToNextMonth} className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground">
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                {/* Dias da semana */}
                <div className="grid grid-cols-7 border-b border-border bg-muted/40">
                    {weekdays.map((day) => (
                        <div key={day} className="p-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Grade de dias */}
                <div className="grid grid-cols-7 gap-1 p-4">
                    {renderCalendarDays()}
                </div>
            </ContentCard>

            {/* Legenda */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {[
                    { bg: 'bg-primary/10', label: 'Dia com vagas disponíveis' },
                    { bg: 'bg-blue-50 dark:bg-blue-900/20', label: 'Dia lotado (sem vagas)' },
                    { bg: 'bg-muted/50', label: 'Domingo (fechado)' },
                ].map(({ bg, label }) => (
                    <div key={label} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                        <div className={`h-4 w-4 rounded border border-border ${bg}`} />
                        <span className="text-sm text-muted-foreground">{label}</span>
                    </div>
                ))}
            </div>

            {/* Modal do dia */}
            {showModal && selectedDay && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card text-card-foreground shadow-xl">

                        {/* Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-5">
                            <div>
                                <h2 className="text-base font-semibold capitalize text-foreground">
                                    {new Date(selectedDay.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </h2>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {selectedDay.appointments.filter((a) => a.status !== 'cancelado').length} consultas · {selectedDay.slots.length} vagas
                                </p>
                            </div>
                            <button onClick={handleCloseModal} className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-6 p-6">
                            {showNewAppointment ? (
                                /* Formulário de nova consulta / edição */
                                <div className="space-y-4">
                                    <h3 className="font-medium text-foreground">
                                        {editingAppointment ? 'Editar Consulta' : 'Nova Consulta'}
                                    </h3>

                                    <div>
                                        <label className={labelClass}>Paciente *</label>
                                        <select
                                            value={selectedPatientId}
                                            onChange={(e) => {
                                                setSelectedPatientId(e.target.value);
                                                const p = pacientes.find((p) => p.id === e.target.value);
                                                if (p) setNewAppointment((prev) => ({ ...prev, phone: p.phone || '' }));
                                            }}
                                            className={inputClass}
                                        >
                                            <option value="">Selecione um paciente</option>
                                            {pacientes.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Telefone</label>
                                        <input
                                            type="tel"
                                            value={newAppointment.phone}
                                            onChange={(e) => setNewAppointment({ ...newAppointment, phone: e.target.value })}
                                            className={inputClass}
                                            placeholder="(11) 99999-9999"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClass}>Horário *</label>
                                            <select
                                                value={newAppointment.time}
                                                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                                                className={inputClass}
                                            >
                                                <option value="">Selecione</option>
                                                {DEFAULT_SLOTS.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Duração</label>
                                            <select
                                                value={newAppointment.duration}
                                                onChange={(e) => setNewAppointment({ ...newAppointment, duration: Number(e.target.value) })}
                                                className={inputClass}
                                            >
                                                <option value={30}>30 min</option>
                                                <option value={60}>60 min</option>
                                                <option value={90}>90 min</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Tipo</label>
                                        <select
                                            value={newAppointment.type}
                                            onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value as Appointment['type'] })}
                                            className={inputClass}
                                        >
                                            <option value="consulta">Consulta</option>
                                            <option value="retorno">Retorno</option>
                                            <option value="avaliacao">Avaliação</option>
                                        </select>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={() => { setShowNewAppointment(false); setEditingAppointment(null); resetForm(); }}
                                            className="flex-1 rounded-md border border-border bg-transparent px-4 py-2 text-sm text-foreground transition hover:bg-muted"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={editingAppointment ? handleSaveEdit : handleAddAppointment}
                                            disabled={!selectedPatientId || !newAppointment.time}
                                            className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                                        >
                                            {editingAppointment ? 'Salvar' : 'Agendar'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Horários disponíveis */}
                                    <div>
                                        <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                                            <Clock className="h-4 w-4 text-muted-foreground" /> Horários Disponíveis
                                        </h3>
                                        {selectedDay.slots.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {selectedDay.slots.map((slot) => (
                                                    <span key={slot} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                                        {slot}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">Sem horários disponíveis</p>
                                        )}
                                    </div>

                                    {/* Consultas marcadas */}
                                    <div>
                                        <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                                            <User className="h-4 w-4 text-muted-foreground" /> Consultas Marcadas
                                        </h3>
                                        {selectedDay.appointments.length > 0 ? (
                                            <div className="space-y-3">
                                                {selectedDay.appointments.map((apt) => {
                                                    const s = typeColors[apt.type];
                                                    return (
                                                        <div key={apt.id} className={`rounded-lg border p-4 transition ${s.bg} ${s.border} ${apt.status === 'cancelado' ? 'opacity-50' : ''}`}>
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div className="flex-1">
                                                                    <p className="font-medium text-foreground">{apt.patientName}</p>
                                                                    <p className="text-sm text-muted-foreground">{apt.time} · {apt.duration}min</p>
                                                                    {apt.phone && <p className="text-sm text-muted-foreground">{apt.phone}</p>}
                                                                </div>
                                                                <div className="flex flex-col items-end gap-1.5">
                                                                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${s.badge}`}>{apt.type}</span>
                                                                    <span className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${apt.status === 'confirmado'
                                                                            ? 'bg-primary/10 text-primary'
                                                                            : apt.status === 'pendente'
                                                                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                                                : 'bg-destructive/10 text-destructive'
                                                                        }`}>
                                                                        {apt.status === 'confirmado' && <Check className="h-3 w-3" />}
                                                                        {apt.status === 'pendente' && <AlertCircle className="h-3 w-3" />}
                                                                        {apt.status}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {apt.status !== 'cancelado' && (
                                                                <div className="mt-3 flex gap-2 border-t border-border/50 pt-3">
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditingAppointment(apt);
                                                                            setSelectedPatientId(apt.patientId);
                                                                            setNewAppointment({ patientName: apt.patientName, phone: apt.phone, time: apt.time, duration: apt.duration, type: apt.type, notes: apt.notes });
                                                                            setShowNewAppointment(true);
                                                                        }}
                                                                        className="flex flex-1 items-center justify-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground transition hover:bg-muted"
                                                                    >
                                                                        <Edit2 className="h-3 w-3" /> Editar
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => handleCancelAppointment(apt.id, e)}
                                                                        className="flex flex-1 items-center justify-center gap-1 rounded-md border border-amber-200 bg-amber-100/60 px-3 py-1.5 text-xs text-amber-700 transition hover:bg-amber-200/60 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                                                                    >
                                                                        <X className="h-3 w-3" /> Cancelar
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => handleDeleteAppointment(apt.id, e)}
                                                                        className="flex items-center justify-center rounded-md border border-destructive/20 bg-destructive/10 px-3 py-1.5 text-xs text-destructive transition hover:bg-destructive/20"
                                                                    >
                                                                        <Trash2 className="h-3 w-3" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">Nenhuma consulta marcada</p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer sticky */}
                        {!showNewAppointment && (
                            <div className="sticky bottom-0 flex gap-3 border-t border-border bg-card px-6 py-5">
                                <button
                                    onClick={handleCloseModal}
                                    className="flex-1 rounded-md border border-border bg-transparent px-4 py-2 text-sm text-foreground transition hover:bg-muted"
                                >
                                    Fechar
                                </button>
                                <button
                                    onClick={() => setShowNewAppointment(true)}
                                    disabled={selectedDay.slots.length === 0}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                                >
                                    <Plus className="h-4 w-4" /> Nova Consulta
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function getMonthData(year: number, month: number, appointments: Appointment[]): DayData[] {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dayDataMap = new Map<string, Appointment[]>();

    appointments.forEach((apt) => {
        let dateStr = apt.date ?? (() => {
            const dayMatch = apt.id.match(/^(\d{2})/);
            const day = dayMatch ? parseInt(dayMatch[1]) : new Date().getDate();
            return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        })();
        if (!dayDataMap.has(dateStr)) dayDataMap.set(dateStr, []);
        dayDataMap.get(dateStr)!.push(apt);
    });

    const DEFAULT_SLOTS = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    const days: DayData[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayOfWeek = new Date(year, month, day).getDay();
        if (dayOfWeek === 0) { days.push({ date: dateStr, slots: [], appointments: [] }); continue; }
        const dayAppointments = dayDataMap.get(dateStr) || [];
        const usedSlots = dayAppointments.filter((a) => a.status !== 'cancelado').map((a) => a.time);
        days.push({
            date: dateStr,
            slots: DEFAULT_SLOTS.filter((s) => !usedSlots.includes(s)),
            appointments: dayAppointments.sort((a, b) => a.time.localeCompare(b.time)),
        });
    }
    return days;
}