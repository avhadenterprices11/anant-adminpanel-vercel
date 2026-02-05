import React, { Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate,
  Outlet
} from "react-router-dom";

// Import route modules individually to prevent circular dependency
import { authRoutes } from "@/routes/authRoutes";
import { dashboardRoutes } from "@/routes/dashboardRoutes";
import { productRoutes } from "@/routes/productRoutes";
import { orderRoutes } from "@/routes/orderRoutes";
import { customerRoutes } from "@/routes/customerRoutes";
import { settingsRoutes } from "@/routes/settingsRoutes";
import { collectionRoutes } from "@/routes/collectionRoutes";
import { blogRoutes } from "@/routes/blogRoutes";
import { discountRoutes } from "@/routes/discountRoutes";
import { giftcardRoutes } from "@/routes/giftcardRoutes";
import { notificationRoutes } from "@/routes/notificationRoutes";
import { bundleRoutes } from "@/routes/bundleRoutes";
import { profileRoutes } from "@/routes/profileRoutes";
import { accessManagementRoutes } from "@/routes/accessManagementRoutes";
import { inventoryRoutes } from "@/routes/inventoryRoutes";
import { catalogRoutes } from "@/routes/catalogRoutes";
import { tierRoutes } from "@/routes/tierRoutes";
import { tagRoutes } from "@/routes/tagRoutes";
import { chatRoutes } from "@/routes/chatRoutes";
import { invitationRoutes } from "@/routes/invitationRoutes";

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
