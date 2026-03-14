import { useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { getFilterOptions } from "../../lib/contentPipeline";
import { getRuntimeSummary, runtimeMode } from "../../lib/runtime";

export default function Topbar() {
  const runtime = getRuntimeSummary();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = getFilterOptions();
  const badgeClassName =
    runtimeMode === "mock"
      ? "bg-amber-100 text-amber-800"
      : "bg-emerald-100 text-emerald-800";
  const showFilters = location.pathname === "/" || location.pathname === "/calendar";
  const hasActiveFilters =
    Boolean(searchParams.get("q")) ||
    Boolean(searchParams.get("platform")) ||
    Boolean(searchParams.get("pillar")) ||
    Boolean(searchParams.get("status"));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(hasActiveFilters);

  function updateFilter(key, value) {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (value) {
      nextSearchParams.set(key, value);
    } else {
      nextSearchParams.delete(key);
    }

    setSearchParams(nextSearchParams);
  }

  return (
    <header className="border-b border-[var(--border)] bg-white px-3 py-3 sm:px-6 sm:py-4">
      <div className="flex items-start justify-between gap-3 xl:items-start">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold sm:text-lg">Change180 Content Studio</h2>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Create, organize, and refine coaching content.
          </p>
        </div>

        <div className="shrink-0 text-right">
          <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold sm:px-3 sm:text-xs ${badgeClassName}`}>
            {runtime.label}
          </span>
          <p className="mt-2 hidden max-w-full text-sm text-gray-500 sm:block xl:max-w-xs">
            {runtime.detail}
          </p>
        </div>
      </div>

      {showFilters ? (
        <div className="mt-4 space-y-3">
          <Input
            label="Search"
            value={searchParams.get("q") ?? ""}
            onChange={(event) => updateFilter("q", event.target.value)}
            placeholder="Search topic, hook, or CTA"
          />

          <div className="flex gap-2 sm:hidden">
            <button
              className="flex-1 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--bg)]"
              onClick={() => setMobileFiltersOpen((current) => !current)}
              type="button"
            >
              {mobileFiltersOpen ? "Hide Filters" : "More Filters"}
            </button>
            {hasActiveFilters ? (
              <button
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--bg)]"
                onClick={() => setSearchParams(new URLSearchParams())}
                type="button"
              >
                Clear
              </button>
            ) : null}
          </div>

          <div className={`${mobileFiltersOpen ? "grid" : "hidden"} gap-3 sm:grid sm:grid-cols-2 xl:grid-cols-4`}>
            <Select
              label="Platform"
              value={searchParams.get("platform") ?? ""}
              onChange={(event) => updateFilter("platform", event.target.value)}
            >
              <option value="">All platforms</option>
              {filters.platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </Select>

            <Select
              label="Pillar"
              value={searchParams.get("pillar") ?? ""}
              onChange={(event) => updateFilter("pillar", event.target.value)}
            >
              <option value="">All pillars</option>
              {filters.pillars.map((pillar) => (
                <option key={pillar} value={pillar}>
                  {pillar}
                </option>
              ))}
            </Select>

            <Select
              label="Status"
              value={searchParams.get("status") ?? ""}
              onChange={(event) => updateFilter("status", event.target.value)}
            >
              <option value="">All statuses</option>
              {filters.statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>

            <div className="hidden items-end sm:flex">
              <button
                className="w-full rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--bg)]"
                onClick={() => setSearchParams(new URLSearchParams())}
                type="button"
              >
                Clear Filters
              </button>
            </div>
          </div>

        </div>
      ) : null}
    </header>
  );
}
