import React from "react";
import StatCard from "./StatCard";

const StatsCards = () => {
    const stats = [
        {
            title: "Total Resumes",
            value: "04",
            subtitle: "+1 this month",
        },
        {
            title: "Profile Strength",
            value: "92%",
            progress: 92,
        },
        {
            title: "Executive Views",
            value: "128",
            subtitle: "High Intent",
        },
        {
            title: "Tier Level",
            value: "Elite Professional",
            subtitle: "Manage Subscription",
            dark: true,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, index) => (
                <StatCard
                    key={index}
                    {...item}
                />
            ))}
        </div>
    );
};

export default StatsCards;

