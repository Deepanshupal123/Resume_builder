import { stats } from "./dashboardData";

const DashboardStats = () => {
    return (
        <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((item) => (
                <div
                    key={item.label}
                    className="bg-white rounded-2xl p-6 border border-slate-200"
                >
                    <div className="flex justify-between items-center">
                        <h4 className="text-sm text-slate-500">
                            {item.label}
                        </h4>

                        {item.badge && (
                            <span
                                style={{ color: item.badgeColor }}
                                className="text-xs font-semibold"
                            >
                                {item.badge}
                            </span>
                        )}
                    </div>

                    <h2 className="text-3xl font-bold mt-3">
                        {item.value}
                        {item.suffix}
                    </h2>
                </div>
            ))}
        </section>
    );
};

export default DashboardStats;