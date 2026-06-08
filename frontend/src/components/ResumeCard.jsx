import React from "react";
import {
    MoreHorizontal,
    Edit,
    Download,
    Bolt,
    History,
} from "lucide-react";

const ResumeCard = ({
    title,
    match,
    date,
    location,
    draft = false,
}) => {
    return (
        <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300">

            {/* Preview */}
            <div className="relative bg-slate-50 p-6 aspect-[4/3] flex items-center justify-center">

                <div className="w-40 h-52 bg-white border shadow-lg p-4">
                    <div className="w-14 h-2 bg-slate-300 rounded mb-4"></div>

                    <div className="space-y-2">
                        <div className="h-1 bg-slate-200 rounded"></div>
                        <div className="h-1 bg-slate-100 rounded"></div>
                        <div className="h-1 bg-slate-100 rounded"></div>
                    </div>

                    <div className="mt-5 space-y-2">
                        <div className="h-1 bg-slate-300 w-10"></div>
                        <div className="h-1 bg-slate-100"></div>
                        <div className="h-1 bg-slate-100"></div>
                    </div>
                </div>

                {!draft && (
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition">
                        <div className="flex flex-col gap-2">
                            <button className="bg-white p-2 rounded-full shadow">
                                <Edit size={16} />
                            </button>

                            <button className="bg-white p-2 rounded-full shadow">
                                <Download size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {draft && (
                    <span className="absolute top-4 left-4 bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full">
                        Draft
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex justify-between">
                    <div>
                        <h3 className="font-bold text-lg text-slate-900">
                            {title}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                            {date} • {location}
                        </p>
                    </div>

                    {!draft ? (
                        <div className="flex items-center gap-1 text-green-600">
                            <Bolt size={14} />
                            <span className="text-xs font-semibold">
                                {match}% Match
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-slate-400">
                            <History size={14} />
                            <span className="text-xs font-semibold">
                                v2.4
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center mt-5 pt-4 border-t">
                    <div className="flex gap-2">
                        {!draft ? (
                            <>
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                                    PDF
                                </span>

                                <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                                    DOCX
                                </span>
                            </>
                        ) : (
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                                Pending
                            </span>
                        )}
                    </div>

                    <button>
                        <MoreHorizontal />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResumeCard;