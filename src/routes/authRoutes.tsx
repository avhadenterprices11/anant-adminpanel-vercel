import { lazy } from "react";
import { Route, Navigate, useSearchParams } from "react-router-dom";

// Lazy load auth pages
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const SignupPage = lazy(() => import("@/features/auth/pages/SignupPage"));
const AuthCallback = lazy(() => import("@/features/auth/pages/AuthCallback"));

// Component to redirect accept-invitation to signup with token
const AcceptInvitationRedirect = () => {
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get('invite_token');

  if (inviteToken) {
    return <Navigate to={`/signup?invite_token=${inviteToken}`} replace />;
  }

  return <Navigate to="/signup" replace />;
};

// eslint-disable-next-line react-refresh/only-export-components

export const authRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/accept-invitation" element={<AcceptInvitationRedirect />} />
    <Route path="/auth/callback" element={<AuthCallback />} />
  </>
);