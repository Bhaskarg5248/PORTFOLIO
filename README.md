# Bhaskar – .NET Developer Portfolio

Personal portfolio built from Bhaskar's resume.

| Layer | Technology |
|-------|------------|
| Build tool | Vite |
| Runtime / package manager | Bun |
| Frontend | React (`.jsx` components) |
| Styling | Tailwind CSS |
| Backend | Small Bun API server (`server/index.js`) |
| Data | JSON files in `/data` |
| Version control | Git |

## Getting started

```bash
bun install
bun run dev          # Vite on http://localhost:5173 + API on http://localhost:3001
```

Open http://localhost:5173. Vite proxies `/api/*` to the Bun server.

### Production

```bash
bun run build        # outputs dist/
bun run start        # Bun serves dist/ and the API on http://localhost:3001
```

Set `PORT` to change the port.

## Project structure

```
index.html
vite.config.js, tailwind.config.js, postcss.config.js
src/
  main.jsx, App.jsx, index.css
  components/        Navbar, Hero, About, Skills, Experience, Projects, Education, Contact, Footer, Section (.jsx)
server/index.js      GET /api/portfolio, POST /api/contact, static serving of dist/
data/                profile, skills, experience, projects, education, messages (JSON)
```

## Editing content

All content lives in `data/*.json`. Edit those files and reload; no component changes needed.

## Notes

- Contact messages are appended to `data/messages.json`. This works on a normal server or your own machine,
  but not on read-only or serverless hosts, where you'd swap it for an email service or database.
- `data/messages.json` contains visitor details; add it to `.gitignore` if you push this repo publicly.
- Run `bun install` once and commit the generated `bun.lock` so installs are reproducible.
