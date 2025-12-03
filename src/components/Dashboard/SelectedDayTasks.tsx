import { memo } from "react";
import type { SelectedDayTasksProps } from "../../types";

function SelectedDayTasksComponent({
  formattedSelectedDate,
  tasksForSelectedDate,
  onToggleFinished,
  onAddTask,
}: SelectedDayTasksProps) {
  return (
    <div className="w-full dashboard-half min-w-0 overflow-hidden relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="card-title">📋 Tasks for Selected Day</h2>
        <button
          type="button"
          onClick={onAddTask}
          className="btn btn-circle btn-sm btn-primary text-xl"
          aria-label="Add task"
        >
          <span className="-mt-1">+</span>
        </button>
      </div>
      <p className="text-sm text-base-content/70 mb-4">
        {formattedSelectedDate}
      </p>

      {tasksForSelectedDate.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📭</div>
          <p className="text-base-content/60">No tasks created on this day</p>
        </div>
      ) : (
        <ul className="space-y-3 max-h-64 overflow-y-auto">
          {tasksForSelectedDate.map((task) => (
            <li
              key={task.id}
              className="p-3 rounded-lg bg-base-200 border border-base-300"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!task.dateFinished}
                  onChange={(e) => onToggleFinished(task.id, e.target.checked)}
                  className="checkbox checkbox-sm checkbox-success"
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
                    task.dateFinished ? "badge-success" : "badge-warning"
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
  );
}

export const SelectedDayTasks = memo(SelectedDayTasksComponent);
