import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import NotFoundPage from "../features/app/NotFoundPage";
import RouteErrorPage from "../features/app/RouteErrorPage";
import AnalyticsNotesPage from "../features/analytics/AnalyticsNotesPage";
import BrandProfilePage from "../features/brand/BrandProfilePage";
import CreateContentPage from "../features/content/CreateContentPage";
import CalendarPage from "../features/calendar/CalendarPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import NextMovesPage from "../features/strategy/NextMovesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "next-moves", element: <NextMovesPage /> },
      { path: "brand", element: <BrandProfilePage /> },
      { path: "create", element: <CreateContentPage /> },
      { path: "create/:draftId", element: <CreateContentPage /> },
      { path: "calendar", element: <CalendarPage /> },
      { path: "analytics", element: <AnalyticsNotesPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
