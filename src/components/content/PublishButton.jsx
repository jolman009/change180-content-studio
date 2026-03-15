import Button from "../ui/Button";

export default function PublishButton({ post, onPublish, isPublishing, disabled }) {
  if (post.status === "draft") {
    return (
      <Button variant="ghost" disabled title="Approve before publishing" className="w-full text-sm sm:w-auto">
        Publish to {post.platform}
      </Button>
    );
  }

  if (post.publishedAt) {
    return (
      <span className="inline-block text-sm font-medium text-emerald-600">
        Published &#10003;
      </span>
    );
  }

  if (post.publishError) {
    return (
      <Button
        onClick={() => onPublish(post.id, post.platform)}
        disabled={isPublishing || disabled}
        className="w-full text-sm sm:w-auto"
      >
        {isPublishing ? "Publishing..." : "Retry Publish"}
      </Button>
    );
  }

  if (post.status === "approved" || post.status === "scheduled") {
    return (
      <Button
        onClick={() => onPublish(post.id, post.platform)}
        disabled={isPublishing || disabled}
        className="w-full text-sm sm:w-auto"
      >
        {isPublishing ? "Publishing..." : `Publish to ${post.platform}`}
      </Button>
    );
  }

  return null;
}
