import React from "react";
import { useNavigate } from "react-router-dom";
import {
    templates,
    stats,
    recentResumes,
    getBuildTools,
} from "./dashboardData";

const DashboardCards = ({ onSelectTemplate }) => {
    const navigate = useNavigate();
    const buildTools = getBuildTools(navigate);

    return (
        <div className="space-y-12">

            {/* Stats */}
            <section>
                <h2 className="text-2xl font-bold mb-6 text-slate-800">
                    Dashboard Overview
                </h2>

                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {stats.map((item) => (
                        <div
                            key={item.label}
                            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
                        >
                            <p className="text-sm text-slate-500">
                                {item.label}
                            </p>

                            <h3 className="text-3xl font-bold mt-3">
                                {item.value}
                                {item.suffix}
                            </h3>

                            {item.badge && (
                                <span
                                    style={{ color: item.badgeColor }}
                                    className="text-sm font-medium mt-2 block"
                                >
                                    {item.badge}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* AI Tools */}
            <section>
                <h2 className="text-2xl font-bold mb-6">
                    Smart AI Toolbox
                </h2>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {buildTools.map((tool) => (
                        <div
                            key={tool.title}
                            onClick={tool.onClick}
                            className="cursor-pointer bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all"
                        >
                            <h3 className="font-semibold text-lg">
                                {tool.title}
                            </h3>

                            <p className="text-slate-500 text-sm mt-2">
                                {tool.desc}
                            </p>

                            <button
                                className="mt-4 font-medium"
                                style={{
                                    color: tool.linkColor,
                                }}
                            >
                                {tool.linkText}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recent Resumes */}
            <section>
                <h2 className="text-2xl font-bold mb-6">
                    Recent Resumes
                </h2>

                <div className="grid gap-4">
                    {recentResumes.map((resume) => (
                        <div
                            key={resume.title}
                            className="bg-white rounded-xl border border-slate-200 p-5 flex justify-between items-center"
                        >
                            <div>
                                <h4 className="font-semibold">
                                    {resume.title}
                                </h4>

                                <p className="text-sm text-slate-500">
                                    {resume.date} • {resume.template}
                                </p>
                            </div>

                            <div
                                className="font-bold"
                                style={{ color: resume.color }}
                            >
                                {resume.score}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Templates */}
            <section id="templates">
                <h2 className="text-2xl font-bold mb-6">
                    Resume Templates
                </h2>

                <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            onClick={() => onSelectTemplate(template.id)}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-xl transition-all"
                        >
                            <div className="h-64 flex items-center justify-center bg-slate-100 text-slate-400 text-sm">
                                {template.preview || template.name}
                            </div>

                            <div className="p-4">
                                <h3 className="font-semibold">
                                    {template.name}
                                </h3>

                                <p className="text-sm text-slate-500">
                                    {template.sub}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
};

export default DashboardCards;