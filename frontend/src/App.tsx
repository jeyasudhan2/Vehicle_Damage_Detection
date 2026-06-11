// frontend/src/App.tsx
// ──────────────────────────────────────────────────────────────────
// Root app with React Router.
// Auth pages (login, create-account, forgot-password) are public.
// All other pages are wrapped in <ProtectedRoute>.
// ──────────────────────────────────────────────────────────────────

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProtectedRoute from './components/ProtectedRoute';
import UploadPage from './pages/UploadPage';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';
import "./index.css"
import LandingPage from './pages/LandingPage';
import OutletLayout from './layout/OutletLayout';


const queryClient = new QueryClient({
    defaultOptions: {
        queries: { staleTime: 30_000, retry: 1 },
    },
});

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>

                <OutletLayout>

                
                    <Routes>

                        {/* ── Public auth routes ── */}
                        <Route path="/login"           element={<LoginPage />} />
                        <Route path="/create-account"  element={<CreateAccountPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                        {/* ── Protected app routes ── */}
                        <Route path="/" element={
                            <ProtectedRoute><LandingPage /></ProtectedRoute>
                        } />
                        <Route path="/upload" element={
                            <ProtectedRoute><UploadPage /></ProtectedRoute>
                        } />
                        <Route path="/result/:id" element={
                            <ProtectedRoute><ResultPage /></ProtectedRoute>
                        } />
                        <Route path="/history" element={
                            <ProtectedRoute><HistoryPage /></ProtectedRoute>
                        } />

                        {/* ── Default redirect ── */}
                        <Route path="/" element={<Navigate to="/" replace />} />
                        <Route path="*" element={<Navigate to="/`" replace />} />

                    </Routes>
                    </OutletLayout>
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    );
}