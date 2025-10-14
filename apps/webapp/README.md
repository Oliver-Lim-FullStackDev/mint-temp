# Webapp
Mint.io WebApp

## Project setup

```bash
$ pnpm i
```

## Compile and run the project

```bash
# run local with proxy
pnpm dev:https:proxy
```

**URLs:**
- Webapp: https://mint.dev
- Telegram: https://mint.dev/casinos?tgma
- API (direct): https://api.mint.dev/api

### Environment Variables

The following environment variables are required for the Telegram Stars API:

- `TELEGRAM_BOT_TOKEN` - Your Telegram Bot token for creating invoices
- `NEXT_PUBLIC_MINT_ENV` - Select between "production" and "staging" to point to the correct env

```bash
NEXT_PUBLIC_MINT_URL=https://mint.dev
NEXT_PUBLIC_SERVER_URL=https://api.mint.dev/api
NEXT_PUBLIC_MINT_API_URL=https://api.mint.dev/api
```

### Notes

- This is a demo implementation using in-memory storage
- In production, you should use a proper database
- Purchase data is stored in global memory and will be lost on server restart
- Real payment verification should be implemented for production use

# UI & Theme
We're using Material UI.
See [/packages/ui](`../../packages/ui/README.md`)

# CI & Deploy
We use Vercel & Railway

## Deploy from localhost
- brew install railway
- railway login
- railway up (from the app )

# Build Locally
**To simply build the app run:** `pnpm build`

**To build like Vercel:**
1. Install `vercel-cli` on your machine
1. `npx vercel login` (Request access to the Mint project)
1. `npx vercel build`

You should now be able to run local builds the same way as Vercel does.

# Development
```bash
# Add an existing local package
pnpm add -D @mint/my-lib
```
