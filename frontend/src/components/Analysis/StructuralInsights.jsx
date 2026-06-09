const insights = [
  {
    title: "Reverse Chronological Flow",
    desc: "Experience is perfectly sequenced."
  },
  {
    title: "Quantifiable Metrics",
    desc: "Add revenue and growth percentages."
  },
  {
    title: "Executive Summary",
    desc: "Expand summary to include leadership keywords."
  }
];

const StructuralInsights = () => {
  return (
    <div className="bg-white border p-8 rounded-xl">
      <h2 className="text-2xl font-semibold mb-6">
        Structural Insights
      </h2>

      <div className="space-y-6">
        {insights.map((item) => (
          <div key={item.title}>
            <h4 className="font-semibold">
              {item.title}
            </h4>

            <p className="text-gray-500">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StructuralInsights;