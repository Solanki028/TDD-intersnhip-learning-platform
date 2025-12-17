import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const [error, setError] = useState('');
    const { register, user } = useAuth();
    const navigate = useNavigate();

    if (user) {
        if (user.role === 'admin') return <Navigate to="/admin" />;
        if (user.role === 'mentor') return <Navigate to="/mentor" />;
        if (user.role === 'student') return <Navigate to="/student" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await register(formData.name, formData.email, formData.password, formData.role);
            if (formData.role === 'mentor') {
                alert('Registration successful. Please wait for admin approval before logging in.');
                navigate('/login');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left Side - Image/Inspiration */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900">
                <img
                    src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=1974&auto=format&fit=crop"
                    alt="Creative teamwork"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/80 to-transparent"></div>
                <div className="relative z-10 p-16 flex flex-col justify-center h-full text-white">
                    <h2 className="text-4xl font-bold mb-6 leading-tight">Start Teaching or Learning Today</h2>
                    <p className="text-lg text-gray-200 mb-8 max-w-lg">Whether you want to share your knowledge as a Mentor or expand your skills as a Student, we have the perfect tools for you.</p>
                    <div className="flex gap-4">
                        <div className="flex -space-x-4">
                            <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=1" alt="" />
                            <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=2" alt="" />
                            <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=3" alt="" />
                            <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-500 flex items-center justify-center text-xs font-bold">+2k</div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-sm font-bold">Join our community</span>
                            <span className="text-xs text-indigo-200">World class mentors & students</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                        <p className="text-gray-500 mt-2">Get started with your free account</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none"
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">I want to join as a</label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`
                                    relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200
                                    ${formData.role === 'student' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}
                                `}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={formData.role === 'student'}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="sr-only"
                                    />
                                    <span className="text-2xl mb-1">👨‍🎓</span>
                                    <span className={`text-sm font-bold ${formData.role === 'student' ? 'text-indigo-700' : 'text-gray-600'}`}>Student</span>
                                </label>

                                <label className={`
                                    relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200
                                    ${formData.role === 'mentor' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}
                                `}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="mentor"
                                        checked={formData.role === 'mentor'}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="sr-only"
                                    />
                                    <span className="text-2xl mb-1">👩‍🏫</span>
                                    <span className={`text-sm font-bold ${formData.role === 'mentor' ? 'text-purple-700' : 'text-gray-600'}`}>Mentor</span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-lg shadow-lg transform transition-all duration-200 hover:-translate-y-0.5 mt-2"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                            Sign in here
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
