import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import NotFoundPage from "../features/app/NotFoundPage";
import RouteErrorPage from "../features/app/RouteErrorPage";
import LoginPage from "../features/auth/LoginPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AnalyticsNotesPage from "../features/analytics/AnalyticsNotesPage";
import BrandProfilePage from "../features/brand/BrandProfilePage";
import CreateContentPage from "../features/content/CreateContentPage";
import CalendarPage from "../features/calendar/CalendarPage";
import ConnectedAccountsPage from "../features/accounts/ConnectedAccountsPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import NextMovesPage from "../features/strategy/NextMovesPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
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
      { index: true, element: <DashboardPage /> },
      { path: "next-moves", element: <NextMovesPage /> },
      { path: "brand", element: <BrandProfilePage /> },
      { path: "accounts", element: <ConnectedAccountsPage /> },
      { path: "create", element: <CreateContentPage /> },
      { path: "create/:draftId", element: <CreateContentPage /> },
      { path: "calendar", element: <CalendarPage /> },
      { path: "analytics", element: <AnalyticsNotesPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
