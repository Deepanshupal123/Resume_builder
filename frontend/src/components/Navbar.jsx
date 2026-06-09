import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    Search,
    Bell,
    ChevronDown,
} from "lucide-react";
import { RiMenuFold2Fill } from "react-icons/ri";
const Navbar = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const storedUser = (() => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch (e) {
            return null;
        }
    })();

    const displayName = storedUser?.name || 'A. Thorne';
    const displayEmail = storedUser?.email || 'athorne@example.com';

    useEffect(() => {
        function handleClick(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
                setMobileMenuOpen(false);
            }
        }

        function handleKey(e) {
            if (e.key === 'Escape') {
                setOpen(false);
                setMobileMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);

        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, []);

    function handleLogout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setOpen(false);
        navigate('/login');
    }

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <button
                    onClick={() => setMobileMenuOpen((s) => !s)}
                    className="md:hidden text-slate-900 p-2"
                    aria-label="Toggle menu"
                >
                    <RiMenuFold2Fill size={24} />
                </button>
                {/* Left */}
                <div className="flex items-center gap-10">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Executive Slate
                    </h2>



                    <nav className="hidden md:flex items-center gap-8">
                        <NavLink
                            to="/home"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-sm font-semibold border-b-2 border-slate-900 pb-1"
                                    : "text-sm text-slate-500 hover:text-slate-900"
                            }
                        >
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/my-resumes"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-sm font-semibold border-b-2 border-slate-900 pb-1"
                                    : "text-sm text-slate-500 hover:text-slate-900"
                            }
                        >
                            My Resume
                        </NavLink>

                        <NavLink
                            to="/templates"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-sm font-semibold border-b-2 border-slate-900 pb-1"
                                    : "text-sm text-slate-500 hover:text-slate-900"
                            }
                        >
                            Templates
                        </NavLink>

                        <NavLink
                            to="/analysis"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-sm font-semibold border-b-2 border-slate-900 pb-1"
                                    : "text-sm text-slate-500 hover:text-slate-900"
                            }
                        >
                            Analytics
                        </NavLink>

                        <NavLink
                            to="/settings"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-sm font-semibold border-b-2 border-slate-900 pb-1"
                                    : "text-sm text-slate-500 hover:text-slate-900"
                            }
                        >
                            Settings
                        </NavLink>
                    </nav>
                </div>

                {/* Right */}
                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center gap-4">
                        {/* <Search
                            size={20}
                            className="cursor-pointer text-slate-500"
                        /> */}

                        <Bell
                            size={20}
                            className="cursor-pointer text-slate-500"
                        />
                    </div>

                    <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

                    <div className="relative" ref={containerRef}>
                        <div
                            onClick={() => setOpen((s) => !s)}
                            className="flex items-center gap-3 cursor-pointer select-none"
                        >
                            <img
                                src="https://i.pravatar.cc/150?img=12"
                                alt="profile"
                                className="w-10 h-10 rounded-full object-cover"
                            />

                            <span className="hidden lg:block font-medium">
                                {displayName}
                            </span>

                            <ChevronDown size={18} />
                        </div>

                        {open && (
                            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                                <div className="p-4">
                                    <div className="font-semibold text-slate-900">{displayName}</div>
                                    <div className="text-xs text-slate-500 truncate">{displayEmail}</div>
                                </div>

                                <div className="border-t border-slate-100" />

                                <div className="p-2">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-2 rounded hover:bg-slate-50 text-sm text-red-600"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>


                </div>
            </div>

            {/* Mobile Sidebar */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
            <div
                ref={mobileMenuRef}
                className={`fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-50 md:hidden transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">Menu</h2>
                    <span onClick={() => setMobileMenuOpen(false)} className="cursor-pointer text-slate-500 hover:text-slate-900 text-xl text-bolder">
                        X
                    </span>
                </div>

                <nav className="flex flex-col p-4 gap-2">
                    <NavLink
                        to="/home"
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                            isActive
                                ? "px-4 py-3 rounded-lg bg-slate-100 font-semibold text-slate-900"
                                : "px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50"
                        }
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/my-resumes"
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                            isActive
                                ? "px-4 py-3 rounded-lg bg-slate-100 font-semibold text-slate-900"
                                : "px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50"
                        }
                    >
                        My Resume
                    </NavLink>

                    <NavLink
                        to="/templates"
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                            isActive
                                ? "px-4 py-3 rounded-lg bg-slate-100 font-semibold text-slate-900"
                                : "px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50"
                        }
                    >
                        Templates
                    </NavLink>

                    <NavLink
                        to="/analysis"
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                            isActive
                                ? "px-4 py-3 rounded-lg bg-slate-100 font-semibold text-slate-900"
                                : "px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50"
                        }
                    >
                        Analytics
                    </NavLink>

                    <NavLink
                        to="/settings"
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                            isActive
                                ? "px-4 py-3 rounded-lg bg-slate-100 font-semibold text-slate-900"
                                : "px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50"
                        }
                    >
                        Settings
                    </NavLink>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;

