export default function Card({ title, subtitle, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-[var(--border)] bg-white p-5 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}