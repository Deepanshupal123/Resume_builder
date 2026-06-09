const SecuritySettings = () => {
    return (
        <div className="bg-white border rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-6">
                Security
            </h2>

            <div className="space-y-4 max-w-lg">
                <input
                    type="password"
                    placeholder="Current Password"
                    className="border rounded-lg p-3 w-full"
                />

                <input
                    type="password"
                    placeholder="New Password"
                    className="border rounded-lg p-3 w-full"
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="border rounded-lg p-3 w-full"
                />

                <button className="border border-black px-6 py-3 rounded-lg">
                    Update Password
                </button>
            </div>
        </div>
    );
};

export default SecuritySettings;