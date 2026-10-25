# Mohammed Sufiyaan Safy, Portfolio

My personal portfolio website, built as **Task 1** of the **Future Interns Full Stack Web Development** internship (track code FS).

**Live site:** https://sufiyaansafy.vercel.app <!-- update if your address is different -->

![Desktop view of the portfolio](docs/screenshot-desktop.png)

## What it does

- **Introduces me** with my role, a short summary, the stack I build with, and quick facts about where I'm based, what I'm studying and when I'm available.
- **Shows my skills** grouped by languages, front end, databases, tools and concepts.
- **Lists my projects** with a filter for Future Interns tasks, courses and academic work. The three internship tasks show their status and dates, so the page doubles as a build log.
- **Holds my resume:** education, certifications and coursework side by side, with no clicking needed.
- **Lets people contact me.** A one-click button copies my email address, and the form saves each message to a Supabase database and emails me a notification, with spam and rate-limit protection.
- **Is easy to find.** The page is pre-rendered to plain HTML at build time, with meta tags, Open Graph previews for LinkedIn and WhatsApp, structured data, a sitemap and robots.txt.
- **Works everywhere.** Responsive from 320px phones to wide desktops, with visible keyboard focus, text contrast that meets WCAG AA, and reduced motion respected.

## Design

Three solid colours on white, with no gradients or transparency: **charcoal black** for text and dark blocks, **forest green** for buttons and links, and **crimson red** for accents. Every text colour meets WCAG AA contrast against its background, and the exact ratios are noted next to each colour in `src/styles.css`.

The signature element is the hero's stack: three offset blocks, one per colour, labelled front end, back end and database, which build up from the bottom when the page loads. The logo is a miniature of the same stack. Headings use Archivo set wide, and body text uses Archivo at normal width.

## Tech stack

| Layer | Tools |
| --- | --- |
| Front end | React 19, Vite 8, plain CSS with custom properties |
| Back end | Supabase Edge Function (Deno, TypeScript) |
| Database | Supabase PostgreSQL with Row Level Security |
| Email | Resend API |
| Hosting | Vercel (any static host works) |
| Font | Archivo (variable width and weight), self-hosted |

## How the contact form works

```
Browser form ──POST JSON──▶ Edge Function "contact" ──insert──▶ contact_messages table
   (React)                    validate, honeypot,      └──────▶ Resend email to me
                              rate limit (3 per 10 min)
```

1. `src/components/Contact.jsx` validates the fields in the browser and shows clear errors.
2. `src/lib/sendMessage.js` sends the data to the Edge Function.
3. `supabase/functions/contact/index.ts` validates again on the server (never trust the browser), silently drops bots that fill the hidden "website" field, limits each email address to 3 messages per 10 minutes, saves the message, then emails me through Resend with the sender as the reply-to address.
4. The `contact_messages` table has Row Level Security turned on with no public policies, so the public can't read or write it directly. Only the Edge Function, using the project's secret key on the server, can insert rows.

## Project structure

```
FUTURE_FS_01/
├── index.html                  SEO tags and structured data
├── public/                     favicon, social preview image, robots.txt, sitemap.xml
├── scripts/prerender.js        turns the React app into static HTML after the build
├── src/
│   ├── data/profile.js         all CV content (edit this to update the site)
│   ├── data/projects.js        project list, statuses and links
│   ├── components/             one file per section
│   ├── lib/sendMessage.js      calls the Edge Function
│   ├── entry-server.jsx        build-time renderer
│   ├── main.jsx                browser entry (hydrates the pre-rendered HTML)
│   └── styles.css              design tokens and all styles
└── supabase/
    ├── migrations/             SQL for the contact_messages table
    └── functions/contact/      the Edge Function
```

## Run it locally

You need [Node.js](https://nodejs.org) 20.19 or newer (22 LTS recommended).

```bash
npm install
cp .env.example .env      # on Windows: copy .env.example .env
npm run dev               # opens on http://localhost:5173
```

The site works without Supabase; the contact form then tells visitors to email me directly. To connect it, follow the next section and put your project URL in `.env`.

To test the production build, including pre-rendering:

```bash
npm run build
npm run preview
```

## Set up Supabase and email

### 1. Create the table

In the [Supabase dashboard](https://supabase.com/dashboard), open your project, go to **SQL Editor**, paste the contents of `supabase/migrations/20261025000000_contact_messages.sql` and click **Run**.

### 2. Get a Resend API key

Sign up at [resend.com](https://resend.com) with the email address you want notifications sent to, then create an API key. Without your own domain, Resend's test sender (`onboarding@resend.dev`) can only send to your own account email, which is exactly what this form needs.

### 3. Add the secrets

Go to **Edge Functions > Secrets** and add:

| Key | Value |
| --- | --- |
| `RESEND_API_KEY` | your Resend API key |
| `CONTACT_TO_EMAIL` | `sufiyaansafy11@gmail.com` |

### 4. Deploy the function

The function must be deployed with **JWT verification turned off**, because visitors filling in a public form aren't logged in. Validation, the honeypot and the rate limit protect it instead.

**Option A, with the CLI (recommended):**

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase functions deploy contact --no-verify-jwt
```

If the CLI asks for Docker, add `--use-api` to the deploy command so Supabase bundles the function for you.

**Option B, in the dashboard:** go to **Edge Functions**, deploy a new function named `contact` using the editor, paste in `supabase/functions/contact/index.ts`, deploy it, then turn off JWT verification in the function's settings.

### 5. Connect the site

Put your project URL (from **Project Settings > API**) in `.env` locally and in Vercel's environment variables:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
```

Messages appear in **Table Editor > contact_messages**. The `emailed` column shows whether the notification email went out.

## Deploy to Vercel

1. Publish this folder to GitHub as a **public** repository named `FUTURE_FS_01` (in GitHub Desktop: **File > Add local repository**, create the repository, then **Publish repository** with "Keep this code private" unticked).
2. In [Vercel](https://vercel.com), choose **Add New > Project** and import the repository. Vercel detects Vite automatically. Set the project name to `sufiyaansafy` so the address is `sufiyaansafy.vercel.app` (if that's taken, pick another name and use it for `SITE_URL`).
3. Add two environment variables: `VITE_SUPABASE_URL` (from step 5 above) and `SITE_URL` (your live address, e.g. `https://sufiyaansafy.vercel.app`, no trailing slash).
4. Click **Deploy**. Every push to `main` redeploys the site.

`SITE_URL` fills in the canonical link, social preview image, structured data, robots.txt and sitemap. If you change it, redeploy so the pre-rendered HTML picks it up.

## Updating the site

- **Profile, skills, resume:** edit `src/data/profile.js`.
- **Projects:** edit `src/data/projects.js`. When Task 2 or Task 3 goes live, change its `status` to `'Live'` and add links, for example:

  ```js
  links: [
    { label: 'Live site', href: 'https://...' },
    { label: 'Source code', href: 'https://github.com/sufiyaansafy/FUTURE_FS_02' },
  ],
  ```

- **Colours:** the design tokens at the top of `src/styles.css`.

## Credits

- Typeface: [Archivo](https://github.com/Omnibus-Type/Archivo) by Omnibus-Type, under the SIL Open Font License.
- Built during the [Future Interns](https://futureinterns.com) Full Stack Web Development internship, October 2026.
