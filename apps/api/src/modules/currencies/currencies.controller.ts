import { Controller, Get, Param, Query } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { GetCurrenciesQueryDto } from './currencies.dto';
import { Currency, CurrenciesResponse } from './currencies.types';

/**
 * Controller for currency information endpoints
 */
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  /**
   * Get all currencies, optionally filtered by type
   *
   * @example GET /currencies
   * @example GET /currencies?type=crypto
   * @example GET /currencies?type=fiat&enabled=false
   */
  @Get()
  findAll(@Query() query: GetCurrenciesQueryDto): Currency[] {
    const enabledOnly = query.enabled !== false;
    return this.currenciesService.findAll(query.type, enabledOnly);
  }

  /**
   * Get currencies categorized by type (crypto and fiat)
   *
   * @example GET /currencies/categorized
   * @returns { crypto: Currency[], fiat: Currency[] }
   */
  @Get('categorized')
  findAllCategorized(@Query('enabled') enabled?: boolean): CurrenciesResponse {
    const enabledOnly = enabled !== false;
    return this.currenciesService.findAllCategorized(enabledOnly);
  }

  /**
   * Get all crypto currencies
   *
   * @example GET /currencies/crypto
   */
  @Get('crypto')
  findAllCrypto(@Query('enabled') enabled?: boolean): Currency[] {
    const enabledOnly = enabled !== false;
    return this.currenciesService.findAllCrypto(enabledOnly);
  }

  /**
   * Get all fiat currencies
   *
   * @example GET /currencies/fiat
   */
  @Get('fiat')
  findAllFiat(@Query('enabled') enabled?: boolean): Currency[] {
    const enabledOnly = enabled !== false;
    return this.currenciesService.findAllFiat(enabledOnly);
  }

  /**
   * Get a specific currency by code
   *
   * @example GET /currencies/BTC
   * @example GET /currencies/USD
   */
  @Get(':code')
  findByCode(@Param('code') code: string): Currency | null {
    return this.currenciesService.findByCode(code.toUpperCase());
  }
}

