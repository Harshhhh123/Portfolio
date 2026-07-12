# harsh-goilkar :: cloud console

A portfolio disguised as a cloud provider console. Pick AWS or GCP on the way in — same résumé underneath, two fully committed costumes: AWS gets the dark-topbar/light-body Cloudscape look, GCP gets the dark Material console. Every section is a real console metaphor (projects are S3 buckets, skills are a service catalog, contact is an IAM access request).

Built by [Harsh Goilkar](mailto:harshgoilkar27@gmail.com) — Cloud/DevOps engineer & full-stack developer, B.Tech IT @ DJSCE '27.

## Run it

```bash
npm install
npm run dev   # http://localhost:3000
```

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · hand-rolled canvas 3D (no WebGL libs)

## Layout

- `src/lib/content.ts` — all portfolio content, theme-agnostic (single source of truth; `PLACEHOLDER` strings mark links to fill in)
- `src/lib/themes/` — AWS/GCP terminology, boot sequences, jokes
- `src/components/landing/` — preloader, vendor duel, boot/transition sequence
- `src/app/console/` — the console itself (home, IAM, compute, storage, catalog, monitoring, billing)

## Personalization

- Photo → `public/profile.jpg`
- Provider logos → `public/logos/aws.png`, `public/logos/gcp.png`
- Links → search `PLACEHOLDER` in `src/lib/content.ts`

---

*Not an actual AWS or Google Cloud property. Please don't sue, Andy. Please don't sunset me, Sundar.*
