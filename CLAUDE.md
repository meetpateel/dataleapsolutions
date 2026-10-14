# CLAUDE.md

Marketing site for DataLeap (https://dataleapsolution.com): static HTML, no build step, hosted on GitHub Pages.

## Layout

- 7 pages at the root: `index.html`, `about.html`, `service-details.html`, `careers.html`, `privacy-policy.html`, `terms-of-service.html`, `cookie-policy.html`. Header, footer and `<head>` are copied into each page, so a shared change must be made in all 7.
- `assets/css/main.css`: all site styles. Edit it directly (there is no SCSS source).
- `assets/js/main.js` (nav, scroll, AOS init), `consent.js` (cookie banner, loads reCAPTCHA only after consent), `forms.js` (Formspree submit + reCAPTCHA token), `service-details.js` (capability tab switcher).
- `assets/vendor/`: Bootstrap 5.3, Bootstrap Icons, AOS. Only the files the pages load are kept.
- `sitemap.xml`, `robots.txt`, favicons and `og-image.png` at the root.

## Deploying

- Pushing to `main` deploys via `.github/workflows/jekyll-gh-pages.yml` (about 1-2 minutes). Check it with `gh run list --branch main --limit 1`, then `gh run watch <id>`.
- `_config.yml` only excludes repo docs from the published site. Any new `.md` file at the root would be published as a page unless added to its `exclude` list.
- Workflow actions are pinned to commit SHAs; Dependabot opens monthly update PRs.

## Working on this repo

- Make changes on a `claude/<topic>` branch and open a PR. The user merges; don't merge yourself.
- Preview with `python -m http.server 8765 --bind 127.0.0.1`. Don't use `file://`: the CSP's `'self'` doesn't match there.

## Content Security Policy (easy to break)

Every page has the same `<meta http-equiv="Content-Security-Policy">` right after `<meta charset>`. It allows no inline code:

- No `<script>` blocks, `onclick=` handlers or `style=` attributes. Put JS in `assets/js/` and styles in `main.css` (Bootstrap utility classes like `d-none` are fine).
- A new third-party origin (script, font, image, iframe, fetch) must be added to the policy on all 7 pages, or it is silently blocked.
- Blocked requests don't reliably show as CSP errors in the console. To test, register a `securitypolicyviolation` listener, or check that stylesheets, images and scripts actually loaded.
- Meta CSP can't set `frame-ancestors`, so clickjacking protection would need a proxy that sets headers (e.g. Cloudflare).

## Forms

- The contact form (`index.html`) and careers form (`careers.html`) post to Formspree via `forms.js`. The `action` URLs are still placeholders (`YOUR_CONTACT_FORM_ID`, `YOUR_APPLICATION_FORM_ID`), so both fail until the owner supplies real IDs. Never invent IDs.
- reCAPTCHA v3 loads only after the visitor accepts the cookie banner. The site key in `consent.js` is public; the secret key lives only in Formspree and must never be committed.
- The forms keep the template class `php-email-form`; CSS and all three scripts select on it.

## Content rules

- Show city and state only (Sioux Falls, SD). Leaving out a street address is intentional; don't add one.
- Don't add claims that can't be verified (client counts, industries served, delivery times, certifications).
- The template is used under a paid BootstrapMade license, so the missing footer credit and the template images are fine; don't flag them.
- Public contact: info@dataleapsolution.com and +1 605-370-3803. Don't put a personal email address anywhere in the repo or in commits.
- Pages use plain, specific copy aimed at businesses that run on paperwork (hotels first). Keep `<title>`, meta description, Open Graph tags and JSON-LD in sync when page copy changes.
