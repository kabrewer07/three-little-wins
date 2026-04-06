# Three Little Wins

A personal daily reflection tool for logging wins and one improvement at the end of each day. The habit is simple — write down three things that went well. Small wins add up.

## Features

- Google OAuth sign in
- Log three (or more) wins and one improvement per day
- One entry per day — come back and update anytime
- Calendar view showing logged days for the current month
- Past entries with full win history
- Rotating daily improvement prompts
- Responsive — works on mobile and desktop

## Tech Stack

- **React** + **TypeScript** via Vite
- **Tailwind CSS v4** with custom design tokens
- **Supabase** — Postgres database + Google OAuth
- **Vercel** — deployment

## Running Locally
```bash
npm install
npm run dev
```

Requires a `.env.local` file with:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Live

[threelittlewins.vercel.app](https://three-little-wins.vercel.app)