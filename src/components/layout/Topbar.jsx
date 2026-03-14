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
    <header className="border-b border-[var(--border)] bg-white px-6 py-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">Change180 Content Studio</h2>
          <p className="text-sm text-gray-500">
            Create, organize, and refine coaching content.
          </p>
        </div>

        <div className="text-left xl:text-right">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClassName}`}>
            {runtime.label}
          </span>
          <p className="mt-2 max-w-xs text-sm text-gray-500">{runtime.detail}</p>
        </div>
      </div>

      {showFilters ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <Input
            label="Search"
            value={searchParams.get("q") ?? ""}
            onChange={(event) => updateFilter("q", event.target.value)}
            placeholder="Search topic, hook, or CTA"
          />

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

          <div className="flex items-end">
            <button
              className="w-full rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--bg)]"
              onClick={() => setSearchParams(new URLSearchParams())}
              type="button"
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
