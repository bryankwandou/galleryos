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

## Implemented MVP controls

- AI and wallet endpoints reject cross-origin browser requests and apply per-instance rate limits.
- Workflow anchoring requires a short-lived, signed, HttpOnly wallet session created only after Ed25519 verification.
- Local analysis images remain browser object URLs; only derived technical metrics are sent to Groq.
- The remote image proxy uses an explicit HTTPS hostname allowlist and verifies image content types.
- Client selection submissions return HMAC-signed receipts; tampering is rejected by the public receipt-verification endpoint.
