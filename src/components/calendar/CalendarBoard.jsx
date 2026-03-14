import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";

export default function CalendarBoard({ posts = [] }) {
  if (posts.length === 0) {
    return (
      <EmptyState
        title="Weekly Calendar"
        description="Scheduled content will appear here once the calendar is connected to saved posts."
      />
    );
  }

  return (
    <Card title="Weekly Calendar" subtitle="A simple board now; drag-and-drop later">
      <div className="grid gap-4 md:grid-cols-5">
        {posts.map((post) => (
          <div
            key={`${post.date}-${post.title}`}
            className="rounded-xl border border-(--border) bg-(--bg) p-4"
          >
            <p className="text-sm font-semibold">{post.date}</p>
            <p className="mt-2 text-sm">{post.title}</p>
            <span className="mt-3 inline-block rounded-full bg-white px-3 py-1 text-xs capitalize">
              {post.status}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
