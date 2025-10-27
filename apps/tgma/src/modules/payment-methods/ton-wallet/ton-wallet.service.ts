import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { StoreItem } from '../../store/types';
import { PaymentMethodHandler, PurchaseResult } from '../types';
import { useTonPurchase } from '../../store/hooks/useStorePurchase';
import { v4 as uuidv4 } from 'uuid';
import { useUserAuth } from 'src/modules/ton/auth/context/user-auth-ton-provider';
import { PriceResponse } from '@mint/types';

const RECEIVER_ADDRESS = process.env.NEXT_PUBLIC_RECEIVER_ADDRESS_TON_WALLET;
const getTxValidUntil = () => Math.floor(Date.now() / 1000) + 600; // 10 minutes from now

export function useTonWalletPayment(): PaymentMethodHandler {
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const connected = !!address;
  const { user } = useUserAuth();

  // Store purchase mutation
  const storePurchaseMutation = useTonPurchase();

  const config = {
    name: 'ton-wallet',
    displayName: 'TON Wallet',
    icon: '💎',
    available: connected
  };

  const isAvailable = () => connected;

  const processPurchase = async (item: StoreItem): Promise<PurchaseResult> => {
    if (!connected || !address) {
      return {
        success: false,
        error: 'TON Wallet not connected'
      };
    }

    try {
      const transactionId = uuidv4();
      const username = user?.player?.username || '';

      // Check if this is a free item (price is 0)
      const isFree = item.price.usd === 0;

      if (isFree) {
        // For free items, skip payment process and go directly to transaction recording
        try {
          await storePurchaseMutation.mutateAsync({
            itemId: item.id,
            walletAddress: address,
            amount: 0, // Free item
            transactionId: transactionId,
            playerId: user?.id,
            username: username,
          });

          return {
            success: true,
            transactionId,
            purchase: {
              item,
              transactionId,
              timestamp: Date.now(),
              secret: item.id,
              paymentMethod: 'ton'
            }
          };
        } catch (e) {
          console.error('Failed to process free TON purchase:', e);
          return {
            success: false,
            error: 'Failed to process free purchase'
          };
        }
      }

      // For paid items, proceed with normal payment flow
      // Get USD price for this item
      const priceResponse = await fetch(`/api/store/items/${item.id}/prices`);
      if (!priceResponse.ok) {
        throw new Error('Failed to get item price');
      }

      const priceData: PriceResponse = await priceResponse.json();
      const tonAmount = priceData.price.ton;

      // Validate transaction parameters
      if (!RECEIVER_ADDRESS) {
        throw new Error('Receiver address not configured');
      }

      if (!tonAmount || tonAmount <= 0) {
        throw new Error('Invalid TON amount');
      }

      // Convert TON to nano units (9 decimals) - must be integer
      const amountInNano = Math.floor(tonAmount * 1000000000).toString();

      // Validate that the amount is a valid integer
      if (!amountInNano || amountInNano === '0' || amountInNano.includes('.')) {
        throw new Error('Invalid amount conversion - amount must be an integer in nano units');
      }

      // Create a simple TON transaction (direct transfer, not swap)
      const tonTransaction = {
        validUntil: getTxValidUntil(),
        messages: [
          {
            address: RECEIVER_ADDRESS!,
            amount: amountInNano,
          },
        ],
      };

      if (!amountInNano || amountInNano === '0') {
        throw new Error('Invalid transaction amount');
      }

      if (tonTransaction.validUntil <= Math.floor(Date.now() / 1000)) {
        throw new Error('Transaction timeout is in the past');
      }

      console.log('Sending TON transaction:', {
        receiver: RECEIVER_ADDRESS,
        amount: amountInNano,
        amountInTon: tonAmount,
        validUntil: tonTransaction.validUntil
      });

      // Ensure TonConnect UI is ready
      if (!tonConnectUI) {
        throw new Error('TonConnect UI is not initialized');
      }

      console.log('About to send transaction with TonConnect UI:', tonConnectUI);

      const result = await tonConnectUI.sendTransaction(tonTransaction);
      console.log('Transaction result:', result);

      if (!result || !result.boc) {
        return {
          success: false,
          error: 'Failed to get transaction boc - transaction may have been cancelled or failed'
        };
      }

      // Call the webapp API to store the purchase in the backend
      try {
        await storePurchaseMutation.mutateAsync({
          itemId: item.id,
          walletAddress: address,
          amount: tonAmount,
          transactionId: transactionId,
          playerId: user?.id,
          username: username,
        });
      } catch (e) {
        console.error('Failed to store TON purchase in backend:', e);
        return {
          success: false,
          error: 'Failed to send transaction to the backend'
        };
      }

      return {
        success: true,
        transactionId,
        purchase: {
          item,
          transactionId,
          timestamp: Date.now(),
          secret: item.id, // In a real app, this would be retrieved from server
          paymentMethod: 'ton'
        }
      };
    } catch (e) {
      console.error('Error during TON purchase:', e);

      let errorMessage = 'Transaction failed';

      if (e instanceof Error) {
        if (e.message.includes('No tx found')) {
          errorMessage = 'Transaction was cancelled or failed to process. Please try again.';
        } else if (e.message.includes('User rejected')) {
          errorMessage = 'Transaction was cancelled by user.';
        } else if (e.message.includes('Failed to calculate fee')) {
          errorMessage = 'Unable to calculate transaction fee. Please check your network connection and try again.';
        } else if (e.message.includes('Insufficient funds')) {
          errorMessage = 'Insufficient TON balance for this transaction.';
        } else {
          errorMessage = `Transaction failed: ${e.message}`;
        }
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  };

  return {
    config,
    isAvailable,
    processPurchase
  };
}
