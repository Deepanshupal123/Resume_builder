const ResumeHeader = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
                <h1 className="text-3xl md:text-5xl font-bold">
                    My Resumes
                </h1>

                <p className="text-gray-500 mt-3 max-w-xl">
                    Manage your professional portfolio and
                    create tailored resumes for every job.
                </p>
            </div>

            <button className="bg-black text-white px-6 py-3 rounded-lg w-full sm:w-auto">
                + Create New
            </button>
        </div>
    );
};

export default ResumeHeader;