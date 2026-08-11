<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/3361971e-e8c7-4f0f-8c4d-ef0a5437ef51

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Security Standard

This application treats client-side roles and local storage as presentation state, not as an authorization boundary.

- Deploy [firestore.rules](firestore.rules) with every Firebase release. Public reads are limited to the models and agencies directory; writes require document ownership or an authenticated Firebase user with the `admin` custom claim.
- Set the Firebase custom claim with a trusted server or the Firebase Admin SDK. Never allow the browser to assign its own `admin` claim.
- Audit logs are readable only by admins and can only be created by an authenticated user for their own user ID.
- Subscriber creation is limited to the allowlisted fields and a bounded email length. Unknown collections are denied by default.
- The Express server disables framework fingerprinting, adds baseline browser security headers, limits JSON bodies to 100 KB, and rate-limits API requests per IP.

Before production deployment, configure Firebase App Check, enable Authentication email verification and MFA for privileged accounts, and deploy the rules using the Firebase CLI:

```bash
firebase deploy --only firestore:rules
```
