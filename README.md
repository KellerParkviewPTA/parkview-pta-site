# Parkview Elementary PTA Website

A modern, mobile-friendly website for the Parkview Elementary PTA (Keller ISD), built so that **anyone on the PTA board can add events, news, and photos without touching code** — all through a free admin panel at `/admin`.

This README is written for non-developers. Follow the numbered steps in order the first time you set things up.

---

## 1. What this site is built with

- **[Astro](https://astro.build)** — generates fast, static web pages.
- **Tailwind CSS** — styling.
- **[Decap CMS](https://decapcms.org)** — the free admin panel at `/admin` where you'll add/edit content.
- **Netlify** — free hosting + free form handling (no backend server needed).

You don't need to understand any of these to use the site day-to-day — just the `/admin` panel.

---

## 2. Running the site on your own computer (optional, for developers)

If you just want to deploy the site, skip to **Section 3**. If you want to preview changes locally first:

1. Install [Node.js](https://nodejs.org) (version 20 or later).
2. Open a terminal in this project folder.
3. Run:
   ```
   npm install
   npm run dev
   ```
4. Open the URL it prints (usually `http://localhost:4321`) in your browser.

---

## 3. Deploying the site for free (Netlify)

1. Create a free account at [netlify.com](https://netlify.com).
2. Push this project to a GitHub repository (ask a technical friend if you've never done this, or use GitHub Desktop — drag the project folder in, click "Publish repository").
3. In Netlify, click **Add new site → Import an existing project**, and connect your GitHub repo.
4. Build settings should auto-detect from `netlify.toml` in this project:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click **Deploy**. After a minute or two, your site will be live at a `*.netlify.app` URL.
6. (Optional) In Netlify's **Domain settings**, connect a custom domain like `parkviewpta.org` if you own one.
7. Update `site:` in `astro.config.mjs` to your real live URL so sitemaps/SEO links are correct, then redeploy.

---

## 4. Setting up your admin login (one-time setup)

The admin panel at `/admin` is how you'll edit everything day-to-day — events, news, board members, photos, etc. — through simple forms, no code.

1. In your Netlify site dashboard, go to **Site configuration → Identity** and click **Enable Identity**.
2. Go to **Identity → Services** and click **Enable Git Gateway**. (This lets the admin panel save your changes back to the website automatically.)
3. Go to **Identity → Invite users**, and invite yourself (and any other board members who should be able to edit the site) by email.
4. Check your email, click the invite link, and set a password.
5. Visit `https://YOUR-SITE.netlify.app/admin` and log in.

That's it — from now on, anyone you've invited can log in at `/admin` and edit the site.

---

## 5. Using the admin panel (`/admin`)

Once logged in, you'll see a list of content types on the left (Calendar Events, News & Announcements, Board Members, Volunteer Opportunities, etc.). Each works the same way:

### Add a new event
Events are **not** added through `/admin` — they come straight from the PTA's Google Calendar (`kellerparkviewpta@gmail.com`), the same calendar the board already uses:

1. Add the event normally in Google Calendar (title, date, time, location, description).
2. That's it. The homepage and `/calendar` page automatically pull in anything on that calendar within a minute or two of the next site rebuild — no publishing step needed.

See **"Setting up the Google Calendar integration"** below for the one-time setup that connects the calendar to the site.

### Add a news announcement
1. Go to `/admin` → **News & Announcements** → **New News & Announcements**.
2. Write a title, short excerpt, and the full story.
3. Toggle **Pin to top** or **Mark as Urgent** if it's important (urgent posts show in a banner across the whole site).
4. Click **Publish**.

### Add a volunteer opportunity
There are two ways to add one, depending on the kind of opportunity:

**Option A — through `/admin` (for ongoing roles without a specific date, like Room Parent):**
1. Go to `/admin` → **Volunteer Opportunities** → **New**.
2. Fill in the title, description, number of spots needed, and a contact person.
3. Click **Publish**. It will appear on the Volunteer page with a sign-up button that opens a short sign-up form on the site.

**Option B — through Google Calendar (for a specific dated event, like a Blood Drive):**
1. Add a regular event to the **"Volunteer Opportunities"** Google Calendar (a separate calendar from the main PTA one — see setup below) with the real title, date/time, and location.
2. Paste a signup link somewhere in the event's description — this can be a Google Calendar "Appointment Schedule" booking link, a Google Form, or any other signup tool.
3. That's it. It automatically shows up on the Volunteer page with a "Sign Up" button pointing to that link, and on the `/calendar` page too — no `/admin` step needed.

### Change the Spirit Shop / store link, logo, or other site-wide settings
These live in one developer-facing file — `src/site.config.ts` — specifically so one person can update the shop link, logo, contact info, and social links all in one place:

1. In GitHub, open `src/site.config.ts` and click the pencil (edit) icon.
2. Change the value in quotes (e.g. `storeUrl: '...'`) to your real link.
3. To swap the logo: upload your new logo file to `public/images/` in GitHub first, then change `logoPath` to point to it (e.g. `/images/your-new-logo.png`).
4. Commit the change — Netlify will automatically rebuild and deploy the site.

If you're not comfortable editing code directly on GitHub, ask a technical friend — it's a one-line change.

### Setting up the Google Calendar integration
The site reads two Google Calendars at build time and turns them into event/volunteer cards automatically. Both calendars belong to the same `kellerparkviewpta@gmail.com` Google account — one is the main PTA calendar you already use, the other is a second calendar just for volunteer opportunities.

**Main PTA calendar** (already set up — only needed again if you ever recreate it):
1. In Google Calendar, go to **Settings → [your calendar] → Access permissions for events**, check **"Make available to public,"** and set the dropdown to **"See all event details"** (not "See only free/busy").
2. Still on that settings page, go to **"Integrate calendar"** and copy the **"Public URL to this calendar"** — paste it into `googleCalendarEmbedUrl` in `site.config.ts`.
3. The ICS "subscribe" link follows a predictable pattern Google doesn't show directly anymore: `https://calendar.google.com/calendar/ical/YOUR-EMAIL-URL-ENCODED/public/basic.ics` — paste that into `googleCalendarSubscribeUrl`.

**Volunteer Opportunities calendar** (for the Option B workflow above):
1. Create a second calendar in Google Calendar named **"Volunteer Opportunities."**
2. Repeat the same public/"See all event details" sharing steps as above for this new calendar.
3. Copy its Calendar ID from **"Integrate calendar"** (looks like `abc123@group.calendar.google.com`) into `volunteerCalendarEmbedSrc`, and its ICS URL into `volunteerCalendarSubscribeUrl`.

**Important limitation:** Google's "Appointment Schedule" feature (bookable time slots) does **not** sync through either calendar feed — only regular events do. Use Appointment Schedules for the actual slot-booking mechanics, and always pair one with a regular calendar event (with the booking link pasted in the description) so the site can pick it up.

---

## 6. Forms (membership, volunteer, contact, etc.)

All forms on the site (Join/Membership, general Volunteer interest, Contact, Sponsor interest) submit automatically through **Netlify Forms** — no backend needed. Submissions show up in your Netlify dashboard under **Forms**, and Netlify can email you a notification for each one:

1. In Netlify, go to **Forms → Settings and usage → Form notifications**.
2. Add an **Email notification** and set it to the address in `formRecipientEmail` in `site.config.ts` (or any address you prefer).

---

## 7. What you still need to provide

See **[TODO-CHECKLIST.md](./TODO-CHECKLIST.md)** for the full list of placeholder content, links, and images that need to be replaced with real PTA information before launch.

---

## 8. Project structure (for developers)

- `src/site.config.ts` — single file for school name, colors, contact info, and external links.
- `src/content/` — all editable content (events, news, board, etc.) as markdown/JSON files — this is what `/admin` edits.
- `src/content.config.ts` — defines the schema/fields for each content type above.
- `src/pages/` — one file per page/route.
- `src/components/` — reusable UI pieces.
- `public/admin/` — the Decap CMS admin panel (`index.html` + `config.yml`).
- `netlify.toml` — Netlify build settings.
