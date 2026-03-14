import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import App from "../App";
import DashboardPage from "../features/dashboard/DashboardPage";
import CreateContentPage from "../features/content/CreateContentPage";
import CalendarPage from "../features/calendar/CalendarPage";
import AnalyticsNotesPage from "../features/analytics/AnalyticsNotesPage";
import BrandProfilePage from "../features/brand/BrandProfilePage";
import { demoContentPosts } from "../lib/demoData";

vi.mock("../features/content/useContentPosts", () => ({
  useContentPosts: () => ({
    posts: demoContentPosts,
    loading: false,
    error: "",
    savingPostId: "",
    reloadPosts: vi.fn(),
    savePostUpdates: vi.fn(),
  }),
}));

function renderRoute(initialEntry = "/") {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <App />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "brand", element: <BrandProfilePage /> },
          { path: "create", element: <CreateContentPage /> },
          { path: "calendar", element: <CalendarPage /> },
          { path: "analytics", element: <AnalyticsNotesPage /> },
        ],
      },
    ],
    { initialEntries: [initialEntry] },
  );

  return render(<RouterProvider router={router} />);
}

describe("app smoke routes", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the dashboard route", async () => {
    renderRoute("/");

    expect(
      await screen.findByText("Start here if this is your first pass through the studio this week."),
    ).toBeInTheDocument();
    expect(screen.getByText("Draft Posts")).toBeInTheDocument();
  });

  it("renders the create route", async () => {
    renderRoute("/create");

    expect(
      await screen.findByText("Turn a coaching idea into a usable social asset"),
    ).toBeInTheDocument();
    expect(screen.getByText("Generate Content")).toBeInTheDocument();
  });

  it("renders the calendar route", async () => {
    renderRoute("/calendar");

    expect(
      await screen.findByText("Grouped by scheduled date with editable pipeline state"),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Status").length).toBeGreaterThan(0);
  });

  it("renders the analytics route", async () => {
    renderRoute("/analytics");

    expect(
      await screen.findByText(
        "Capture what happened after posting so future content choices get sharper.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Save Note")).toBeInTheDocument();
  });
});
