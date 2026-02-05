import { lazy } from "react";
import { Route } from "react-router-dom";
import { ProtectedLayout } from "@/layouts/ProtectedLayout";

// Lazy load invitation pages
const InvitationListPage = lazy(() => import("@/features/invitations/pages/InvitationListPage"));

export const invitationRoutes = (
    <>
        <Route path="/invitations" element={<ProtectedLayout><InvitationListPage /></ProtectedLayout>} />
    </>
);
