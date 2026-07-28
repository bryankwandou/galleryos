# Product and Engineering Decisions

## Human-confirmed culling

GalleryOS treats visual analysis as an advisory layer. A model may flag blur, blinking, or near-duplicate framing, but it must return a visible reason and cannot change gallery inclusion without a photographer's confirmation. This protects creative control and avoids presenting a probabilistic result as fact.

## Image analysis

A production implementation should send a cost-controlled, analysis-sized derivative containing real pixel data to a vision-capable model. Filename and EXIF-only scoring cannot reliably identify expressions or compositional duplicates. Originals remain untouched and independently backed up.

## Private delivery

Production image objects must use private storage and short-lived signed access. Public galleries should use high-entropy, booking-scoped tokens, while original and delivery downloads require separately expiring authorization.

## Vertical slice

This repository starts with a deployable interface and domain invariants instead of claiming unconfigured infrastructure works. Database, storage, authentication, jobs, payments, email, and model calls become production features only after their credentials and external resources exist.
