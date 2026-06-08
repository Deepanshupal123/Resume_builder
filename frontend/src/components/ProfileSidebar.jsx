import React from "react";
import {
    User,
    Briefcase,
    Shield,
    ChevronRight,
} from "lucide-react";

const ProfileSidebar = () => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">

            {/* Profile Header */}
            <div className="p-8 text-center border-b">
                <div className="relative w-28 h-28 mx-auto">
                    <img
                        src="https://i.pravatar.cc/300?img=12"
                        alt="profile"
                        className="w-full h-full rounded-2xl object-cover"
                    />

                    <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-500 border-4 border-white"></div>
                </div>

                <h3 className="mt-5 text-2xl font-bold text-slate-900">
                    Alexander Thorne
                </h3>

                <p className="mt-2 text-xs tracking-[0.25em] uppercase text-blue-600 font-semibold">
                    Elite Executive Tier
                </p>
            </div>

            {/* Navigation */}
            <div className="p-2">

                <SidebarItem
                    icon={<User size={18} />}
                    title="Biographical Data"
                />

                <SidebarItem
                    icon={<Briefcase size={18} />}
                    title="Master Experience"
                />

                <SidebarItem
                    icon={<Shield size={18} />}
                    title="Account Security"
                />
            </div>
        </div>
    );
};

const SidebarItem = ({ icon, title }) => {
    return (
        <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition">

            <div className="flex items-center gap-3">
                <span className="text-slate-500">
                    {icon}
                </span>

                <span className="font-medium text-slate-800">
                    {title}
                </span>
            </div>

            <ChevronRight
                size={16}
                className="text-slate-400"
            />
        </button>
    );
};

export default ProfileSidebar;