import { Navigate } from "react-router-dom";
import { useAuth } from "../../lib/authContext";
import LoadingState from "../ui/LoadingState";
import { hasSupabaseEnv } from "../../lib/runtime";

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();

  if (!hasSupabaseEnv) {
    return children;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <LoadingState title="Loading..." />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
