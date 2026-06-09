const DocumentPreview = () => {
    return (
        <div className="bg-white border rounded-xl overflow-hidden">
            <div className="p-4 border-b flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
                <h3>Document Scan</h3>

                <div className="flex gap-2">
                    <button>+</button>
                    <button>-</button>
                </div>
            </div>

            <div className="p-8 flex justify-center bg-gray-50">
                <div className="w-full max-w-[18rem] h-[420px] bg-white border shadow">
                    <div className="p-6 space-y-3">
                        <div className="h-4 bg-black w-2/3"></div>

                        <div className="h-2 bg-gray-200"></div>
                        <div className="h-2 bg-gray-200 w-4/5"></div>

                        <div className="h-2 bg-gray-200"></div>
                        <div className="h-2 bg-gray-200"></div>

                        <div className="h-2 bg-gray-200 w-3/4"></div>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t">
                Visual Balance:
                <span className="font-semibold ml-2">
                    Excellent
                </span>
            </div>
        </div>
    );
};

export default DocumentPreview;