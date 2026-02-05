import { lazy } from "react";
import { Route } from "react-router-dom";
import { ProtectedLayout } from "@/layouts/ProtectedLayout";

// Lazy load collection pages
const CollectionListPage = lazy(() => import("@/features/collections/pages/CollectionListPage"));
const CollectionDetailPage = lazy(() => import("@/features/collections/pages/CollectionDetailPage"));
const CreateCollectionPage = lazy(() => import("@/features/collections/pages/CreateCollectionPage"));

export const collectionRoutes = (
  <>
    <Route path="/collections" element={<ProtectedLayout><CollectionListPage /></ProtectedLayout>} />
    <Route path="/collections/:id" element={<ProtectedLayout><CollectionDetailPage /></ProtectedLayout>} />
    <Route path="/collections/new" element={<ProtectedLayout><CreateCollectionPage /></ProtectedLayout>} />
  </>
);