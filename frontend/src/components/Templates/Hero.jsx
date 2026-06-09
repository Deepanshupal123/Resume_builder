import React from "react";

const Hero = ({ activeFilter, setActiveFilter }) => {
    const filters = [
        "All Templates",
        "Classic",
        "Modern",
        "Creative",
    ];

    return (
        <section className="max-w-7xl mx-auto px-6 pt-0 py-20 text-center">
            <h1 className="text-5xl font-bold mb-6">
                Professional Readiness Starts with{" "}
                <span className="text-blue-600">
                    Structure
                </span>
            </h1>

            <p className="text-gray-600 max-w-3xl mx-auto mb-10">
                Choose from our library of executive-grade
                templates, meticulously designed to impress
                recruiters and pass ATS systems.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() =>
                            setActiveFilter(filter)
                        }
                        className={`px-5 py-2 rounded-full border transition ${activeFilter === filter
                            ? "border-black text-black"
                            : "border-gray-300 text-gray-500"
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default Hero;