import { Injectable } from '@nestjs/common';
import { CURRENCIES_DATA } from './currencies.data';
import { Currency, CurrencyType, CurrenciesResponse } from './currencies.types';

/**
 * Service for managing currency information
 */
@Injectable()
export class CurrenciesService {
  /**
   * Get all currencies, optionally filtered by type
   */
  findAll(type?: CurrencyType, enabledOnly = true): Currency[] {
    let currencies = [...CURRENCIES_DATA];

    // Filter by enabled status
    if (enabledOnly) {
      currencies = currencies.filter((currency) => currency.enabled);
    }

    // Filter by type if specified
    if (type) {
      currencies = currencies.filter((currency) => currency.type === type);
    }

    // Sort by display order
    return currencies.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  /**
   * Get currencies categorized by type
   */
  findAllCategorized(enabledOnly = true): CurrenciesResponse {
    const allCurrencies = this.findAll(undefined, enabledOnly);

    return {
      crypto: allCurrencies.filter((currency) => currency.type === CurrencyType.CRYPTO),
      fiat: allCurrencies.filter((currency) => currency.type === CurrencyType.FIAT),
    };
  }

  /**
   * Get a specific currency by code
   */
  findByCode(code: string): Currency | null {
    return CURRENCIES_DATA.find((currency) => currency.code === code) || null;
  }

  /**
   * Get multiple currencies by codes
   */
  findByCodes(codes: string[]): Currency[] {
    return CURRENCIES_DATA.filter((currency) => codes.includes(currency.code));
  }

  /**
   * Check if a currency code is valid
   */
  isValidCurrency(code: string): boolean {
    return CURRENCIES_DATA.some((currency) => currency.code === code);
  }

  /**
   * Get all crypto currencies
   */
  findAllCrypto(enabledOnly = true): Currency[] {
    return this.findAll(CurrencyType.CRYPTO, enabledOnly);
  }

  /**
   * Get all fiat currencies
   */
  findAllFiat(enabledOnly = true): Currency[] {
    return this.findAll(CurrencyType.FIAT, enabledOnly);
  }
}

