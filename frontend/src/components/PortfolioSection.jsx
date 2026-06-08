import React, { useState } from "react";
import ResumeCard from "./ResumeCard";
import ExecutiveBanner from "./ExecutiveBanner";
import { Grid2X2, List } from "lucide-react";

const PortfolioSection = () => {
    const [gridView, setGridView] = useState(true);

    return (
        <section>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                    Active Portfolio
                </h2>

                <div className="bg-slate-100 p-1 rounded-lg flex">

                    <button
                        onClick={() => setGridView(true)}
                        className={`p-2 rounded ${gridView
                                ? "bg-white shadow text-gray-900"
                                : ""
                            }`}
                    >
                        <Grid2X2 size={18} />
                    </button>

                    <button
                        onClick={() => setGridView(false)}
                        className={`p-2 rounded ${!gridView
                                ? "bg-white shadow text-gray-900"
                                : ""
                            }`}
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {/* Cards */}
            <div
                className={
                    gridView
                        ? "grid md:grid-cols-2 gap-8"
                        : "flex flex-col gap-6"
                }
            >
                <ResumeCard
                    title="Chief Technology Officer"
                    match="98"
                    date="Edited 2 hours ago"
                    location="New York, NY"
                />

                <ResumeCard
                    title="VP of Engineering"
                    draft
                    date="Edited 3 days ago"
                    location="San Francisco"
                />
            </div>

            <ExecutiveBanner />
        </section>
    );
};

export default PortfolioSection;