import { templates } from "./dashboardData";

const TemplateGallery = ({ onSelect }) => {
    return (
        <section id="templates">
            <h2 className="text-2xl font-bold mb-6">
                Resume Templates
            </h2>

            <div className="grid md:grid-cols-3 xl:grid-cols-5 gap-6">
                {templates.map((template) => {
                    const Preview = template.Preview;

                    return (
                        <div
                            key={template.id}
                            onClick={() => onSelect(template.id)}
                            className="bg-white rounded-xl border overflow-hidden cursor-pointer hover:shadow-xl"
                        >
                            <div className="h-72 overflow-hidden">
                                <Preview />
                            </div>

                            <div className="p-4">
                                <h3>{template.name}</h3>
                                <p>{template.sub}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default TemplateGallery;