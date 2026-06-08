import { useNavigate } from "react-router-dom";
import { getBuildTools } from "./dashboardData";

const AIToolbox = () => {
    const navigate = useNavigate();

    const buildTools = getBuildTools(navigate);

    return (
        <section>
            <h2 className="text-2xl font-bold mb-6 text-slate-800">
                Smart AI Toolbox
            </h2>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {buildTools.map((tool) => (
                    <div
                        key={tool.title}
                        onClick={tool.onClick}
                        className="cursor-pointer rounded-2xl border p-6 bg-white hover:shadow-lg"
                    >
                        <h3 className="font-semibold">
                            {tool.title}
                        </h3>

                        <p className="text-sm text-slate-500 mt-2">
                            {tool.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AIToolbox;