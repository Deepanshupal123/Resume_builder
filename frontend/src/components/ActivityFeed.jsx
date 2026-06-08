import React from "react";
import {
    Upload,
    PenTool,
    Eye,
} from "lucide-react";

const ActivityFeed = () => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">

            {/* Header */}
            <div className="px-6 py-4 border-b bg-slate-50 flex items-center justify-between">

                <h3 className="text-xs uppercase tracking-widest font-bold">
                    Journal & Activity
                </h3>

                <span className="bg-slate-900 text-white text-xs px-3 py-1 rounded-full">
                    3 Recent
                </span>
            </div>

            {/* Timeline */}
            <div className="p-6 space-y-8">

                <ActivityItem
                    icon={<Upload size={18} />}
                    title="Exported CTO v2.4"
                    time="Today, 2:15 PM"
                />

                <ActivityItem
                    icon={<PenTool size={18} />}
                    title="Revised Executive Narrative"
                    time="Yesterday, 10:45 AM"
                />

                <ActivityItem
                    icon={<Eye size={18} />}
                    title="Profile viewed by Amazon Inc."
                    time="3 Days Ago"
                />
            </div>

            <button className="w-full border-t py-4 text-xs font-semibold uppercase tracking-widest text-slate-500 hover:text-slate-900">
                Audit Full History
            </button>
        </div>
    );
};

const ActivityItem = ({
    icon,
    title,
    time,
}) => {
    return (
        <div className="flex gap-4">

            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                {icon}
            </div>

            <div>
                <h4 className="font-medium text-slate-900">
                    {title}
                </h4>

                <p className="text-xs text-slate-500 mt-1">
                    {time}
                </p>
            </div>
        </div>
    );
};

export default ActivityFeed;