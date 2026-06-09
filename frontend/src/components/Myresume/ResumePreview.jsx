const ResumePreview = () => {
    return (
        <div className="absolute inset-0 p-5">
            <div className="bg-white h-full rounded shadow-sm p-4">
                <div className="h-3 bg-gray-800 w-1/3 mb-4"></div>

                <div className="space-y-2">
                    <div className="h-2 bg-gray-200"></div>
                    <div className="h-2 bg-gray-200 w-5/6"></div>
                    <div className="h-2 bg-gray-200 w-4/6"></div>
                </div>

                <div className="mt-6 space-y-2">
                    <div className="h-2 bg-gray-200"></div>
                    <div className="h-2 bg-gray-200"></div>
                    <div className="h-2 bg-gray-200 w-3/4"></div>
                </div>
            </div>
        </div>
    );
};

export default ResumePreview;