import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { Api } from 'telegram/tl';

@Injectable()
export class StarsConversionService implements OnModuleDestroy {
  private readonly logger = new Logger(StarsConversionService.name);
  private starsRateCache: { rate: number; timestamp: number } | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private telegramClient: TelegramClient | null = null;
  private isConnecting = false;

  constructor(private readonly configService: ConfigService) {}

  /**
   * Convert USD to Stars
   */
  async convertUsdToStars(usdAmount: number): Promise<number> {
    try {
      const starsRate = await this.getStarsRate(); // Get USD per star rate
      const starsAmount = Math.ceil(usdAmount / starsRate);

      this.logger.debug(`Converted ${usdAmount} USD to ${starsAmount} stars (rate: $${starsRate} per star)`);
      return starsAmount;
    } catch (error) {
      this.logger.error('Error converting USD to Stars:', error);
      throw new Error('Failed to convert USD to Stars');
    }
  }

  /**
   * Convert Stars to USD
   */
  async convertStarsToUsd(starsAmount: number): Promise<number> {
    try {
      const starsRate = await this.getStarsRate(); // Get USD per star rate
      const usdAmount = starsAmount * starsRate;

      this.logger.debug(`Converted ${starsAmount} stars to ${usdAmount} USD (rate: $${starsRate} per star)`);
      return Math.round(usdAmount * 100) / 100; // Round to 2 decimal places
    } catch (error) {
      this.logger.error('Error converting Stars to USD:', error);
      throw new Error('Failed to convert Stars to USD');
    }
  }

  /**
   * Get the current stars rate from Telegram (raw stars_usd_sell_rate_x1000 value)
   */
  async getStarsRateX1000(): Promise<number> {
    try {
      // Check cache first
      if (this.starsRateCache && Date.now() - this.starsRateCache.timestamp < this.CACHE_DURATION) {
        return this.starsRateCache.rate;
      }

      // Fetch from Telegram API
      const rate = await this.fetchStarsRateFromTelegram();

      // Cache the result
      this.starsRateCache = {
        rate,
        timestamp: Date.now()
      };

      this.logger.log(`Stars rate updated: ${rate} cents per 1000 stars`);
      return rate;
    } catch (error) {
      this.logger.error('Failed to get stars rate:', error);

      // Return cached rate if available, otherwise fallback
      if (this.starsRateCache) {
        this.logger.warn('Using cached stars rate due to API error');
        return this.starsRateCache.rate;
      }

      // Fallback to a default rate (1410 means $14.10 per 1000 stars = $0.0141 per star)
      const fallbackRate = 1410; // $14.10 per 1000 stars = 1410 cents per 1000 stars
      this.logger.warn(`Using fallback stars rate: ${fallbackRate} cents per 1000 stars`);
      return fallbackRate;
    }
  }

  /**
   * Get the current stars rate from Telegram (USD per star)
   */
  async getStarsRate(): Promise<number> {
    const starsRateX1000 = await this.getStarsRateX1000();
    return starsRateX1000 / 100000; // Convert from cents per 1000 stars to USD per star
  }

  /**
   * Get or create a Telegram client instance
   */
  private async getTelegramClient(): Promise<TelegramClient> {
    if (this.telegramClient && this.telegramClient.connected) {
      return this.telegramClient;
    }

    // Prevent multiple simultaneous connection attempts
    if (this.isConnecting) {
      // Wait for the ongoing connection attempt
      while (this.isConnecting) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (this.telegramClient && this.telegramClient.connected) {
        return this.telegramClient;
      }
    }

    this.isConnecting = true;

    try {
      const apiId = process.env.TELEGRAM_API_ID;
      const apiHash = process.env.TELEGRAM_API_HASH || '';
      const sessionString = process.env.TELEGRAM_SESSION_STRING || '';

      if (!apiId || !apiHash) {
        throw new Error('Telegram API credentials not configured');
      }

      this.telegramClient = new TelegramClient(
        new StringSession(sessionString),
        parseInt(apiId),
        apiHash,
        {
          connectionRetries: 5,
          timeout: 10000, // 10 second timeout
          retryDelay: 1000, // 1 second delay between retries
          useWSS: false, // Disable WebSocket to avoid update loop issues
          floodSleepThreshold: 60, // Flood sleep threshold
        }
      );

      this.logger.log('Connecting to Telegram...');
      await this.telegramClient.start({
        phoneNumber: async () => '',
        password: async () => '',
        phoneCode: async () => '',
        onError: (err) => this.logger.error('Telegram client error:', err),
      });

      this.logger.log('Connected successfully!');

      // Get current user info
      const me = await this.telegramClient.getMe();
      this.logger.log(`Logged in as: ${me.firstName} ${me.lastName} (@${me.username})`);

      return this.telegramClient;
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * Fetch stars rate from Telegram using the gramjs library
   */
  private async fetchStarsRateFromTelegram(): Promise<number> {
    try {
      const client = await this.getTelegramClient();

      // Call help.GetAppConfig to get the stars rate
      this.logger.log('Fetching stars rate...');
      const result = await client.invoke(new Api.help.GetAppConfig({}));

      // Extract the stars_usd_sell_rate_x1000 value
      if (!('config' in result)) {
        throw new Error('Config not available in Telegram response');
      }
      const configValues = (result as any).config.value;
      const starsRate = configValues.find((item: any) => item.key === 'stars_usd_sell_rate_x1000');

      if (!starsRate) {
        throw new Error('Stars rate not found in Telegram response');
      }

      const rate = starsRate.value.value; // Keep the raw x1000 format value
      this.logger.log(`Fetched stars rate from Telegram: ${rate} cents per 1000 stars`);
      return rate;
    } catch (error) {
      this.logger.error('Error fetching stars rate from Telegram:', error);

      // Fallback to mock rate if Telegram API fails
      const fallbackRate = 1410; // $14.10 per 1000 stars = 1410 cents per 1000 stars
      this.logger.warn(`Using fallback stars rate: ${fallbackRate} cents per 1000 stars`);
      return fallbackRate;
    }
  }

  /**
   * Clear the cache (useful for testing or manual refresh)
   */
  clearCache(): void {
    this.starsRateCache = null;
    this.logger.log('Stars rate cache cleared');
  }

  /**
   * Get cache status for debugging
   */
  getCacheStatus(): { hasCache: boolean; age: number | null } {
    if (!this.starsRateCache) {
      return { hasCache: false, age: null };
    }

    return {
      hasCache: true,
      age: Date.now() - this.starsRateCache.timestamp
    };
  }

  /**
   * Cleanup method to properly disconnect the Telegram client
   */
  async onModuleDestroy(): Promise<void> {
    if (this.telegramClient && this.telegramClient.connected) {
      try {
        await this.telegramClient.disconnect();
        this.logger.log('Telegram client disconnected on module destroy');
      } catch (error) {
        this.logger.error('Error disconnecting Telegram client:', error);
      }
    }
  }
}
