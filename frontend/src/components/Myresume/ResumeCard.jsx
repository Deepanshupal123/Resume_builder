import ResumePreview from "./ResumePreview";

const ResumeCard = ({ resume }) => {
    return (
        <div className="group bg-white border rounded-xl overflow-hidden hover:border-black transition">
            <div className="relative aspect-[3/4] bg-gray-100">
                <ResumePreview />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button className="bg-white px-5 py-3 rounded-lg font-semibold">
                        Edit Resume
                    </button>
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between">
                    <span
                        className={`text-xs px-2 py-1 rounded ${resume.status === "Draft"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-green-100 text-green-600"
                            }`}
                    >
                        {resume.status}
                    </span>

                    <button>⋮</button>
                </div>

                <h3 className="text-xl font-semibold mt-4">
                    {resume.title}
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                    {resume.updated}
                </p>
            </div>
        </div>
    );
};

export default ResumeCard;