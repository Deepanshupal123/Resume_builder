import { useState } from "react";
import ProfileSettings from "./ProfileSettings";
import SubscriptionSettings from "./SubscriptionSettings";
import SecuritySettings from "./SecuritySettings";
import NotificationSettings from "./NotificationSettings";
import SettingsHeader from "./SettingsHeader";
import SettingsSidebar from "./SettingsSidebar";
import Footer from "../Footer";
import Navbar from "../Navbar";

const Settings = () => {
    const [activeTab, setActiveTab] = useState("profile");

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return <ProfileSettings />;
            case "subscription":
                return <SubscriptionSettings />;
            case "security":
                return <SecuritySettings />;
            case "notifications":
                return <NotificationSettings />;
            default:
                return <ProfileSettings />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-1 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                    <SettingsHeader />

                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                        <SettingsSidebar
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />

                        <div className="flex-1 min-w-0">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Settings;