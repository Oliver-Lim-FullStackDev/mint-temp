# Mint Game Studio API

The `@mint/gamestudio-api` package defines the thin bridge that Mint exposes to external studios. It handles **player resolution** and **payments** only – gameplay engines, randomness, and rewards now live in the internal `@mint/game-internal` module.

## Surface modules

- **config** – lightweight game definition metadata (studio & game identifiers, optional descriptive config).
- **init** – request/response DTOs for retrieving balances together with the exposed config snapshot.
- **payments** – adapters that wire the Game Studio API into a wallet provider.
- **player** – provider contract for resolving the current player/session context.
- **errors** – canonical error types thrown by the API helpers.

## REST endpoints

The Mint API now keeps gameplay endpoints internal. External studios will see only the data bridge:

- `GET /games/:studioId/:gameId/config`
- `POST /games/:studioId/:gameId/payments/:action`
- `GET /players/:playerId`

Gameplay for Mint-owned titles is served from dedicated internal routes:

- `GET /internal/games/:studioId/:gameId/init`
- `POST /internal/games/:studioId/:gameId/play`

## Example – Minty Spins (internal)

### Init

```http
GET /internal/games/mint/minty-spins/init
Authorization: Bearer <sessionToken>
```

```json
{
  "config": { "gameId": "mint_super_slots", "randomness": { "type": "PF" }, ... },
  "balances": { "SPN": 42 },
  "randomness": { "type": "PF", "hash": "ab12cd..." }
}
```

### Play

```http
POST /internal/games/mint/minty-spins/play
Authorization: Bearer <sessionToken>
Content-Type: application/json

{ "clientSeed": "optional-client-seed", "wager": 0 }
```

```json
{
  "result": {
    "data": [["minty", "trump", ...]],
    "isWin": true,
    "winningCombinations": [...],
    "rewards": { "MBX": 50, "XPP": 37, "RTP": 3 },
    "spinsRemaining": 41
  },
  "balance": { "before": 42, "after": 41 },
  "randomness": {
    "type": "PF",
    "serverSeed": "...",
    "clientSeed": "...",
    "combinedSeed": "...",
    "hash": "next-hash"
  }
}
```

### Payments webhook (placeholder)

External studios can POST to `/games/:studioId/:gameId/payments/:action` to share settlement events. The current implementation simply acknowledges the payload and will evolve into signed webhooks.

### Player lookup

```http
GET /players/123
Authorization: Bearer <sessionToken>
```

Returns a lightweight view of the current player (only if the session belongs to that player) with the latest SPN balance.

## Using the packages in Minty Spins

`SlotGameService` now composes two packages:

- `@mint/gamestudio-api` for session resolution and wallet mutations.
- `@mint/game-internal` for the slot runtime, randomness strategy wiring, rewards settlement, and engine adapters.

Mint-owned games import the internal runtime directly to avoid exposing gameplay logic or randomness to third parties.
