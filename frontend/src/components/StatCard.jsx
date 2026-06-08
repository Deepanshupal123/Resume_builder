import React from "react";

const StatCard = ({
    title,
    value,
    subtitle,
    progress,
    dark = false,
}) => {
    return (
        <div
            className={`rounded-xl p-6 border ${dark
                ? "bg-slate-900 border-slate-900 text-white"
                : "bg-white border-slate-200"
                }`}
        >
            <p
                className={`text-xs uppercase tracking-wider mb-2 ${dark ? "text-slate-400" : "text-slate-700"
                    }`}
            >
                {title}
            </p>

            <div className="flex items-end justify-between">
                <div>
                    <h3 className={`text-3xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>
                        {value}
                    </h3>

                    {subtitle && (
                        <p
                            className={`text-sm mt-2 ${dark
                                ? "text-slate-400"
                                : "text-green-600"
                                }`}
                        >
                            {subtitle}
                        </p>
                    )}
                </div>

                {progress && (
                    <div className="w-24 h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                            style={{
                                width: `${progress}%`,
                            }}
                            className="h-full bg-blue-600"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;