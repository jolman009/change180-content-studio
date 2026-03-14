import Card from "../ui/Card";

export default function StatCard({ label, value }) {
  return (
    <Card className="p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold sm:text-3xl">{value}</p>
    </Card>
  );
}
