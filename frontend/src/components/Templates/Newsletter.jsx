import React from "react";

const Newsletter = () => {
    return (
        <section className="bg-gray-100 py-20 mt-20">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                <div>
                    <h2 className="text-3xl font-bold mb-3">
                        Not sure which one to choose?
                    </h2>

                    <p className="text-gray-600">
                        Get our expert selection guide and
                        learn which template works best for
                        your industry.
                    </p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="border rounded-lg px-4 py-3 w-full md:w-72"
                    />

                    <button className="bg-black text-white px-6 rounded-lg">
                        Send Guide
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;