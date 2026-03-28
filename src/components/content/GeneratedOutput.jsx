import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import LoadingState from "../ui/LoadingState";
import Textarea from "../ui/Textarea";
import Input from "../ui/Input";
import Button from "../ui/Button";
import PostPreview from "./PostPreview";
import QuoteCard from "./QuoteCard";
import PublishStatusBadge from "./PublishStatusBadge";
import PublishButton from "./PublishButton";
import { AI_TONE_ACTIONS } from "../../lib/aiGeneration";

export default function GeneratedOutput({
  output,
  loading,
  error,
  fieldErrors = {},
  isSaving,
  isRewriting,
  activeRewriteAction,
  platform = "Instagram",
  contentType = "Caption Post",
  onChange,
  onRetryGenerate,
  onRewrite,
  onSaveDraft,
  saveLabel = "Save Draft",
  publishStatus,
  onPublish,
  isPublishing,
  postStatus,
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
      <PostPreview output={output} platform={platform} contentType={contentType} />
      <QuoteCard output={output} platform={platform} />

      <div className="mb-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {AI_TONE_ACTIONS.map((action) => (
          <Button
            key={action.id}
            onClick={() => onRewrite(action.id)}
            variant={activeRewriteAction === action.id ? "secondary" : "ghost"}
            disabled={isRewriting || isSaving}
            className="w-full text-sm sm:w-auto"
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
          <Button className="w-full sm:w-auto" onClick={onSaveDraft} disabled={isSaving}>
            {isSaving ? "Saving Draft..." : saveLabel}
          </Button>
        </div>

        {publishStatus ? (
          <div className="mt-4 space-y-3 border-t border-[var(--border)] pt-4">
            {(publishStatus.publishedAt || publishStatus.publishError) ? (
              <PublishStatusBadge
                publishedAt={publishStatus.publishedAt}
                platformPostId={publishStatus.platformPostId}
                publishError={publishStatus.publishError}
                platform={platform}
              />
            ) : null}
            <div className="flex justify-end">
              <PublishButton
                post={{
                  id: publishStatus.postId,
                  platform,
                  status: postStatus || "draft",
                  publishedAt: publishStatus.publishedAt,
                  publishError: publishStatus.publishError,
                }}
                onPublish={onPublish}
                isPublishing={isPublishing}
                disabled={isSaving}
              />
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
