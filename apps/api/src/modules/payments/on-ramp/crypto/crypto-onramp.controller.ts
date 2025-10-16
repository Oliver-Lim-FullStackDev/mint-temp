import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { CryptoOnrampService } from './crypto-onramp.service';
import {
  CreateCryptoInvoiceDto,
  GetCryptoInvoiceDto,
  ListCryptoInvoicesDto,
  GetUserBalanceDto,
  CryptoWebhookDto,
} from './crypto-onramp.dto';
import { getProviderForCurrency } from 'src/modules/payments/shared/payment-config';
import { Currency } from 'src/modules/payments/shared/payment.types';

@Controller('payments/on-ramp/crypto')
export class CryptoOnrampController {
  private readonly logger = new Logger(CryptoOnrampController.name);

  constructor(private readonly cryptoOnrampService: CryptoOnrampService) {}

  /**
   * Create a crypto deposit invoice
   */
  @Post('invoice')
  @HttpCode(HttpStatus.CREATED)
  async createInvoice(@Body() dto: CreateCryptoInvoiceDto) {
    this.logger.log(`Creating crypto invoice for user ${dto.userId} - ${dto.amount} ${dto.currency}`);

    const invoice = await this.cryptoOnrampService.createInvoice(dto);

    return {
      success: true,
      message: 'Crypto invoice created successfully',
      data: invoice,
    };
  }

  /**
   * Get invoice details
   */
  @Get('invoice/:invoiceId')
  async getInvoice(@Param() params: GetCryptoInvoiceDto) {
    this.logger.log(`Getting invoice details for: ${params.invoiceId}`);

    const invoice = await this.cryptoOnrampService.getInvoice(params.invoiceId);

    return {
      success: true,
      message: 'Invoice details retrieved successfully',
      data: invoice,
    };
  }

  /**
   * List user invoices
   */
  @Get('invoices')
  async listInvoices(@Query() query: ListCryptoInvoicesDto) {
    const { userId, page = 1, perPage = 10 } = query;

    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    this.logger.log(`Listing invoices for user: ${userId}`);

    const result = await this.cryptoOnrampService.listInvoices(userId, page, perPage);

    return {
      success: true,
      message: 'Invoices retrieved successfully',
      data: result,
    };
  }

  /**
   * Get user balance
   */
  @Get('balance/:userId')
  async getUserBalance(@Param() params: GetUserBalanceDto) {
    this.logger.log(`Getting balance for user: ${params.userId}`);

    const balance = await this.cryptoOnrampService.getUserBalance(params.userId);

    return {
      success: true,
      message: 'User balance retrieved successfully',
      data: balance || { userId: params.userId, balances: {} },
    };
  }

  /**
   * Webhook endpoint for TXN.pro
   */
  @Post('webhook/txn-pro')
  @HttpCode(HttpStatus.OK)
  async handleTxnProWebhook(
    @Body() payload: CryptoWebhookDto,
    @Headers('x-txn-signature') signature?: string,
    @Headers('x-txn-timestamp') timestamp?: string,
  ) {
    this.logger.log('Received TXN.pro webhook');

    await this.cryptoOnrampService.processWebhook(payload, 'txn.pro', signature, timestamp);

    return {
      success: true,
      message: 'TXN.pro webhook processed successfully',
      invoiceId: payload.data?.id,
      status: payload.data?.attributes?.status,
    };
  }

  /**
   * Webhook endpoint for STON.fi
   */
  @Post('webhook/ston-fi')
  @HttpCode(HttpStatus.OK)
  async handleStonFiWebhook(
    @Body() payload: any,
    @Headers('x-stonfi-signature') signature?: string,
    @Headers('x-stonfi-timestamp') timestamp?: string,
  ) {
    this.logger.log('Received STON.fi webhook');

    await this.cryptoOnrampService.processWebhook(payload, 'ston.fi', signature, timestamp);

    return {
      success: true,
      message: 'STON.fi webhook processed successfully',
      invoiceId: payload.invoiceId,
      status: payload.status,
    };
  }

  /**
   * Get provider for a specific currency (utility endpoint)
   */
  @Get('provider/:currency')
  async getProviderForCurrency(@Param('currency') currency: string) {
    try {
      const provider = getProviderForCurrency(currency as Currency);

      return {
        success: true,
        message: 'Provider retrieved successfully',
        data: {
          currency,
          provider,
        },
      };
    } catch (error) {
      throw new BadRequestException(`No provider configured for currency: ${currency}`);
    }
  }
}
