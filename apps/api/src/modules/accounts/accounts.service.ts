import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);
  private readonly hgApiUrl: string;

  constructor(private configService: ConfigService) {
    // Get HG API base URL without /api suffix
    const baseUrl = this.configService.get<string>('NEXT_PUBLIC_MINT_API_URL') || 'https://clients.mintstage.io/api';
    this.hgApiUrl = baseUrl.replace(/\/api$/, '');
    this.logger.log(`HG API URL: ${this.hgApiUrl}`);
  }

  async updateAccount(accountId: string, enabled: boolean, authorization: string) {
    const url = `${this.hgApiUrl}/accounts/${accountId}`;

    this.logger.log(`Updating account ${accountId}, enabled: ${enabled}`);

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.casinosaga.v1',
          'Authorization': authorization,
        },
        body: JSON.stringify({
          account: {
            enabled,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`HG API error: ${response.status} - ${errorText}`);

        if (response.status === 401) {
          throw new HttpException('Invalid or expired session token', HttpStatus.UNAUTHORIZED);
        }

        if (response.status === 404) {
          throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
        }

        throw new HttpException(
          errorText || 'Failed to update account',
          response.status,
        );
      }

      const data = await response.json();
      this.logger.log(`Account ${accountId} updated successfully`);
      return data;
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error('Error updating account:', error);
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async selectAccount(currency: string, authorization: string) {
    const url = `${this.hgApiUrl}/select_account`;

    this.logger.log(`Selecting account with currency: ${currency}`);

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.casinosaga.v1',
          'Authorization': authorization,
        },
        body: JSON.stringify({
          currency,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`HG API error: ${response.status} - ${errorText}`);

        if (response.status === 401) {
          throw new HttpException('Invalid or expired session token', HttpStatus.UNAUTHORIZED);
        }

        if (response.status === 400) {
          throw new HttpException('Invalid currency selection', HttpStatus.BAD_REQUEST);
        }

        throw new HttpException(
          errorText || 'Failed to select account',
          response.status,
        );
      }

      const data = await response.json();
      this.logger.log(`Account selected successfully: ${currency}`);
      return data;
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error('Error selecting account:', error);
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async selectCurrency(selectedCurrency: string, authorization: string) {
    const url = `${this.hgApiUrl}/me`;

    this.logger.log(`Selecting fiat currency: ${selectedCurrency}`);

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.casinosaga.v1',
          'Authorization': authorization,
        },
        body: JSON.stringify({
          selected_currency: selectedCurrency,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`HG API error: ${response.status} - ${errorText}`);

        if (response.status === 401) {
          throw new HttpException('Invalid or expired session token', HttpStatus.UNAUTHORIZED);
        }

        if (response.status === 400) {
          throw new HttpException('Invalid currency selection', HttpStatus.BAD_REQUEST);
        }

        throw new HttpException(
          errorText || 'Failed to select currency',
          response.status,
        );
      }

      const data = await response.json();
      this.logger.log(`Currency selected successfully: ${selectedCurrency}`);
      return data;
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error('Error selecting currency:', error);
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

