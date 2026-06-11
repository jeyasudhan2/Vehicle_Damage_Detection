import { useQuery } from '@tanstack/react-query';
import { getHistory } from '../services/api';
import type { HistoryItem } from '../services/api';

/**
 * TanStack Query hook for fetching detection history.
 * Refetches every 30 seconds for near-real-time updates.
 */
export function useHistory() {
    return useQuery<HistoryItem[], Error>({
        queryKey: ['detectionHistory'],
        queryFn: getHistory,
        refetchInterval: 30000,
        staleTime: 10000,
    });
}
