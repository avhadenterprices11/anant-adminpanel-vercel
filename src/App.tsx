import React, { Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate,
  Outlet
} from "react-router-dom";

// Import route modules
import {
  authRoutes,
  dashboardRoutes,
  productRoutes,
  orderRoutes,
  customerRoutes,
  settingsRoutes,
  collectionRoutes,
  blogRoutes,
  discountRoutes,
  giftcardRoutes,
  notificationRoutes,
  bundleRoutes,
  profileRoutes,
  accessManagementRoutes,
  inventoryRoutes,
  catalogRoutes,
  tierRoutes,
  tagRoutes,
  chatRoutes,
  invitationRoutes,
} from "@/routes";

import { ErrorBoundary } from "@/components/layouts/ErrorBoundary";
import { PageLoaderSkeleton } from "@/components/ui/loading-skeletons";

import "./index.css";

const RootLayout = () => (
  <ErrorBoundary>
    <Suspense fallback={<PageLoaderSkeleton />}>
      <Outlet />
    </Suspense>
  </ErrorBoundary>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      {/* Default route - redirect to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Auth routes */}
      {authRoutes}

      {/* Protected routes */}
      {dashboardRoutes}
      {productRoutes}
      {orderRoutes}
      {customerRoutes}
      {settingsRoutes}
      {collectionRoutes}
      {blogRoutes}
      {discountRoutes}
      {giftcardRoutes}
      {notificationRoutes}
      {bundleRoutes}
      {/* {customerSegmentRoutes} */}
      {profileRoutes}
      {accessManagementRoutes}
      {inventoryRoutes}
      {catalogRoutes}
      {tierRoutes}
      {tagRoutes}
      {chatRoutes}
      {invitationRoutes}

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Route>
  )
);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
