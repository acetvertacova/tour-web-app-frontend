import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Menu, X, User, LogOut } from "lucide-react";
import { logout } from "../store/auth/slice";

export default function Header() {
    const { userInfo, userToken } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
        setIsMenuOpen(false);
    };

    return (
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-green-100/50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                        <div className="bg-green-600 p-2 rounded-full shadow-sm">
                            <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-light text-green-900 tracking-tight">Wonder</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `px-3 py-2 rounded-full transitions-all duration-300 ${isActive
                                    ? "text-green-900 font-medium bg-green-100/60"
                                    : "text-green-700 hover:text-green-900 hover:bg-green-50/60 font-light"
                                }`
                            }
                        >
                            Tours
                        </NavLink>

                        {userToken && (
                            <NavLink
                                to="/bookings"
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-full transitions-all duration-300 ${isActive
                                        ? "text-green-900 font-medium bg-green-100/60"
                                        : "text-green-700 hover:text-green-900 hover:bg-green-50/60 font-light"
                                    }`
                                }
                            >
                                My Bookings
                            </NavLink>
                        )}

                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                `px-3 py-2 rounded-full transitions-all duration-300 ${isActive
                                    ? "text-green-900 font-medium bg-green-100/60"
                                    : "text-green-700 hover:text-green-900 hover:bg-green-50/60 font-light"
                                }`
                            }
                        >
                            About Us
                        </NavLink>

                        {/* Auth Section */}
                        {!userToken ? (
                            <div className="flex items-center gap-3 ml-4">
                                <NavLink
                                    to="/login"
                                    className="px-6 py-2 rounded-full border border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-300 font-light tracking-wide"
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    className="px-6 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-all duration-300 font-light tracking-wide shadow-sm"
                                >
                                    Sign Up
                                </NavLink>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 ml-4">
                                <div className="flex items-center space-x-2 text-green-800">
                                    <User className="h-4 w-4" />
                                    <span className="font-light">Hello, {userInfo.sub}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-300 font-light shadow-sm"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </nav>

                </div>
            </div>
        </header>
    );
}