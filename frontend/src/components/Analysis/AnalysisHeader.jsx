const AnalysisHeader = () => {
    return (
        <div className="flex flex-col md:flex-row justify-between mb-10 gap-4">
            <div>
                <p className="uppercase text-sm text-gray-500">
                    Resume Analysis
                </p>

                <h1 className="text-3xl md:text-4xl font-bold mt-2">
                    Senior Product Designer_v4.pdf
                </h1>
            </div>

            <div className="flex flex-wrap gap-3">
                <button className="border px-4 py-2 rounded-lg">
                    Edit Content
                </button>

                <button className="bg-black text-white px-4 py-2 rounded-lg">
                    Export PDF
                </button>
            </div>
        </div>
    );
};

export default AnalysisHeader;