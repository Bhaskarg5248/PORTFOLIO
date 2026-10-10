import { getPortfolio } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default async function Home() {
  const { profile, skills, experience, projects, education } = await getPortfolio();

  return (
    <>
      <Navbar name={profile.name} />
      <main>
        <Hero profile={profile} />
        <About profile={profile} />
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
