import Card from "./Card";

export default function ErrorState({ title = "Something went wrong", message, action }) {
  return (
    <Card title={title}>
      <div className="space-y-3 text-sm">
        <p className="text-red-600">{message}</p>
        {action}
      </div>
    </Card>
  );
}
