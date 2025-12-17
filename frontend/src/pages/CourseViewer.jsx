import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

const CourseViewer = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [chapters, setChapters] = useState([]);
    const [progress, setProgress] = useState({ completedChapters: [] });
    const [currentChapter, setCurrentChapter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCelebration, setShowCelebration] = useState(false);

    const isCourseCompleted = chapters.length > 0 && progress.completedChapters.length === chapters.length;

    useEffect(() => {
        if (isCourseCompleted) {
            setShowCelebration(true);
            triggerConfetti();
        }
    }, [isCourseCompleted]);

    const triggerConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    useEffect(() => {
        fetchCourseData();
    }, [id]);

    const fetchCourseData = async () => {
        try {
            const chaptersRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses/${id}/chapters`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setChapters(chaptersRes.data);

            const progressRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/progress/course/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setProgress(progressRes.data);

            if (chaptersRes.data.length > 0) {
                // Determine first unlocked chapter or first uncompleted
                // Logic: Locked chapters are those where previous is not complete.
                // We want to default strictly to the first one user wants to click, but maybe show first one.
                setCurrentChapter(chaptersRes.data[0]);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const markComplete = async (chapterId) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/progress/${chapterId}/complete`, {}, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            // Refresh progress
            const progressRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/progress/course/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setProgress(progressRes.data);
            alert('Chapter Completed!');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error completing chapter');
        }
    };

    const downloadCertificate = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/certificates/${id}`, {
                responseType: 'blob',
                headers: { Authorization: `Bearer ${user.token}` },
            });
            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `certificate-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error downloading certificate');
        }
    }

    if (loading) return <div>Loading...</div>;

    const isChapterCompleted = (chapterId) => progress.completedChapters.includes(chapterId);

    // Check if locked: Previous chapter must be complete.
    const isChapterLocked = (index) => {
        if (index === 0) return false;
        const prevChapter = chapters[index - 1];
        return !isChapterCompleted(prevChapter._id);
    }



    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-50 font-sans">
            {/* Dark Sidebar */}
            <div className="w-96 bg-gray-900 text-white flex flex-col shadow-2xl z-10">
                <div className="p-6 border-b border-gray-800 bg-gray-900">
                    <h2 className="text-xl font-bold tracking-tight text-white/90">Course Content</h2>

                    {/* Progress Bar in Sidebar */}
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
                            <span>Your Progress</span>
                            <span>{chapters.length > 0 ? Math.round((progress.completedChapters.length / chapters.length) * 100) : 0}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-indigo-500 h-2 rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                style={{ width: `${chapters.length > 0 ? Math.round((progress.completedChapters.length / chapters.length) * 100) : 0}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                    {chapters.map((chapter, index) => {
                        const locked = isChapterLocked(index);
                        const completed = isChapterCompleted(chapter._id);
                        const isActive = currentChapter && currentChapter._id === chapter._id;

                        return (
                            <div
                                key={chapter._id}
                                onClick={() => !locked && setCurrentChapter(chapter)}
                                className={`
                                    p-4 rounded-xl transition-all duration-200 border-l-4 group relative overflow-hidden
                                    ${isActive
                                        ? 'bg-gray-800 border-indigo-500 shadow-md'
                                        : 'border-transparent hover:bg-gray-800/50'
                                    }
                                    ${locked ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
                                `}
                            >
                                <div className="flex items-start gap-4 z-10 relative">
                                    <div className={`
                                        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                                        ${completed ? 'bg-green-500/20 text-green-400' : isActive ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-400'}
                                    `}>
                                        {completed ? '✓' : locked ? '🔒' : index + 1}
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-semibold transition-colors ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                            {chapter.title}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 bg-gray-900 px-2 py-0.5 rounded">Video</span>
                                            {completed && <span className="text-[10px] text-green-400 font-medium">Completed</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {showCelebration && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all scale-100 animate-bounce-short border-4 border-yellow-400">
                            <div className="text-6xl mb-4">🎉</div>
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Congratulations!</h2>
                            <p className="text-gray-600 mb-8">You've successfully completed <span className="font-bold text-indigo-600">{chapters.length > 0 ? 'the course' : ''}</span>. Great job!</p>

                            <button
                                onClick={downloadCertificate}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition hover:-translate-y-1 flex items-center justify-center gap-2 text-lg"
                            >
                                <span>🏆</span>
                                <span>Download Certificate</span>
                            </button>

                            <button
                                onClick={() => setShowCelebration(false)}
                                className="mt-4 text-gray-400 hover:text-gray-600 text-sm font-medium hover:underline"
                            >
                                Back to Course
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto bg-gray-100 relative">
                {currentChapter ? (
                    <div className="max-w-5xl mx-auto p-8 lg:p-12">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 text-sm text-indigo-600 font-bold tracking-wide uppercase mb-2">
                                <span>Chapter {chapters.findIndex(c => c._id === currentChapter._id) + 1}</span>
                                <span>•</span>
                                <span>Video Lesson</span>
                            </div>
                            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">{currentChapter.title}</h1>
                        </div>

                        {/* Cinema Mode Video Player */}
                        <div className="relative group rounded-2xl overflow-hidden shadow-2xl bg-black ring-1 ring-black/5 aspect-video mb-10">
                            {getYouTubeId(currentChapter.videoUrl) ? (
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${getYouTubeId(currentChapter.videoUrl)}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center flex-col text-gray-400 gap-4">
                                    <span className="text-6xl opacity-20">🎞️</span>
                                    <p>Video content unavailable</p>
                                </div>
                            )}
                        </div>

                        {/* Description & Action */}
                        <div className="flex flex-col lg:flex-row gap-12">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="text-2xl">📝</span> Description
                                </h3>
                                <div className="prose prose-indigo text-gray-600 leading-relaxed bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                    {currentChapter.description}
                                </div>
                            </div>

                            <div className="lg:w-80">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:sticky lg:top-8">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Actions</h3>
                                    {!isChapterCompleted(currentChapter._id) ? (
                                        <button
                                            onClick={() => markComplete(currentChapter._id)}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 transform active:scale-95"
                                        >
                                            <span className="w-6 h-6 border-2 border-white/30 rounded-full flex items-center justify-center text-[10px] group-hover:bg-white group-hover:text-indigo-600 transition-colors">✓</span>
                                            Mark as Completed
                                        </button>
                                    ) : (
                                        <div className="w-full bg-green-50 text-green-700 font-bold py-4 rounded-xl border border-green-200 flex items-center justify-center gap-2">
                                            <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</span>
                                            Completed
                                        </div>
                                    )}
                                    <p className="text-xs text-center text-gray-400 mt-4">
                                        Marking as complete unlocks the next chapter.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6 text-4xl shadow-inner">👈</div>
                        <h2 className="text-2xl font-bold text-gray-600 mb-2">Ready to start?</h2>
                        <p>Select a chapter from the sidebar to begin learning.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseViewer;
