export interface Messages {
  welcome: string;
  help: string;
}

export const MESSAGES: Messages = {
  welcome: `Welcome to Mint Store! 🎉\nSelect an item to purchase with Telegram Stars:`,
  help: `🛍 *Mint Store Bot Help*\n\nCommands:\n/start - View available items\n/help - Show this help message\n\nHow to use:\n1. Use /start to see available items\n2. Click on an item to purchase\n3. Pay with Stars\n4. Receive your secret code`,
};
