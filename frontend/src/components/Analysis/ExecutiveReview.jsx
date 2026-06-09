const ExecutiveReview = () => {
    return (
        <div className="bg-black text-white p-8 rounded-xl">
            <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">
                    Executive Review
                </h2>

                <span className="bg-white/10 px-3 py-1 rounded">
                    Premium
                </span>
            </div>

            <p className="text-white/80 italic">
                This resume presents as a high-authority
                candidate. Focus on strategic influence
                rather than execution to reach elite level.
            </p>
        </div>
    );
};

export default ExecutiveReview;