import { useState, useEffect, useCallback } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    User,
    Plus,
    X,
    Check,
    AlertCircle,
    Trash2,
    Edit2,
} from 'lucide-react';
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
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        badge: 'bg-blue-200',
    },
    retorno: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        badge: 'bg-purple-200',
    },
    avaliacao: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-700',
        badge: 'bg-orange-200',
    },
};

export function Agenda({
    initialAppointments = [],
    initialMonth,
    initialYear,
    pacientes = [],
}: AgendaProps) {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(
        initialMonth && initialYear
            ? new Date(initialYear, initialMonth - 1, 1)
            : today,
    );
    const [allAppointments, setAllAppointments] =
        useState<Appointment[]>(initialAppointments);
    const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showNewAppointment, setShowNewAppointment] = useState(false);
    const [editingAppointment, setEditingAppointment] =
        useState<Appointment | null>(null);
    const [selectedPatientId, setSelectedPatientId] = useState<string>('');
    const [newAppointment, setNewAppointment] = useState({
        patientName: '',
        phone: '',
        time: '',
        duration: 60,
        type: 'consulta' as Appointment['type'],
        notes: '',
    });

    const page = usePage();
    const baseUrl = page.props.currentTeam
        ? `/${page.props.currentTeam.slug}`
        : '';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleDateString('pt-BR', {
        month: 'long',
    });
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const monthData = getMonthData(year, month, allAppointments);

    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    useEffect(() => {
        setAllAppointments(initialAppointments);
    }, [initialAppointments]);

    const goToPrevMonth = useCallback(() => {
        setCurrentDate(new Date(year, month - 1, 1));
    }, [year, month]);

    const goToNextMonth = useCallback(() => {
        setCurrentDate(new Date(year, month + 1, 1));
    }, [year, month]);

    const handleDayClick = (day: number) => {
        const data = monthData[day - 1];
        if (data) {
            setSelectedDay(data);
            setShowModal(true);
            setShowNewAppointment(false);
            setEditingAppointment(null);
        }
    };

    const handleAddAppointment = () => {
        if (!selectedDay || !selectedPatientId || !newAppointment.time) return;

        const selectedPatient = pacientes.find(
            (p) => p.id === selectedPatientId,
        );
        const appointmentDate = selectedDay.date;
        const data = {
            cliente_id: selectedPatientId,
            data: appointmentDate,
            horario: newAppointment.time,
            duracao: newAppointment.duration,
            tipo: newAppointment.type,
            status: 'pendente',
            observacoes: newAppointment.notes,
            telefone: newAppointment.phone,
        };

        router.post(`${baseUrl}/consultas`, data, {
            onSuccess: () => {
                const appointment: Appointment = {
                    id: generateId(),
                    patientId: selectedPatientId,
                    patientName: selectedPatient?.name || '',
                    phone: newAppointment.phone,
                    time: newAppointment.time,
                    date: appointmentDate,
                    duration: newAppointment.duration,
                    type: newAppointment.type,
                    status: 'pendente',
                    notes: newAppointment.notes,
                };
                setAllAppointments([...allAppointments, appointment]);
                setNewAppointment({
                    patientName: '',
                    phone: '',
                    time: '',
                    duration: 60,
                    type: 'consulta',
                    notes: '',
                });
                setSelectedPatientId('');
                setShowNewAppointment(false);
            },
        });
    };

    const handleSaveEdit = () => {
        if (!editingAppointment || !newAppointment.time || !selectedPatientId)
            return;

        const selectedPatient = pacientes.find(
            (p) => p.id === selectedPatientId,
        );
        router.put(
            `${baseUrl}/consultas/${editingAppointment.id}`,
            {
                cliente_id: selectedPatientId,
                horario: newAppointment.time,
                duracao: newAppointment.duration,
                tipo: newAppointment.type,
                status: newAppointment.status || 'pendente',
                observacoes: newAppointment.notes,
            },
            {
                onSuccess: () => {
                    const updated = allAppointments.map((apt) =>
                        apt.id === editingAppointment.id
                            ? {
                                  ...apt,
                                  patientId: selectedPatientId,
                                  patientName:
                                      selectedPatient?.name || apt.patientName,
                                  ...newAppointment,
                              }
                            : apt,
                    );
                    setAllAppointments(updated);
                    setEditingAppointment(null);
                    setShowNewAppointment(false);
                    setNewAppointment({
                        patientName: '',
                        phone: '',
                        time: '',
                        duration: 60,
                        type: 'consulta',
                        notes: '',
                    });
                    setSelectedPatientId('');
                },
            },
        );
    };

    const handleDeleteAppointment = (aptId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Excluir esta consulta?')) {
            router.delete(`${baseUrl}/consultas/${aptId}`, {
                onSuccess: () => {
                    setAllAppointments(
                        allAppointments.filter((apt) => apt.id !== aptId),
                    );
                },
            });
        }
    };

    const handleCancelAppointment = (aptId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        router.put(
            `${baseUrl}/consultas/${aptId}`,
            {
                status: 'cancelado',
            },
            {
                onSuccess: () => {
                    const updated = allAppointments.map((apt) =>
                        apt.id === aptId
                            ? { ...apt, status: 'cancelado' as const }
                            : apt,
                    );
                    setAllAppointments(updated);
                },
            },
        );
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDay(null);
        setShowNewAppointment(false);
        setEditingAppointment(null);
    };

    const renderCalendarDays = () => {
        const days = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-20 md:h-24" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayData = monthData[day - 1];
            const dayOfWeek = new Date(year, month, day).getDay();
            const isSunday = dayOfWeek === 0;
            const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();

            let bgClass = 'bg-white hover:bg-gray-50';
            let dotColor = '';

            if (isSunday) {
                bgClass = 'bg-gray-100';
            } else if (dayData) {
                const activeAppointments = dayData.appointments.filter(
                    (a) => a.status !== 'cancelado',
                );
                if (
                    activeAppointments.length > 0 &&
                    dayData.slots.length === 0
                ) {
                    bgClass = 'bg-blue-50';
                    dotColor = 'bg-blue-500';
                } else if (activeAppointments.length > 0) {
                    bgClass = 'bg-emerald-50';
                    dotColor = 'bg-emerald-500';
                } else {
                    dotColor = 'bg-gray-300';
                }
            }

            days.push(
                <div
                    key={day}
                    onClick={() => !isSunday && handleDayClick(day)}
                    className={`h-20 cursor-pointer rounded-lg border border-gray-100 p-2 transition-all md:h-24 ${bgClass} ${
                        isSunday
                            ? 'cursor-not-allowed opacity-60'
                            : 'hover:shadow-md'
                    } ${isToday ? 'ring-2 ring-emerald-500' : ''}`}
                >
                    <div className="flex items-center justify-between">
                        <span
                            className={`text-sm font-medium ${isToday ? 'text-emerald-600' : 'text-gray-700'}`}
                        >
                            {day}
                        </span>
                        {dotColor && (
                            <div
                                className={`h-2 w-2 rounded-full ${dotColor}`}
                            />
                        )}
                    </div>
                    {dayData && !isSunday && (
                        <div className="mt-1 text-xs text-gray-500">
                            {dayData.appointments.filter(
                                (a) => a.status !== 'cancelado',
                            ).length > 0 && (
                                <span className="text-blue-600">
                                    {
                                        dayData.appointments.filter(
                                            (a) => a.status !== 'cancelado',
                                        ).length
                                    }{' '}
                                    consul.
                                </span>
                            )}
                            {dayData.slots.length > 0 && (
                                <span
                                    className={
                                        dayData.appointments.filter(
                                            (a) => a.status !== 'cancelado',
                                        ).length > 0
                                            ? 'text-gray-400'
                                            : 'text-emerald-600'
                                    }
                                >
                                    {dayData.slots.length} vagas
                                </span>
                            )}
                        </div>
                    )}
                </div>,
            );
        }

        return days;
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Agenda"
                description="Gerencie suas consultas e disponibilidade"
            />

            <ContentCard>
                <div className="flex items-center justify-between border-b border-gray-100 p-4">
                    <button
                        onClick={goToPrevMonth}
                        className="rounded-lg p-2 hover:bg-gray-100"
                    >
                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <h2 className="text-lg font-semibold text-gray-900 capitalize">
                        {monthName} {year}
                    </h2>
                    <button
                        onClick={goToNextMonth}
                        className="rounded-lg p-2 hover:bg-gray-100"
                    >
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                </div>

                <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
                    {weekdays.map((day) => (
                        <div
                            key={day}
                            className="p-3 text-center text-sm font-medium text-gray-500"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1 p-4">
                    {renderCalendarDays()}
                </div>
            </ContentCard>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-white p-4">
                    <div className="h-4 w-4 rounded border border-gray-200 bg-emerald-50" />
                    <span className="text-sm text-gray-600">
                        Dia com vagas disponíveis
                    </span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-white p-4">
                    <div className="h-4 w-4 rounded border border-gray-200 bg-blue-50" />
                    <span className="text-sm text-gray-600">
                        Dia lotado (sem vagas)
                    </span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-white p-4">
                    <div className="h-4 w-4 rounded border border-gray-200 bg-gray-100" />
                    <span className="text-sm text-gray-600">
                        Domingo (fechado)
                    </span>
                </div>
            </div>

            {showModal && selectedDay && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white">
                        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-6">
                            <div>
                                <h2 className="text-xl font-semibold capitalize">
                                    {new Date(
                                        selectedDay.date + 'T00:00:00',
                                    ).toLocaleDateString('pt-BR', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                    })}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {
                                        selectedDay.appointments.filter(
                                            (a) => a.status !== 'cancelado',
                                        ).length
                                    }{' '}
                                    consultas • {selectedDay.slots.length} vagas
                                </p>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-6 p-6">
                            {showNewAppointment ? (
                                <div className="space-y-4">
                                    <h3 className="font-medium text-gray-900">
                                        {editingAppointment
                                            ? 'Editar Consulta'
                                            : 'Nova Consulta'}
                                    </h3>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Paciente *
                                        </label>
                                        <select
                                            value={selectedPatientId}
                                            onChange={(e) => {
                                                const patientId = e.target.value;
                                                setSelectedPatientId(patientId);
                                                
                                                // Auto-preencher telefone quando paciente for selecionado
                                                const selectedPatient = pacientes.find(p => p.id === patientId);
                                                if (selectedPatient) {
                                                    setNewAppointment(prev => ({
                                                        ...prev,
                                                        phone: selectedPatient.phone || '',
                                                    }));
                                                }
                                            }}
                                            className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                                        >
                                            <option value="">
                                                Selecione um paciente
                                            </option>
                                            {pacientes.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Telefone
                                        </label>
                                        <input
                                            type="tel"
                                            value={newAppointment.phone}
                                            onChange={(e) =>
                                                setNewAppointment({
                                                    ...newAppointment,
                                                    phone: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Horário *
                                            </label>
                                            <select
                                                value={newAppointment.time}
                                                onChange={(e) =>
                                                    setNewAppointment({
                                                        ...newAppointment,
                                                        time: e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border px-4 py-2"
                                            >
                                                <option value="">
                                                    Selecione
                                                </option>
                                                {DEFAULT_SLOTS.map((slot) => (
                                                    <option
                                                        key={slot}
                                                        value={slot}
                                                    >
                                                        {slot}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Duração
                                            </label>
                                            <select
                                                value={newAppointment.duration}
                                                onChange={(e) =>
                                                    setNewAppointment({
                                                        ...newAppointment,
                                                        duration: Number(
                                                            e.target.value,
                                                        ),
                                                    })
                                                }
                                                className="w-full rounded-lg border px-4 py-2"
                                            >
                                                <option value={30}>
                                                    30 min
                                                </option>
                                                <option value={60}>
                                                    60 min
                                                </option>
                                                <option value={90}>
                                                    90 min
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Tipo
                                        </label>
                                        <select
                                            value={newAppointment.type}
                                            onChange={(e) =>
                                                setNewAppointment({
                                                    ...newAppointment,
                                                    type: e.target
                                                        .value as Appointment['type'],
                                                })
                                            }
                                            className="w-full rounded-lg border px-4 py-2"
                                        >
                                            <option value="consulta">
                                                Consulta
                                            </option>
                                            <option value="retorno">
                                                Retorno
                                            </option>
                                            <option value="avaliacao">
                                                Avaliação
                                            </option>
                                        </select>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setShowNewAppointment(false);
                                                setEditingAppointment(null);
                                                setNewAppointment({
                                                    patientName: '',
                                                    phone: '',
                                                    time: '',
                                                    duration: 60,
                                                    type: 'consulta',
                                                    notes: '',
                                                });
                                                setSelectedPatientId('');
                                            }}
                                            className="flex-1 rounded-lg border px-4 py-2 hover:bg-gray-50"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={
                                                editingAppointment
                                                    ? handleSaveEdit
                                                    : handleAddAppointment
                                            }
                                            disabled={
                                                !selectedPatientId ||
                                                !newAppointment.time
                                            }
                                            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
                                        >
                                            {editingAppointment
                                                ? 'Salvar'
                                                : 'Agendar'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-900">
                                            <Clock className="h-4 w-4" />{' '}
                                            Horários Disponíveis
                                        </h3>
                                        {selectedDay.slots.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {selectedDay.slots.map(
                                                    (slot) => (
                                                        <span
                                                            key={slot}
                                                            className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700"
                                                        >
                                                            {slot}
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                Sem horários disponíveis
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-900">
                                            <User className="h-4 w-4" />{' '}
                                            Consultas Marcadas
                                        </h3>
                                        {selectedDay.appointments.length > 0 ? (
                                            <div className="space-y-3">
                                                {selectedDay.appointments.map(
                                                    (apt) => {
                                                        const colors =
                                                            typeColors[
                                                                apt.type
                                                            ];
                                                        return (
                                                            <div
                                                                key={apt.id}
                                                                className={`rounded-lg border p-4 ${colors.bg} ${colors.border} ${apt.status === 'cancelado' ? 'opacity-50' : ''}`}
                                                            >
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex-1">
                                                                        <p className="font-medium text-gray-900">
                                                                            {
                                                                                apt.patientName
                                                                            }
                                                                        </p>
                                                                        <p className="text-sm text-gray-600">
                                                                            {
                                                                                apt.time
                                                                            }{' '}
                                                                            •{' '}
                                                                            {
                                                                                apt.duration
                                                                            }
                                                                            min
                                                                        </p>
                                                                        {apt.phone && (
                                                                            <p className="text-sm text-gray-500">
                                                                                {
                                                                                    apt.phone
                                                                                }
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex flex-col items-end gap-2 text-right">
                                                                        <span
                                                                            className={`rounded px-2 py-1 text-xs font-medium ${colors.badge}`}
                                                                        >
                                                                            {
                                                                                apt.type
                                                                            }
                                                                        </span>
                                                                        <span
                                                                            className={`flex items-center gap-1 rounded px-2 py-1 text-xs ${
                                                                                apt.status ===
                                                                                'confirmado'
                                                                                    ? 'bg-emerald-200 text-emerald-700'
                                                                                    : apt.status ===
                                                                                        'pendente'
                                                                                      ? 'bg-yellow-200 text-yellow-700'
                                                                                      : 'bg-red-200 text-red-600'
                                                                            }`}
                                                                        >
                                                                            {apt.status ===
                                                                                'confirmado' && (
                                                                                <Check className="h-3 w-3" />
                                                                            )}
                                                                            {apt.status ===
                                                                                'pendente' && (
                                                                                <AlertCircle className="h-3 w-3" />
                                                                            )}
                                                                            {
                                                                                apt.status
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                {apt.status !==
                                                                    'cancelado' && (
                                                                    <div className="mt-3 flex gap-2 border-t border-gray-200 pt-3">
                                                                        <button
                                                                            onClick={(
                                                                                e,
                                                                            ) => {
                                                                                setEditingAppointment(
                                                                                    apt,
                                                                                );
                                                                                setSelectedPatientId(
                                                                                    apt.patientId,
                                                                                );
                                                                                setNewAppointment(
                                                                                    {
                                                                                        patientName:
                                                                                            apt.patientName,
                                                                                        phone: apt.phone,
                                                                                        time: apt.time,
                                                                                        duration:
                                                                                            apt.duration,
                                                                                        type: apt.type,
                                                                                        notes: apt.notes,
                                                                                    },
                                                                                );
                                                                                setShowNewAppointment(
                                                                                    true,
                                                                                );
                                                                            }}
                                                                            className="flex flex-1 items-center justify-center gap-1 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs hover:bg-gray-50"
                                                                        >
                                                                            <Edit2 className="h-3 w-3" />{' '}
                                                                            Editar
                                                                        </button>
                                                                        <button
                                                                            onClick={(
                                                                                e,
                                                                            ) =>
                                                                                handleCancelAppointment(
                                                                                    apt.id,
                                                                                    e,
                                                                                )
                                                                            }
                                                                            className="flex flex-1 items-center justify-center gap-1 rounded border border-yellow-200 bg-yellow-100 px-3 py-1.5 text-xs text-yellow-700 hover:bg-yellow-200"
                                                                        >
                                                                            <X className="h-3 w-3" />{' '}
                                                                            Cancelar
                                                                        </button>
                                                                        <button
                                                                            onClick={(
                                                                                e,
                                                                            ) =>
                                                                                handleDeleteAppointment(
                                                                                    apt.id,
                                                                                    e,
                                                                                )
                                                                            }
                                                                            className="flex items-center justify-center gap-1 rounded border border-red-200 bg-red-100 px-3 py-1.5 text-xs text-red-600 hover:bg-red-200"
                                                                        >
                                                                            <Trash2 className="h-3 w-3" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                Nenhuma consulta marcada
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {!showNewAppointment && (
                            <div className="sticky bottom-0 flex gap-3 border-t bg-white p-6">
                                <button
                                    onClick={handleCloseModal}
                                    className="flex-1 rounded-lg border px-4 py-2 hover:bg-gray-50"
                                >
                                    Fechar
                                </button>
                                <button
                                    onClick={() => setShowNewAppointment(true)}
                                    disabled={selectedDay.slots.length === 0}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
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

function getMonthData(
    year: number,
    month: number,
    appointments: Appointment[],
): DayData[] {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dayDataMap = new Map<string, Appointment[]>();

    appointments.forEach((apt) => {
        let dateStr: string;

        if (apt.date) {
            dateStr = apt.date;
        } else {
            const dayMatch = apt.id.match(/^(\d{2})/);
            const day = dayMatch ? parseInt(dayMatch[1]) : new Date().getDate();
            dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }

        if (!dayDataMap.has(dateStr)) {
            dayDataMap.set(dateStr, []);
        }
        dayDataMap.get(dateStr)!.push(apt);
    });

    const days: DayData[] = [];
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

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayOfWeek = new Date(year, month, day).getDay();

        if (dayOfWeek === 0) {
            days.push({ date: dateStr, slots: [], appointments: [] });
            continue;
        }

        const dayAppointments = dayDataMap.get(dateStr) || [];
        const usedSlots = dayAppointments
            .filter((a) => a.status !== 'cancelado')
            .map((a) => a.time);
        const availableSlots = DEFAULT_SLOTS.filter(
            (s) => !usedSlots.includes(s),
        );

        days.push({
            date: dateStr,
            slots: availableSlots,
            appointments: dayAppointments.sort((a, b) =>
                a.time.localeCompare(b.time),
            ),
        });
    }

    return days;
}
