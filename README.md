# MINT

## Apps
- `@mint/api` [API](./apps/api/README.md)
- `@mint/cms` [CMS](./apps/cms/README.md)
- `@mint/telegram-bot` [Telegram Bot](./apps/telegram-bot/README.md)
- `@mint/tgma` [TGMA](./apps/tgma/README.md)
- `@mint/webapp` [Webapp](./apps/webapp/README.md)

## Packages
- `@mint/client` [MINT API Client and NextJS API Wrapper](./packages/client/README.md)
- `@mint/config` [Config](./packages/config/README.md)
- `@mint/game-internal` [Game Studio API](./packages/game-internal/README.md)
- `@mint/gamestudio-api` [Game Studio API](./packages/gamestudio-api/README.md)
- `@mint/infra` [Infrastructure Setup](./packages/infra/README.md)
- `@mint/mui` [Minimals.css / Material UI Base Theme](./packages/mui/README.md)
- `@mint/ui` [MINT Base UI lib for all apps](./packages/ui/README.md)
- `@mint/slot-machine` [Slot Machine](./packages/slot-machine/README.md)
- `@mint/types` [Types](./packages/types/README.md)

# Get Started with Local Development
**1. One-time host mapping (Do it first time):**
```bash
sudo sh -c 'echo "127.0.0.1 mint.dev" >> /etc/hosts'
sudo sh -c 'echo "127.0.0.1 api.mint.dev" >> /etc/hosts'
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder 2>/dev/null || true
```
**2. One-time setup (per machine):**

- From the root folder run:
```bash
# install deps
pnpm i
# installs Caddy + trusts local CA
pnpm --filter=@mint/infra dev:setup
```

**3. Start HTTPS proxy (Caddy):**
   - Must run in its own terminal in parallel.
   - Run it every time when you run the TGMA app & API
```bash
pnpm dev:proxy
```

**4. Start `@mint/api`:**
```bash
pnpm dev:api
```

**5. Start `@mint/webapp`:**
```bash
pnpm dev:webapp
```

**6. Start `@mint/tgma`:**
```bash
pnpm dev:tgma
```

# CI, Builds & Deployments

We use Vercel, Railway for hosting and GitHub Action for CI.

## CI Secrets
See [GitHub → Settings → Secrets → Actions](https://github.com/mintdotio/mint/settings/secrets/actions)

