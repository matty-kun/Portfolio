export interface Project {
  title: string;
  shortDescription?: string;
  websiteName?: string;
  videoLink?: string;
  subtitle: string;
  repositoryLink?: string;
  description: string;
  bullets: string[];
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface ExtraActivity {
  title: string;
  link?: string | string[];
}

export interface Social {
  platform: string;
  link: string;
}

export interface Talk {
  title: string;
  event: string;
  date?: string;
  link?: string;
}

export interface Education {
  institution: string;
  degree: string;
  date: string;
  description?: string;
}

export interface SubExperience {
  role: string;
  company: string;
  year: string;
  description?: string;
}

export interface Experience {
  role: string;
  company: string;
  year: string;
  description?: string;
  subItems?: SubExperience[];
}

export interface Resume {
  name: string;
  title: string;
  location: string;
  linkedin: string;
  github: string;
  email?: string;
  summary: string;
  projects: Project[];
  skillCategories: SkillCategory[];
  extras: ExtraActivity[];
  gallery?: string[];
  socials?: Social[];
  talks?: Talk[];
  education?: Education[];
  experience?: Experience[];
}
