# The Luxury Barber Club — VIP

Next.js + Firebase Realtime Database starter for one-time VIP codes, guest registration and admin-triggered weekly draws.

## 1. Requirements
- Node.js 20.9+
- A Firebase project with **Authentication (Email/Password)** and **Realtime Database** enabled
- A Firebase service account for server-side Admin SDK access
- A Vercel project

## 2. Firebase setup
1. In Firebase Console, open the existing project selected by the owner.
2. Enable Authentication → Sign-in method → Email/Password.
3. Create the owner's admin user under Authentication → Users. Verify the email address.
4. In Project settings → Service accounts, generate a private key. Keep it secret.
5. Copy the web app configuration into `.env.local` using `.env.example` as a template.
6. Add the service-account JSON as `FIREBASE_SERVICE_ACCOUNT_JSON`. Keep it server-only.
7. Set `ADMIN_EMAILS` to the exact verified admin email address(es), comma-separated.
8. **Do not replace the existing project's database rules.** The app accesses `/luxuryVip` only through the server-side Admin SDK; the browser never reads or writes VIP records directly. Keep the current rules for the other application and review them separately.

**Important:** the Firebase web config contains a public API key, not an admin credential. The service-account private key is highly sensitive. Never put it in a `NEXT_PUBLIC_` variable, source code, Git, or a browser bundle. Since the chosen Firebase project may contain unrelated payment data, back it up first and verify the correct database URL/project before deployment. The app stores its data only under `/luxuryVip`. Do not upload the included example rules as a replacement for rules in a shared production project.

## 3. Local development
```bash
cp .env.example .env.local
# Fill every value
npm install
npm run dev
```
Open http://localhost:3000. Admin: http://localhost:3000/admin.

## 4. Vercel deployment
1. Push this folder to a private Git repository.
2. Import it in Vercel as a Next.js project.
3. Add every variable from `.env.example` in Vercel → Project → Settings → Environment Variables. Do not add `FIREBASE_SERVICE_ACCOUNT_JSON` with a `NEXT_PUBLIC_` prefix.
4. Deploy and test the public registration and admin login flows.

## 5. How it works
- Admin signs in with Firebase Email/Password.
- Server verifies the Firebase ID token, verified email and `ADMIN_EMAILS` allowlist.
- Admin creates random one-time codes. Only SHA-256 hashes are stored in `/luxuryVip/codes`.
- Guest submits name + code. Server consumes the code transactionally and adds an entry to the current ISO week.
- The weekly draw is admin-triggered. It atomically locks the week's entry list, selects a winner with Node's cryptographic random generator, then stores the result.
- The week ID is UTC ISO week (`YYYY-Www`). Before production, confirm that this matches the salon's intended local weekly cutoff.

## 6. Before public launch
- Add final official game rules, privacy notice, retention policy, contact details and eligibility/claim process. Obtain appropriate legal review for the applicable jurisdiction.
- Define whether the prize draw is free and whether any purchase is required; get local legal advice before advertising it as a chance-based promotion.
- Add rate limiting / bot protection to public redemption, audit logging, backup and monitoring.
- Consider a dedicated Firebase project rather than a project shared with payment-related services.
- Confirm the salon's weekly closing time and timezone; current week calculation uses UTC.

## Database shape
```text
luxuryVip/
  codes/{sha256(code)}                 # unused → redeemed
  guestIndex/{redemptionId}            # minimal guest index
  weeks/{YYYY-Www}/entries/{entryId}   # eligible entries
  weeks/{YYYY-Www}/draw                # open → drawing → completed
  winners/{YYYY-Www}                  # immutable result snapshot
```
