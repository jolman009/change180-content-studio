import Card from "./Card";

export default function EmptyState({ title, description, action }) {
  return (
    <Card title={title}>
      <div className="space-y-3 text-sm text-gray-500">
        <p>{description}</p>
        {action}
      </div>
    </Card>
  );
}
