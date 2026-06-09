const tabs = [
    {
        id: "profile",
        label: "Profile",
    },
    {
        id: "subscription",
        label: "Subscription",
    },
    {
        id: "security",
        label: "Security",
    },
    {
        id: "notifications",
        label: "Notifications",
    },
];

const SettingsSidebar = ({
    activeTab,
    setActiveTab,
}) => {
    return (
        <aside className="w-full lg:w-64 flex-shrink-0">
            <div
                className="
          flex
          lg:flex-col
          gap-2
          overflow-x-auto
          lg:overflow-visible
          pb-2
          lg:pb-0
          scrollbar-hide
        "
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
              min-w-max
              lg:w-full
              px-4
              py-3
              rounded-lg
              text-sm
              font-medium
              transition-all
              duration-200
              text-left
              whitespace-nowrap
              
              ${activeTab === tab.id
                                ? "bg-black text-white shadow-md"
                                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                            }
            `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </aside>
    );
};

export default SettingsSidebar;