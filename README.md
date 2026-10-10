# Bhaskar – .NET Developer Portfolio

Personal portfolio built from Bhaskar's resume.

| Layer | Technology |
|-------|------------|
| Backend | Next.js (App Router, API routes) |
| Data | JSON files in `/data` |
| Frontend | React |
| Styling | Tailwind CSS |
| Version control | Git |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Project structure

```
app/
  api/portfolio/route.js   GET  – all portfolio data as JSON
  api/contact/route.js     POST – validates and saves a message to data/messages.json
  layout.js, page.js, globals.css
components/                Navbar, Hero, About, Skills, Experience, Projects, Education, Contact, Footer
data/                      profile, skills, experience, projects, education, messages (JSON)
lib/data.js                JSON read/write helpers
```

## Editing content

All content lives in `data/*.json`. Edit those files and the page updates; no component changes needed.

## Notes

- Contact messages are appended to `data/messages.json`. This works on a normal Node server or local machine,
  but serverless hosts (e.g. Vercel) have a read-only filesystem, so swap `writeJson` for an email service or
  database there.
- `data/messages.json` contains visitor details; add it to `.gitignore` if you push this repo publicly.
