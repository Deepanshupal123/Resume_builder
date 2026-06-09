import React from "react";
import Navbar from "../components/Navbar";
import StatsCards from "../components/StatsCards";
import PortfolioSection from "../components/PortfolioSection";
import ProfileSidebar from "../components/ProfileSidebar";
import ActivityFeed from "../components/ActivityFeed";
import PremiumWidget from "../components/PremiumWidget";
import Footer from "../components/Footer";
import DashboardCards from "../components/DashboardCards";
import { useNavigate } from "react-router-dom";
const Home = () => {
    const navigate = useNavigate();
    const handleSelectTemplate = (id) => {
        console.log(id);
    };

    const handleCreateNew = () => {
        navigate("/builder");
    }


    return (
        <div className="min-h-screen bg-slate-50 flex flex-col gap-4">

            <Navbar />

            <main className="max-w-7xl mx-auto px-4 md:px-6">

                {/* Hero */}
                <section className="mb-12">

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">

                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                                Welcome, Alexander
                            </h1>

                            <p className="mt-3 text-slate-500 max-w-xl">
                                Your executive portfolio is currently
                                performing at the top 5% of your peer group.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">

                            <button className="px-5 py-3 border rounded-lg bg-white hover:bg-slate-100">
                                Analyze Resume
                            </button>

                            <button onClick={handleCreateNew} className="px-6 py-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800">
                                Create New
                            </button>

                        </div>

                    </div>

                </section>

                {/* Stats */}
                <StatsCards />

                {/* Main Content */}
                <div className="grid lg:grid-cols-12 gap-10 mt-10">

                    {/* Left */}
                    <div className="lg:col-span-8">
                        <PortfolioSection />
                    </div>

                    {/* Right */}
                    <div className="lg:col-span-4 space-y-8">
                        <ProfileSidebar />
                        <ActivityFeed />
                        <PremiumWidget />
                    </div>

                </div>

                <DashboardCards
                    onSelectTemplate={handleSelectTemplate}
                />

            </main>

            <Footer />

        </div>
    );
};

export default Home;

