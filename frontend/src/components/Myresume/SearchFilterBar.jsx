import { useState } from "react";

const SearchFilterBar = () => {
    const [active, setActive] = useState("All");

    const filters = [
        "All",
        "Drafts",
        "Exported",
        "Archived",
    ];

    return (
        <div className="bg-white border rounded-xl p-4 flex flex-col lg:flex-row gap-4 justify-between">
            <input
                type="text"
                placeholder="Search resumes..."
                className="border rounded-lg px-4 py-2 w-full lg:w-96"
            />

            <div className="flex gap-2 overflow-x-auto">
                {filters.map((item) => (
                    <button
                        key={item}
                        onClick={() => setActive(item)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap ${active === item
                                ? "bg-black text-white"
                                : "border"
                            }`}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SearchFilterBar;