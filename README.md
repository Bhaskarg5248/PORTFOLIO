# Bhaskar – .NET Developer Portfolio

Personal portfolio built from Bhaskar's resume.

| Layer | Technology |
|-------|------------|
| Build tool | Vite |
| Runtime / package manager | Bun |
| Frontend | React (`.jsx` components) |
| Styling | Tailwind CSS |
| Backend | Vercel functions in `api/` (Bun server for local dev) |
| Data | JSON files in `/data` |
| Version control | Git |

## Getting started

```bash
bun install
bun run dev          # Vite on http://localhost:5173 + API on http://localhost:3001
```

Open http://localhost:5173. Vite proxies `/api/*` to the Bun server.

### Deploy to Vercel

1. Push this repo to GitHub, then in Vercel choose **Add New → Project** and import it
   (`vercel.json` already sets the Vite build, `bun run build`, and output `dist`).
2. Add environment variables (Project → Settings → Environment Variables):
   - `RESEND_API_KEY` (required for the contact form; get one at resend.com)
   - `CONTACT_TO` (optional, defaults to the email in `data/profile.json`)
   - `ANTHROPIC_API_KEY` (optional, enables Claude answers in the Digital Twin)
3. Deploy. The page is static; `/api/twin` and `/api/contact` run as Vercel functions from `api/`.

`server/index.js` is for local development only; Vercel never runs it.

## Digital Twin

The **Digital twin** section is a chat UI where visitors ask questions and get first-person answers about
your experience, skills, projects, education and contact details (`POST /api/twin`).

- **Works out of the box, no key needed.** A built-in keyword matcher answers from the `data/*.json` files.
  It can only answer what is in your data and politely declines anything else.
- **Optional: Claude-powered answers.** Set an API key and the twin uses Claude (grounded on the same data,
  told not to invent facts) and falls back to the built-in answers if the call fails:

  ```bash
  ANTHROPIC_API_KEY=sk-ant-... bun run dev        # locally; on Vercel use an environment variable
  TWIN_MODEL=claude-sonnet-5-5                    # optional model override
  ```

  The key stays on the server and is never sent to the browser.
- Edit the greeting, placeholder and suggestion chips in `data/twin.json`.
- Questions are capped at 500 characters. For rate limiting on Vercel, add a rule under Firewall → Rate Limiting.
- The UI labels it clearly as an AI assistant.

## Project structure

```
index.html
vite.config.js, tailwind.config.js, postcss.config.js
src/
  main.jsx, App.jsx, index.css
  components/        Navbar, Hero, About, DigitalTwin, Skills, Experience, Projects, Education, Contact, Footer, Section (.jsx)
api/                 Vercel functions: POST /api/twin, POST /api/contact
server/index.js      local dev server that runs the same handlers
server/twin.js       Digital twin answer engine (built-in matcher + optional Claude)
server/resume.js     resume data for the functions
vercel.json          Vercel build settings
data/                profile, skills, experience, projects, education, twin (JSON)
```

## Editing content

All content lives in `data/*.json`. Edit those files and reload; no component changes needed.

## Notes

- Contact messages are emailed to you through Resend (locally they are just printed to the console).
- Run `bun install` once and commit the generated `bun.lock` so installs are reproducible.
