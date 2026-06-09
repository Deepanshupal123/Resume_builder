import ProgressBar from "./ProgressBar";

const skills = [
    { title: "Product Strategy", value: 92 },
    { title: "Stakeholder Mgmt", value: 78 },
    { title: "Design Systems", value: 100 },
    { title: "Data Analytics", value: 45 },
];

const KeywordMatchCard = () => {
    return (
        <div className="bg-white border p-8 rounded-xl">
            <div className="flex justify-between mb-8">
                <h3 className="uppercase text-sm text-gray-500">
                    Keyword Density & Match
                </h3>

                <span className="text-blue-600">
                    Target: Fintech Lead
                </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {skills.map((item) => (
                    <ProgressBar
                        key={item.title}
                        {...item}
                    />
                ))}
            </div>
        </div>
    );
};

export default KeywordMatchCard;