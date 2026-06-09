const ATSScoreCard = () => {
    return (
        <div className="bg-white border p-8 text-center rounded-xl">
            <h3 className="uppercase text-sm text-gray-500 mb-6">
                Overall ATS Score
            </h3>

            <div className="w-40 h-40 rounded-full border-[12px] border-black flex items-center justify-center mx-auto">
                <div>
                    <h2 className="text-5xl font-bold">85</h2>
                    <p className="text-sm text-gray-500">
                        Perfected
                    </p>
                </div>
            </div>

            <p className="text-gray-500 mt-6">
                Your resume is in the top 5% for Senior
                Design roles.
            </p>
        </div>
    );
};

export default ATSScoreCard;