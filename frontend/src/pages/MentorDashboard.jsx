import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CreateCourseModal from '../components/mentor/CreateCourseModal';
import { MentorStats, CourseGrid } from '../components/mentor/MentorDashboardComponents';

const MentorDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses/my`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setCourses(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCourse = async (courseData) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/courses`, courseData, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            fetchCourses();
        } catch (error) {
            console.error(error);
            alert('Failed to create course');
        }
    };

    const deleteCourse = async (id) => {
        if (!window.confirm('Delete this course and all its chapters? This action cannot be undone.')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/courses/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            fetchCourses();
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Bar */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Mentor<span className="text-indigo-600">Studio</span></h1>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-6 py-8">
                {/* Stats & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Welcome back, Mentor {user?.name ? user.name.split(' ')[0] : ''}!</h2>
                        <p className="text-gray-500 mt-1">Here's what's happening with your courses.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Create New Course
                    </button>
                </div>

                <MentorStats courses={courses} />

                <div className="mb-6 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">Your Course Library</h3>
                </div>

                <CourseGrid courses={courses} deleteCourse={deleteCourse} />
            </main>

            <CreateCourseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateCourse}
            />
        </div>
    );
};

export default MentorDashboard;
