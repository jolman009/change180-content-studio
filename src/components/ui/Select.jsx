export default function Select({ label, children, ...props }) {
  return (
    <label className="block space-y-2">
      {label && <span className="text-sm font-medium">{label}</span>}
      <select
        className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-base outline-none focus:border-[var(--primary)] sm:text-sm"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
