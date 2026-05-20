import type { Resume } from "../../domain/entities/Resume";

export const mockDatabase: Resume = {
  name: "Matthew Vargas",
  title: "Founder, Software Engineer and Architect",
  location: "Aleosan, Cotabato, Philippines",
  linkedin: "https://www.linkedin.com/in/jm-vargas/",
  github: "https://github.com/matty-kun",
  email: "vargas.matthew.dev@gmail.com",
  summary: "Digital craftsman, Software Engineer, Architect, problem solver, and first-principles thinker skilled in React, Next.js, TypeScript, Firebase, and Supabase. I specialize in designing clean, scalable architectures and building robust real-world applications. Lately, I am delving into mobile app development and studying deeper into software architecture and clean code principles.\n\nI am also spearheading FarePay, which is currently in the planning phase with the Local Government Unit (LGU) to establish an ordinance that supports e-governance (e-gov) initiatives for local public transportation. Additionally, I actively lead the CODAX Community, routinely join regional and national programming competitions, and love connecting and collaborating with fellow builders to craft impact-driven technology.",
  projects: [
    {
      title: "FarePay",
      shortDescription: "Web App for Fair Ride Pricing",
      websiteName: "https://farepayph.vercel.app/",
      subtitle: "Project Repository: [GitHub Link]",
      repositoryLink: "https://github.com/matty-kun/FarePay-v1",
      description: "Built a modern fare calculator web application designed to promote fairness and transparency for commuters and drivers in Midsayap. Based on LGU Ordinance No. 536, the tool calculates accurate fares considering routes, baggage, and passenger count, with offline and mobile support.",
      bullets: [
        "Developed using Next.js (React), TypeScript, and Tailwind CSS, implementing modular UI components and reusable hooks for better maintainability.",
        "Integrated Firebase (Firestore, Analytics) to handle user suggestions, data storage, and real-time fare computation updates.",
        "Implemented PWA functionality for offline use and installation on mobile devices, improving accessibility for local commuters.",
        "Designed and integrated map-based route computation using MapTiler and OpenRouteService, with TomTom as a fallback provider for reliable geolocation and route mapping.",
        "Organized a scalable Next.js App Router structure with clear component separation and clean code conventions.",
        "Currently in-development of v1 for future partnership with the Local Government Unit of Midsayap"
      ]
    },
    {
      title: "Monument",
      shortDescription: "Real-Time Intramural Score & Event Management System",
      websiteName: "https://themonument.vercel.app/",
      subtitle: "Project Repository: [GitHub Link]",
      repositoryLink: "https://github.com/matty-kun/Monument",
      description: "Built a real-time web platform for tracking intramural scores, events, and rankings, designed to enhance transparency and engagement across schools and universities. Enables students, faculty, and organizers to view live results, schedules, and standings in one responsive interface.",
      bullets: [
        "Developed using Next.js (App Router), React (TypeScript), and Tailwind CSS, featuring responsive layouts and Framer Motion animations for leaderboard transitions and podium effects.",
        "Integrated Supabase for authentication, database management (PostgreSQL), and real-time updates through Postgres change subscriptions - eliminating the need for manual refreshes.",
        "Implemented role-based access control (Admin, Staff, Public) using Supabase Auth and Row Level Security (RLS) for secure data handling.",
        "Created server-side functions (RPC) for leaderboard and medal calculations to ensure accuracy and consistency.",
        "Deployed via Vercel, leveraging Next.js optimizations for performance and scalability across environments.",
        "Designed with a scalable architecture, supporting future expansion into SaaS functionality for event management systems."
      ]
    },
    {
      title: "QualitixWeb",
      shortDescription: "Accreditation Compliance Management System",
      subtitle: "Project Repository: [GitHub Link]",
      repositoryLink: "https://github.com/AllanAragon/QualitixWeb",
      description: "Built a centralized compliance management web application designed to streamline the accreditation process for educational institutions. The platform tracks requirements, submissions, and visit schedules across multiple accrediting agencies — CHED, PAASCU, and the Board of Trustees — in one unified dashboard.",
      bullets: [
        "Developed using Next.js (App Router), TypeScript, and Tailwind CSS, implementing modular UI components, reusable hooks, and a clean component-separation architecture for long-term maintainability.",
        "Integrated Supabase (PostgreSQL + Auth) for real-time data handling, role-based access control, and secure document storage — supporting admin, coordinator, and read-only outsider roles with route-level protection.",
        "Designed a multi-agency area management system with dynamic sub-area panels, per-coordinator visit access toggles, and tabbed layouts that organize compliance areas by accrediting body.",
        "Built a document submission and review pipeline with file upload support, status tracking (submitted -> approved), and a compliance overview dashboard featuring KPI cards, progress bars, and activity feeds.",
        "Implemented deadline monitoring with an automated checker service and upcoming deadline widgets, giving administrators and coordinators real-time visibility into compliance timelines.",
        "Currently in active development with planned expansion to support additional accrediting agencies and a future partnership with institutional quality assurance offices."
      ]
    },
    {
      title: "Flow",
      shortDescription: "Personal Time Tracking & Focus App",
      websiteName: "https://flowph.vercel.app/",
      subtitle: "Project Repository: [GitHub Link]",
      repositoryLink: "https://github.com/matty-kun/Flow-App",
      description: "Built a mobile time tracking application designed to help individuals build consistent focus habits, monitor productivity, and stay accountable to their goals.",
      bullets: [
        "Developed using React Native (Expo) with TypeScript and NativeWind (Tailwind CSS), utilizing Expo Router for clean file-based navigation across a modular screen and component architecture.",
        "Implemented a live session tracker with Pomodoro timer support, background-persistent timer state, and local push notifications for session completion and pause/resume actions.",
        "Integrated OpenAI (GPT-4o Mini) for natural language activity logging — users can type phrases like \"Coding 1.5h\" and the app parses them into structured log entries automatically.",
        "Built an analytics and reporting dashboard with daily/weekly/monthly breakdowns, category-level stats, trend indicators, and a weekly bar chart — all computed in real-time from locally stored activity logs.",
        "Designed a goal tracking system with deadline-aware progress tracking, forecast computation, and streak calculations to motivate consistent daily engagement.",
        "Stored all user data locally using Expo SQLite for full offline functionality, with no account or internet connection required."
      ]
    },
    {
      title: "DevLift",
      shortDescription: "Web App for Student and Startups Collaboration",
      websiteName: "devlift.ph",
      subtitle: "Project Repository: [GitHub Link]",
      repositoryLink: "https://github.com/matty-kun",
      description: "Designed and built a React + Supabase platform prototype aimed at connecting students with real-world tech projects and mentors from startups. Focused on hands-on learning, collaboration, and career readiness.",
      bullets: [
        "Developed a responsive React/TypeScript interface with reusable components and custom state management.",
        "Integrated Supabase backend services for authentication, project listings, and real-time data updates.",
        "Implemented modular design and scalable structure using Vite and Tailwind CSS for clean UI and fast builds.",
        "Designed for future scalability and community-driven contribution through open-source collaboration."
      ]
    },
    {
      title: "CODAX Community",
      shortDescription: "Tech Education & Career Guidance Platform",
      websiteName: "https://codax-x-cite.vercel.app/",
      subtitle: "Project Repository: [GitHub Link]",
      repositoryLink: "https://github.com/matty-kun/CODAX-x-CITE",
      description: "Initiated a community-driven tech education platform in partnership with Notre Dame of Midsayap College (CITE Department) to guide students toward the right tech career paths and learning resources.",
      bullets: [
        "Built an interest form to collect student preferences and connect them to relevant tech programs and mentors.",
        "Managed and grew a 500+ member community across Discord and Facebook focused on mentorship, collaboration, and career discovery.",
        "Currently in pre-launch phase, finalizing platform structure and event integrations for full release."
      ]
    },
    {
      title: "Distraction Blocker",
      shortDescription: "Chrome Extension for Focus Enhancement",
      videoLink: "https://www.facebook.com/go.mattykun/videos/482016564959171",
      subtitle: "Project Repository: [GitHub Link]",
      repositoryLink: "https://github.com/matty-kun/Distraction-Blocker",
      description: "Developed a Chrome extension aimed at helping users stay focused and productive by blocking access to distracting websites. Designed with modular JavaScript principles and scalable UI logic for a smooth user experience.",
      bullets: [
        "Built with HTML, CSS, and JavaScript, utilizing a structured and modular codebase that mirrors React-style component patterns.",
        "Created a user-friendly interface that allows users to input, save, and manage custom blocklists.",
        "Implemented persistent storage for user preferences and automatic blocking functionality during active sessions."
      ]
    },
    {
      title: "Hotel Reservation System",
      shortDescription: "Console-Based Hotel Booking Management System",
      subtitle: "Project Repository: [GitHub Link]",
      repositoryLink: "https://github.com/matty-kun/Hotel-reservation-system",
      description: "Developed a console-based hotel reservation management system designed to process bookings, track room availability, and handle guest information efficiently.",
      bullets: [
        "Built as an object-oriented programming (OOP) terminal application, showcasing modular class hierarchy and reliable logic structure.",
        "Implemented features for managing room states, guest profiles, check-in/check-out logs, and invoice billing calculations.",
        "Designed a robust command-line interface with input validation and clean error handling for a reliable user flow."
      ]
    },
    {
      title: "Smart Energy Saving Room System",
      shortDescription: "Arduino-Based Intelligent Energy Conservation System",
      subtitle: "Project Repository: [GitHub Link]",
      repositoryLink: "https://github.com/matty-kun/Smart-Energy-Saving-Room-System",
      description: "Designed and built an Arduino-powered intelligent room automation system to conserve energy by automatically controlling lighting, ventilation, and appliances based on room occupancy and ambient light levels.",
      bullets: [
        "Developed custom sensor-integration firmware for Arduino, utilizing PIR motion sensors and LDR light sensors to detect room occupancy and environment illumination.",
        "Programmed relay logic to automatically cut or supply power to connected appliances and lights, minimizing standby power consumption.",
        "Integrated a character LCD display for real-time status updates of ambient parameters and system operations."
      ]
    }
  ],
  skillCategories: [
    {
      title: "Frontend Development",
      skills: ["HTML5", "CSS3", "JavaScript(ES6+)", "TypeScript", "React", "Next.js", "Vite", "Tailwind CSS", "Bootstrap", "Turborepo"]
    },
    {
      title: "Backend & Databases",
      skills: ["Node.js", "Python", "Supabase", "Firebase", "PostgreSQL", "SQLite"]
    },
    {
      title: "AI-Assisted Development Tools",
      skills: ["GitHub Copilot", "Gemini", "Gemini CLI", "Claude", "Cursor", "Antigravity"]
    },
    {
      title: "Developer Tools",
      skills: ["Git", "GitHub", "NPM", "PNPM", "Webpack", "VS Code", "Cursor IDE", "JetBrains", "Trello", "Discord"]
    },
    {
      title: "Other Skills",
      skills: ["Strong Communication", "Team Collaboration", "Community Leadership", "Mentoring"]
    }
  ],
  education: [],
  experience: [
    {
      role: "Bachelor of Science in Computer Science",
      company: "Notre Dame of Midsayap College",
      year: "2024 - Present",
      description: "Emphasizing practical application of software engineering principles, responsive design, and collaborative development.",
      subItems: [
        {
          role: "Founder",
          company: "FarePay",
          year: "Oct 2024 - Present"
        },
        {
          role: "Founder",
          company: "CODAX Community",
          year: "2024 - Present"
        }
      ]
    },
    {
      role: "Hello World! 👋",
      company: "Wrote my first line of code",
      year: "2022"
    }
  ],
  extras: [
    { title: "Philippine Startup Challenge X", link: "/certs/Philippine Startup Challenge.png" },
    { title: "NDMC-PSITS 2024", link: "/certs/NDMC-PSITS 2024.png" },
    { title: "Codechum - Nat'l Programming Challenge 2025", link: "/certs/Codechum Certificate_page-0001.jpg" },
    { title: "13th PSITS Convention", link: ["/certs/13PSITS_page-0001.jpg", "/certs/13 PSITS_page-0001.jpg"] },
    { title: "BASE Certificate", link: "/certs/BASE.png" },
    { title: "freeCodeCamp - Responsive Web Design", link: "/certs/freecodecamp.png" }
  ],
  gallery: [
    "/gallery/680124099_122209450784510211_4866045196128612309_n.jpg",
    "/gallery/682466542_122209450808510211_4686585848027036106_n.jpg",
    "/gallery/683432356_122209450904510211_2230697608578781964_n.jpg",
    "/gallery/1746192133689.jpg",
    "/gallery/1746192133780.jpg",
    "/gallery/1748836396540.jpg",
    "/gallery/470140647_122127918980510211_8588630895689724777_n.jpg",
    "/gallery/470160529_122127665090510211_3151066742534497770_n.jpg",
    "/gallery/470227413_122127918920510211_4872541661325035663_n.jpg",
    "/gallery/470239616_122127918896510211_6775582240858626946_n.jpg",
    "/gallery/480870654_122238281846016805_6037655628876926304_n.jpg",
    "/gallery/481052727_122238280370016805_7317402669979177264_n.jpg",
    "/gallery/482031464_122242811258016805_7256181789434153897_n.jpg",
    "/gallery/484034963_122242808006016805_5850406198114776474_n.jpg",
    "/gallery/484089914_122242808888016805_5684468655840272981_n.jpg",
    "/gallery/484116372_122242810910016805_8874395220765950137_n.jpg",
    "/gallery/491746915_644423571771685_308285476035822992_n.jpg",
    "/gallery/622365103_122198735288510211_817062334120827396_n.jpg",
    "/gallery/624696777_122198734892510211_5623695642650293854_n.jpg",
    "/gallery/645936471_122202801074510211_9109361225249817456_n.jpg"
  ],
  socials: [
    { platform: "LinkedIn", link: "https://www.linkedin.com/in/jm-vargas/" },
    { platform: "GitHub", link: "https://github.com/matty-kun" },
    { platform: "Facebook", link: "https://www.facebook.com/go.mattykun" },
    { platform: "Instagram", link: "https://www.instagram.com/auto.mattech/" }
  ]
};
