export const templates = [
    {
        id: "classic",
        name: "Classic",
        sub: "ATS-friendly",
        preview: "Classic Template",
    },
    {
        id: "modern",
        name: "Modern Blue",
        sub: "Sidebar accent",
        preview: "Modern Template",
    },
    {
        id: "creative",
        name: "Creative",
        sub: "Bold & colorful",
        preview: "Creative Template",
    },
    {
        id: "minimal",
        name: "Minimal",
        sub: "Clean & elegant",
        preview: "Minimal Template",
    },
    {
        id: "executive",
        name: "Executive",
        sub: "Premium dark",
        preview: "Executive Template",
    },
];

export const stats = [
    {
        icon: "folder_open",
        label: "Total Resumes",
        value: "12",
        badge: "+2 this week",
        badgeColor: "#2ECC71",
    },
    {
        icon: "leaderboard",
        label: "Avg. ATS Score",
        value: "88",
        suffix: "/100",
        badge: "Top 5%",
        badgeColor: "#a0caff",
    },
    {
        icon: "download",
        label: "Downloads",
        value: "34",
        badge: "428 total",
        badgeColor: "#8a919e",
    },
    {
        icon: "bolt",
        label: "Profile Strength",
        value: "78",
        suffix: "%",
        progress: 78,
    },
];

export const recentResumes = [
    {
        title: "Senior Product Designer – Apple",
        date: "Oct 24, 2023",
        template: "Minimalist Pro",
        score: 92,
        color: "#2ECC71",
        label: "Excellent",
    },
    {
        title: "Full Stack Engineer – Stripe",
        date: "Oct 21, 2023",
        template: "Modern Tech",
        score: 84,
        color: "#a0caff",
        label: "Very Good",
    },
    {
        title: "UI/UX Designer – Figma",
        date: "Oct 18, 2023",
        template: "Creative",
        score: 78,
        color: "#d2bbff",
        label: "Good",
    },
];

export const getBuildTools = (navigate) => [
    {
        title: "Template Builder",
        desc: "Customize 50+ designer templates with our drag-and-drop editor.",
        linkText: "Choose Template",
        linkColor: "#a0caff",
        onClick: () =>
            document
                .getElementById("templates")
                ?.scrollIntoView({ behavior: "smooth" }),
    },
    {
        title: "AI Resume Generator",
        desc: "Let AI write your experience and skills based on your dream role.",
        linkText: "Generate with AI",
        linkColor: "#d2bbff",
        onClick: () => navigate("/resume"),
    },
    {
        title: "Cover Letter Generator",
        desc: "Generate personalized cover letters.",
        linkText: "Create Letter",
        linkColor: "#2ECC71",
        onClick: () => navigate("/cover-letter"),
    },
    {
        title: "ATS Score Checker",
        desc: "Instantly scan for readability and keyword match.",
        linkText: "Check Score",
        linkColor: "#a0caff",
        onClick: () => navigate("/ats-checker"),
    },
    {
        title: "JD Match Analyzer",
        desc: "Compare your resume against any job posting.",
        linkText: "Analyze Match",
        linkColor: "#d2bbff",
        onClick: () => navigate("/jd-match"),
    },
    {
        title: "Resume Score Card",
        desc: "Get deep AI feedback on content quality.",
        linkText: "Get Score",
        linkColor: "#4cd7f6",
        onClick: () => navigate("/score"),
    },
];

