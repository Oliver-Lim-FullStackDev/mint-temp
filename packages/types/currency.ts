export const enum Currency {
  USD = 'USD',
  TON = 'TON',
  STARS = 'STARS',
}

export type CurrencyCode = keyof typeof Currency;

export interface CurrencyConversion {
  from: {
    currency: Currency;
    amount: number;
  };
  to: {
    currency: Currency;
    amount: number;
  };
  rate: {
    [key: string]: number;
  };
}

export interface CurrencyRate {
  currency: Currency;
  rate: number;
  lastUpdated: Date;
}

export type CurrencyPrice = Partial<Record<Currency, number>>;