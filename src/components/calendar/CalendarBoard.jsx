import Card from "../ui/Card";

const mockPosts = [
  { date: "Mon", title: "Mindset shift caption", status: "draft" },
  { date: "Tue", title: "Coaching invitation carousel", status: "approved" },
  { date: "Wed", title: "Reel script on self-sabotage", status: "scheduled" },
  { date: "Thu", title: "Quote graphic", status: "draft" },
  { date: "Fri", title: "Weekly reflection post", status: "scheduled" },
];

export default function CalendarBoard() {
  return (
    <Card title="Weekly Calendar" subtitle="A simple board now; drag-and-drop later">
      <div className="grid gap-4 md:grid-cols-5">
        {mockPosts.map((post) => (
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