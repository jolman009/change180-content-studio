import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import CalendarBoard from "../../components/calendar/CalendarBoard";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import {
  applyContentFilters,
  buildCalendarGroups,
  getContentFiltersFromSearchParams,
} from "../../lib/contentPipeline";
import { saveContentPost } from "../../services/contentService";
import { publishPost } from "../../services/publishService";
import { useContentPosts } from "../content/useContentPosts";

export default function CalendarPage() {
  const [searchParams] = useSearchParams();
  const filters = getContentFiltersFromSearchParams(searchParams);
  const { posts, loading, error, savingPostId, savePostUpdates, reloadPosts } = useContentPosts();
  const [publishingPostId, setPublishingPostId] = useState(null);
  const [duplicatingPostId, setDuplicatingPostId] = useState(null);
  const [duplicateStatus, setDuplicateStatus] = useState({ type: "", message: "" });

  async function handlePublish(postId, platform) {
    setPublishingPostId(postId);

    try {
      const result = await publishPost(postId, platform);
      savePostUpdates(postId, {
        platformPostId: result.data.platformPostId,
        publishedAt: result.data.publishedAt,
        publishError: null,
        status: "posted",
      });
    } catch (err) {
      savePostUpdates(postId, {
        publishError: err.message || "Publish failed",
      });
    } finally {
      setPublishingPostId(null);
    }
  }

  async function handleDuplicate(postId, targetPlatform) {
    const sourcePost = posts.find((p) => p.id === postId);
    if (!sourcePost) return;

    setDuplicatingPostId(postId);
    setDuplicateStatus({ type: "", message: "" });

    try {
      await saveContentPost({
        platform: targetPlatform,
        contentType: sourcePost.contentType,
        pillar: sourcePost.pillar,
        goal: sourcePost.goal,
        tone: sourcePost.tone,
        topic: sourcePost.topic,
        context: sourcePost.context,
        status: "draft",
        scheduledFor: sourcePost.scheduledFor,
        hook: sourcePost.hook,
        body: sourcePost.body,
        cta: sourcePost.cta,
        hashtags: sourcePost.hashtags,
        visualDirection: sourcePost.visualDirection,
      });

      await reloadPosts();
      setDuplicateStatus({
        type: "success",
        message: `Duplicated to ${targetPlatform} as a new draft.`,
      });
    } catch (err) {
      setDuplicateStatus({
        type: "error",
        message: err.message || `Unable to duplicate to ${targetPlatform}.`,
      });
    } finally {
      setDuplicatingPostId(null);
    }
  }

  if (loading) {
    return (
      <LoadingState
        title="Loading Calendar"
        description="Collecting saved drafts and schedule details."
      />
    );
  }

  if (error) {
    return <ErrorState title="Calendar" message={error} />;
  }

  const filteredPosts = applyContentFilters(posts, filters);
  const calendarGroups = buildCalendarGroups(filteredPosts);

  return (
    <>
      {duplicateStatus.message ? (
        <div
          className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
            duplicateStatus.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {duplicateStatus.message}
        </div>
      ) : null}

      <CalendarBoard
        groups={calendarGroups}
        savingPostId={savingPostId}
        onStatusChange={(postId, status) => savePostUpdates(postId, { status })}
        onScheduleChange={(postId, scheduledFor) => savePostUpdates(postId, { scheduledFor })}
        onPublish={handlePublish}
        publishingPostId={publishingPostId}
        onDuplicate={handleDuplicate}
        duplicatingPostId={duplicatingPostId}
      />
    </>
  );
}
