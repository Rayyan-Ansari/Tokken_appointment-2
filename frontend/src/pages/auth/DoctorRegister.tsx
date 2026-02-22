import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export const DoctorRegister: React.FC = () => {
    const navigate = useNavigate();
    const { registerDoctor } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phone: '',
        dob: '',
        sex: 'M' as 'M' | 'F' | 'O',
        qualification: '',
        specialization: '',
        yearsExperience: 0,
        licenseNumber: '',
    });
    const [licenseDocument, setLicenseDocument] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLicenseDocument(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }
        if (!licenseDocument) {
            toast.error('Please upload your license document');
            return;
        }
        setIsLoading(true);
        try {
            const { confirmPassword, ...registerData } = formData;
            await registerDoctor({ ...registerData, licenseDocument });
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const inputCls = `w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm
        focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all`;
    const labelCls = `block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5`;

    return (
        <div className="min-h-screen flex" style={{ background: 'linear-gradient(160deg, #e8f0fe 0%, #dce8ff 50%, #ede7f9 100%)' }}>

            {/* Left decorative panel */}
            <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #1e3a8a 0%, #3730a3 55%, #7c3aed 100%)' }}>
                <div className="absolute top-10 left-12 w-20 h-20 rounded-full bg-white/10 animate-float" />
                <div className="absolute bottom-20 right-16 w-16 h-16 rounded-full bg-white/10 animate-float" style={{ animationDelay: '1.5s' }} />
                <div className="absolute top-1/2 left-1/3 w-10 h-10 rounded-full bg-white/10 animate-float" style={{ animationDelay: '3s' }} />

                <div className="relative z-10 flex flex-col justify-center px-12 text-white">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">
                            👨‍⚕️
                        </div>
                        <span className="text-xl font-bold">Doctor Portal</span>
                    </div>
                    <h1 className="text-4xl font-extrabold leading-snug mb-3">Join As a<br />Medical Professional</h1>
                    <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
                        Register your practice, manage patient queues, and run efficient sessions with real-time token management.
                    </p>

                    {/* Feature list */}
                    <div className="mt-10 space-y-3">
                        {[
                            { icon: '📋', text: 'Manage your token queue' },
                            { icon: '⚡', text: 'Start & control sessions live' },
                            { icon: '📊', text: 'Track daily patient stats' },
                        ].map(f => (
                            <div key={f.text} className="flex items-center gap-3 text-blue-100 text-sm">
                                <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                                    {f.icon}
                                </div>
                                {f.text}
                            </div>
                        ))}
                    </div>

                    {/* Note */}
                    <div className="mt-10 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                        <div className="flex items-start gap-2">
                            <span className="text-yellow-300 mt-0.5">⚠️</span>
                            <p className="text-blue-100 text-xs leading-relaxed">
                                Your account requires <strong className="text-white">admin approval</strong> before you can start accepting patients.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="w-full lg:w-7/12 flex items-center justify-center p-6 py-10">
                <div className="w-full max-w-xl">
                    <div className="bg-white rounded-3xl shadow-xl border border-indigo-100 p-8">

                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3"
                                style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}>
                                <span className="text-xl">👨‍⚕️</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Doctor Registration</h2>
                            <p className="text-gray-500 text-sm mt-1">Create your professional account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Personal Info */}
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Personal Info</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Full Name</label>
                                    <input type="text" name="fullName" placeholder="Dr. Jane Smith" value={formData.fullName} onChange={handleChange} required className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Email Address</label>
                                    <input type="email" name="email" placeholder="doctor@example.com" value={formData.email} onChange={handleChange} required className={inputCls} />
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
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-3 pt-1">
                                <div className="flex-1 h-px bg-gray-100" />
                                <span className="text-xs text-gray-400 font-medium">Professional Details</span>
                                <div className="flex-1 h-px bg-gray-100" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Qualification</label>
                                    <input type="text" name="qualification" placeholder="MBBS, MD" value={formData.qualification} onChange={handleChange} required className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Specialization</label>
                                    <input type="text" name="specialization" placeholder="Cardiology" value={formData.specialization} onChange={handleChange} required className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Years of Experience</label>
                                    <input type="number" name="yearsExperience" placeholder="5" value={formData.yearsExperience} onChange={handleChange} required min="0" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>License Number</label>
                                    <input type="text" name="licenseNumber" placeholder="MED123456" value={formData.licenseNumber} onChange={handleChange} required className={inputCls} />
                                </div>

                                {/* File upload */}
                                <div className="col-span-2">
                                    <label className={labelCls}>License Document (PDF / JPG / PNG)</label>
                                    <div className={`relative ${licenseDocument ? 'border-indigo-400 bg-indigo-50' : 'border-dashed border-gray-300 bg-gray-50'} border-2 rounded-xl p-4 text-center cursor-pointer transition-all hover:border-indigo-400 hover:bg-indigo-50`}>
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                            required
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        {licenseDocument ? (
                                            <div className="flex items-center justify-center gap-2 text-indigo-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm font-medium truncate max-w-xs">{licenseDocument.name}</span>
                                            </div>
                                        ) : (
                                            <div className="text-gray-400 text-sm">
                                                <svg className="w-6 h-6 mx-auto mb-1 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                Click to upload or drag & drop
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-3 pt-1">
                                <div className="flex-1 h-px bg-gray-100" />
                                <span className="text-xs text-gray-400 font-medium">Security</span>
                                <div className="flex-1 h-px bg-gray-100" />
                            </div>

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

                            {/* Mobile warning note */}
                            <div className="lg:hidden bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                                <span className="text-amber-500 mt-0.5">⚠️</span>
                                <p className="text-amber-700 text-xs">Your account needs admin approval before you can start accepting patients.</p>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all mt-1
                                    disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
                                style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Creating Account...
                                    </span>
                                ) : 'Create Doctor Account'}
                            </button>
                        </form>

                        {/* Footer */}
                        <p className="text-center text-sm text-gray-500 mt-5">
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
