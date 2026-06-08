import React from "react";

const ExecutiveBanner = () => {
  return (
    <div className="mt-10 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 text-white">
      
      <div>
        <h2 className="text-2xl font-bold">
          Executive Branding Analysis
        </h2>

        <p className="mt-2 text-slate-300">
          Get a detailed score on your resume's impact
          for Fortune 500 roles.
        </p>
      </div>

      <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold">
        Start Free Scan
      </button>
    </div>
  );
};

export default ExecutiveBanner;