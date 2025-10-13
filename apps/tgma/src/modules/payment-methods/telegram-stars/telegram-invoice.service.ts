import { useMutation } from '@tanstack/react-query';

export interface CreateInvoiceRequest {
  itemId: string;
  userId: string;
  username?: string;
  playerId?: string;
}

export interface CreateInvoiceResponse {
  invoiceLink: string;
}

export function useCreateTelegramInvoice() {
  return useMutation({
    mutationFn: async (data: CreateInvoiceRequest): Promise<CreateInvoiceResponse> => {
      const response = await fetch('/api/telegram-stars/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      return response.json();
    },
  });
}