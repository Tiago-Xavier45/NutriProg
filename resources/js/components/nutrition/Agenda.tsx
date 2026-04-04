import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, Plus, X, Check, AlertCircle, Trash2, Edit2 } from 'lucide-react';

interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    phone: string;
    time: string;
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

const STORAGE_KEY = 'nutripro_appointments';
const DEFAULT_SLOTS = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
const generateId = () => Math.random().toString(36).substring(2, 15);

const mockInitialAppointments: Appointment[] = [
    { id: generateId(), patientId: '1', patientName: 'Maria Silva', phone: '(11) 99999-1111', time: '08:00', duration: 60, type: 'consulta', status: 'confirmado', notes: '' },
    { id: generateId(), patientId: '2', patientName: 'João Santos', phone: '(11) 99999-2222', time: '09:00', duration: 60, type: 'retorno', status: 'confirmado', notes: '' },
];

const loadAppointments = (): Appointment[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return mockInitialAppointments;
        }
    }
    return mockInitialAppointments;
};

const saveAppointments = (appointments: Appointment[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
};

const getMonthData = (year: number, month: number, appointments: Appointment[]): DayData[] => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dayDataMap = new Map<string, Appointment[]>();
    
    appointments.forEach(apt => {
        const dayMatch = apt.id.match(/^(\d{2})/);
        const day = dayMatch ? parseInt(dayMatch[1]) : new Date().getDate();
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (!dayDataMap.has(dateStr)) {
            dayDataMap.set(dateStr, []);
        }
        dayDataMap.get(dateStr)!.push(apt);
    });

    const days: DayData[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayOfWeek = new Date(year, month, day).getDay();
        
        if (dayOfWeek === 0) {
            days.push({ date: dateStr, slots: [], appointments: [] });
            continue;
        }

        const dayAppointments = dayDataMap.get(dateStr) || [];
        const usedSlots = dayAppointments.filter(a => a.status !== 'cancelado').map(a => a.time);
        const availableSlots = DEFAULT_SLOTS.filter(s => !usedSlots.includes(s));

        days.push({ 
            date: dateStr, 
            slots: availableSlots, 
            appointments: dayAppointments.sort((a, b) => a.time.localeCompare(b.time))
        });
    }

    return days;
};

const typeColors = {
    consulta: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-200' },
    retorno: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-200' },
    avaliacao: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-200' },
};

