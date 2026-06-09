const ProgressBar = ({ title, value }) => {
    return (
        <div>
            <div className="flex justify-between mb-2">
                <span>{title}</span>
                <span>{value}%</span>
            </div>

            <div className="h-2 bg-gray-200 rounded-full">
                <div
                    className="h-2 bg-black rounded-full"
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;