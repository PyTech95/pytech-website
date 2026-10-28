# Careers shortlist and Work card update

Changes:
- Current Location is mandatory (trimmed, maximum 200 characters), saved in applications, shown in admin and notification email.
- Admin-only star/unstar endpoint; persistent shortlist, count and Starred filter. Older applications load in batches of 500.
- Consistent 16:10 image frames with absolutely positioned contained images, padding, no image distortion, and missing/broken-image fallback. Shared grid covers Work and other pages using ProjectGrid.
- Existing records remain readable without migration; absent starred fields are treated as false.

Validation:
- Run from repository root: node --test tests/careers-shortlist.test.cjs (4 tests pass).
- Modified JavaScript/JSX syntax passes; Next.js production compilation succeeds.
- Full production build cannot finish here because MONGO_URL and DB_NAME are unavailable during prerendering. Run with existing production environment before deploying.
- Browser visual verification was unavailable because a browser executable is not installed. Real project-image URLs, live Mongo persistence, SMTP delivery and resume downloads require a staging/live smoke check.

Apply:
1. Back up the existing checkout and keep its environment files and uploads.
2. Copy these five changed files into the existing repository:
   frontend/app/admin/page.js
   frontend/app/api/[[...path]]/route.js
   frontend/components/site/careers-client.js
   frontend/components/site/project-grid.js
   frontend/lib/mailer.js
3. Optionally add tests/careers-shortlist.test.cjs and run the command above.
4. In frontend, use the existing dependency install, run yarn build with your existing environment, then restart the existing website service.
5. Submit a location-required application, star it in admin, refresh, check Starred count/filter, and inspect Work at mobile and desktop widths.

No dependency or environment changes are needed. No database records were changed here.
GitHub update was blocked: connected integration has pull=true, push=false; branch creation returned HTTP 403.
