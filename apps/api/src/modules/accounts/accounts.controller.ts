import { Controller, Patch, Put, Param, Body, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { AccountsService } from './accounts.service';

/**
 * Controller for cryptocurrency account operations
 * Handles crypto account selection and status management
 */
@Controller('accounts/crypto')
export class CryptoAccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  /**
   * Select a cryptocurrency as the primary account
   * PUT /accounts/crypto/select
   */
  @Put('select')
  async selectCryptoAccount(
    @Body() body: { currency: string },
    @Headers('authorization') authorization: string,
  ) {
    if (!authorization) {
      throw new HttpException('Authorization header is required', HttpStatus.UNAUTHORIZED);
    }

    if (!body.currency) {
      throw new HttpException('Currency is required', HttpStatus.BAD_REQUEST);
    }

    return this.accountsService.selectAccount(body.currency, authorization);
  }

  /**
   * Update cryptocurrency account status (enable/disable)
   * PATCH /accounts/crypto/:id
   */
  @Patch(':id')
  async updateCryptoAccountStatus(
    @Param('id') accountId: string,
    @Body() body: { enabled: boolean },
    @Headers('authorization') authorization: string,
  ) {
    if (!authorization) {
      throw new HttpException('Authorization header is required', HttpStatus.UNAUTHORIZED);
    }

    if (typeof body.enabled !== 'boolean') {
      throw new HttpException('enabled is required and must be a boolean', HttpStatus.BAD_REQUEST);
    }

    return this.accountsService.updateAccount(accountId, body.enabled, authorization);
  }
}

/**
 * Controller for fiat currency operations
 * Handles fiat currency selection for display purposes
 */
@Controller('accounts/fiat')
export class FiatAccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  /**
   * Select a fiat currency for displaying balances
   * PUT /accounts/fiat/select
   */
  @Put('select')
  async selectFiatCurrency(
    @Body() body: { selected_currency: string },
    @Headers('authorization') authorization: string,
  ) {
    if (!authorization) {
      throw new HttpException('Authorization header is required', HttpStatus.UNAUTHORIZED);
    }

    if (!body.selected_currency) {
      throw new HttpException('selected_currency is required', HttpStatus.BAD_REQUEST);
    }

    return this.accountsService.selectCurrency(body.selected_currency, authorization);
  }
}

