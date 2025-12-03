import "cally";
import "../../types/cally.type";
import { memo } from "react";
import type { TaskCalendarProps } from "../../types";

function TaskCalendarComponent({
  calendarRef,
  calendarKey,
  selectedDate,
}: TaskCalendarProps) {
  return (
    <div className="w-full dashboard-half min-w-0">
      <h2 className="card-title mb-4">📅 Task Calendar</h2>
      <div className="overflow-x-auto">
        <div className="flex justify-center min-w-fit">
          <calendar-date
            key={calendarKey}
            ref={calendarRef}
            value={selectedDate}
            class="cally bg-base-100 border border-base-300 rounded-box w-full"
          >
            <svg
              aria-label="Previous"
              className="fill-current size-4"
              slot="previous"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <title>Previous</title>
              <path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            <svg
              aria-label="Next"
              className="fill-current size-4"
              slot="next"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <title>Next</title>
              <path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            <calendar-month />
          </calendar-date>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm text-base-content/70">
        <span className="w-3 h-3 rounded-full bg-primary" />
        <span>Days with tasks created</span>
      </div>
    </div>
  );
}

export const TaskCalendar = memo(TaskCalendarComponent);
