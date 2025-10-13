# HTML5 Slot Machine

![Build and Deploy Status](https://github.com/johakr/html5-slot-machine/actions/workflows/deploy.yml/badge.svg) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

This is a modern proof of concept casino slot machine game, built using only vanilla HTML, CSS and JavaScript.
No Flash or Frameworks required. Allowing for an amazing low bundle size and blazing fast performance.

Built using the _Web Animations API_.

## Features

- Fully responsive for great UX on mobile, web & fullscreen mode.
- Autoplay functionality, which keeps running even if the game window is in background.
- Credit system with configurable initial balance and spin costs.
- Win detection for horizontal and diagonal patterns.
- Special symbol bonuses and jackpot system.
- Configurable payout table with multiple winning combinations.
- Symbol probability weighting for realistic gameplay.
- Visual win animations highlighting winning combinations.

## Installation, Build & Deployment

1. Clone repository
2. Run `npm install`
   - _Development_: run `npm start` and go to `http://localhost:8080`
   - _Production_: run `npm run build` and serve from `/dist`

## Configuration

For configuration options see `config` object in [index.js](https://github.com/johakr/html5-slot-machine/blob/master/src/js/index.js)

### Basic Configuration

| Property      | Description                                                                                                                            | Default   |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `inverted`    | Controls visual spinning direction of reels. If false, reels will spin from bottom to top. If true, reels will spin from top to bottom | false     |
| `onSpinStart` | Callback function invoked when spin starts with symbols pattern array `(symbols) => void`.                                             | undefined |
| `onSpinEnd`   | Callback function invoked when spin ends with symbols pattern array `(symbols) => void`.                                               | undefined |

### Game Configuration

The `gameConfig` object allows for extensive customization of the slot machine behavior:

| Property         | Description                                                 | Default |
| ---------------- | ----------------------------------------------------------- | ------- |
| `initialSpins`   | Number of spins available at the start                      | 20      |
| `initialCredits` | Starting credit balance                                     | 100     |
| `spinCost`       | Cost per spin (0 for free spins)                            | 0       |
| `symbolWeights`  | Probability weights for each symbol                         | \*      |
| `payouts`        | Configuration for all winning combinations and their values | \*      |

## Payout System

The payout system evaluates the following win types:

### Horizontal Matches

Matching symbols in a horizontal row. The payout increases with more symbols:

```
3 in a row: 10 credits
4 in a row: 25 credits
5 in a row: 100 credits
```

### Diagonal Matches

Matching symbols in a diagonal line (both directions). The payout increases with more symbols:

```
3 in a diagonal: 15 credits
4 in a diagonal: 30 credits
5 in a diagonal: 150 credits
```

### Special Symbol Counts

Some symbols have special payouts when they appear anywhere on the grid:

```
Darth Vader (1): 5 credits
Darth Vader (2): 15 credits
Darth Vader (3): 50 credits
```

### Jackpot

A special high-value payout when specific conditions are met:

```
5 Death Stars: 1000 credits
```

## Probability Control

The slot machine includes a sophisticated probability control system that allows:

- Symbol weighting to control the frequency of each symbol
- Pattern probability control to adjust the likelihood of winning combinations
- Configurable jackpot frequency
- Testing mode to force jackpot (press 'J' key)

## Credits

Icons are created by [KPD Media](https://dribbble.com/shots/3517520-Star-Wars) and can be used for private and commercial purposes with no attribution required ([check license here](https://iconstore.co/icons/10-star-wars-icons/)).
