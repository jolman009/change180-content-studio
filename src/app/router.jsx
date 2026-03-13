import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import DashboardPage from "../components/dashboard/DashboardPage";
import BrandProfilePage from "../features/brand/BrandProfilePage";
import CreateContentPage from "../features/content/CreateContentPage";
import CalendarPage from "../features/calendar/CalendarPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "brand", element: <BrandProfilePage /> },
      { path: "create", element: <CreateContentPage /> },
      { path: "calendar", element: <CalendarPage /> },
    ],
  },
]);
