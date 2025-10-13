import { Injectable, Logger } from '@nestjs/common';
import { Omniston, SettlementMethod, GaslessSettlement, Blockchain } from '@ston-fi/omniston-sdk';

export interface TonPriceData {
  usd: number;
  ton: number;
  lastUpdated: string;
}

interface StonFiQuote {
  askUnits?: string;
  askAmount?: {
    units: number;
  };
}

const STON_FI_API_URL = process.env.OMNISTON_API_URL;

@Injectable()
export class TonConversionService {
  private readonly logger = new Logger(TonConversionService.name);
  private cachedPrice: TonPriceData | null = null;
  private lastFetchTime = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private omniston: Omniston;

  constructor() {
    this.omniston = new Omniston({
      apiUrl: STON_FI_API_URL || 'wss://omni-ws.ston.fi',
    });
  }

  /**
   * Convert USD to TON
   */
  async convertUsdToTon(usdAmount: number): Promise<number> {
    try {
      const tonPrice = await this.getTonPrice();
      const tonAmount = usdAmount / tonPrice;

      this.logger.debug(`Converted ${usdAmount} USD to ${tonAmount} TON (rate: ${tonPrice})`);
      return tonAmount;
    } catch (error) {
      this.logger.error('Error converting USD to TON:', error);
      throw new Error('Failed to convert USD to TON');
    }
  }

  /**
   * Convert TON to USD
   */
  async convertTonToUsd(tonAmount: number): Promise<number> {
    try {
      const tonPrice = await this.getTonPrice();
      const usdAmount = tonAmount * tonPrice;

      this.logger.debug(`Converted ${tonAmount} TON to ${usdAmount} USD (rate: ${tonPrice})`);
      return Math.round(usdAmount * 100) / 100; // Round to 2 decimal places
    } catch (error) {
      this.logger.error('Error converting TON to USD:', error);
      throw new Error('Failed to convert TON to USD');
    }
  }

  /**
   * Get current TON price in USD using STON.fi
   * Uses STON.fi API for real-time pricing
   */
  async getTonPrice(): Promise<number> {
    const now = Date.now();

    // Return cached price if still valid
    if (this.cachedPrice && now - this.lastFetchTime < this.CACHE_DURATION) {
      return this.cachedPrice.usd;
    }

    try {
      // Use a fixed USD amount (e.g., $100) to get TON price from STON.fi
      const usdAmount = 100;
      const tonAmount = await this.getTonPriceFromStonFiDirect(usdAmount);
      const tonPrice = usdAmount / tonAmount;

      // Cache the result
      this.cachedPrice = {
        usd: tonPrice,
        ton: 1,
        lastUpdated: new Date().toISOString(),
      };
      this.lastFetchTime = now;

      this.logger.log(`TON price updated: $${tonPrice}`);
      return tonPrice;
    } catch (error) {
      this.logger.error('Failed to fetch TON price from STON.fi:', error);

      // Return cached price if available, otherwise use fallback
      if (this.cachedPrice) {
        this.logger.warn('Using cached TON price due to API error');
        return this.cachedPrice.usd;
      }

      // Fallback to a reasonable default TON price
      this.logger.warn('Using fallback TON price of $2.50');
      const fallbackPrice = 2.50;

      this.cachedPrice = {
        usd: fallbackPrice,
        ton: 1,
        lastUpdated: new Date().toISOString(),
      };
      this.lastFetchTime = now;

      return fallbackPrice;
    }
  }

  /**
   * Get TON amount for a given USD amount using STON.fi (with fallback)
   */
  async getTonPriceFromStonFi(usdAmount: number): Promise<number> {
    const USDT_ADDRESS = process.env.USDT_ADDRESS;
    const TON_ADDRESS = process.env.TON_ADDRESS;

    if (!USDT_ADDRESS) {
      this.logger.warn('USDT_ADDRESS environment variable is not configured, using fallback calculation');
      // Fallback to simple calculation using cached price
      const tonPriceUsd = await this.getTonPrice();
      return usdAmount / tonPriceUsd;
    }

    if (!TON_ADDRESS) {
      this.logger.warn('TON_ADDRESS environment variable is not configured, using fallback calculation');
      // Fallback to simple calculation using cached price
      const tonPriceUsd = await this.getTonPrice();
      return usdAmount / tonPriceUsd;
    }

    return this.getTonPriceFromStonFiDirect(usdAmount);
  }

  /**
   * Get TON amount for a given USD amount using STON.fi (direct, no fallback)
   */
  async getTonPriceFromStonFiDirect(usdAmount: number): Promise<number> {
    const USDT_ADDRESS = process.env.USDT_ADDRESS;
    const TON_ADDRESS = process.env.TON_ADDRESS;

    if (!USDT_ADDRESS || !TON_ADDRESS) {
      throw new Error('STON.fi environment variables not configured');
    }

    try {
      // Convert USD to USDT units (6 decimals)
      const usdtAmount = (usdAmount * 1000000).toString();

      // Request quote for USDT to TON swap
      const quoteRequest = {
        settlementMethods: [SettlementMethod.SETTLEMENT_METHOD_SWAP],
        askAssetAddress: {
          blockchain: Blockchain.TON,
          address: TON_ADDRESS, // We want TON
        },
        bidAssetAddress: {
          blockchain: Blockchain.TON,
          address: USDT_ADDRESS, // We're paying with USDT
        },
        amount: {
          bidUnits: usdtAmount, // Amount of USDT to pay
        },
        settlementParams: {
          maxPriceSlippageBps: 100, // 1% slippage
          gaslessSettlement: GaslessSettlement.GASLESS_SETTLEMENT_POSSIBLE,
          maxOutgoingMessages: 4,
        },
      };

      // Get quote from STON.fi
      const quote = await new Promise<StonFiQuote>((resolve, reject) => {
        const subscription = this.omniston.requestForQuote(quoteRequest).subscribe({
          next: (event) => {
            if (event.type === 'quoteUpdated') {
              subscription.unsubscribe();
              resolve(event.quote);
            } else if (event.type === 'noQuote') {
              subscription.unsubscribe();
              reject(new Error('No quote available'));
            }
          },
          error: (error) => {
            subscription.unsubscribe();
            reject(error);
          }
        });
      });

      // Extract TON amount from quote
      let tonAmount: number;

      if (quote.askUnits) {
        // STON.fi returns askUnits as a string
        const askUnitsValue = parseInt(quote.askUnits);
        if (isNaN(askUnitsValue) || askUnitsValue <= 0) {
          throw new Error('Invalid askUnits value from STON.fi');
        }
        tonAmount = askUnitsValue / 1000000000; // Convert from nano to TON
      } else if (quote.askAmount && quote.askAmount.units) {
        // Fallback to standard structure
        const unitsValue = quote.askAmount.units;
        if (isNaN(unitsValue) || unitsValue <= 0) {
          throw new Error('Invalid askAmount.units value from STON.fi');
        }
        tonAmount = unitsValue / 1000000000;
      } else {
        throw new Error('Unknown quote structure from STON.fi');
      }

      // Validate the final TON amount
      if (isNaN(tonAmount) || tonAmount <= 0) {
        throw new Error('Invalid TON amount calculated from STON.fi quote');
      }

      return tonAmount;
    } catch (error) {
      this.logger.error('Error getting TON price from STON.fi:', error);
      throw error;
    }
  }
}
