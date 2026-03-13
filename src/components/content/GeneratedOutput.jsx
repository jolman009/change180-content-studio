import Card from "../ui/Card";

export default function GeneratedOutput({ output }) {
  if (!output) {
    return (
      <Card title="Generated Output" subtitle="Your AI draft will appear here.">
        <p className="text-sm text-gray-500">
          Nothing generated yet. Feed the machine a worthy thought.
        </p>
      </Card>
    );
  }

  return (
    <Card title="Generated Output" subtitle="Review, refine, and save">
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold">Hook</h4>
          <p>{output.hook}</p>
        </div>

        <div>
          <h4 className="font-semibold">Caption</h4>
          <p className="whitespace-pre-wrap">{output.caption}</p>
        </div>

        <div>
          <h4 className="font-semibold">Call to Action</h4>
          <p>{output.cta}</p>
        </div>

        <div>
          <h4 className="font-semibold">Hashtags</h4>
          <p>{output.hashtags?.join(" ")}</p>
        </div>

        <div>
          <h4 className="font-semibold">Visual Direction</h4>
          <p>{output.visual}</p>
        </div>
      </div>
    </Card>
  );
}