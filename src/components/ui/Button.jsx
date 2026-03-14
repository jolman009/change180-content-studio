export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}) {
  const variants = {
    primary: "bg-[var(--primary)] text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
    secondary:
      "bg-[var(--secondary)] text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
    ghost:
      "bg-transparent text-[var(--text)] hover:bg-[var(--bg)] disabled:cursor-not-allowed disabled:opacity-60",
  };

  return (
    <button
      className={`rounded-xl px-4 py-2 font-medium transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
