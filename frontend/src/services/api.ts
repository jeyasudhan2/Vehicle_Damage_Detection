// frontend/src/services/api.ts
// ──────────────────────────────────────────────────────────────────
// API service — automatically attaches the Supabase JWT token
// to every request so the FastAPI backend can authenticate the user.
// ──────────────────────────────────────────────────────────────────

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { supabase } from '../lib/supabaseClient';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
    timeout: 60_000,
});

// ── Request interceptor ───────────────────────────────────────────
// Runs before EVERY request — reads the current session and injects
// the access_token into the Authorization header automatically.
api.interceptors.request.use(async (config) => {
    try {
        const { data: { session } } = await supabase.auth.getSession();

        console.log('[API] Session:', session ? 'found' : 'null');  // debug
        console.log('[API] Token:', session?.access_token?.slice(0, 20));

        if (session?.access_token) {
            config.headers['Authorization'] = `Bearer ${session.access_token}`;
        }
    } catch (err) {
        console.error('[API] Failed to get session:', err);
    }
    return config;
});

// ── Types ─────────────────────────────────────────────────────────
export interface BoundingBox {
    x:          number;
    y:          number;
    width:      number;
    height:     number;
    label:      string;
    confidence: number;
}

export interface DetectionResult {
    id:                 string;
    imageUrl:           string;
    processedImageUrl:  string;
    damages:            BoundingBox[];
    totalDamages:       number;
    overallConfidence:  number;
    estimatedCost:      number;
    damageTypes:        string[];
    timestamp:          string;
    userEmail?:         string;
}

export interface HistoryItem {
    id:             string;
    thumbnailUrl:   string;
    date:           string;
    damageTypes:    string[];
    confidence:     number;
    estimatedCost:  number;
    status:         'completed' | 'processing' | 'failed';
    userEmail?:     string;
}

// ── Mock data (offline fallback) ──────────────────────────────────
const MOCK_DETECTION: DetectionResult = {
    id:                'demo-001',
    imageUrl:          '/demo-car.jpg',
    processedImageUrl: '/demo-car.jpg',
    damages: [
        { x: 120, y: 80,  width: 200, height: 150, label: 'Dent',    confidence: 0.94 },
        { x: 400, y: 200, width: 160, height: 120, label: 'Scratch', confidence: 0.87 },
        { x: 300, y: 350, width: 180, height: 100, label: 'Crack',   confidence: 0.91 },
    ],
    totalDamages:      3,
    overallConfidence: 0.91,
    estimatedCost:     2450,
    damageTypes:       ['Dent', 'Scratch', 'Crack'],
    timestamp:         new Date().toISOString(),
};

const MOCK_HISTORY: HistoryItem[] = [
    { id: 'h1', thumbnailUrl: '/demo-car.jpg', date: '2026-03-15', damageTypes: ['Dent', 'Scratch'],       confidence: 0.92, estimatedCost: 1850, status: 'completed' },
    { id: 'h2', thumbnailUrl: '/demo-car.jpg', date: '2026-03-14', damageTypes: ['Crack', 'Broken Glass'], confidence: 0.88, estimatedCost: 3200, status: 'completed' },
    { id: 'h3', thumbnailUrl: '/demo-car.jpg', date: '2026-03-13', damageTypes: ['Scratch'],               confidence: 0.95, estimatedCost:  600, status: 'completed' },
];

// ── API Functions ─────────────────────────────────────────────────

/** POST /detect — upload image, run YOLO, save to Supabase */
export async function detectDamage(imageFile: File): Promise<DetectionResult> {
    try {
        const formData = new FormData();
        formData.append('file', imageFile);
        const response: AxiosResponse<DetectionResult> = await api.post('/detect', formData);
        return response.data;
    } catch {
        await new Promise(r => setTimeout(r, 2500));
        return {
            ...MOCK_DETECTION,
            id:                `demo-${Date.now()}`,
            imageUrl:          URL.createObjectURL(imageFile),
            processedImageUrl: URL.createObjectURL(imageFile),
            timestamp:         new Date().toISOString(),
        };
    }
}

/** GET /api/history — current user's detections only */
export async function getHistory(): Promise<HistoryItem[]> {
    try {
        const response: AxiosResponse<HistoryItem[]> = await api.get('/api/history');
        return response.data;
    } catch {
        await new Promise(r => setTimeout(r, 800));
        return MOCK_HISTORY;
    }
}

/** GET /api/detect/{id} — single detection */
export async function getDetectionById(id: string): Promise<DetectionResult> {
    try {
        const response: AxiosResponse<DetectionResult> = await api.get(`/api/detect/${id}`);
        return response.data;
    } catch {
        await new Promise(r => setTimeout(r, 500));
        return { ...MOCK_DETECTION, id };
    }
}

export default api;