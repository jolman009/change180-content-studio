import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import NotFoundPage from "../features/app/NotFoundPage";
import RouteErrorPage from "../features/app/RouteErrorPage";
import BrandProfilePage from "../features/brand/BrandProfilePage";
import CreateContentPage from "../features/content/CreateContentPage";
import CalendarPage from "../features/calendar/CalendarPage";
import DashboardPage from "../features/dashboard/DashboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "brand", element: <BrandProfilePage /> },
      { path: "create", element: <CreateContentPage /> },
      { path: "calendar", element: <CalendarPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
