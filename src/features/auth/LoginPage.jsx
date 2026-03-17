import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
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
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img
            src="/change180_logo.webp"
            alt="Change180 Life Coaching"
            className="mx-auto mb-4 h-28 w-auto"
          />
          <p className="text-sm text-[var(--muted)]">Content Studio</p>
        </div>

        {signUpSuccess ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-700">
            Check your email to confirm your account, then sign in.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h2 className="text-center text-lg font-semibold text-[var(--secondary)]">
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
  );
}
