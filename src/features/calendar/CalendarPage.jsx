import { useSearchParams } from "react-router-dom";
import CalendarBoard from "../../components/calendar/CalendarBoard";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import {
  applyContentFilters,
  buildCalendarGroups,
  getContentFiltersFromSearchParams,
} from "../../lib/contentPipeline";
import { useContentPosts } from "../content/useContentPosts";

export default function CalendarPage() {
  const [searchParams] = useSearchParams();
  const filters = getContentFiltersFromSearchParams(searchParams);
  const { posts, loading, error, savingPostId, savePostUpdates } = useContentPosts();

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
    <CalendarBoard
      groups={calendarGroups}
      savingPostId={savingPostId}
      onStatusChange={(postId, status) => savePostUpdates(postId, { status })}
      onScheduleChange={(postId, scheduledFor) => savePostUpdates(postId, { scheduledFor })}
    />
  );
}
