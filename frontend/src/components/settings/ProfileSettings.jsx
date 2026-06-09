const ProfileSettings = () => {
    return (
        <div className="bg-white border rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-6">
                Profile Information
            </h2>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex justify-center">
                    <img
                        src="https://i.pravatar.cc/200"
                        alt=""
                        className="w-32 h-32 rounded-full"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-5 flex-1">
                    <input
                        placeholder="Full Name"
                        className="border rounded-lg p-3"
                    />

                    <input
                        placeholder="Professional Title"
                        className="border rounded-lg p-3"
                    />

                    <input
                        placeholder="Email"
                        className="border rounded-lg p-3"
                    />

                    <input
                        placeholder="Location"
                        className="border rounded-lg p-3"
                    />

                    <textarea
                        rows="4"
                        placeholder="Professional Bio"
                        className="border rounded-lg p-3 md:col-span-2"
                    />

                    <div className="md:col-span-2 flex justify-end">
                        <button className="bg-black text-white px-6 py-3 rounded-lg">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;