
const AdminStats = ({ analytics, pendingMentorsCount }) => {
    if (!analytics) return null;

    const stats = [
        {
            title: "Total Users",
            value: analytics.totalUsers,
            subtext: `Students: ${analytics.totalStudents} | Mentors: ${analytics.totalMentors}`,
            color: "bg-blue-50 border-blue-200 text-blue-700",
            icon: "👥"
        },
        {
            title: "Total Courses",
            value: analytics.totalCourses,
            subtext: "Active courses",
            color: "bg-green-50 border-green-200 text-green-700",
            icon: "📚"
        },
        {
            title: "Total Chapters",
            value: analytics.totalChapters,
            subtext: "Learning modules",
            color: "bg-purple-50 border-purple-200 text-purple-700",
            icon: "📑"
        },
        {
            title: "Pending Mentors",
            value: pendingMentorsCount,
            subtext: "Requires approval",
            color: "bg-yellow-50 border-yellow-200 text-yellow-700",
            icon: "⚠️"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <div key={index} className={`p-6 rounded-xl border ${stat.color} shadow-sm transition-transform hover:scale-105 duration-200`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium opacity-80">{stat.title}</p>
                            <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                        </div>
                        <span className="text-2xl">{stat.icon}</span>
                    </div>
                    {stat.subtext && <p className="text-xs mt-3 opacity-75">{stat.subtext}</p>}
                </div>
            ))}
        </div>
    );
};

export default AdminStats;
