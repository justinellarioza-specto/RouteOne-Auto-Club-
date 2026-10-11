<p align="center">
  <img src="public/images/brand/routeone-logo.png" alt="RouteOne Auto Club logo" width="140" />
</p>

# RouteOne Auto Club

A website for **RouteOne Auto Club**, a fictional private motoring club at Silverstone Circuit. Visitors can browse a collection of supercars, hypercars and F1 cars, book track days and private viewings, and join as members. The site doubles as the club's digital marketing platform, with a promotional video, a social media campaign, an email campaign and live data from a REST API.

**Live site:** <https://routeone-auto-club.onrender.com> · **Repository:** <https://github.com/justinellarioza-specto/RouteOne-Auto-Club->

![Tests](https://github.com/justinellarioza-specto/RouteOne-Auto-Club-/actions/workflows/ci.yml/badge.svg)

---

## Where each project requirement is

| Requirement | Where to find it |
| --- | --- |
| **Part I-A: Landing page** (hero, logo, tagline, call to action, about, featured products, promotion, video) | Home page: hero with background video, About, featured cars, “Your turn” steps, showreel video, “Experience the thrill” promotion |
| **Part I-B: Feature page** | **Performance** (“Why RouteOne”): four features with icons, descriptions and stats |
| **Part I-C: Products / services page** | **Collection** (32 cars with image, name, category, specs, availability, search and filters) and **Services** (programs with prices and calls to action) |
| **Part I-D: Contact page** | **Contact** (in the header): name, email, subject, preferred date, message, validation, plus address, phone, email, hours and social accounts |
| **Part II: Social media campaign** | **Contact** page, below the contact form: the **Grand Opening** campaign (#RouteOneGrandOpening): the poster as an Instagram post with a booking button, the goal, audience, a three-step rollout, and what runs on Instagram, Facebook, TikTok and YouTube |
| **Part III: Email marketing** | **Contact** page, below the social campaign: the **“Stop the Route”** email (subject: *Stop the Route: Your dream supercar is waiting inside*) announcing the Scuderia Ferrari SF-26, shown in an inbox with logo, subject line, banner, message, “Drive the Extraordinary Now!” button and company info (website, email, phone, social). Desktop and phone preview. The email file itself is `public/email/stop-the-route/email.html` |
| **Part IV: API / data integration** | **Live API data** page (☰ menu or footer): Dataset 1 (products) and Dataset 2 (customers) loaded with `GET`, plus an API console. Also used by Collection, Services, the admin inbox and “My bookings” |

## Try it

| Role | Login | What to look at |
| --- | --- | --- |
| Visitor | none | Browse, search (press `/` or `Ctrl + K`), send a request from **Contact** or **Book a drive** |
| Member | `user` / `user` | Tap your name in the header to see **My bookings**, with statuses and cancel |
| Admin | Type `admin` / `admin` in **Log in** (not listed on the login screen) | **Race control** button in the header (or `#/admin`) → **Inquiries**: every request from the forms, where it came from, status changes and CSV export. **Fleet**: mark cars available or in the private collection (updates the Collection page) |
| New member | **Sign up** tab | Create your own account (password: 8+ characters) |

On the login screen, tap the **Member** demo account to fill in the details. The admin account isn't shown there on purpose; staff type it in.

A good demo flow: log in as the member and send a request from Contact → log in as admin and mark it **Booked** → log back in as the member and see it marked **Booked** under My bookings.

## Run it on your computer

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the site and API together for development |
| `npm run build` | Builds the site and the server for production into `dist/` |
| `npm start` | Runs the production build (after `npm run build`) |
| `npm run build:static` | Builds the site only, for static hosts such as Netlify |
| `npm run lint` | Type-checks the project |
| `npm test` | Runs the 21 API tests |
| `npm run test:e2e` | Runs the browser tests (first time: `npx playwright install chromium`) |

## REST API

The Express server (`server.ts`) serves the site and a JSON API. Data is stored in `public/data/*.json`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/vehicles` | All cars (Dataset 1: products) |
| `GET` | `/api/vehicles/:id` | One car |
| `GET` | `/api/vehicles/availability` | Which cars are available or in the private collection |
| `GET` | `/api/experiences` | Services and experiences |
| `GET` | `/api/customers` | Customer inquiries (Dataset 2). Public: names and emails partly hidden. Admin: full records |
| `GET` | `/api/customers?email=` | One customer's own inquiries, for “My bookings” (must be logged in as that customer) |
| `POST` | `/api/inquiries` | Saves a request from the contact or booking form (checked on the server) |
| `PATCH` | `/api/inquiries/:id` | Changes an inquiry's status. Admin: any status. Member: cancel their own open request |
| `POST` | `/api/auth/login` | Checks login ID and password, returns a session token |
| `POST` | `/api/auth/signup` | Creates a member account (password stored hashed) |
| `GET` | `/api/auth/me` | Confirms a saved session is still valid |
| `POST` | `/api/auth/logout` | Ends the session |
| `PATCH` | `/api/vehicles/:id/availability` | Admin sets a car as available or in the private collection |
| `GET` | `/api/health` | Server status check |

If the server can't be reached (for example on a static host), the site falls back to reading the same JSON files directly, so pages still show their data.

## Security

- **Real login.** Passwords are checked on the server; wrong passwords are rejected. New accounts are stored with salted `scrypt` hashes in `data/accounts.json`, which is never served to the browser.
- **Sessions.** Logging in returns a random token that expires after 8 hours. The admin inbox, status changes and “My bookings” only work with a valid token, so editing browser storage cannot unlock admin data.
- **Customer privacy.** Full customer records live in the private `data/customers.json`. The public API and `public/data/customers.json` only contain masked names and emails (`Julian V.`, `j•••@apex-capital.demo`).
- **Server-side form checks.** Name, email format, message length and dates (today onward, within two years) are validated on the server, not just in the browser. Requests larger than 20 KB are refused.
- **Rate limits.** At most 5 inquiries per minute and 10 login attempts per 5 minutes from one visitor (`429 Too Many Requests`).
- **Security headers.** Content-Security-Policy (only our own scripts plus the YouTube player), `X-Frame-Options: SAMEORIGIN` (only our own pages, such as the email preview, can be framed), `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` and HSTS in production. The `X-Powered-By` header is turned off.
- `npm audit` reports 0 known vulnerabilities.

## Testing

Every push to GitHub runs `.github/workflows/ci.yml`: type check, production build, API tests and browser tests. Tests use a throwaway copy of the data, so they never change your real files.

- **API tests** (`tests/api.test.mjs`, 21 tests): car and customer datasets, masked public data, login and wrong passwords, member vs admin permissions, forged tokens, status changes, fleet availability, sign-up with hashed passwords, server-side form validation, campaign source, oversized requests, security headers, and both rate limits.
- **Browser tests** (`tests/e2e/smoke.spec.ts`): page links and the Back button; a visitor books from Contact, a wrong admin password is rejected, and the admin sees the booking in the inbox; no sideways scrolling on a phone.

## Page links

Every page has its own address, so the browser's Back and Forward buttons work and pages can be shared or bookmarked: `#/collection`, `#/experience`, `#/performance`, `#/services`, `#/contact`, `#/api-data`, `#/admin`. The browser tab title follows the page.

## Campaign tracking

Links in the social and email campaigns carry a tag such as `/?source=instagram` or `/?source=email`. The site remembers it for the visit, saves it with any inquiry, and the admin inbox shows **Where inquiries come from**: how many inquiries and bookings each channel produced. Each platform's tracked link is shown in the social campaign on the Contact page.

## Put it online

**Render (recommended, everything works):**
1. Push this project to GitHub.
2. On [render.com](https://render.com), choose **New → Blueprint** and select the repository. `render.yaml` sets everything up.
3. Wait for the build and open the `onrender.com` link.

The free plan sleeps after a period without visitors, so the first visit can take up to a minute. Open the site once before presenting. Inquiries and new accounts saved on Render's free plan reset whenever the server restarts or redeploys.

**Netlify (static, simpler):** on [netlify.com](https://netlify.com), add the repository; `netlify.toml` sets the build. Pages and API data display normally, but submitted forms are kept only in the visitor's browser session.

## Built with

React 19 · TypeScript · Vite · Tailwind CSS 4 · Express · Motion · Lucide icons · Archivo and Inter (bundled, no Google Fonts needed)

Design: one red accent (`#D71920`) on light and dark themes, wide Archivo headings, sentence-case labels, and photos stored locally as WebP for fast loading.

## Project structure

```
server.ts                 Express server, REST API, login and security
data/                     private storage: customers.json (full records), accounts.json (hashed, created at runtime)
public/data/              vehicles.json, experiences.json, customers.json (masked public copy)
public/images/            car photos (WebP) and logo
public/email/             the Stop the Route campaign email (HTML + images)
src/pages/                Home, Collection, Experiences, Features, Services, Contact (with campaigns and journal), Live API data
src/components/           sections, modals, campaigns, header and footer
src/components/admin/     admin dashboard, Inquiries inbox and Fleet manager
tests/                    API tests and browser tests
.github/workflows/        automatic test run on every push
src/context/              theme and member login state
src/services/api.ts       all API calls, with offline fallbacks
```

## Team

| Member | Contribution |
| --- | --- |
| _Name_ | _e.g. design, home page, API_ |
| _Name_ | |
| _Name_ | |

---

RouteOne Auto Club is a fictional company created for a web publishing course project. Car and F1 photos belong to their respective owners and are used for educational purposes.
