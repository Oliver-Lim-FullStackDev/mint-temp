import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { TonConversionService } from 'src/modules/conversion/ton-conversion.service';
import { StarsConversionService } from 'src/modules/conversion/stars-conversion.service';
import {
  ExchangeRequest,
  ExchangeResponse,
  ExchangeRate,
  CurrencyConversion,
} from './exchange.types';

@Injectable()
export class ExchangeService {
  private readonly logger = new Logger(ExchangeService.name);

  // In-memory storage for demo (replace with your database)
  private exchanges: Map<string, ExchangeResponse> = new Map();

  constructor(
    private readonly tonConversionService: TonConversionService,
    private readonly starsConversionService: StarsConversionService,
  ) {}

  /**
   * Create a currency exchange
   */
  async createExchange(request: ExchangeRequest): Promise<ExchangeResponse> {
    try {
      this.logger.log(`Creating exchange: ${request.amount} ${request.fromCurrency} -> ${request.toCurrency}`);

      // Validate currency pair
      if (request.fromCurrency === request.toCurrency) {
        throw new BadRequestException('From and to currencies cannot be the same');
      }

      // Get exchange rate
      const rate = await this.getExchangeRate(request.fromCurrency, request.toCurrency);

      // Calculate result
      const result = request.amount * rate.rate;

      const exchange: ExchangeResponse = {
        exchangeId: `exchange_${uuidv4()}`,
        userId: request.userId,
        amount: request.amount,
        fromCurrency: request.fromCurrency,
        toCurrency: request.toCurrency,
        rate: rate.rate,
        result,
        status: 'pending',
        provider: rate.provider,
        reference: request.reference,
        createdAt: new Date().toISOString(),
      };

      this.exchanges.set(exchange.exchangeId, exchange);

      // Process the exchange (simulate async processing)
      this.processExchange(exchange.exchangeId);

      this.logger.log(`✅ Exchange created: ${exchange.exchangeId}`);

      return exchange;
    } catch (error) {
      this.logger.error('Error creating exchange:', error);
      throw error;
    }
  }

  /**
   * Get exchange rate between two currencies
   */
  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<ExchangeRate> {
    try {
      let rate: number;
      let provider: string;

      // Handle different currency pairs
      if (fromCurrency === 'USD' && toCurrency === 'TON') {
        const tonPrice = await this.tonConversionService.getTonPrice();
        rate = 1 / tonPrice; // USD to TON rate
        provider = 'ston.fi';
      } else if (fromCurrency === 'USD' && toCurrency === 'STARS') {
        const starsRate = await this.starsConversionService.getStarsRate();
        rate = 1 / starsRate; // USD to STARS rate
        provider = 'telegram';
      } else if (fromCurrency === 'TON' && toCurrency === 'USD') {
        const tonPrice = await this.tonConversionService.getTonPrice();
        rate = tonPrice; // TON to USD rate
        provider = 'ston.fi';
      } else if (fromCurrency === 'STARS' && toCurrency === 'USD') {
        const starsRate = await this.starsConversionService.getStarsRate();
        rate = starsRate; // STARS to USD rate
        provider = 'telegram';
      } else if (fromCurrency === 'TON' && toCurrency === 'STARS') {
        // Convert TON to USD first, then USD to STARS
        const tonPrice = await this.tonConversionService.getTonPrice();
        const starsRate = await this.starsConversionService.getStarsRate();
        rate = tonPrice / starsRate; // TON to STARS rate
        provider = 'ston.fi + telegram';
      } else if (fromCurrency === 'STARS' && toCurrency === 'TON') {
        // Convert STARS to USD first, then USD to TON
        const starsRate = await this.starsConversionService.getStarsRate();
        const tonPrice = await this.tonConversionService.getTonPrice();
        rate = starsRate / tonPrice; // STARS to TON rate
        provider = 'telegram + ston.fi';
      } else {
        throw new BadRequestException(`Exchange from ${fromCurrency} to ${toCurrency} not supported`);
      }

      return {
        fromCurrency,
        toCurrency,
        rate,
        lastUpdated: new Date().toISOString(),
        provider,
      };
    } catch (error) {
      this.logger.error(`Error getting exchange rate from ${fromCurrency} to ${toCurrency}:`, error);
      throw error;
    }
  }

  /**
   * Convert currency (utility method)
   */
  async convertCurrency(amount: number, from: string, to: string): Promise<CurrencyConversion> {
    const rate = await this.getExchangeRate(from, to);
    const result = amount * rate.rate;

    return {
      from: { currency: from, amount },
      to: { currency: to, amount: result },
      rate: this.formatRate(from, to, rate.rate),
    };
  }

  /**
   * Get exchange by ID
   */
  async getExchange(exchangeId: string): Promise<ExchangeResponse> {
    const exchange = this.exchanges.get(exchangeId);
    if (!exchange) {
      throw new BadRequestException('Exchange not found');
    }
    return exchange;
  }

  /**
   * List user exchanges
   */
  async listExchanges(userId: string, page: number = 1, perPage: number = 10): Promise<{
    exchanges: ExchangeResponse[];
    total: number;
    page: number;
    perPage: number;
  }> {
    const allExchanges = Array.from(this.exchanges.values())
      .filter(exchange => exchange.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedExchanges = allExchanges.slice(startIndex, endIndex);

    return {
      exchanges: paginatedExchanges,
      total: allExchanges.length,
      page,
      perPage,
    };
  }

  /**
   * Process exchange (simulate async processing)
   */
  private async processExchange(exchangeId: string): Promise<void> {
    try {
      const exchange = this.exchanges.get(exchangeId);
      if (!exchange) return;

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update status to completed
      exchange.status = 'completed';
      exchange.completedAt = new Date().toISOString();

      this.exchanges.set(exchangeId, exchange);

      this.logger.log(`✅ Exchange ${exchangeId} completed`);
    } catch (error) {
      this.logger.error(`Error processing exchange ${exchangeId}:`, error);

      const exchange = this.exchanges.get(exchangeId);
      if (exchange) {
        exchange.status = 'failed';
        this.exchanges.set(exchangeId, exchange);
      }
    }
  }

  /**
   * Format rate for response
   */
  private formatRate(from: string, to: string, rate: number): any {
    if (from === 'USD' && to === 'TON') {
      return { usdPerTon: 1 / rate };
    } else if (from === 'USD' && to === 'STARS') {
      return { usdPerStar: 1 / rate };
    }
    return { rate };
  }
}
