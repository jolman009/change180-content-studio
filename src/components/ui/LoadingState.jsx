import Card from "./Card";

export default function LoadingState({ title = "Loading", description = "Please wait." }) {
  return (
    <Card title={title}>
      <div className="space-y-3">
        <div className="h-4 w-32 animate-pulse rounded-full bg-[var(--border)]" />
        <div className="h-3 w-full animate-pulse rounded-full bg-[var(--border)]" />
        <div className="h-3 w-5/6 animate-pulse rounded-full bg-[var(--border)]" />
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Card>
  );
}
