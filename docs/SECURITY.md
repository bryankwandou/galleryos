# Security Model

Before production launch:

1. Enforce organization scoping on every studio query and mutation.
2. Store originals and derivatives privately; issue purpose-specific signed URLs.
3. Hash gallery and delivery tokens at rest, apply expiry, and scope each token to one booking.
4. Verify Clerk and Stripe webhook signatures before processing payloads.
5. Validate upload MIME type, decoded image format, byte size, dimensions, and filename.
6. Keep model, database, storage, payment, and email credentials server-only.
7. Add rate limits and auditable events to public selection and download endpoints.
8. Delete both database rows and storage objects during organization erasure.
9. Maintain independent backups; GalleryOS must never be the only copy of irreplaceable work.
