import { useCallback } from 'react';
import { useOmniston, SettlementMethod, GaslessSettlement, Blockchain } from '@ston-fi/omniston-sdk-react';

const USDT_ADDRESS = process.env.NEXT_PUBLIC_USDT_ADDRESS;
const TON_ADDRESS = process.env.NEXT_PUBLIC_TON_ADDRESS;

// Separate hook for TON price conversion
export function useTonPriceConversion() {
  const omniston = useOmniston();

  const getTonPriceFromStonFi = useCallback(async (usdAmount: number): Promise<number> => {
    // Check if omniston is available
    if (!omniston) {
      throw new Error('STON.fi not available');
    }

    // Check if required environment variables are set
    if (!USDT_ADDRESS) {
      throw new Error('NEXT_PUBLIC_USDT_ADDRESS environment variable is not configured');
    }

    if (!TON_ADDRESS) {
      throw new Error('NEXT_PUBLIC_TON_ADDRESS environment variable is not configured');
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
      const quote = await new Promise<any>((resolve, reject) => {
        const subscription = omniston.requestForQuote(quoteRequest).subscribe({
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

      // Extract TON amount from quote - using the actual STON.fi structure
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
      console.error('Error getting TON price from STON.fi:', error);
      // Fallback to backend price
      const priceResponse = await fetch(`/api/store/items/ton/price`);
      if (priceResponse.ok) {
        const priceData = await priceResponse.json();
        return usdAmount / priceData.usd;
      }
      throw error;
    }
  }, [omniston]);

  return { getTonPriceFromStonFi };
}