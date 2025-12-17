import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CourseManager = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    // State
    const [course, setCourse] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('chapters'); // 'chapters', 'students', 'settings'

    // Form States
    const [newChapter, setNewChapter] = useState({ title: '', description: '', videoUrl: '', sequenceOrder: 0 });
    const [editingChapterId, setEditingChapterId] = useState(null);
    const [studentEmailToAssign, setStudentEmailToAssign] = useState('');
    const [isChapterFormOpen, setIsChapterFormOpen] = useState(false);

    useEffect(() => {
        fetchCourseData();
    }, [id]);

    const fetchCourseData = async () => {
        try {
            const [courseRes, chaptersRes, studentsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/api/courses/my`, { headers: { Authorization: `Bearer ${user.token}` } }),
                axios.get(`${import.meta.env.VITE_API_URL}/api/courses/${id}/chapters`, { headers: { Authorization: `Bearer ${user.token}` } }),
                axios.get(`${import.meta.env.VITE_API_URL}/api/courses/${id}/students`, { headers: { Authorization: `Bearer ${user.token}` } })
            ]);

            const foundCourse = courseRes.data.find(c => c._id === id);
            if (!foundCourse) {
                // handle not found
                return;
            }
            setCourse(foundCourse);
            setChapters(chaptersRes.data);
            setEnrolledStudents(studentsRes.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const saveChapter = async (e) => {
        e.preventDefault();
        try {
            if (editingChapterId) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/courses/${id}/chapters/${editingChapterId}`, newChapter, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/courses/${id}/chapters`, newChapter, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
            }
            // Reset and refresh
            setNewChapter({ title: '', description: '', videoUrl: '', sequenceOrder: chapters.length + 1 });
            setEditingChapterId(null);
            setIsChapterFormOpen(false);

            // Refresh chapters only
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses/${id}/chapters`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setChapters(res.data);
        } catch (error) {
            console.error(error);
            alert('Error saving chapter');
        }
    };

    const deleteChapter = async (chapterId) => {
        if (!window.confirm('Delete this chapter?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/courses/${id}/chapters/${chapterId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses/${id}/chapters`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setChapters(res.data);
        } catch (e) { console.error(e); }
    }

    const startEditing = (chapter) => {
        setNewChapter({ ...chapter });
        setEditingChapterId(chapter._id);
        setIsChapterFormOpen(true);
    };

    const assignStudent = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/courses/${id}/assign`, { email: studentEmailToAssign }, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setStudentEmailToAssign('');

            // Refresh students
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses/${id}/students`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setEnrolledStudents(res.data);
            alert('Student assigned');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error assigning student');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
    if (!course) return <div>Course not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center gap-4 mb-6">
                        <button onClick={() => navigate('/mentor')} className="text-gray-500 hover:text-indigo-600 transition">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                            {course.students.length} Students
                        </span>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-6">
                        {['chapters', 'students', 'settings'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-6 py-8 flex-grow">

                {/* Chapters Tab */}
                {activeTab === 'chapters' && (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-800">Course Content</h2>
                            <button
                                onClick={() => {
                                    setEditingChapterId(null);
                                    setNewChapter({ title: '', description: '', videoUrl: '', sequenceOrder: chapters.length + 1 });
                                    setIsChapterFormOpen(true);
                                }}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 text-sm"
                            >
                                + Add Chapter
                            </button>
                        </div>

                        {/* Add/Edit Chapter Form (Inline/Collapsed) */}
                        {isChapterFormOpen && (
                            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8 animate-slide-down">
                                <h3 className="text-lg font-bold mb-4">{editingChapterId ? 'Edit Chapter' : 'New Chapter'}</h3>
                                <form onSubmit={saveChapter} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                            <input type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none" value={newChapter.title} onChange={e => setNewChapter({ ...newChapter, title: e.target.value })} required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                            <input type="number" className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none" value={newChapter.sequenceOrder} onChange={e => setNewChapter({ ...newChapter, sequenceOrder: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (YouTube/MP4)</label>
                                        <input type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none" value={newChapter.videoUrl} onChange={e => setNewChapter({ ...newChapter, videoUrl: e.target.value })} required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none" rows="3" value={newChapter.description} onChange={e => setNewChapter({ ...newChapter, description: e.target.value })} />
                                    </div>
                                    <div className="flex gap-3 justify-end">
                                        <button type="button" onClick={() => setIsChapterFormOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save Chapter</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="space-y-3">
                            {chapters.map((chapter) => (
                                <div key={chapter._id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex justify-between items-center group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
                                            {chapter.sequenceOrder}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{chapter.title}</h4>
                                            <p className="text-sm text-gray-500 truncate max-w-md">{chapter.description || 'No description'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => startEditing(chapter)} className="text-gray-400 hover:text-indigo-600 p-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
                                        <button onClick={() => deleteChapter(chapter._id)} className="text-gray-400 hover:text-red-600 p-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                                    </div>
                                </div>
                            ))}
                            {chapters.length === 0 && (
                                <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
                                    <p className="text-gray-500">No chapters yet. Click "Add Chapter" to build your course.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Students Tab */}
                {activeTab === 'students' && (
                    <div className="animate-fade-in max-w-4xl">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Quick Enroll</h3>
                            <form onSubmit={assignStudent} className="flex gap-4">
                                <input
                                    type="email"
                                    placeholder="Enter student email..."
                                    className="flex-grow border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={studentEmailToAssign}
                                    onChange={e => setStudentEmailToAssign(e.target.value)}
                                    required
                                />
                                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">Assign</button>
                            </form>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="min-w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                                        <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {enrolledStudents.map(student => (
                                        <tr key={student._id}>
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-gray-900">{student.name}</div>
                                                <div className="text-sm text-gray-500">{student.email}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="w-full max-w-xs">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span>{student.progress}%</span>
                                                        <span>{student.completedChapters}/{student.totalChapters} Ch</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${student.progress}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Enrolled</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {enrolledStudents.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="py-8 text-center text-gray-500">No students enrolled yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="animate-fade-in max-w-2xl">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Course Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                                    <input type="text" className="w-full border p-2 rounded bg-gray-50" value={course.title} disabled />
                                    <p className="text-xs text-gray-400 mt-1">To update course details, please contact admin or create a new course.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea className="w-full border p-2 rounded bg-gray-50" rows="4" value={course.description} disabled />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CourseManager;
