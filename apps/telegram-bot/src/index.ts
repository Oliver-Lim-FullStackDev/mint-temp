/**
 * A Telegram bot demonstrating Star payments functionality.
 * This bot allows users to purchase digital items using Telegram Stars.
 */

import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';
import { MESSAGES } from './config';
import { StoreService } from './store.service';
import fetch from 'node-fetch';
import { PurchaseData, PurchaseApiResponse } from '@mint/types';
import { BotStats } from './types';

// Load environment variables
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const BOT_MINI_APP_URL = process.env.MINT_TELEGRAM_WEBAPP_URL!;
const MINT_API_AUTH_TOKEN = process.env.MINT_API_AUTH_TOKEN!;
const MINT_API_URL = process.env.MINT_API_URL!;

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is required in environment variables');
  process.exit(1);
}

if (!MINT_API_AUTH_TOKEN) {
  console.error('❌ MINT_API_AUTH_TOKEN is required in environment variables');
  process.exit(1);
}

if (!MINT_API_URL) {
  console.error('❌ MINT_API_URL is required in environment variables');
  process.exit(1);
}

// Store statistics
const STATS: BotStats = {
  purchases: {}
};

// Create bot instance
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Get items service instance
const itemsService = StoreService.getInstance();

// Command handlers
async function start(msg: TelegramBot.Message): Promise<void> {
  try {
    console.log('Start command received from user:', msg.from?.id);

    const items = await itemsService.getItems();

    if (items.length === 0) {
      await bot.sendMessage(msg.chat.id, 'Sorry, no items are currently available.');
      return;
    }

    const keyboard: TelegramBot.InlineKeyboardButton[][] = [];
    for (const item of items) {
      if (item.price.stars === 0) {
        // Handle free items
        keyboard.push([{
          text: `${item.title} - FREE`,
          callback_data: item.id
        }]);
      } else {
        keyboard.push([{
          text: `${item.title} - ${item.price.stars} ⭐`,
          callback_data: item.id
        }]);
      }
    }

    const replyMarkup: TelegramBot.InlineKeyboardMarkup = {
      inline_keyboard: keyboard
    };

    await bot.sendMessage(msg.chat.id, MESSAGES.welcome, {
      reply_markup: replyMarkup
    });
  } catch (error) {
    console.error('Error in start command:', error);
    await bot.sendMessage(msg.chat.id, 'Sorry, something went wrong while starting the bot. Please try again later.');
  }
}

async function helpCommand(msg: TelegramBot.Message): Promise<void> {
  try {
    console.log('Help command received from user:', msg.from?.id);
    await bot.sendMessage(msg.chat.id, MESSAGES.help, {
      parse_mode: 'Markdown'
    });
  } catch (error) {
    console.error('Error in help command:', error);
    await bot.sendMessage(msg.chat.id, 'Sorry, something went wrong while showing help.');
  }
}

async function helloCommand(msg: TelegramBot.Message): Promise<void> {
  console.log('Hello command received from user:', msg.from?.id);
  await bot.sendMessage(msg.chat.id, 'Hello! 👋 Welcome to Mint store!');
}

// Pre-checkout handler
async function precheckoutCallback(query: TelegramBot.PreCheckoutQuery): Promise<void> {
  try {
    const payload = query.invoice_payload;
    if (!payload) {
      await bot.answerPreCheckoutQuery(query.id, false, { error_message: 'Invalid payment data.' });
      return;
    }

    // Parse the payload to get the itemId
    let itemId: string;
    try {
      const payloadData = JSON.parse(payload);
      itemId = payloadData.itemId;
    } catch (error) {
      // Fallback for old format (just itemId as string)
      itemId = payload;
    }

    if (itemId && await itemsService.hasItem(itemId)) {
      await bot.answerPreCheckoutQuery(query.id, true);
    } else {
      await bot.answerPreCheckoutQuery(query.id, false, { error_message: 'Item not found or invalid.' });
    }
  } catch (error) {
    console.error('Error in precheckout callback:', error);
    await bot.answerPreCheckoutQuery(query.id, false, { error_message: 'Something went wrong...' });
  }
}

