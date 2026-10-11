// Resume data for server-side code. Static JSON imports are traced by Vercel,
// so the files ship with the serverless functions.
import profile from "../data/profile.json" with { type: "json" };
import skills from "../data/skills.json" with { type: "json" };
import experience from "../data/experience.json" with { type: "json" };
import projects from "../data/projects.json" with { type: "json" };
import education from "../data/education.json" with { type: "json" };

export const portfolio = { profile, skills, experience, projects, education };
