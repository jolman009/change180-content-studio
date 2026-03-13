export default function Topbar() {
  return (
    <header className="border-b border-[var(--border)] bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Change180 Content Studio</h2>
          <p className="text-sm text-gray-500">
            Create, organize, and refine coaching content.
          </p>
        </div>
      </div>
    </header>
  );
}