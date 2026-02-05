import { lazy } from "react";
import { Route } from "react-router-dom";
import { ProtectedLayout } from "@/layouts/ProtectedLayout";

// Lazy load customer segment pages
const CustomerSegmentsPage = lazy(() => import("@/features/customer-segment/pages/CustomerSegmentsPage"));
const CustomerSegmentDetailPage = lazy(() => import("@/features/customer-segment/pages/CustomerSegmentDetailPage"));
const AddCustomerSegmentPage = lazy(() => import("@/features/customer-segment/pages/AddCustomerSegmentPage"));

export const customerSegmentRoutes = (
  <>
    <Route path="/customer-segments" element={<ProtectedLayout><CustomerSegmentsPage /></ProtectedLayout>} />
    <Route path="/customer-segments/:id" element={<ProtectedLayout><CustomerSegmentDetailPage /></ProtectedLayout>} />
    <Route path="/customer-segments/new" element={<ProtectedLayout><AddCustomerSegmentPage /></ProtectedLayout>} />
  </>
);