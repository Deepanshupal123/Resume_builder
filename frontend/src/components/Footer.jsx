import React from "react";

const Footer = () => {
    return (
        <footer className="mt-20 bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">

                {/* Top */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 border-b border-slate-700 pb-8 sm:pb-12">

                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold">
                            Executive Slate
                        </h2>

                        <p className="mt-3 sm:mt-4 text-slate-400 text-xs sm:text-sm leading-relaxed">
                            The premier career infrastructure for
                            world-class leadership talent.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3 sm:mb-4 uppercase tracking-widest text-xs">
                            Product
                        </h3>

                        <ul className="space-y-2 sm:space-y-3 text-slate-400 text-xs sm:text-sm">
                            <li>
                                <a href="/" className="hover:text-white">Resume Builder</a>
                            </li>

                            <li>
                                <a href="/" className="hover:text-white">Brand Audit</a>
                            </li>

                            <li>
                                <a href="/" className="hover:text-white">LinkedIn Mastery</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3 sm:mb-4 uppercase tracking-widest text-xs">
                            Resources
                        </h3>

                        <ul className="space-y-2 sm:space-y-3 text-slate-400 text-xs sm:text-sm">
                            <li>
                                <a href="/" className="hover:text-white">Job Market Data</a>
                            </li>

                            <li>
                                <a href="/" className="hover:text-white">Interview Guide</a>
                            </li>

                            <li>
                                <a href="/" className="hover:text-white">Salary Insights</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3 sm:mb-4 uppercase tracking-widest text-xs">
                            Support
                        </h3>

                        <ul className="space-y-2 sm:space-y-3 text-slate-400 text-xs sm:text-sm">
                            <li>
                                <a href="/" className="hover:text-white">Privacy Policy</a>
                            </li>

                            <li>
                                <a href="/" className="hover:text-white">Terms & Conditions</a>
                            </li>

                            <li>
                                <a href="/" className="hover:text-white">Contact Support</a>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom */}
                <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:justify-between md:items-center mt-6 sm:mt-8">

                    <p className="text-slate-500 text-xs sm:text-sm">
                        © 2026 Executive Slate. All rights reserved.
                    </p>

                    <div className="flex gap-4 sm:gap-6 text-slate-400 text-xs sm:text-sm">
                        <a href="/" className="hover:text-white">Twitter</a>
                        <a href="/" className="hover:text-white">LinkedIn</a>
                        <a href="/" className="hover:text-white">Email</a>
                    </div>

                </div>

            </div>
        </footer>
    );
};

export default Footer;