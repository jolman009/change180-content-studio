import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import AppShell from "../../components/layout/AppShell";
import ErrorState from "../../components/ui/ErrorState";

export default function RouteErrorPage() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "The app hit an unexpected routing error.";

  return (
    <AppShell>
      <ErrorState
        title="Page Error"
        message={message}
        action={
          <Link className="text-sm font-medium text-[var(--primary)] underline" to="/">
            Return to dashboard
          </Link>
        }
      />
    </AppShell>
  );
}
