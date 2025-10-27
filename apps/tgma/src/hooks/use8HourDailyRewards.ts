'use client';

import { useSession, useUpdateBalancesFromRewardObject, useUpdateBalancesFromRewards } from 'src/modules/account/session-store';
import { toast } from '@mint/ui/components/snackbar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useInventory } from './useInventory';

const INVENTORY_QUERY_KEY = 'user-inventory';

// Daily reward slots: 00:00, 08:00, 16:00
const DAILY_SLOTS = [0, 8, 16]; // Hours in 24-hour format

export interface CountdownState {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

export interface RewardSlot {
  slotIndex: number;
  hour: number;
  nextAvailableTime: Date;
}

export function use8HourDailyRewards() {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const { isLoading, error, refetch, dailyRewards, hasDailyRewards } = useInventory();
  const updateBalancesFromRewards = useUpdateBalancesFromRewards();
  const updateBalancesFromRewardObject = useUpdateBalancesFromRewardObject();

  const [countdown, setCountdown] = useState<CountdownState>({ hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });
  const [currentSlot, setCurrentSlot] = useState<RewardSlot | null>(null);

  // Calculate current reward slot and availability
  const calculateCurrentSlot = useCallback((): RewardSlot => {
    const now = new Date();
    const currentHour = now.getHours();

    // Find the next available slot
    let nextSlotIndex = -1;
    let nextSlotHour = -1;

    for (let i = 0; i < DAILY_SLOTS.length; i++) {
      const slotHour = DAILY_SLOTS[i];
      if (slotHour !== undefined && slotHour > currentHour) {
        nextSlotIndex = i;
        nextSlotHour = slotHour;
        break;
      }
    }

    // If no slot found for today, use first slot of tomorrow
    if (nextSlotIndex === -1) {
      nextSlotIndex = 0;
      nextSlotHour = DAILY_SLOTS[0] ?? 0;
    }

    // Calculate next available time
    const nextAvailableTime = new Date(now);
    const lastSlot = DAILY_SLOTS[DAILY_SLOTS.length - 1];
    if (nextSlotIndex === 0 && lastSlot !== undefined && lastSlot <= currentHour) {
      // Next slot is tomorrow
      nextAvailableTime.setDate(nextAvailableTime.getDate() + 1);
    }
    nextAvailableTime.setHours(nextSlotHour, 0, 0, 0);

    return {
      slotIndex: nextSlotIndex,
      hour: nextSlotHour,
      nextAvailableTime
    };
  }, []);

  // Update countdown timer
  const updateCountdown = useCallback(() => {
    const slot = calculateCurrentSlot();
    const now = new Date();
    const timeDiff = slot.nextAvailableTime.getTime() - now.getTime();

    if (timeDiff <= 0) {
      // Time has passed, recalculate
      const newSlot = calculateCurrentSlot();
      setCurrentSlot(newSlot);
      return;
    }

    const totalSeconds = Math.floor(timeDiff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setCountdown({ hours, minutes, seconds, totalSeconds });
    setCurrentSlot(slot);
  }, [calculateCurrentSlot]);

  // Initialize countdown and update every second
  useEffect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [updateCountdown]);

  const canClaim = hasDailyRewards && !isLoading;
  const claimableReward = canClaim && dailyRewards.length > 0 ? dailyRewards[0] : null;

  // Activate reward mutation
  const activateRewardMutation = useMutation({
    mutationFn: async (itemId: string) => {
      if (!session?.token) {
        throw new Error('No session token available');
      }

      const response = await fetch(`/api/inventory/${itemId}/activate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.token,
        },
      });

      if (!response.ok || response.status !== 200) {
        throw new Error(`Failed to activate reward: ${response.statusText}`);
      }

      const data = await response.json();

      return data;
    },
    onSuccess: (data, itemId) => {
      // Invalidate and refetch inventory after successful activation
      queryClient.invalidateQueries({ queryKey: [INVENTORY_QUERY_KEY] });

      // Update balances if the activation response contains reward information
      if (data?.rewards && Array.isArray(data.rewards)) {
        updateBalancesFromRewards(data.rewards);
      } else if (data?.amountCents && data?.currency) {
        // Handle single reward case where the response contains amountCents and currency
        const rewardObject = {
          [data.currency]: data.amountCents / 100 // Convert cents to currency units
        };
        updateBalancesFromRewardObject(rewardObject);
      }
    },
    onError: (error) => {
      console.error('Failed to activate reward:', error);
      toast.error('Failed to claim daily reward');
    },
  });

  const activateReward = async (itemId: string) => {
    return activateRewardMutation.mutateAsync(itemId);
  };

  // Check if countdown has ended and refresh inventory
  useEffect(() => {
    if (countdown.totalSeconds === 0 && !canClaim) {
      // Countdown ended, refresh inventory to check for new reward
      refetch();
    }
  }, [countdown.totalSeconds, canClaim, refetch]);

  return {
    // Data from inventory
    dailyRewards: dailyRewards,
    hasDailyRewards: hasDailyRewards,
    claimableReward: claimableReward,

    // Countdown data
    countdown,
    currentSlot,
    canClaim: canClaim,

    // Loading states
    isLoading: isLoading,
    isActivating: activateRewardMutation.isPending,

    // Error states
    error: error,
    activationError: activateRewardMutation.error,

    // Actions
    activateReward,
    refetch: refetch,

    // Utilities
    isClaiming: activateRewardMutation.isPending,
  };
}
