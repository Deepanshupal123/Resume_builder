const SubscriptionSettings = () => {
    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="border rounded-xl p-6">
                <h3 className="text-xl font-semibold">
                    Free Plan
                </h3>

                <p className="mt-2 text-gray-500">
                    Current active plan
                </p>
            </div>

            <div className="lg:col-span-2 border-2 border-black rounded-xl p-6">
                <h3 className="text-2xl font-semibold">
                    Executive Pro
                </h3>

                <p className="text-gray-500 mt-3">
                    Unlimited resumes, AI tools and
                    premium templates.
                </p>

                <button className="mt-6 bg-black text-white px-6 py-3 rounded-lg">
                    Upgrade Now
                </button>
            </div>
        </div>
    );
};

export default SubscriptionSettings;