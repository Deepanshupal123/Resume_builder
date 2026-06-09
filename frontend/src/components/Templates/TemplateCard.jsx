import React from "react";

const TemplateCard = ({ template }) => {
    return (
        <div className="group">
            <div className="relative overflow-hidden border rounded-xl shadow hover:-translate-y-2 transition-all duration-300">
                <img
                    src={template.image}
                    alt={template.name}
                    className="w-full aspect-[3/4] object-cover"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex justify-center items-center">
                    <button className="bg-white px-6 py-3 rounded-lg font-semibold">
                        Preview
                    </button>
                </div>
            </div>

            <div className="flex justify-between items-center mt-5">
                <div>
                    <p className="text-xs uppercase text-gray-500">
                        {template.category}
                    </p>

                    <h3 className="text-xl font-semibold">
                        {template.name}
                    </h3>
                </div>

                <button className="bg-black text-white px-5 py-2 rounded-lg">
                    Select
                </button>
            </div>
        </div>
    );
};

export default TemplateCard;