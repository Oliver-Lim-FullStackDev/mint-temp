# Mint WebApp
Mint.io web casino.

## Project setup
Run dev setup from root [README](../../README.md) 

Once setup, from the root of the monorepo run:
```bash
pnpm i
# in 1 tab
pnpm dev:infra
# in another tab
pnpm dev:webapp
```

**URLs:**
- Web App: https://mint.dev
- API (direct): https://api.mint.dev/api

# Good to Knows

## UI & Theme
See [/packages/ui](`../../packages/ui/README.md`)

## CI & Deploy
We use Vercel for app deployment and ENV vars.

## Build Locally
**To simply build the app run:** `pnpm build`

**To build like Vercel:**
1. Install `vercel-cli` on your machine
1. `npx vercel login` (Request access to the Mint project)
1. `npx vercel build`

You should now be able to run local builds the same way as Vercel does.

## Add New Dependencies
```bash
# Add an existing local package. -D for devDependencies 
pnpm add -D @mint/my-lib
