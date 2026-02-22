import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { Doctor, Session } from '../../types';
import toast from 'react-hot-toast';
import { Sidebar } from '../../components/layout/Sidebar';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Spinner } from '../../components/ui/Spinner';

export const BookAppointment: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [sessions, setSessions] = useState<{ [key: string]: Session }>({});
    const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState<string | null>(null);

    useEffect(() => { loadDoctors(); }, []);

    const loadDoctors = async (showError = true) => {
        try {
            const response = await api.getDoctors();
            if (response.success && response.data?.doctors) {
                const activeDoctors = response.data.doctors.filter((d: Doctor) => d.isActive);
                setDoctors(activeDoctors);
                if (activeDoctors.length > 0) setSelectedDoctorId(activeDoctors[0].id);
                for (const doctor of activeDoctors) {
                    loadDoctorSession(doctor.id);
                }
            }
        } catch (error: any) {
            console.error('Failed to load doctors:', error);
            if (showError && error?.response?.status !== 429) {
                toast.error('Failed to load doctors.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const loadDoctorSession = async (doctorId: string) => {
        try {
            const response = await api.getDoctorSession(doctorId);
            if (response.success && response.data?.session) {
                setSessions(prev => ({ ...prev, [doctorId]: response.data!.session }));
            }
        } catch (error) {
            console.error(`Failed to load session for doctor ${doctorId}:`, error);
        }
    };

    const handleBookToken = async (doctorId: string) => {
        const session = sessions[doctorId];
        if (!session || session.status !== 'ACTIVE') {
            toast.error('Doctor session is not active');
            return;
        }
        setBookingLoading(doctorId);
        try {
            const response = await api.bookToken(doctorId);
            if (response.success) {
                toast.success('Token booked successfully!');
                navigate('/patient');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to book token');
        } finally {
            setBookingLoading(null);
        }
    };

    const getSessionStatus = (doctorId: string) => {
        const session = sessions[doctorId];
        if (!session) return { badge: 'waiting' as const, text: 'No session', canBook: false };
        switch (session.status) {
            case 'ACTIVE': {
                const remaining = session.maxTokenNo - session.currentTokenNo;
                return { badge: 'active' as const, text: `${remaining} slots available`, canBook: remaining > 0 };
            }
            case 'PAUSED': return { badge: 'paused' as const, text: 'Paused', canBook: false };
            case 'ENDED': return { badge: 'ended' as const, text: 'Session ended', canBook: false };
            default: return { badge: 'waiting' as const, text: 'Not started', canBook: false };
        }
    };

    const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);
    const selectedSession = selectedDoctorId ? sessions[selectedDoctorId] : null;
    const selectedStatus = selectedDoctorId ? getSessionStatus(selectedDoctorId) : null;

    return (
        <div className="page-bg">
            <Sidebar userRole="patient" userName={user?.fullName} />

            <div className="main-container">
                {/* Header */}
                <div className="app-header animate-slide-down">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Book Your Appointment</h1>
                        <p className="text-sm text-gray-500">Welcome, {user?.fullName}!</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/patient')} className="btn-ghost text-sm">← Back</button>
                        <button onClick={logout} className="btn-ghost text-sm">Logout</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Left: Select Doctor + Book */}
                    <div className="lg:col-span-2 space-y-4 animate-slide-up">
                        {/* Doctor Selector */}
                        <div className="app-card">
                            <h2 className="text-base font-bold text-gray-700 mb-3">Select Your Doctor</h2>
                            {isLoading ? (
                                <div className="flex justify-center py-8"><Spinner size="lg" /></div>
                            ) : doctors.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-5xl mb-3">👨‍⚕️</div>
                                    <p className="text-gray-500">No doctors available</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {doctors.map((doctor) => {
                                        const status = getSessionStatus(doctor.id);
                                        const isSelected = selectedDoctorId === doctor.id;
                                        return (
                                            <div
                                                key={doctor.id}
                                                onClick={() => setSelectedDoctorId(doctor.id)}
                                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border-2 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:bg-gray-50'}`}
                                            >
                                                <Avatar name={doctor.fullName} size="md" status={sessions[doctor.id]?.status === 'ACTIVE' ? 'online' : 'offline'} />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold text-gray-800 text-sm">{doctor.fullName}</div>
                                                    <div className="text-gray-500 text-xs">{doctor.specialization} | {doctor.yearsExperience}+ Years Experience</div>
                                                </div>
                                                <Badge variant={status.badge}>{status.text}</Badge>
                                                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Book Button */}
                        {selectedDoctor && selectedStatus && (
                            <button
                                onClick={() => handleBookToken(selectedDoctorId!)}
                                disabled={!selectedStatus.canBook || bookingLoading === selectedDoctorId}
                                className={`w-full py-3 rounded-xl font-bold text-base transition-all ${selectedStatus.canBook ? 'btn-primary' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                            >
                                {bookingLoading === selectedDoctorId ? (
                                    <span className="flex items-center justify-center gap-2"><Spinner size="sm" /> Booking...</span>
                                ) : 'Get Your Token'}
                            </button>
                        )}

                        {/* Token Info Card */}
                        {selectedDoctor && selectedSession && (
                            <div className="app-card">
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                                        <div className="text-gray-500 text-xs mb-1">Current Token Running</div>
                                        <div className="text-4xl font-bold text-blue-600">{selectedSession.currentTokenNo || '--'}</div>
                                    </div>
                                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                                        <div className="text-gray-500 text-xs mb-1">Max Token</div>
                                        <div className="text-4xl font-bold text-purple-600">{selectedSession.maxTokenNo || '--'}</div>
                                    </div>
                                </div>
                                {selectedSession.status === 'ACTIVE' && (
                                    <div className="text-center text-sm text-gray-500">
                                        Tokens Ahead: <span className="font-bold text-gray-700">
                                            {Math.max(0, selectedSession.maxTokenNo - selectedSession.currentTokenNo)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Live Queue */}
                        {selectedDoctor && (
                            <div className="app-card">
                                <h3 className="font-bold text-gray-700 mb-3">Live Queue Status</h3>
                                {selectedSession?.status === 'ACTIVE' ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-3 rounded-xl">
                                            <span className="font-semibold">Now Serving</span>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                                <span className="font-bold">Token {selectedSession.currentTokenNo}</span>
                                            </div>
                                        </div>
                                        {Array.from({ length: Math.min(3, Math.max(0, selectedSession.maxTokenNo - selectedSession.currentTokenNo)) }, (_, i) => (
                                            <div key={i} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl text-gray-700 font-medium text-sm">
                                                Token {selectedSession.currentTokenNo + i + 1}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-gray-500 text-sm">
                                        Session not active
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Profile */}
                    <div className="space-y-4 animate-slide-up">
                        <div className="app-card">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-gray-700">Profile</h3>
                                <button className="text-blue-600 text-xs font-medium border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                                    Edit Profile
                                </button>
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <Avatar name={user?.fullName} size="lg" />
                                <div>
                                    <div className="font-bold text-gray-800">{user?.fullName}</div>
                                    <div className="text-gray-500 text-xs">{(user as any)?.phone || '(--) --- ----'}</div>
                                </div>
                            </div>
                            <div className="space-y-2 border-t border-gray-100 pt-3">
                                {[
                                    { icon: '📍', label: 'Phone:', value: (user as any)?.phone || '-' },
                                    { icon: '✉️', label: 'Email:', value: user?.email || '-' },
                                    { icon: '🎂', label: 'Date of Birth:', value: (user as any)?.dob ? new Date((user as any).dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '-' },
                                    { icon: '👤', label: 'Sex:', value: (user as any)?.sex || '-' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-sm">
                                        <span>{item.icon}</span>
                                        <div>
                                            <div className="text-gray-400 text-xs">{item.label}</div>
                                            <div className="text-gray-700 font-medium">{item.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
