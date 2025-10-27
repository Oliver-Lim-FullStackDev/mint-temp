import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@mint/client';
import { useSession, useUpdateBalance } from 'src/modules/account/session-store';

interface UpdateAccountParams {
  accountId: number;
  enabled: boolean;
  token: string;
  currency: string; // Need currency to update the right account
}

interface UpdateAccountResponse {
  success: boolean;
  message?: string;
  data?: any;
}

/**
 * Hook to update account enabled status
 */
export function useUpdateAccount() {
  const queryClient = useQueryClient();
  const { session } = useSession();
  const updateBalance = useUpdateBalance();

  const mutation = useMutation<UpdateAccountResponse, Error, UpdateAccountParams>({
    mutationFn: async ({ accountId, enabled, token }: UpdateAccountParams) => {
      // apiFetch already handles response parsing and error throwing
      return apiFetch(`/account/crypto/${accountId}`, {
        method: 'PATCH',
        body: { enabled },
      });
    },
    onSuccess: (data, variables) => {
      // Update the session store directly with the new enabled value
      updateBalance(variables.currency, { enabled: variables.enabled } as any);
      console.log(`Account ${variables.currency} enabled updated to:`, variables.enabled);
    },
    onError: (error) => {
      console.error('Failed to update account:', error);
    },
  });

  return {
    updateAccount: mutation.mutate,
    updateAccountAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
}

