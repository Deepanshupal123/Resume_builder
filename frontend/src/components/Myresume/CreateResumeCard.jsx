const CreateResumeCard = () => {
    return (
        <div className="border-2 border-dashed rounded-xl flex flex-col justify-center items-center min-h-[500px] hover:bg-gray-50 transition cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl">
                +
            </div>

            <h3 className="font-semibold text-xl mt-4">
                New Career Path
            </h3>

            <p className="text-gray-500 text-center mt-2 px-6">
                Start with a professionally crafted
                template.
            </p>
        </div>
    );
};

export default CreateResumeCard;