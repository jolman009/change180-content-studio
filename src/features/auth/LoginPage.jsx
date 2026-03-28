import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Eye, EyeOff, Sparkles, Calendar, BarChart3, Share2 } from "lucide-react";
import { useAuth } from "../../lib/authContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

function PasswordInput({ label, value, onChange, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="block space-y-2">
      {label && <span className="text-sm font-medium">{label}</span>}
      <div className="relative">
        <input
          className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 pr-10 text-base outline-none focus:border-[var(--primary)] sm:text-sm"
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)]"
          tabIndex={-1}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </label>
  );
}

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-Powered Content",
    description: "Generate on-brand social posts in seconds with tone-aware AI rewriting.",
  },
  {
    icon: Calendar,
    title: "Visual Calendar",
    description: "Plan, schedule, and auto-publish across platforms from one calendar view.",
  },
  {
    icon: Share2,
    title: "Multi-Platform Publishing",
    description: "Connect LinkedIn, Facebook, and Instagram — publish directly from the studio.",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    description: "Log outcomes, spot patterns, and sharpen your content strategy over time.",
  },
];

export default function LoginPage() {
  const { session, signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  if (session) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password);

    if (error) {
      setError(error.message);
    } else if (isSignUp) {
      setSignUpSuccess(true);
    }

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen">
      {/* Left — Landing / Brand Panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-[var(--secondary)] p-10 text-white lg:flex xl:p-16">
        <div>
          <img
            src="/change180_logo.webp"
            alt="Change180 Life Coaching"
            className="mb-2 h-20 w-auto brightness-0 invert"
          />
          <p className="text-sm font-medium text-white/60">Content Studio</p>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold leading-tight xl:text-4xl">
            Your coaching voice,
            <br />
            amplified.
          </h1>
          <p className="max-w-md text-base leading-relaxed text-white/70">
            Define your brand, generate content that sounds like you, and publish
            across every platform — all from one place.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl bg-white/10 p-4 backdrop-blur-sm"
            >
              <feature.icon size={20} className="mb-2 text-[var(--pink)]" />
              <p className="text-sm font-semibold">{feature.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/60">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <p className="text-xs text-white/40">
          &copy; {new Date().getFullYear()} Change180 Life Coaching. All rights reserved.
        </p>
      </div>

      {/* Right — Sign In / Sign Up Form */}
      <div className="flex w-full flex-col items-center justify-center bg-[var(--bg)] px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Mobile logo — hidden on desktop since it's on the left panel */}
          <div className="mb-8 text-center lg:hidden">
            <img
              src="/change180_logo.webp"
              alt="Change180 Life Coaching"
              className="mx-auto mb-4 h-28 w-auto"
            />
            <p className="text-sm text-[var(--muted)]">Content Studio</p>
          </div>

          {/* Desktop heading */}
          <div className="mb-8 hidden lg:block">
            <h2 className="text-2xl font-bold text-[var(--secondary)]">
              {isSignUp ? "Get started" : "Welcome back"}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {isSignUp
                ? "Create your account to start building content."
                : "Sign in to your Content Studio."}
            </p>
          </div>

          {signUpSuccess ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-700">
              Check your email to confirm your account, then sign in.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <h2 className="text-center text-lg font-semibold text-[var(--secondary)] lg:hidden">
                {isSignUp ? "Create Account" : "Sign In"}
              </h2>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <PasswordInput
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />

              {isSignUp && (
                <>
                  <PasswordInput
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />

                  <div className="rounded-xl bg-[var(--bg)] p-3 text-xs text-[var(--muted)]">
                    <p className="mb-1 font-medium text-[var(--text)]">Password requirements:</p>
                    <ul className="list-inside list-disc space-y-0.5">
                      <li>At least 6 characters</li>
                      <li>Mix of uppercase and lowercase recommended</li>
                      <li>Include a number or special character</li>
                    </ul>
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
              </Button>

              <p className="text-center text-sm text-[var(--muted)]">
                {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
                <button
                  type="button"
                  className="font-medium text-[var(--primary)] hover:underline"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                    setConfirmPassword("");
                  }}
                >
                  {isSignUp ? "Sign in" : "Sign up"}
                </button>
              </p>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-[var(--muted)]">
            <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
            <span className="mx-2">·</span>
            <a href="/data-deletion" className="hover:underline">Data Deletion</a>
          </p>
        </div>
      </div>
    </div>
  );
}
