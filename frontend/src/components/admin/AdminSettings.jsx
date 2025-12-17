import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AdminSettings = () => {
    const { user } = useAuth();
    const [passwordData, setPasswordData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (passwordData.password !== passwordData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/users/profile/password`,
                { password: passwordData.password },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setMessage('Password updated successfully');
            setPasswordData({ password: '', confirmPassword: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 max-w-lg mx-auto mt-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Security Settings</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                        type="password"
                        name="password"
                        value={passwordData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="Enter new password"
                        required
                        minLength="6"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="Confirm new password"
                        required
                        minLength="6"
                    />
                </div>

                {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
                {message && <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm">{message}</div>}

                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    Update Password
                </button>
            </form>
        </div>
    );
};

export default AdminSettings;
