import CalendarBoard from "../../components/calendar/CalendarBoard";
import { mockCalendarPosts } from "../../lib/mockData";

export default function CalendarPage() {
  return <CalendarBoard posts={mockCalendarPosts} />;
}
