import type { PaymentMethodHandler, PurchaseResult } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useTelegram } from 'src/hooks/useTelegram';
import { useUserAuth } from 'src/modules/telegram/context/user-auth-telegram-provider';
import { StoreItem } from '../../store/types';
import { useStarsPurchase } from '../../store/hooks/useStorePurchase';
import { useCreateTelegramInvoice } from './telegram-invoice.service';

export function useTelegramStarsPayment(): PaymentMethodHandler {
  const { isTelegram, WebApp, userId } = useTelegram();
  const { user } = useUserAuth();

  const config = {
    name: 'telegram-stars',
    displayName: 'Telegram Stars',
    icon: '⭐',
    available: isTelegram && !!WebApp && !!userId
  };

  const isAvailable = () => isTelegram && !!WebApp && !!userId;

  // Create invoice mutation
  const createInvoiceMutation = useCreateTelegramInvoice();

  // Store purchase mutation
  const storePurchaseMutation = useStarsPurchase();

  const processPurchase = async (item: StoreItem): Promise<PurchaseResult> => {
    // Check if we're in Telegram environment
    if (!isTelegram || !WebApp || !userId) {
      return {
        success: false,
        error: 'Telegram Stars payments are only available in Telegram'
      };
    }

    try {
      const transactionId = uuidv4();
      const username = user?.player?.username || '';

      // Check if this is a free item (price is 0)
      const isFree = item.price.stars === 0;

      if (isFree) {
        // For free items, skip payment process and go directly to transaction recording
        try {
          // For free items, we can call the API directly since no payment is involved
          await storePurchaseMutation.mutateAsync({
            itemId: item.id,
            amount: 0, // Free item
            transactionId,
            username,
            playerId: userId,
          });

          return {
            success: true,
            transactionId,
            purchase: {
              item,
              transactionId,
              timestamp: Date.now(),
              secret: item.id,
              paymentMethod: 'telegram-stars'
            }
          };
        } catch (e) {
          console.error('Failed to process free Stars purchase:', e);
          return {
            success: false,
            error: 'Failed to process free purchase'
          };
        }
      }

      // For paid items, proceed with normal payment flow
      // Create payment using Telegram Stars
      const { invoiceLink } = await createInvoiceMutation.mutateAsync({
        itemId: item.id,
        userId: userId,
        username: username,
        playerId: userId,
      });

      // Return a promise that resolves when the payment is completed
      return new Promise((resolve) => {
        // Open Telegram payment
        WebApp.openInvoice(invoiceLink, async (status: string) => {
          if (status === 'paid') {
            // The bot will handle storing the transaction data via successfulPaymentCallback
            // We just need to resolve with success here
            resolve({
              success: true,
              transactionId,
              purchase: {
                item,
                transactionId,
                timestamp: Date.now(),
                secret: item.id,
                paymentMethod: 'telegram-stars'
              }
            });
          } else if (['failed', 'cancelled'].includes(status)) {
            resolve({
              success: false,
              error: 'Payment was cancelled or failed'
            });
          }
        });
      });
    } catch (error) {
      console.error('Error creating Stars invoice:', error);
      return {
        success: false,
        error: 'Failed to create payment invoice'
      };
    }
  };

  return {
    config,
    isAvailable,
    processPurchase
  };
}
