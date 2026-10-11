import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import DigitalTwin from "./components/DigitalTwin.jsx";
import Skills from "./components/Skills.jsx";
import Experience from "./components/Experience.jsx";
import Projects from "./components/Projects.jsx";
import Education from "./components/Education.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";

// Content is bundled at build time, so the page needs no API call to load.
import profile from "../data/profile.json";
import skills from "../data/skills.json";
import experience from "../data/experience.json";
import projects from "../data/projects.json";
import education from "../data/education.json";
import twin from "../data/twin.json";

export default function App() {
  return (
    <>
      <Navbar name={profile.name} />
      <main>
        <Hero profile={profile} />
        <About profile={profile} />
        <DigitalTwin profile={profile} twin={twin} />
        <Skills skills={skills} />
        <Experience experience={experience} />
        <Projects projects={projects} />
        <Education education={education} />
        <Contact profile={profile} />
      </main>
      <Footer name={profile.name} />
    </>
  );
}
