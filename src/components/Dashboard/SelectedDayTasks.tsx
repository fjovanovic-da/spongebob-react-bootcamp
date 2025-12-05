import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";
import type { SelectedDayTasksProps } from "../../types";
import {
  badgeCompletionAnimation,
  emptyStateVariants,
  iconButtonHoverTap,
  listItemVariants,
  listVariants,
} from "../../utils/animations";

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
        <motion.button
          type="button"
          onClick={onAddTask}
          className="btn btn-circle btn-sm btn-primary text-xl"
          aria-label="Add task"
          {...iconButtonHoverTap}
        >
          <span className="-mt-1">+</span>
        </motion.button>
      </div>
      <p className="text-sm text-base-content/70 mb-4">
        {formattedSelectedDate}
      </p>

      <AnimatePresence mode="wait">
        {tasksForSelectedDate.length === 0 ? (
          <motion.div
            key="empty"
            className="text-center py-8"
            variants={emptyStateVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="text-4xl mb-2">📭</div>
            <p className="text-base-content/60">No tasks created on this day</p>
          </motion.div>
        ) : (
          <motion.ul
            key="list"
            className="space-y-3 max-h-64 overflow-y-auto"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {tasksForSelectedDate.map((task) => (
                <motion.li
                  key={task.id}
                  className="p-3 rounded-lg bg-base-200 border border-base-300"
                  variants={listItemVariants}
                  layout
                  exit="exit"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!task.dateFinished}
                      onChange={(e) =>
                        onToggleFinished(task.id, e.target.checked)
                      }
                      className="checkbox checkbox-sm checkbox-success"
                    />
                    <span
                      className={`font-medium ${
                        task.dateFinished ? "line-through opacity-60" : ""
                      }`}
                    >
                      {task.name}
                    </span>
                    <motion.span
                      className={`ml-auto badge ${
                        task.dateFinished ? "badge-success" : "badge-warning"
                      } badge-sm`}
                      {...badgeCompletionAnimation(!!task.dateFinished)}
                    >
                      {task.dateFinished ? "Done" : "Pending"}
                    </motion.span>
                  </div>
                  {task.description && (
                    <p className="text-sm text-base-content/60 mt-1 ml-4">
                      {task.description}
                    </p>
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export const SelectedDayTasks = memo(SelectedDayTasksComponent);
