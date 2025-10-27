import { useMutation } from '@tanstack/react-query';
import { useSession, useUpdateBalance } from 'src/modules/account/session-store';
import { apiFetch } from '@mint/client';

interface SelectAccountParams {
  currency: string;
  token: string;
}

/**
 * Hook to select a cryptocurrency account
 * Uses React Query's useMutation for optimistic updates and automatic error handling
 *
 * @example
 * const { selectAccount, isLoading } = useSelectAccount();
 *
 * const handleSelect = async () => {
 *   await selectAccount({ currency: 'BTC', token: session.token });
 * };
 */
export function useSelectAccount() {
  const { session } = useSession();
  const updateBalance = useUpdateBalance();

  const mutation = useMutation({
    mutationFn: async ({ currency, token }: SelectAccountParams) => {
      return apiFetch('/account/crypto/select', {
        method: 'PUT',
        body: { currency },
      });
    },
    onSuccess: (data, variables) => {
      // Get all accounts from session
      const balances = session?.player?.balances || {};
      const allAccounts = Object.values(balances) as any[];

      // Update session store: set selected=false for all accounts, then selected=true for the chosen one
      allAccounts.forEach((account: any) => {
        if (account.currency === variables.currency) {
          // Set this account as selected
          updateBalance(account.currency, { selected: true });
        } else if (account.selected) {
          // Unset previously selected account
          updateBalance(account.currency, { selected: false });
        }
      });

      console.log(`Account ${variables.currency} selected`);
    },
    onError: (error) => {
      console.error('Error selecting account:', error);
    },
  });

  return {
    ...mutation,
    selectAccount: mutation.mutate,
    selectAccountAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

