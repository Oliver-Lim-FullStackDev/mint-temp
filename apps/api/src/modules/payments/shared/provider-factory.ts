import { Injectable, Logger } from '@nestjs/common';
import { Provider, Currency, PaymentRequest, PaymentResponse, PaymentProvider } from './payment.types';
import { getProviderForCurrency, isProviderEnabled, getProviderConfig } from './payment-config';

/**
 * Factory for creating payment providers
 */
@Injectable()
export class ProviderFactory {
  private readonly logger = new Logger(ProviderFactory.name);
  private providerInstances = new Map<Provider, PaymentProvider>();

  /**
   * Get provider instance for a currency
   */
  async getProviderForCurrency(currency: Currency): Promise<PaymentProvider> {
    const provider = getProviderForCurrency(currency);
    return this.getProvider(provider);
  }

  /**
   * Get specific provider instance
   */
  async getProvider(provider: Provider): Promise<PaymentProvider> {
    if (!isProviderEnabled(provider)) {
      throw new Error(`Provider ${provider} is not enabled or configured`);
    }

    if (this.providerInstances.has(provider)) {
      return this.providerInstances.get(provider)!;
    }

    const instance = await this.createProvider(provider);
    this.providerInstances.set(provider, instance);
    return instance;
  }

  /**
   * Create provider instance
   */
  private async createProvider(provider: Provider): Promise<PaymentProvider> {
    const config = getProviderConfig(provider);

    this.logger.log(`Creating provider instance for ${provider}`);

    switch (provider) {
      case 'txn.pro':
        const { TxnProService } = await import('../on-ramp/crypto/providers/txn-pro/txn-pro.service');
        return new TxnProService(config);

      case 'ston.fi':
        const { StonFiService } = await import('../on-ramp/crypto/providers/ston-fi/ston-fi.service');
        return new StonFiService(config);

      case 'epocket':
        // Future implementation
        throw new Error(`Provider ${provider} not yet implemented`);

      case 'rhino.fi':
        // Future implementation
        throw new Error(`Provider ${provider} not yet implemented`);

      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  /**
   * Clear provider instances (useful for testing)
   */
  clearInstances(): void {
    this.providerInstances.clear();
  }
}
