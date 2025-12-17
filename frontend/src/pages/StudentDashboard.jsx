import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    const [courses, setCourses] = useState([]);
    const { user } = useAuth();
    const [progressData, setProgressData] = useState({});

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses/student`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setCourses(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 mb-8">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <span className="text-2xl">🎓</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">My<span className="text-indigo-600">Learning</span></h1>
                    </div>
                    <div className="text-gray-600 font-medium">
                        Welcome, Student {user?.name ? user.name.split(' ')[0] : ''}
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-6 pb-12">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">My Courses</h2>
                    <p className="text-gray-500 mt-1">Pick up where you left off</p>
                </div>

                {courses.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <span className="text-6xl mb-4 block">📚</span>
                        <h3 className="text-xl font-semibold text-gray-800">No courses assigned yet.</h3>
                        <p className="text-gray-500 mt-2">Check back later or contact your mentor.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map(course => {
                            const isCompleted = course.progress === 100;
                            return (
                                <div key={course._id} className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group border ${isCompleted ? 'border-2 border-yellow-400 ring-4 ring-yellow-400/20' : 'border-gray-100'} transform hover:-translate-y-1`}>
                                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                                        {course.image ? (
                                            <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
                                                <span className="text-5xl text-white opacity-40">📖</span>
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm">
                                            {course.completedChapters} / {course.totalChapters} Chapters
                                        </div>
                                        {isCompleted && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                                                <div className="bg-yellow-400 text-yellow-900 px-6 py-2 rounded-full font-bold shadow-lg transform -rotate-12 border-2 border-yellow-200 flex items-center gap-2">
                                                    <span>🏆</span> Completed
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 flex-grow flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-gray-900 line-clamp-1" title={course.title}>{course.title}</h3>
                                        </div>

                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                {course.mentor?.name?.charAt(0) || 'M'}
                                            </div>
                                            <span className="text-sm text-gray-500 font-medium">{course.mentor?.name || 'Unknown Mentor'}</span>
                                        </div>

                                        <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-grow">{course.description}</p>

                                        <div className="mt-auto">
                                            <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2">
                                                <span>Progress</span>
                                                <span>{course.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2 mb-6 overflow-hidden">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-1000 ease-out ${isCompleted ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-indigo-600'}`}
                                                    style={{ width: `${course.progress}%` }}
                                                ></div>
                                            </div>

                                            <Link
                                                to={`/student/course/${course._id}`}
                                                className={`block w-full text-center font-semibold py-3 rounded-xl transition duration-300 shadow-md group-hover:shadow-lg flex items-center justify-center gap-2 ${isCompleted ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                                            >
                                                {isCompleted ? 'View Certificate' : 'Continue Learning'}
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentDashboard;
