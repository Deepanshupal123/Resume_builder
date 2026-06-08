import { recentResumes } from "./dashboardData";

const RecentResumes = () => {
    return (
        <section>
            <h2 className="text-2xl font-bold mb-6">
                Recent Resumes
            </h2>

            <div className="space-y-4">
                {recentResumes.map((resume) => (
                    <div
                        key={resume.title}
                        className="bg-white border rounded-xl p-5 flex justify-between"
                    >
                        <div>
                            <h3>{resume.title}</h3>

                            <p className="text-sm text-slate-500">
                                {resume.date}
                            </p>
                        </div>

                        <div>
                            <span
                                style={{ color: resume.color }}
                            >
                                {resume.score}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default RecentResumes;