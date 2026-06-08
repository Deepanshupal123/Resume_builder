import React from "react";
import {
    Search,
    Bell,
    ChevronDown,
} from "lucide-react";

const Navbar = () => {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* Left */}
                <div className="flex items-center gap-10">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Executive Slate
                    </h2>

                    <nav className="hidden md:flex items-center gap-8">
                        <a
                            href="/"
                            className="text-sm font-semibold border-b-2 border-slate-900 pb-1"
                        >
                            Dashboard
                        </a>

                        <a
                            href="/"
                            className="text-sm text-slate-500 hover:text-slate-900"
                        >
                            Resumes
                        </a>

                        <a
                            href="/"
                            className="text-sm text-slate-500 hover:text-slate-900"
                        >
                            Analytics
                        </a>
                    </nav>
                </div>

                {/* Right */}
                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center gap-4">
                        <Search
                            size={20}
                            className="cursor-pointer text-slate-500"
                        />

                        <Bell
                            size={20}
                            className="cursor-pointer text-slate-500"
                        />
                    </div>

                    <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

                    <div className="flex items-center gap-3 cursor-pointer">
                        <img
                            src="https://i.pravatar.cc/150?img=12"
                            alt="profile"
                            className="w-10 h-10 rounded-full object-cover"
                        />

                        <span className="hidden lg:block font-medium">
                            A. Thorne
                        </span>

                        <ChevronDown size={18} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;