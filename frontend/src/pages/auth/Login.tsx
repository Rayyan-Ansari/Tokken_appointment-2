import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [role, setRole] = useState<UserRole>('patient');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login({ email, password }, role);
            const redirectMap: Record<UserRole, string> = {
                patient: '/patient',
                doctor: '/doctor',
                admin: '/admin',
            };
            navigate(redirectMap[role]);
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const roles: { key: UserRole; label: string; icon: string; color: string; activeGrad: string }[] = [
        { key: 'patient', label: 'Patient', icon: '👤', color: 'blue', activeGrad: 'from-blue-500 to-blue-600' },
        { key: 'doctor', label: 'Doctor', icon: '👨‍⚕️', color: 'indigo', activeGrad: 'from-indigo-500 to-indigo-600' },
        { key: 'admin', label: 'Admin', icon: '🛡️', color: 'violet', activeGrad: 'from-violet-500 to-violet-600' },
    ];

    return (
        <div className="min-h-screen flex" style={{ background: 'linear-gradient(160deg, #e8f0fe 0%, #dce8ff 50%, #ede7f9 100%)' }}>

            {/* ── Left Panel ─────────────────────────────────── */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #1e3a8a 0%, #1d4ed8 55%, #7c3aed 100%)' }}>

                {/* Floating blobs */}
                <div className="absolute top-10 left-16 w-20 h-20 rounded-full bg-white/10 animate-float" />
                <div className="absolute top-1/3 right-12 w-14 h-14 rounded-full bg-white/10 animate-float" style={{ animationDelay: '1.2s' }} />
                <div className="absolute bottom-24 left-28 w-16 h-16 rounded-full bg-white/10 animate-float" style={{ animationDelay: '2.4s' }} />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-14 text-white">
                    {/* Brand */}
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">
                            📅
                        </div>
                        <span className="text-xl font-bold tracking-tight">Token Appointment</span>
                    </div>

                    <h1 className="text-4xl font-extrabold leading-snug mb-3">
                        Real-Time Token<br />Appointment System
                    </h1>
                    <p className="text-blue-200 text-lg mb-2">Book Smart. Wait Less.</p>
                    <p className="text-blue-300/80 text-sm max-w-xs leading-relaxed">
                        Track live token updates, book instantly,<br />and manage queues efficiently.
                    </p>

                    {/* Live token card */}
                    <div className="mt-12 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 max-w-xs">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="text-4xl">👩‍⚕️</div>
                            <div>
                                <div className="font-semibold text-sm">Dr. Sarah Johnson</div>
                                <div className="text-blue-300 text-xs">Cardiology</div>
                            </div>
                            <div className="ml-auto flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-green-300 text-xs font-medium">Live</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/10 rounded-2xl p-4 text-center">
                                <div className="text-xs text-blue-200 mb-1">Now Serving</div>
                                <div className="text-4xl font-bold">25</div>
                            </div>
                            <div className="bg-white/10 rounded-2xl p-4 text-center">
                                <div className="text-xs text-blue-200 mb-1">Waiting</div>
                                <div className="text-4xl font-bold">18</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Right Panel ────────────────────────────────── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
                <div className="w-full max-w-md">

                    {/* Card */}
                    <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-8">

                        {/* Logo */}
                        <div className="text-center mb-7">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
                                style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)' }}>
                                <span className="text-2xl">📅</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
                            <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
                        </div>

                        {/* Role tabs */}
                        <div className="flex gap-1.5 mb-6 bg-gray-100 p-1 rounded-2xl">
                            {roles.map(r => (
                                <button
                                    key={r.key}
                                    type="button"
                                    onClick={() => setRole(r.key)}
                                    className={`flex-1 py-2 px-2 rounded-xl text-sm font-semibold transition-all duration-200
                                        ${role === r.key
                                            ? `bg-gradient-to-r ${r.activeGrad} text-white shadow-md`
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <span className="mr-1">{r.icon}</span>
                                    {r.label}
                                </button>
                            ))}
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl
                                            text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300
                                            focus:border-blue-400 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-11 py-2.5 bg-gray-50 border border-gray-200 rounded-xl
                                            text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300
                                            focus:border-blue-400 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-200
                                    disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 hover:shadow-lg
                                    active:scale-[0.98] mt-1"
                                style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : `Sign In as ${roles.find(r => r.key === role)?.label}`}
                            </button>
                        </form>

                        {/* Footer links */}
                        <div className="mt-5 flex items-center justify-center gap-4 text-sm">
                            <button className="text-gray-400 hover:text-blue-600 transition-colors text-xs">
                                Forgot password?
                            </button>
                            {role !== 'admin' && (
                                <>
                                    <span className="text-gray-200">|</span>
                                    <Link
                                        to={role === 'patient' ? '/register/patient' : '/register/doctor'}
                                        className="text-blue-600 hover:text-blue-700 font-medium text-xs transition-colors"
                                    >
                                        Create {role === 'patient' ? 'Patient' : 'Doctor'} Account
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile tagline */}
                    <p className="lg:hidden text-center text-xs text-gray-500 mt-5">
                        Real-Time Token Appointment System
                    </p>
                </div>
            </div>
        </div>
    );
};
