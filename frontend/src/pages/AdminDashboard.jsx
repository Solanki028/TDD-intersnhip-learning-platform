import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AdminStats from '../components/admin/AdminStats';
import UserManagement from '../components/admin/UserManagement';
import CourseManagement from '../components/admin/CourseManagement';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([fetchUsers(), fetchAnalytics(), fetchAllCourses()]);
            setLoading(false);
        };
        loadData();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/analytics`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setAnalytics(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAllCourses = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setCourses(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setUsers(data);
        } catch (error) {
            console.error(error);
        }
    };

    const approveMentor = async (id) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${id}/approve-mentor`, {}, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            // Refresh data
            fetchUsers();
            fetchAnalytics();
        } catch (error) {
            console.error(error);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            fetchUsers();
            fetchAnalytics();
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation Bar */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Admin<span className="text-indigo-600">Portal</span></h1>
                    </div>

                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                        {['overview', 'users', 'courses'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 capitalize
                                    ${activeTab === tab
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900'}`
                                }
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="container mx-auto px-6 py-8">

                {/* Always show high-level stats on Overview */}
                {activeTab === 'overview' && (
                    <div className="animate-fade-in-up">
                        <h2 className="text-xl font-semibold mb-6 text-gray-700">Platform Overview</h2>
                        <AdminStats
                            analytics={analytics}
                            pendingMentorsCount={users.filter(u => u.role === 'mentor' && !u.isApproved).length}
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Quick Views */}
                            <div className="opacity-75 pointer-events-none">
                                <UserManagement users={users.slice(0, 5)} approveMentor={approveMentor} deleteUser={deleteUser} />
                            </div>
                            <div className="opacity-75 pointer-events-none">
                                <CourseManagement courses={courses.slice(0, 5)} />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="animate-fade-in">
                        <UserManagement users={users} approveMentor={approveMentor} deleteUser={deleteUser} />
                    </div>
                )}

                {activeTab === 'courses' && (
                    <div className="animate-fade-in">
                        <CourseManagement courses={courses} />
                    </div>
                )}

            </main>
        </div>
    );
};

export default AdminDashboard;
