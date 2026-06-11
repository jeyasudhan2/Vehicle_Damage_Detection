import { useMutation } from '@tanstack/react-query';
import { detectDamage } from '../services/api';
import type { DetectionResult } from '../services/api';

/**
 * TanStack Query mutation hook for uploading an image
 * and running damage detection via the backend API.
 */
export function useDetection() {
    return useMutation<DetectionResult, Error, File>({
        mutationFn: (imageFile: File) => detectDamage(imageFile),
    });
}
