# Known Limitations

- Demo photographs are remote editorial samples; no user-upload storage is configured.
- Dashboard state is browser-memory demo state and does not persist to a database.
- Authentication, organizations, and role-based access are not connected.
- Initial cards contain curated demonstration suggestions; the Technical Cull Agent measures real browser pixels (sharpness, luminance, clipping) and uses configured Groq reasoning with provider metadata. It does not claim semantic visual understanding.
- Payments, email notifications, background jobs, and downloadable packages are not connected.
- The gallery token route demonstrates UX but is not yet backed by persistent token storage or a production authorization boundary.
- Wallet ownership uses a real Ed25519 signed challenge and gallery manifests can be anchored through Solana's Memo program on devnet; these proofs do not replace database authorization.
- Legal text is starter content requiring qualified review.
- Production URLs in sitemap and robots must be changed if the deployment hostname differs.

These limitations are deliberate: the application does not fabricate successful third-party operations when credentials and provisioned services are absent.
