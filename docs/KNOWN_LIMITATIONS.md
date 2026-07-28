# Known Limitations

- Demo photographs are remote editorial samples; no user-upload storage is configured.
- Dashboard state is browser-memory demo state and does not persist to a database.
- Authentication, organizations, and role-based access are not connected.
- AI culling reasons are curated demonstration data, not live model output.
- Payments, email notifications, background jobs, and downloadable packages are not connected.
- The gallery token route demonstrates UX but is not a production authorization boundary.
- Legal text is starter content requiring qualified review.
- Production URLs in sitemap and robots must be changed if the deployment hostname differs.

These limitations are deliberate: the application does not fabricate successful third-party operations when credentials and provisioned services are absent.
