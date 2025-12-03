import { motion } from "framer-motion";
import { memo } from "react";
import type { TaskSummaryProps } from "../../types/task.type";
import {
  statItemVariants,
  statsContainerVariants,
  valueChangeAnimation,
} from "../../utils/animations";

function TaskSummaryComponent({ tasks }: TaskSummaryProps) {
  const completedCount = tasks.filter((t) => t.dateFinished).length;
  const pendingCount = tasks.filter((t) => !t.dateFinished).length;

  return (
    <div className="card bg-base-100 shadow-xl mb-8">
      <div className="card-body">
        <h2 className="card-title mb-4">📊 Task Summary</h2>
        <motion.div
          className="stats stats-vertical lg:stats-horizontal shadow w-full"
          variants={statsContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="stat" variants={statItemVariants}>
            <div className="stat-title">Total Tasks</div>
            <motion.div
              className="stat-value text-primary"
              key={tasks.length}
              {...valueChangeAnimation}
            >
              {tasks.length}
            </motion.div>
          </motion.div>
          <motion.div className="stat" variants={statItemVariants}>
            <div className="stat-title">Completed</div>
            <motion.div
              className="stat-value text-success"
              key={completedCount}
              {...valueChangeAnimation}
            >
              {completedCount}
            </motion.div>
          </motion.div>
          <motion.div className="stat" variants={statItemVariants}>
            <div className="stat-title">Pending</div>
            <motion.div
              className="stat-value text-warning"
              key={pendingCount}
              {...valueChangeAnimation}
            >
              {pendingCount}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export const TaskSummary = memo(TaskSummaryComponent);
