# GalleryOS

GalleryOS is a photography-studio workflow prototype covering booking visibility, explainable human-confirmed culling, gallery preparation, and a private client selection experience.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, then use **Open the studio**. The client-facing demo is at `/gallery/harper-chen`.

## Current scope

- Responsive marketing site, pricing, privacy, and terms
- Interactive studio dashboard and booking filters
- Human-confirmed cull review; suggestions never remove work automatically
- Real browser pixel measurement with grounded Groq technical reasoning
- Phantom/Solflare signed wallet ownership verification
- Solana devnet Memo proofs for wallet and gallery manifests
- Gallery builder preview and client favorites flow
- Signed client-selection receipts with tamper verification
- Unit tests for cull decision invariants

Production integrations are intentionally not represented as complete. See `docs/KNOWN_LIMITATIONS.md`.

## Live proof workflow

1. Open `/dashboard` and choose **Cull review** to run the Vision Cull Agent.
   You can select a local JPEG, PNG, or WebP under 20 MB; the source file remains in the browser and only technical measurements reach Groq.
2. Choose **Clients** to connect Phantom or Solflare and sign the ownership challenge.
3. Choose **Galleries** and publish with proof to write the approved image manifest digest to Solana devnet.
4. Follow the displayed Solana Explorer link to independently verify the transaction.
5. Paste any GalleryOS transaction into `/verify` to validate its signer, Memo label, digest format, confirmation status, and slot directly from devnet RPC.
