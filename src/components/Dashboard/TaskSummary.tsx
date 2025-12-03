import { memo } from "react";
import type { TaskSummaryProps } from "../../types/task.type";

function TaskSummaryComponent({ tasks }: TaskSummaryProps) {
  const completedCount = tasks.filter((t) => t.dateFinished).length;
  const pendingCount = tasks.filter((t) => !t.dateFinished).length;

  return (
    <div className="card bg-base-100 shadow-xl mb-8">
      <div className="card-body">
        <h2 className="card-title mb-4">📊 Task Summary</h2>
        <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
          <div className="stat">
            <div className="stat-title">Total Tasks</div>
            <div className="stat-value text-primary">{tasks.length}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Completed</div>
            <div className="stat-value text-success">{completedCount}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Pending</div>
            <div className="stat-value text-warning">{pendingCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const TaskSummary = memo(TaskSummaryComponent);
