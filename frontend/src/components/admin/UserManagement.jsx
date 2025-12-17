import { useState } from 'react';

// ... (imports)
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const UserManagement = ({ users, approveMentor, deleteUser }) => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'mentor', isApproved: true });

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            alert('User created successfully');
            setIsModalOpen(false);
            setFormData({ name: '', email: '', password: '', role: 'mentor', isApproved: true });
            window.location.reload(); // Simple reload to refresh list
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create user');
        }
    };

    const handleToggleStatus = async (userId) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${userId}/toggle-status`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            window.location.reload();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update user status');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-fade-in">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-bold text-gray-800">User Management</h2>
                <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="px-4 py-2 border rounded-lg text-sm w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="student">Student</option>
                        <option value="mentor">Mentor</option>

                    </select>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add User
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((u) => (
                                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                                    <td className={`py-4 px-6 whitespace-nowrap ${u.isActive === false ? 'opacity-50' : ''}`}>
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{u.name}</div>
                                                <div className="text-sm text-gray-500">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                u.role === 'mentor' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'}`}>
                                            {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        {u.isActive === false ? (
                                            <span className="text-red-500 flex items-center gap-1 font-medium"><span className="w-2 h-2 rounded-full bg-red-500"></span> Deactivated</span>
                                        ) : u.role === 'mentor' && !u.isApproved ? (
                                            <span className="text-yellow-600 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-600"></span> Pending</span>
                                        ) : (
                                            <span className="text-green-600 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-600"></span> Active</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            {u.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleToggleStatus(u._id)}
                                                    className={`px-3 py-1 rounded transition ${u.isActive === false
                                                        ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                                        : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}
                                                >
                                                    {u.isActive === false ? 'Activate' : 'Deactivate'}
                                                </button>
                                            )}
                                            {u.role === 'mentor' && !u.isApproved && u.isActive !== false && (
                                                <button
                                                    onClick={() => approveMentor(u._id)}
                                                    className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
                                                >
                                                    Approve
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteUser(u._id)}
                                                className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-8 text-center text-gray-500">
                                    No users found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-slide-up">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Add New User</h3>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="student">Student</option>
                                    <option value="mentor">Mentor</option>
                                </select>
                            </div>

                            {formData.role === 'mentor' && (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isApproved"
                                        checked={formData.isApproved}
                                        onChange={e => setFormData({ ...formData, isApproved: e.target.checked })}
                                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label htmlFor="isApproved" className="text-sm text-gray-700">Auto-approve Mentor?</label>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
