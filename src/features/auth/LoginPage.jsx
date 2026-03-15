import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../lib/authContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function LoginPage() {
  const { session, signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />

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
                }}
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