// Successful payment handler
async function successfulPaymentCallback(msg: TelegramBot.Message): Promise<void> {
  try {
    if (!msg.successful_payment) return;

    const payment = msg.successful_payment;
    const payload = payment.invoice_payload;

    if (!payload) {
      await bot.sendMessage(msg.chat.id, 'Error: Invalid payment data.');
      return;
    }

    // Parse the payload to get all required fields
    let purchaseData: PurchaseData;
    try {
      const parsedPayload = JSON.parse(payload);
      // Validate that all required fields are present
      if (!parsedPayload.itemId || !parsedPayload.transactionId || !parsedPayload.username || !parsedPayload.playerId || parsedPayload.amount === undefined) {
        throw new Error('Missing required fields in payload');
      }

      purchaseData = {
        itemId: parsedPayload.itemId,
        transactionId: parsedPayload.transactionId,
        username: parsedPayload.username,
        playerId: parsedPayload.playerId,
        amount: parsedPayload.amount
      };

      console.log(`📦 Parsed purchase data from payload:`, purchaseData);
    } catch (error) {
      // Fallback for old format (just itemId as string)
      console.log(`⚠️ Failed to parse payload as JSON, using fallback format`);
      const itemId = payload;
      const item = await itemsService.getItemById(itemId);
      if (!item) {
        await bot.sendMessage(msg.chat.id, 'Error: Item not found.');
        return;
      }

      purchaseData = {
        itemId: itemId,
        transactionId: `tx_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        username: msg.from?.username || msg.from?.first_name || 'unknown',
        playerId: msg.from?.id?.toString() || 'unknown',
        amount: item.price?.stars || 0
      };
    }

    const userId = msg.from?.id;
    if (!userId) {
      await bot.sendMessage(msg.chat.id, 'Error: Unable to identify user.');
      return;
    }

    // Call the Mint API to process the purchase
    try {
      const apiResponse = await fetch(`${MINT_API_URL}/transaction/purchase/stars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MINT_API_AUTH_TOKEN}`
        },
        body: JSON.stringify({
          itemId: purchaseData.itemId,
          amount: purchaseData.amount,
          transactionId: purchaseData.transactionId,
          username: purchaseData.username,
          playerId: purchaseData.playerId
        })
      });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error(`API call failed with status ${apiResponse.status}:`, errorText);
        await bot.sendMessage(msg.chat.id, 'Error: Failed to process purchase. Please contact support.');
        return;
      }

      const apiResult = await apiResponse.json() as PurchaseApiResponse;
      if (!apiResult.success) {
        console.error('API returned failure:', apiResult);
        await bot.sendMessage(msg.chat.id, 'Error: Purchase processing failed. Please contact support.');
        return;
      }

      console.log(`Successfully processed purchase via API for user ${userId}, purchase ID: ${apiResult.purchaseId}`);
    } catch (apiError) {
      console.error('Error calling Mint API:', apiError);
      await bot.sendMessage(msg.chat.id, 'Error: Failed to process purchase. Please contact support.');
      return;
    }

    // Update statistics
    STATS.purchases[userId.toString()] = (STATS.purchases[userId.toString()] || 0) + 1;

    console.log(
      `Successful payment from user ${userId} ` +
      `for item ${purchaseData.itemId} (charge_id: ${payment.telegram_payment_charge_id})`
    );
  } catch (error) {
    console.error('Error in successful payment callback:', error);
    await bot.sendMessage(msg.chat.id, 'Error processing payment. Please contact support.');
  }
}

// Error handler
function errorHandler(error: Error): void {
  console.error('Bot error:', error);
}

// Main function
async function main(): Promise<void> {
  try {
    console.log('🚀 Starting Telegram bot...');

    // Test API connection on startup
    try {
      const items = await itemsService.getItems();
      console.log(`✅ Successfully connected to API. Found ${items.length} items.`);
    } catch (error) {
      console.error('⚠️ Warning: Could not connect to API on startup:', error);
      console.log('Bot will continue but may not function properly until API is available.');
    }

    // Add handlers (equivalent to Python's application.add_handler)
    // /start command handler
    bot.onText(/\/start/, async (msg) => {
      try {
        console.log('Start command received from user:', msg.from?.id);
        // First send image
        await bot.sendPhoto(
          msg.chat.id,
          `${process.env.MINT_TELEGRAM_WEBAPP_HOST}/assets/telegram/welcome-cover.png`
        );
        // Then send message with buttons
        await bot.sendMessage(
          msg.chat.id,
          `Live now on Telegram! 🎉\n
Play for free, earn XP, and lock in your future $MINT allocation (coming soon). Bigger bonuses await when our full crypto casino launches on the web.`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: 'Play now for FREE 🎰',
                    web_app: { url: process.env.MINT_TELEGRAM_WEBAPP_HOMEPAGE! }
                  }
                ],
                [
                  {
                    text: 'Follow on X',
                    url: 'https://x.com/MintDotIO'
                  }
                ],
                [
                  {
                    text: 'Announcements',
                    url: 'https://t.me/MintDotIO'
                  }
                ]
              ]
            }
          }
        );
      } catch (error) {
        console.error('Error in /start command:', error);
        await bot.sendMessage(
          msg.chat.id,
          'Sorry, something went wrong while starting the bot. Please try again later.'
        );
      }
    });

    //bot.onText(/\/help/, helpCommand);
    //bot.onText(/\/hello/, helloCommand);

    // Callback query handler
    //bot.on('callback_query', buttonHandler);

    // Pre-checkout handler
    bot.on('pre_checkout_query', precheckoutCallback);

    // Successful payment handler
    bot.on('message', (msg) => {
      if (msg.successful_payment) {
        successfulPaymentCallback(msg);
      }
    });

    // Error handler
    bot.on('error', errorHandler);

    // Start the bot
    console.log('✅ Bot started successfully');
    console.log('📝 Commands registered: /start, /help, /hello');
    // Display bot url
    console.log(`🔗 Bot URL: ${BOT_MINI_APP_URL}`);
    console.log('🎯 Bot is polling for updates...');

  } catch (error) {
    console.error('❌ Error starting bot:', error);
    process.exit(1);
  }
}

// Start the bot
main().catch(console.error);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down bot...');
  bot.stopPolling();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Shutting down bot...');
  bot.stopPolling();
  process.exit(0);
});
