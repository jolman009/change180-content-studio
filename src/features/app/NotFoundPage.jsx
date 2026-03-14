import { Link } from "react-router-dom";
import EmptyState from "../../components/ui/EmptyState";

export default function NotFoundPage() {
  return (
    <EmptyState
      title="Page Not Found"
      description="That route does not exist in the current MVP navigation."
      action={
        <Link className="text-sm font-medium text-[var(--primary)] underline" to="/">
          Return to dashboard
        </Link>
      }
    />
  );
}
