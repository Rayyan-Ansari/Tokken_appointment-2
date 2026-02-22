import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export const PatientRegister: React.FC = () => {
    const navigate = useNavigate();
    const { registerPatient } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phone: '',
        dob: '',
        sex: 'M' as 'M' | 'F' | 'O',
        address: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }
        setIsLoading(true);
        try {
            const { confirmPassword, ...registerData } = formData;
            await registerPatient(registerData);
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const inputCls = `w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm
        focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all`;
    const labelCls = `block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5`;

    return (
        <div className="min-h-screen flex" style={{ background: 'linear-gradient(160deg, #e8f0fe 0%, #dce8ff 50%, #ede7f9 100%)' }}>

            {/* Left decorative panel */}
            <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #1e3a8a 0%, #1d4ed8 55%, #7c3aed 100%)' }}>
                <div className="absolute top-10 left-12 w-20 h-20 rounded-full bg-white/10 animate-float" />
                <div className="absolute bottom-20 right-16 w-16 h-16 rounded-full bg-white/10 animate-float" style={{ animationDelay: '1.5s' }} />
                <div className="absolute top-1/2 left-1/3 w-10 h-10 rounded-full bg-white/10 animate-float" style={{ animationDelay: '3s' }} />

                <div className="relative z-10 flex flex-col justify-center px-12 text-white">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">
                            👤
                        </div>
                        <span className="text-xl font-bold">Patient Portal</span>
                    </div>
                    <h1 className="text-4xl font-extrabold leading-snug mb-3">Create Your<br />Patient Account</h1>
                    <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
                        Register to book appointments, track your token in real time, and manage your health visits.
                    </p>

                    {/* Feature list */}
                    <div className="mt-10 space-y-3">
                        {[
                            { icon: '📅', text: 'Book appointments instantly' },
                            { icon: '🔔', text: 'Real-time token notifications' },
                            { icon: '📋', text: 'View your appointment history' },
                        ].map(f => (
                            <div key={f.text} className="flex items-center gap-3 text-blue-100 text-sm">
                                <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                                    {f.icon}
                                </div>
                                {f.text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="w-full lg:w-7/12 flex items-center justify-center p-6 py-10">
                <div className="w-full max-w-xl">
                    <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-8">

                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3"
                                style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}>
                                <span className="text-xl">👤</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Patient Registration</h2>
                            <p className="text-gray-500 text-sm mt-1">Fill in your details to create an account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Personal info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Full Name</label>
                                    <input type="text" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleChange} required className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Email Address</label>
                                    <input type="email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Phone Number</label>
                                    <input type="tel" name="phone" placeholder="+1234567890" value={formData.phone} onChange={handleChange} required className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Date of Birth</label>
                                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Sex</label>
                                    <select name="sex" value={formData.sex} onChange={handleChange} required className={inputCls}>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                        <option value="O">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>Address (Optional)</label>
                                    <input type="text" name="address" placeholder="123 Main St" value={formData.address} onChange={handleChange} className={inputCls} />
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-3 my-1">
                                <div className="flex-1 h-px bg-gray-100" />
                                <span className="text-xs text-gray-400 font-medium">Security</span>
                                <div className="flex-1 h-px bg-gray-100" />
                            </div>

                            {/* Password */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Password</label>
                                    <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Confirm Password</label>
                                    <input type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required className={inputCls} />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all mt-1
                                    disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
                                style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Creating Account...
                                    </span>
                                ) : 'Create Patient Account'}
                            </button>
                        </form>

                        {/* Footer */}
                        <p className="text-center text-sm text-gray-500 mt-5">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
