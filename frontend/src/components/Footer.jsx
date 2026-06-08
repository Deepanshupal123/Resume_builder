import React from "react";

const Footer = () => {
    return (
        <footer className="mt-20 bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-6 py-16">

                {/* Top */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-slate-700 pb-12">

                    <div>
                        <h2 className="text-2xl font-bold">
                            Executive Slate
                        </h2>

                        <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                            The premier career infrastructure for
                            world-class leadership talent.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 uppercase tracking-widest text-xs">
                            Product
                        </h3>

                        <ul className="space-y-3 text-slate-400 text-sm">
                            <li>
                                <a href="/">Resume Builder</a>
                            </li>

                            <li>
                                <a href="/">Brand Audit</a>
                            </li>

                            <li>
                                <a href="/">LinkedIn Mastery</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 uppercase tracking-widest text-xs">
                            Resources
                        </h3>

                        <ul className="space-y-3 text-slate-400 text-sm">
                            <li>
                                <a href="/">Job Market Data</a>
                            </li>

                            <li>
                                <a href="/">Interview Guide</a>
                            </li>

                            <li>
                                <a href="/">Salary Insights</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 uppercase tracking-widest text-xs">
                            Support
                        </h3>

                        <ul className="space-y-3 text-slate-400 text-sm">
                            <li>
                                <a href="/">Privacy Policy</a>
                            </li>

                            <li>
                                <a href="/">Terms & Conditions</a>
                            </li>

                            <li>
                                <a href="/">Contact Support</a>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">

                    <p className="text-slate-500 text-sm">
                        © 2026 Executive Slate. All rights reserved.
                    </p>

                    <div className="flex gap-6 text-slate-400 text-sm">
                        <a href="/">Twitter</a>
                        <a href="/">LinkedIn</a>
                        <a href="/">Email</a>
                    </div>

                </div>

            </div>
        </footer>
    );
};

export default Footer;