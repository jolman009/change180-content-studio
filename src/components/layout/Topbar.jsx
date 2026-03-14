import { getRuntimeSummary, runtimeMode } from "../../lib/runtime";

export default function Topbar() {
  const runtime = getRuntimeSummary();
  const badgeClassName =
    runtimeMode === "mock"
      ? "bg-amber-100 text-amber-800"
      : "bg-emerald-100 text-emerald-800";

  return (
    <header className="border-b border-[var(--border)] bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Change180 Content Studio</h2>
          <p className="text-sm text-gray-500">
            Create, organize, and refine coaching content.
          </p>
        </div>

        <div className="text-right">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClassName}`}>
            {runtime.label}
          </span>
          <p className="mt-2 max-w-xs text-sm text-gray-500">{runtime.detail}</p>
        </div>
      </div>
    </header>
  );
}
