export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}) {
  const variants = {
    primary: "bg-[var(--primary)] text-white hover:opacity-90",
    secondary: "bg-[var(--secondary)] text-white hover:opacity-90",
    ghost: "bg-transparent text-[var(--text)] hover:bg-[var(--bg)]",
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