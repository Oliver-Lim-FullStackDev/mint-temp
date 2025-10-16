import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import {
  CreateExchangeDto,
  GetExchangeRateDto,
  ConvertCurrencyDto,
  GetExchangeHistoryDto,
} from './exchange.dto';

@Controller('payments/exchange')
export class ExchangeController {
  private readonly logger = new Logger(ExchangeController.name);

  constructor(private readonly exchangeService: ExchangeService) {}

  /**
   * Create a currency exchange
   */
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createExchange(@Body() dto: CreateExchangeDto) {
    this.logger.log(`Creating exchange: ${dto.amount} ${dto.fromCurrency} -> ${dto.toCurrency}`);

    const exchange = await this.exchangeService.createExchange({
      userId: dto.userId,
      amount: dto.amount,
      fromCurrency: dto.fromCurrency,
      toCurrency: dto.toCurrency,
      reference: dto.reference,
    });

    return {
      success: true,
      message: 'Exchange created successfully',
      data: exchange,
    };
  }

  /**
   * Get exchange rate between two currencies
   */
  @Get('rate/:fromCurrency/:toCurrency')
  async getExchangeRate(@Param() params: GetExchangeRateDto) {
    this.logger.log(`Getting exchange rate: ${params.fromCurrency} -> ${params.toCurrency}`);

    const rate = await this.exchangeService.getExchangeRate(params.fromCurrency, params.toCurrency);

    return {
      success: true,
      message: 'Exchange rate retrieved successfully',
      data: rate,
    };
  }

  /**
   * Convert currency (utility endpoint)
   */
  @Get('convert')
  async convertCurrency(@Query() query: ConvertCurrencyDto) {
    const numericAmount = parseFloat(query.amount);

    if (isNaN(numericAmount) || numericAmount < 0) {
      throw new BadRequestException('Invalid amount provided');
    }

    this.logger.log(`Converting: ${numericAmount} ${query.from} -> ${query.to}`);

    const conversion = await this.exchangeService.convertCurrency(numericAmount, query.from, query.to);

    return {
      success: true,
      message: 'Currency conversion completed successfully',
      data: conversion,
    };
  }

  /**
   * Get exchange by ID
   */
  @Get('exchange/:exchangeId')
  async getExchange(@Param('exchangeId') exchangeId: string) {
    this.logger.log(`Getting exchange: ${exchangeId}`);

    const exchange = await this.exchangeService.getExchange(exchangeId);

    return {
      success: true,
      message: 'Exchange retrieved successfully',
      data: exchange,
    };
  }

  /**
   * List user exchanges
   */
  @Get('history/:userId')
  async getExchangeHistory(@Param('userId') userId: string, @Query() query: { page?: number; perPage?: number }) {
    const { page = 1, perPage = 10 } = query;

    this.logger.log(`Getting exchange history for user: ${userId}`);

    const result = await this.exchangeService.listExchanges(userId, page, perPage);

    return {
      success: true,
      message: 'Exchange history retrieved successfully',
      data: result,
    };
  }

  /**
   * Legacy endpoints for backward compatibility
   */

  /**
   * Convert to Stars (legacy)
   */
  @Get('stars')
  async convertToStars(
    @Query('amount') amount: string,
    @Query('from') from: string = 'USD',
  ) {
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount < 0) {
      throw new BadRequestException('Invalid amount provided');
    }

    if (from.toUpperCase() !== 'USD') {
      throw new BadRequestException('Only USD to Stars conversion is currently supported');
    }

    this.logger.log(`Converting to Stars: ${numericAmount} USD`);

    const conversion = await this.exchangeService.convertCurrency(numericAmount, 'USD', 'STARS');

    return conversion;
  }

  /**
   * Convert to TON (legacy)
   */
  @Get('ton')
  async convertToTon(
    @Query('amount') amount: string,
    @Query('from') from: string = 'USD',
  ) {
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount < 0) {
      throw new BadRequestException('Invalid amount provided');
    }

    if (from.toUpperCase() !== 'USD') {
      throw new BadRequestException('Only USD to TON conversion is currently supported');
    }

    this.logger.log(`Converting to TON: ${numericAmount} USD`);

    const conversion = await this.exchangeService.convertCurrency(numericAmount, 'USD', 'TON');

    return conversion;
  }
}
