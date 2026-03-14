import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import LoadingState from "../ui/LoadingState";

export default function GeneratedOutput({ output, loading, error }) {
  if (loading) {
    return (
      <LoadingState
        title="Generating Output"
        description="Building a draft from the current prompt inputs."
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Generated Output"
        message={error}
      />
    );
  }

  if (!output) {
    return (
      <EmptyState
        title="Generated Output"
        description="Nothing generated yet. Feed the machine a worthy thought."
      />
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
