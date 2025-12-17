import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Hide navbar on login and register pages
    if (['/login', '/register'].includes(location.pathname)) {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">LMS Portal</Link>
                <div className="space-x-4">
                    {!user ? (
                        <>
                            <Link to="/login" className="hover:text-gray-300">Login</Link>
                            <Link to="/register" className="hover:text-gray-300">Register</Link>
                        </>
                    ) : (
                        <>
                            {user.role === 'admin' && <Link to="/admin" className="hover:text-gray-300">Admin</Link>}
                            {user.role === 'mentor' && <Link to="/mentor" className="hover:text-gray-300">Mentor</Link>}
                            {user.role === 'student' && <Link to="/student" className="hover:text-gray-300">Dashboard</Link>}
                            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Logout</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
