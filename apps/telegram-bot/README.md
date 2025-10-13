# MINT Telegram Bot

A TypeScript Telegram bot for the MINT platform that provides digital item purchases using Telegram Stars and a web app interface for users.

## Features

- **Mint Store**: Purchase virtual items using Telegram Stars
- **Payment Processing**: Secure payment handling with Telegram's native payment system
- **Web App Integration**: Seamless integration with MINT web application
- **API Integration**: Dynamic item fetching from MINT API with caching
- **Statistics Tracking**: Monitor purchases
- **TypeScript**: Full TypeScript support with type safety

## Prerequisites

- Node.js >= 22.0.0
- pnpm
- A Telegram account
- ngrok (for local development)
- MINT API server running

## Setup Guide

### 1. Create a Telegram Bot

1. Open Telegram and search for "@BotFather"
2. Start a chat with BotFather
3. Send the command `/newbot`
4. Follow the instructions to create your bot:
   - Choose a name for your bot
   - Choose a username (must end in 'bot')
5. Save the bot token provided by BotFather

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Required: Your bot token from BotFather
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Required: MINT API URL for fetching items
MINT_API_URL=http://localhost:3001

# Optional: For web app integration
MINT_TELEGRAM_WEBAPP_URL=https://your-webapp-url.com

# Optional: For webhook setup (if using webhooks instead of polling)
RAILWAY_PUBLIC_DOMAIN=https://your-domain.com
TELEGRAM_BOT_WEBHOOK_SECRET=your_webhook_secret
```

### 4. Install Dependencies

```bash
pnpm install
```

### 5. Running the Bot

#### Development Mode
```bash
pnpm run dev
```

#### Production Mode
```bash
pnpm run build
pnpm start
```

## Available Commands

### Core Commands
- `/start` - Shows available items for purchase with inline keyboard
- `/help` - Displays help information and usage instructions
- `/hello` - Simple greeting command

### Web App Commands
- `/update` - Updates the bot's menu button and verifies functionality

## Mint Store Items

### Item Management

The bot now fetches items dynamically from the MINT API instead of using static configuration. Items are managed through the API and cached for 5 minutes to improve performance.

#### ItemsService Features
- **Automatic Caching**: Items are cached for 5 minutes to reduce API calls
- **Error Handling**: Falls back to cached items if API is unavailable
- **Singleton Pattern**: Ensures single instance across the application
- **Type Safety**: Full TypeScript support with Item interface

#### Item Schema
Items follow the standard MINT Item interface:
```typescript
interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
}
```

## Payment Flow

1. **User sends `/start`** - Bot fetches items from API and shows available items
2. **User clicks an item** - Bot sends payment invoice
3. **User completes payment** - Bot provides secret code

## Local Development

### Using ngrok for Web App Testing

1. Start your local app:
   ```bash
   pnpm run dev
   ```

2. Set up ngrok for your local HTTPS app:
   ```bash
   # Kill any existing ngrok processes
   pkill ngrok

   # Start ngrok with the HTTPS URL
   ngrok http https://localhost:3000
   ```

3. Configure the web app URL in BotFather:
   - Go to @BotFather → `/mybots` → Select your bot
   - Bot Settings → Configure Mini App → Edit Mini App URL
   - Use: `https://your-ngrok-url.ngrok-free.app/tgma`

## Telegram Testnet

### Running TGMA Locally outside Telegram

To run TG apps locally outside Telegram:
1. Run app locally and open browser Dev Tools
2. Open the DevTools' Application tab
3. Under the Sidebar > Session Storage, add a new Session variable `env-mocked` and value `1`.

**Note:** Deployments for TG Testnet Apps have a Vercel Deployment Protection via Secret Key to skip Authentication for previews. See:
[Vercel deployment-protection](https://vercel.com/mintdotio/mint-webapp/settings/deployment-protection)

## Architecture

### File Structure
```
src/
├── index.ts          # Main bot logic and handlers
├── config.ts         # Messages configuration
├── items.service.ts  # ItemsService for API integration
└── types/            # TypeScript type definitions
```

### Key Components
- **Bot Instance**: Uses `node-telegram-bot-api` for Telegram integration
- **ItemsService**: Singleton service for fetching and caching items from API
- **Command Handlers**: Async functions for each bot command
- **Payment Processing**: Native Telegram Stars integration
- **Error Handling**: Comprehensive error catching and logging
- **Statistics**: Purchase tracking

### ItemsService Architecture
The `ItemsService` provides:
- **Singleton Pattern**: Single instance across the application
- **Caching**: 5-minute cache duration for API responses
- **Fallback**: Uses cached items if API is unavailable
- **Type Safety**: Full TypeScript support with Item interface

## Security

- The `TELEGRAM_BOT_TOKEN` should be kept secure and never exposed publicly
- The `MINT_API_URL` should point to a secure API endpoint
- All payment processing uses Telegram's secure API
- Webhook requests are validated using the webhook secret
- The web app URL must be HTTPS

## Debugging

### Common Issues

1. **Bot not responding to commands**
   - Check if the bot token is correct
   - Verify the bot is running and polling for updates
   - Check console logs for errors

2. **Items not loading**
   - Verify `MINT_API_URL` is set correctly
   - Check if the MINT API server is running
   - Review console logs for API connection errors

3. **Payment issues**
   - Ensure Telegram Stars is enabled for your bot
   - Verify item prices are in the correct format
   - Check if the bot has payment permissions

### Debug Commands

- Check webhook status: `https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getWebhookInfo`
- Monitor console output for detailed error logs
- Use `/update` command to test bot functionality

### Logging

The bot provides detailed logging for:
- Command execution
- API item fetching and caching
- Payment processing
- Error handling
- User interactions

## Deployment

### Railway Deployment
1. Connect your repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main branch

### Vercel Deployment
1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy with automatic HTTPS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the MINT platform and follows the same licensing terms.

## Support

For issues and questions:
- Check the debugging section above
- Review console logs for error details
- Contact the development team


