import "cally";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTaskStore } from "../stores/useTaskStore";

// Extend JSX to include cally web components
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "calendar-date": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          class?: string;
          value?: string;
          locale?: string;
        },
        HTMLElement
      >;
      "calendar-month": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

// Extend SVGProps to include slot
declare module "react" {
  // biome-ignore lint/correctness/noUnusedVariables: Required for type augmentation
  interface SVGProps<T> {
    slot?: string;
  }
}

function Dashboard() {
  const tasks = useTaskStore((state) => state.tasks);
  const calendarRef = useRef<HTMLElement>(null);

  // State for selected date (default to today)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });

  // Create a set of date strings (YYYY-MM-DD) that have tasks - memoized
  const taskDateStrings = useMemo(() => {
    return tasks.map((task) => {
      const date = new Date(task.date);
      return date.toISOString().split("T")[0];
    });
  }, [tasks]);

  // Filter tasks for the selected date
  const tasksForSelectedDate = useMemo(() => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.date).toISOString().split("T")[0];
      return taskDate === selectedDate;
    });
  }, [tasks, selectedDate]);

  // Format selected date for display
  const formattedSelectedDate = useMemo(() => {
    const date = new Date(selectedDate);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [selectedDate]);

  // Create a stable key for the calendar to force re-render when tasks change
  const calendarKey = useMemo(
    () => taskDateStrings.join(","),
    [taskDateStrings]
  );

  // Stable callback for getDayParts
  const getDayParts = useCallback(
    (date: Date) => {
      const dateStr = date.toISOString().split("T")[0];
      if (taskDateStrings.includes(dateStr)) {
        return "has-task";
      }
      return "";
    },
    [taskDateStrings]
  );

  // Handle date selection from calendar
  const handleDateChange = useCallback((e: Event) => {
    const target = e.target as HTMLElement & { value: string };
    if (target.value) {
      setSelectedDate(target.value);
    }
  }, []);

  // Set up the getDayParts function and change event on the calendar element
  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      (
        calendarEl as unknown as { getDayParts: (date: Date) => string }
      ).getDayParts = getDayParts;

      // Add change event listener
      calendarEl.addEventListener("change", handleDateChange);

      return () => {
        calendarEl.removeEventListener("change", handleDateChange);
      };
    }
  }, [getDayParts, handleDateChange]);

  const containerClasses =
    "dashboard-container max-w-7xl mx-auto p-8 rounded-3xl shadow-2xl bg-base-200";
  const headingClasses =
    "text-4xl font-bold text-center mb-8 flex items-center justify-center gap-2 text-base-content";

  return (
    <div className={containerClasses}>
      <h1 className={headingClasses}>📊 Dashboard</h1>

      {/* Calendar and Selected Day Tasks - Side by Side */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <div className="flex flex-col dashboard-flex gap-8">
            {/* Calendar Section - Left Half */}
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
                      <path
                        fill="currentColor"
                        d="M15.75 19.5 8.25 12l7.5-7.5"
                      />
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

            {/* Selected Day Tasks - Right Half */}
            <div className="w-full dashboard-half min-w-0 overflow-hidden">
              <h2 className="card-title mb-4">📋 Tasks for Selected Day</h2>
              <p className="text-sm text-base-content/70 mb-4">
                {formattedSelectedDate}
              </p>

              {tasksForSelectedDate.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📭</div>
                  <p className="text-base-content/60">
                    No tasks created on this day
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {tasksForSelectedDate.map((task) => (
                    <li
                      key={task.id}
                      className="p-3 rounded-lg bg-base-200 border border-base-300"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            task.dateFinished ? "bg-success" : "bg-warning"
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            task.dateFinished ? "line-through opacity-60" : ""
                          }`}
                        >
                          {task.name}
                        </span>
                        <span
                          className={`ml-auto badge ${
                            task.dateFinished
                              ? "badge-success"
                              : "badge-warning"
                          } badge-sm`}
                        >
                          {task.dateFinished ? "Done" : "Pending"}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-sm text-base-content/60 mt-1 ml-4">
                          {task.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Summary Section */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">📊 Task Summary</h2>
          <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
            <div className="stat">
              <div className="stat-title">Total Tasks</div>
              <div className="stat-value text-primary">{tasks.length}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Completed</div>
              <div className="stat-value text-success">
                {tasks.filter((t) => t.dateFinished).length}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Pending</div>
              <div className="stat-value text-warning">
                {tasks.filter((t) => !t.dateFinished).length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
