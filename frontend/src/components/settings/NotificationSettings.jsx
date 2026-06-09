const NotificationSettings = () => {
    return (
        <div className="bg-white border rounded-xl divide-y">
            <div className="p-6 flex gap-4">
                <input
                    type="checkbox"
                    defaultChecked
                />

                <div>
                    <h3 className="font-semibold">
                        Email Updates
                    </h3>

                    <p className="text-gray-500">
                        Product updates and tips.
                    </p>
                </div>
            </div>

            <div className="p-6 flex gap-4">
                <input
                    type="checkbox"
                    defaultChecked
                />

                <div>
                    <h3 className="font-semibold">
                        Job Alerts
                    </h3>

                    <p className="text-gray-500">
                        Receive matching jobs.
                    </p>
                </div>
            </div>

            <div className="p-6 flex justify-end">
                <button className="bg-black text-white px-6 py-3 rounded-lg">
                    Save Preferences
                </button>
            </div>
        </div>
    );
};

export default NotificationSettings;