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

## Digital Twin

The **Digital twin** section is a chat UI where visitors ask questions and get first-person answers about
your experience, skills, projects, education and contact details (`POST /api/twin`).

- **Works out of the box, no key needed.** A built-in keyword matcher answers from the `data/*.json` files.
  It can only answer what is in your data and politely declines anything else.
- **Optional: Claude-powered answers.** Set an API key and the twin uses Claude (grounded on the same data,
  told not to invent facts) and falls back to the built-in answers if the call fails:

  ```bash
  ANTHROPIC_API_KEY=sk-ant-... bun run start      # or add it to the shell running `bun run dev`
  TWIN_MODEL=claude-sonnet-5-5                    # optional model override
  ```

  The key stays on the server and is never sent to the browser.
- Edit the greeting, placeholder and suggestion chips in `data/twin.json`.
- The endpoint is limited to 15 questions per minute per IP, with a 500-character cap per question.
- The UI labels it clearly as an AI assistant.

## Project structure

```
index.html
vite.config.js, tailwind.config.js, postcss.config.js
src/
  main.jsx, App.jsx, index.css
  components/        Navbar, Hero, About, DigitalTwin, Skills, Experience, Projects, Education, Contact, Footer, Section (.jsx)
server/index.js      GET /api/portfolio, POST /api/contact, POST /api/twin, static serving of dist/
server/twin.js       Digital twin answer engine (built-in matcher + optional Claude)
data/                profile, skills, experience, projects, education, twin, messages (JSON)
```

## Editing content

All content lives in `data/*.json`. Edit those files and reload; no component changes needed.

## Notes

- Contact messages are appended to `data/messages.json`. This works on a normal server or your own machine,
  but not on read-only or serverless hosts, where you'd swap it for an email service or database.
- `data/messages.json` contains visitor details; add it to `.gitignore` if you push this repo publicly.
- Run `bun install` once and commit the generated `bun.lock` so installs are reproducible.