export function Agenda() {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);
    const [allAppointments, setAllAppointments] = useState<Appointment[]>(() => loadAppointments());
    const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showNewAppointment, setShowNewAppointment] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
    const [newAppointment, setNewAppointment] = useState({
        patientName: '',
        phone: '',
        time: '',
        duration: 60,
        type: 'consulta' as Appointment['type'],
        notes: '',
    });

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long' });
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const monthData = getMonthData(year, month, allAppointments);

    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    useEffect(() => {
        saveAppointments(allAppointments);
    }, [allAppointments]);

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
        if (!selectedDay || !newAppointment.patientName || !newAppointment.time) return;

        const appointment: Appointment = {
            id: `${String(new Date().getDate()).padStart(2, '0')}${generateId()}`,
            patientId: generateId(),
            patientName: newAppointment.patientName,
            phone: newAppointment.phone,
            time: newAppointment.time,
            duration: newAppointment.duration,
            type: newAppointment.type,
            status: 'pendente',
            notes: newAppointment.notes,
        };

        setAllAppointments([...allAppointments, appointment]);
        setNewAppointment({ patientName: '', phone: '', time: '', duration: 60, type: 'consulta', notes: '' });
        setShowNewAppointment(false);
    };

    const handleSaveEdit = () => {
        if (!editingAppointment || !newAppointment.patientName || !newAppointment.time) return;

        const updated = allAppointments.map(apt =>
            apt.id === editingAppointment.id
                ? { ...apt, ...newAppointment }
                : apt
        );

        setAllAppointments(updated);
        setEditingAppointment(null);
        setShowNewAppointment(false);
        setNewAppointment({ patientName: '', phone: '', time: '', duration: 60, type: 'consulta', notes: '' });
    };

    const handleDeleteAppointment = (aptId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Excluir esta consulta?')) {
            setAllAppointments(allAppointments.filter(apt => apt.id !== aptId));
        }
    };

    const handleCancelAppointment = (aptId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = allAppointments.map(apt =>
            apt.id === aptId ? { ...apt, status: 'cancelado' as const } : apt
        );
        setAllAppointments(updated);
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
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

            let bgClass = 'bg-white hover:bg-gray-50';
            let dotColor = '';

            if (isSunday) {
                bgClass = 'bg-gray-100';
            } else if (dayData) {
                const activeAppointments = dayData.appointments.filter(a => a.status !== 'cancelado');
                if (activeAppointments.length > 0 && dayData.slots.length === 0) {
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
                    className={`h-20 md:h-24 border border-gray-100 rounded-lg p-2 cursor-pointer transition-all ${bgClass} ${
                        isSunday ? 'cursor-not-allowed opacity-60' : 'hover:shadow-md'
                    } ${isToday ? 'ring-2 ring-emerald-500' : ''}`}
                >
                    <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${isToday ? 'text-emerald-600' : 'text-gray-700'}`}>
                            {day}
                        </span>
                        {dotColor && <div className={`w-2 h-2 rounded-full ${dotColor}`} />}
                    </div>
                    {dayData && !isSunday && (
                        <div className="mt-1 text-xs text-gray-500">
                            {dayData.appointments.filter(a => a.status !== 'cancelado').length > 0 && (
                                <span className="text-blue-600">
                                    {dayData.appointments.filter(a => a.status !== 'cancelado').length} consul.
                                </span>
                            )}
                            {dayData.slots.length > 0 && (
                                <span className={dayData.appointments.filter(a => a.status !== 'cancelado').length > 0 ? 'text-gray-400' : 'text-emerald-600'}>
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
                    <p className="text-gray-500">Gerencie suas consultas e disponibilidade</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <button onClick={goToPrevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h2 className="text-lg font-semibold text-gray-900 capitalize">
                        {monthName} {year}
                    </h2>
                    <button onClick={goToNextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
                    {weekdays.map((day) => (
                        <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1 p-4">
                    {renderCalendarDays()}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 bg-white p-4 rounded-lg border border-gray-100">
                    <div className="w-4 h-4 rounded bg-emerald-50 border border-gray-200" />
                    <span className="text-sm text-gray-600">Dia com vagas disponíveis</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-4 rounded-lg border border-gray-100">
                    <div className="w-4 h-4 rounded bg-blue-50 border border-gray-200" />
                    <span className="text-sm text-gray-600">Dia lotado (sem vagas)</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-4 rounded-lg border border-gray-100">
                    <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200" />
                    <span className="text-sm text-gray-600">Domingo (fechado)</span>
                </div>
            </div>

            {showModal && selectedDay && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
                            <div>
                                <h2 className="text-xl font-semibold capitalize">
                                    {new Date(selectedDay.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    {selectedDay.appointments.filter(a => a.status !== 'cancelado').length} consultas • {selectedDay.slots.length} vagas
                                </p>
                            </div>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {showNewAppointment ? (
                                <div className="space-y-4">
                                    <h3 className="font-medium text-gray-900">
                                        {editingAppointment ? 'Editar Consulta' : 'Nova Consulta'}
                                    </h3>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Paciente *</label>
                                        <input
                                            type="text"
                                            value={newAppointment.patientName}
                                            onChange={(e) => setNewAppointment({...newAppointment, patientName: e.target.value})}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                            placeholder="Nome do paciente"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                                        <input
                                            type="tel"
                                            value={newAppointment.phone}
                                            onChange={(e) => setNewAppointment({...newAppointment, phone: e.target.value})}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Horário *</label>
                                            <select
                                                value={newAppointment.time}
                                                onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                                                className="w-full px-4 py-2 border rounded-lg"
                                            >
                                                <option value="">Selecione</option>
                                                {DEFAULT_SLOTS.map(slot => (
                                                    <option key={slot} value={slot}>{slot}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Duração</label>
                                            <select
                                                value={newAppointment.duration}
                                                onChange={(e) => setNewAppointment({...newAppointment, duration: Number(e.target.value)})}
                                                className="w-full px-4 py-2 border rounded-lg"
                                            >
                                                <option value={30}>30 min</option>
                                                <option value={60}>60 min</option>
                                                <option value={90}>90 min</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                        <select
                                            value={newAppointment.type}
                                            onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value as Appointment['type']})}
                                            className="w-full px-4 py-2 border rounded-lg"
                                        >
                                            <option value="consulta">Consulta</option>
                                            <option value="retorno">Retorno</option>
                                            <option value="avaliacao">Avaliação</option>
                                        </select>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => { setShowNewAppointment(false); setEditingAppointment(null); setNewAppointment({ patientName: '', phone: '', time: '', duration: 60, type: 'consulta', notes: '' }); }}
                                            className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={editingAppointment ? handleSaveEdit : handleAddAppointment}
                                            disabled={!newAppointment.patientName || !newAppointment.time}
                                            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                                        >
                                            {editingAppointment ? 'Salvar' : 'Agendar'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> Horários Disponíveis
                                        </h3>
                                        {selectedDay.slots.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {selectedDay.slots.map(slot => (
                                                    <span key={slot} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                                                        {slot}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm">Sem horários disponíveis</p>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                            <User className="w-4 h-4" /> Consultas Marcadas
                                        </h3>
                                        {selectedDay.appointments.length > 0 ? (
                                            <div className="space-y-3">
                                                {selectedDay.appointments.map(apt => {
                                                    const colors = typeColors[apt.type];
                                                    return (
                                                        <div key={apt.id} className={`p-4 rounded-lg border ${colors.bg} ${colors.border} ${apt.status === 'cancelado' ? 'opacity-50' : ''}`}>
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <p className="font-medium text-gray-900">{apt.patientName}</p>
                                                                    <p className="text-sm text-gray-600">{apt.time} • {apt.duration}min</p>
                                                                    {apt.phone && <p className="text-sm text-gray-500">{apt.phone}</p>}
                                                                </div>
                                                                <div className="text-right flex flex-col items-end gap-2">
                                                                    <span className={`text-xs font-medium px-2 py-1 rounded ${colors.badge}`}>{apt.type}</span>
                                                                    <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                                                                        apt.status === 'confirmado' ? 'bg-emerald-200 text-emerald-700' :
                                                                        apt.status === 'pendente' ? 'bg-yellow-200 text-yellow-700' :
                                                                        'bg-red-200 text-red-600'
                                                                    }`}>
                                                                        {apt.status === 'confirmado' && <Check className="w-3 h-3" />}
                                                                        {apt.status === 'pendente' && <AlertCircle className="w-3 h-3" />}
                                                                        {apt.status}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {apt.status !== 'cancelado' && (
                                                                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                                                                    <button onClick={(e) => { setEditingAppointment(apt); setNewAppointment({ patientName: apt.patientName, phone: apt.phone, time: apt.time, duration: apt.duration, type: apt.type, notes: apt.notes }); setShowNewAppointment(true); }} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50">
                                                                        <Edit2 className="w-3 h-3" /> Editar
                                                                    </button>
                                                                    <button onClick={(e) => handleCancelAppointment(apt.id, e)} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-yellow-100 text-yellow-700 border border-yellow-200 rounded hover:bg-yellow-200">
                                                                        <X className="w-3 h-3" /> Cancelar
                                                                    </button>
                                                                    <button onClick={(e) => handleDeleteAppointment(apt.id, e)} className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-red-100 text-red-600 border border-red-200 rounded hover:bg-red-200">
                                                                        <Trash2 className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm">Nenhuma consulta marcada</p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {!showNewAppointment && (
                            <div className="flex gap-3 p-6 border-t sticky bottom-0 bg-white">
                                <button onClick={handleCloseModal} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Fechar</button>
                                <button
                                    onClick={() => setShowNewAppointment(true)}
                                    disabled={selectedDay.slots.length === 0}
                                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Nova Consulta
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
