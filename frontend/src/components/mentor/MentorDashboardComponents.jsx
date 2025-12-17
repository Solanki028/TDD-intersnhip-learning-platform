import { Link } from 'react-router-dom';

export const MentorStats = ({ courses }) => {
    const totalCourses = courses.length;
    const allStudents = courses.flatMap(c => c.students);
    const uniqueStudents = new Set(allStudents).size;

    const stats = [
        { title: 'My Courses', value: totalCourses, icon: '📚', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
        { title: 'Total Students', value: uniqueStudents, icon: '👨‍🎓', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
                <div key={idx} className={`p-6 rounded-xl border ${stat.color} shadow-sm flex items-center justify-between`}>
                    <div>
                        <p className="text-sm font-medium opacity-80">{stat.title}</p>
                        <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                    </div>
                    <span className="text-3xl">{stat.icon}</span>
                </div>
            ))}
        </div>
    );
};

export const CourseGrid = ({ courses, deleteCourse }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
                <div key={course._id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col group">
                    <div className="h-40 bg-gray-200 relative overflow-hidden">
                        {course.image ? (
                            <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500">
                                <span className="text-4xl text-white opacity-50">🎓</span>
                            </div>
                        )}
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                            {course.students.length} Students
                        </div>
                    </div>

                    <div className="p-5 flex-grow flex flex-col">
                        <h3 className="text-lg font-bold text-gray-800 mb-2 truncate" title={course.title}>{course.title}</h3>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{course.description}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                            <Link
                                to={`/mentor/course/${course._id}`}
                                className="text-indigo-600 font-medium text-sm hover:text-indigo-800 flex items-center gap-1 group-hover:gap-2 transition-all"
                            >
                                Manage <span className="text-lg">→</span>
                            </Link>
                            <button
                                onClick={() => deleteCourse(course._id)}
                                className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                                title="Delete Course"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Empty State / Add Placeholder */}
            {courses.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <p className="text-lg">You haven't created any courses yet.</p>
                    <p className="text-sm">Click "Create New Course" to get started!</p>
                </div>
            )}
        </div>
    );
};
