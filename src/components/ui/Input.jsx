export default function Input({ label, ...props }) {
  return (
    <label className="block space-y-2">
      {label && <span className="text-sm font-medium">{label}</span>}
      <input
        className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 outline-none focus:border-[var(--primary)]"
        {...props}
      />
    </label>
  );
}