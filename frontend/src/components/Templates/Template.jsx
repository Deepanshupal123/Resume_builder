import React, { useState } from "react";
import Navbar from "../Navbar";
import Hero from "./Hero";
import TemplateCard from "./TemplateCard";
import Newsletter from "./Newsletter";
import Footer from "../Footer";

// import Navbar from "../components/Navbar";
// import Hero from "../components/Hero";
// import TemplateCard from "../components/TemplateCard";
// import Newsletter from "../components/Newsletter";
// import Footer from "../components/Footer";


const Template = () => {
    const [activeFilter, setActiveFilter] =
        useState("All Templates");

    const templates = [
        {
            id: 1,
            name: "Stockholm",
            category: "Modern Classic",
            image:
                "https://images.unsplash.com/photo-1517841905240-472988babdf9",
        },
        {
            id: 2,
            name: "New York",
            category: "Executive Focus",
            image:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        },
        {
            id: 3,
            name: "London",
            category: "Classic Authority",
            image:
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col gap-10">
            <Navbar />

            <Hero
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
            />

            <section className="max-w-7xl mx-auto px-6 pb-20">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {templates.map((template) => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                        />
                    ))}
                </div>
            </section>

            <Newsletter />

            <Footer />
        </div>
    );
};

export default Template;

