import React from "react";
import { BadgeCheck } from "lucide-react";

const PremiumWidget = () => {
    return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">

            <BadgeCheck
                size={42}
                className="mx-auto text-blue-600"
            />

            <h3 className="mt-4 text-lg font-bold text-slate-900">
                Go Fully Premium
            </h3>

            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Unlock human curated reviews and VIP placement in
                executive search databases.
            </p>

            <button className="mt-5 w-full py-3 bg-white border rounded-lg font-medium hover:bg-slate-50">
                View Pricing
            </button>
        </div>
    );
};

export default PremiumWidget;