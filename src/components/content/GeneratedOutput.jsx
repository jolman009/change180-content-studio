import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import LoadingState from "../ui/LoadingState";
import Textarea from "../ui/Textarea";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { AI_TONE_ACTIONS } from "../../lib/aiGeneration";

export default function GeneratedOutput({
  output,
  loading,
  error,
  fieldErrors = {},
  aiStatus,
  saveStatus,
  isSaving,
  isRewriting,
  activeRewriteAction,
  onChange,
  onRetryGenerate,
  onRewrite,
  onSaveDraft,
}) {
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
        action={
          onRetryGenerate ? (
            <Button onClick={onRetryGenerate} variant="secondary">
              Retry Generation
            </Button>
          ) : null
        }
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
      {aiStatus?.message ? (
        <div
          className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
            aiStatus.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : aiStatus.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-sky-200 bg-sky-50 text-sky-700"
          }`}
        >
          {aiStatus.message}
        </div>
      ) : null}

      {saveStatus?.message ? (
        <div
          className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
            saveStatus.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {saveStatus.message}
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap gap-2">
        {AI_TONE_ACTIONS.map((action) => (
          <Button
            key={action.id}
            onClick={() => onRewrite(action.id)}
            variant={activeRewriteAction === action.id ? "secondary" : "ghost"}
            disabled={isRewriting || isSaving}
            className="text-sm"
          >
            {isRewriting && activeRewriteAction === action.id
              ? `${action.label}...`
              : action.label}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold">Hook</h4>
          <Input name="hook" value={output.hook} onChange={onChange} />
          {fieldErrors.hook ? <p className="mt-2 text-sm text-red-600">{fieldErrors.hook}</p> : null}
        </div>

        <div>
          <h4 className="font-semibold">Caption</h4>
          <Textarea name="caption" value={output.caption} onChange={onChange} />
          {fieldErrors.caption ? (
            <p className="mt-2 text-sm text-red-600">{fieldErrors.caption}</p>
          ) : null}
        </div>

        <div>
          <h4 className="font-semibold">Call to Action</h4>
          <Textarea name="cta" value={output.cta} onChange={onChange} />
          {fieldErrors.cta ? <p className="mt-2 text-sm text-red-600">{fieldErrors.cta}</p> : null}
        </div>

        <div>
          <h4 className="font-semibold">Hashtags</h4>
          <Input name="hashtags" value={output.hashtags?.join(" ")} onChange={onChange} />
        </div>

        <div>
          <h4 className="font-semibold">Visual Direction</h4>
          <Textarea name="visual" value={output.visual} onChange={onChange} />
        </div>

        <div className="flex justify-end">
          <Button onClick={onSaveDraft} disabled={isSaving}>
            {isSaving ? "Saving Draft..." : "Save Draft"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
