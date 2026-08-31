
export const githubUsername = "BenjaminUnrau";

export const Name = "Benjamin";
export const LastName = "Unrau Dyck";
export const FullName = `${Name} ${LastName}`;
export const mail = "benjaminunrau07@gmail.com";

// Meta information
export const metaTitle = "Benjamin Unrau Dyck's Portfolio";
export const metaDescription = "Explore the portfolio of Benjamin Unrau Dyck, showcasing skills in software engineering, project management, and more.";
export const metaKeywords = "Benjamin Unrau Dyck, software engineer, portfolio, project management, certifications, web development";
export const metaAuthor = "Benjamin Unrau Dyck";

// Contact information
export const contactInfo = `I'm just an email or a message away on any platform. Send me an email at ${mail}, or find me on LinkedIn, Twitter, Facebook, or Instagram. Let’s start a conversation about your ideas or just enjoy a casual chat.`;

/*export const bio = [
    "Discover Benjamin Unrau Dyck.",
    `I am a 25-year-old Computer Science student with a strong foundation in software development, specializing in backend technologies.`,
`I have a keen interest in AI, cybersecurity, and open source technology.`,
`My multilingual skills in German, English, and Spanish, combined with my growing technical expertise, make me a valuable asset in diverse, collaborative environments.`,
    "Thank you for exploring my journey and contributions to the tech world!",
];*/

/*export const languages = [

    {
        title: "German Communication",
        skillName: "German ",
        color: "2",
        percentage: "100",
    }, {
        title: "English Communication",
        skillName: "English",
        color: "2",
        percentage: "100",
    }, {
        title: "Spanish Communication",
        skillName: "Spanish",
        color: "2",
        percentage: "90",
    }
];*/

export const skills = {
    "Programming and Scripting Languages": [
        {
            "skillName": "Python",
            "imagePath": "images/skills/python_logo.png",
        },
        {
            "skillName": "Java",
            "imagePath": "images/skills/java_logo.png",
        },
        {
            "skillName": "C",
            "imagePath": "images/skills/c-program-icon.svg",
        },
    ],
    "Database Management Systems": [
        {
            "skillName": "PostgreSQL",
            "imagePath": "images/skills/Postgresql_elephant.svg",
            //"description": "A relational database management system used for storing and retrieving data efficiently."
        },
        {
            "skillName": "OracleSQL",
            "imagePath": "images/skills/Oracle_SQL.svg",
            //"description": "A relational database management system used for storing and retrieving data efficiently."
        },
    ],
    "Version Control and CI/CD Tools": [
        {
            "skillName": "Git",
            "imagePath": "images/skills/git_logo.png",
            //"description": "Version control system to track changes in source code during software development."
        },
    ]
};

export const certifications = {


    educationalCertifications: [
/*        {
            certificationName: "FPUNA Grades 1",
            image: "images/Certifications/FP_UNA/FPUNA_grades-1.jpg",
            preview: "https://ivanweissvanderpol.github.io/images/Certifications/FP_UNA/FPUNA_grades-1.jpg"
        },
        {
            certificationName: "FPUNA Grades 2",
            image: "images/Certifications/FP_UNA/FPUNA_grades-2.jpg",
            preview: "https://ivanweissvanderpol.github.io/images/Certifications/FP_UNA/FPUNA_grades-2.jpg"
        },*/
        {
            certificationName: "Introduccion al Aseguramiento de la Calidad y Automatizacion",
            image: "images/Certifications/bFP_UNA/Curso de Invierno Benjamin Unrau.jpg",
            preview: "images/Certifications/bFP_UNA/Curso de Invierno Benjamin Unrau.jpg"
        },
        {
            certificationName: "ISTQB Foundational level",
            image: "images/Certifications/bFP_UNA/istqb-preview.png",
            preview: "images/Certifications/bFP_UNA/istqb.pdf"
        },
    ]
}


/*export const experience = [
    {
        title: "WPG S.R.L",
        duration: "May 2024 - Present",
        subtitle: "Internship",
        details: [
            "Worked on a project utilizing OpenAI-Azure integration to develop a personalized AI coding assistant based on company guidelines and code.",
            "Conducted research on fine-tuning AI models and optimizing performance.",
            "Learned about prompt engineering and instruction set development for enhanced AI functionalities, and maximising precision.",
        ],
        tags: ["Software Testing", "Software Development", "Automation", "Machine Learning", "Documentation"],
        icon: "globe",
    }
];*/

/*export const education = [
    {
        title: "Bachelor’s Degree in Computer Science",
        duration: "July 2021 - present",
        subtitle: "Facultad Politécnica de la Universidad Nacional de Asunción (FP-UNA)",
        details: [
            "Currently pursuing a diverse curriculum covering essential computer science fields, including database management, object-oriented programming, and software development methodologies.",
            "Led and participated in various academic projects, demonstrating strong leadership and problem-solving skills in real-world scenarios, and fostering team collaboration.",
            "Participated and volunteered at university events, contributing as a helper and organizer, gaining hands-on experience in event management and technical support, enhancing teamwork and communication skills in fast-paced, dynamic environments.",
            "Gained practical experience with multiple programming languages and technologies through coursework and self-directed learning, including SQL, Python, Java.",
        ],
        tags: [
            "Algorithms & Data Structures",
            "Software Engineering",
            "Machine Learning",
            "Data Security",
            "Operating Systems",
            "Database Management Systems",
            "Computer Networks",
            "Compiler Design",
            "Web Development",
            "Network Security",
            "Programming Languages",
            "Front-End Development",
            "Back-End Development",
            "Project Management",
            "Compiler Design",
            "Probabilities & Statistics",
            "Physics",
            "Economics and Finances",
            "Investigation of Operations",
            "Technical Writing",
        ],
        icon: "graduation-cap",
    },
];*/

export const testimonials = {
    reviewer: "Anonymous Colleagues",
    period: "Six-Month Review",
    company: "MentorMate",
    feedback: [

    ]
  };
  

export const footer = [
    {
        key: "devProfiles",
        data: [
            {
                text: "GitHub",
                link: "https://github.com/BenjaminUnrau",
            },
        ],
    },

    {
        key: "socialProfiles",
        data: [
            {
                text: "LinkedIn",
                link: "https://www.linkedin.com/in/benjamin-unrau-dyck/",
            },
            {
                text: "WhatsApp",
                link: "https://wa.me/595986361808",
            },
        ],
    },

    {
        label: "copyright-text",
        data: [
            "Made with &hearts; by BenjaminUnrauDyck.",
            "&copy; No Copyrights. Feel free to use this template.",
        ],
    },
];

export const footerLinks = {
    email: "mailto:benjaminunrau07@gmail.com",

    resume: {
        en: "assets/Benjamin_Unrau_EN.pdf",
        de: "assets/Benjamin_Unrau_DE.pdf",
        es: "assets/Benjamin_Unrau_ES.pdf"
    }
};