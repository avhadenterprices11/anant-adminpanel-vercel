import { lazy } from "react";
import { Route } from "react-router-dom";
import { ProtectedLayout } from "@/layouts/ProtectedLayout";

// Lazy load order pages
const OrderListPage = lazy(() => import("@/features/orders/pages/OrderListPage"));
const OrderDetailPage = lazy(() => import("@/features/orders/pages/OrderDetailPage"));
const CreateOrderPage = lazy(() => import("@/features/orders/pages/CreateOrderPage"));
const DraftOrdersPage = lazy(() => import("@/features/orders/pages/DraftOrdersPage"));
const DraftOrderDetailPage = lazy(() => import("../features/orders/pages/DraftOrderDetailPage"));
const AbandonedOrdersPage = lazy(() => import("@/features/orders/pages/AbandonedOrdersPage"));

export const orderRoutes = (
  <>
    <Route path="/orders" element={<ProtectedLayout><OrderListPage /></ProtectedLayout>} />
    <Route path="/orders/:id" element={<ProtectedLayout><OrderDetailPage /></ProtectedLayout>} />
    <Route path="/orders/new" element={<ProtectedLayout><CreateOrderPage /></ProtectedLayout>} />
    <Route path="/orders/draft" element={<ProtectedLayout><DraftOrdersPage /></ProtectedLayout>} />
    <Route path="/orders/draft/:id" element={<ProtectedLayout><DraftOrderDetailPage /></ProtectedLayout>} />
    <Route path="/orders/abandoned-cart" element={<ProtectedLayout><AbandonedOrdersPage /></ProtectedLayout>} />
  </>
);