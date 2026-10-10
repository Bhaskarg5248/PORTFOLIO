import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

export async function readJson(name) {
  const file = path.join(DATA_DIR, `${name}.json`);
  const raw = await fs.readFile(file, "utf8");
  return JSON.parse(raw);
}

export async function writeJson(name, value) {
  const file = path.join(DATA_DIR, `${name}.json`);
  await fs.writeFile(file, JSON.stringify(value, null, 2) + "\n", "utf8");
}

export async function getPortfolio() {
  const [profile, skills, experience, projects, education] = await Promise.all([
    readJson("profile"),
    readJson("skills"),
    readJson("experience"),
    readJson("projects"),
    readJson("education"),
  ]);
  return { profile, skills, experience, projects, education };
}
