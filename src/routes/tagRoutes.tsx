import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedLayout } from '@/layouts/ProtectedLayout';

// Lazy load tag pages
const TagListPage = lazy(() => import('@/features/tags/pages/TagListPage'));
const AddTagPage = lazy(() => import('@/features/tags/pages/AddTagPage'));
const TagDetailPage = lazy(() => import('@/features/tags/pages/TagDetailPage'));

export const tagRoutes = (
    <>
        <Route path="/tags" element={<ProtectedLayout><TagListPage /></ProtectedLayout>} />
        <Route path="/tags/new" element={<ProtectedLayout><AddTagPage /></ProtectedLayout>} />
        <Route path="/tags/:id" element={<ProtectedLayout><TagDetailPage /></ProtectedLayout>} />
    </>
);
