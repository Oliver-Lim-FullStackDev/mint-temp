import { useMutation } from '@tanstack/react-query';
import { useSetSelectedCurrency } from '@/modules/account/session-store';
import { apiFetch } from '@mint/client';

interface SelectCurrencyParams {
  currencyCode: string;
  token: string;
}

/**
 * Hook to select a fiat currency for display purposes
 * Uses React Query's useMutation for optimistic updates and automatic error handling
 *
 * @example
 * const { selectCurrency, isLoading } = useSelectCurrency();
 *
 * const handleSelect = async () => {
 *   await selectCurrency({ currencyCode: 'EUR', token: session.token });
 * };
 */
export function useSelectCurrency() {
  const setSelectedCurrency = useSetSelectedCurrency();

  const mutation = useMutation({
    mutationFn: async ({ currencyCode, token }: SelectCurrencyParams) => {
      return apiFetch('/account/fiat/select', {
        method: 'PUT',
        body: { selected_currency: currencyCode },
      });
    },
    onSuccess: (data, variables) => {
      // Update session store with new selected_currency
      setSelectedCurrency(variables.currencyCode);
      console.log(`Currency ${variables.currencyCode} selected`);
    },
    onError: (error) => {
      console.error('Error selecting currency:', error);
    },
  });

  return {
    ...mutation,
    selectCurrency: mutation.mutate,
    selectCurrencyAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

