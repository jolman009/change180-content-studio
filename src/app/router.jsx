import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LoadingState from "../components/ui/LoadingState";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import RouteErrorPage from "../features/app/RouteErrorPage";

const LoginPage = lazy(() => import("../features/auth/LoginPage"));
const NotFoundPage = lazy(() => import("../features/app/NotFoundPage"));
const PrivacyPolicyPage = lazy(() => import("../features/app/PrivacyPolicyPage"));
const DataDeletionPage = lazy(() => import("../features/app/DataDeletionPage"));
const DashboardPage = lazy(() => import("../features/dashboard/DashboardPage"));
const NextMovesPage = lazy(() => import("../features/strategy/NextMovesPage"));
const BrandProfilePage = lazy(() => import("../features/brand/BrandProfilePage"));
const ConnectedAccountsPage = lazy(() => import("../features/accounts/ConnectedAccountsPage"));
const OAuthCallbackPage = lazy(() => import("../features/accounts/OAuthCallbackPage"));
const CreateContentPage = lazy(() => import("../features/content/CreateContentPage"));
const CalendarPage = lazy(() => import("../features/calendar/CalendarPage"));
const AnalyticsNotesPage = lazy(() => import("../features/analytics/AnalyticsNotesPage"));

function SuspenseWrapper({ children }) {
  return (
    <Suspense fallback={<LoadingState title="Loading" description="Preparing the page." />}>
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <SuspenseWrapper>
        <LoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/privacy-policy",
    element: (
      <SuspenseWrapper>
        <PrivacyPolicyPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/data-deletion",
    element: (
      <SuspenseWrapper>
        <DataDeletionPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <DashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "next-moves",
        element: (
          <SuspenseWrapper>
            <NextMovesPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "brand",
        element: (
          <SuspenseWrapper>
            <BrandProfilePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "accounts",
        element: (
          <SuspenseWrapper>
            <ConnectedAccountsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "accounts/callback",
        element: (
          <SuspenseWrapper>
            <OAuthCallbackPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "create",
        element: (
          <SuspenseWrapper>
            <CreateContentPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "create/:draftId",
        element: (
          <SuspenseWrapper>
            <CreateContentPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "calendar",
        element: (
          <SuspenseWrapper>
            <CalendarPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "analytics",
        element: (
          <SuspenseWrapper>
            <AnalyticsNotesPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "*",
        element: (
          <SuspenseWrapper>
            <NotFoundPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
]);
