import { motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { AddTaskModal, TaskTable } from "../components/Task";
import {
  SORT_DIRECTIONS,
  type SortDirection,
  TASK_SORT_KEYS,
  type TaskSortKey,
} from "../config";
import { useTaskStore } from "../stores";
import type { Task } from "../types/task.type";
import {
  buttonHoverTap,
  containerVariants,
  emptyStateVariants,
  itemVariants,
} from "../utils/animations";

function TaskBoard() {
  const { tasks, updateTask, addTask, removeTask } = useTaskStore();
  const [sortKey, setSortKey] = useState<TaskSortKey>(TASK_SORT_KEYS.DATE);
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SORT_DIRECTIONS.ASC
  );
  const [modalOpen, setModalOpen] = useState(false);

  const handleSort = useCallback(
    (key: TaskSortKey) => {
      if (sortKey === key) {
        setSortDirection((prev) =>
          prev === SORT_DIRECTIONS.ASC
            ? SORT_DIRECTIONS.DESC
            : SORT_DIRECTIONS.ASC
        );
      } else {
        setSortKey(key);
        setSortDirection(SORT_DIRECTIONS.ASC);
      }
    },
    [sortKey]
  );

  const handleToggleFinished = useCallback(
    (id: string, checked: boolean) => {
      updateTask(id, { dateFinished: checked ? new Date() : undefined });
    },
    [updateTask]
  );

  const handleUpdateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      updateTask(id, updates);
    },
    [updateTask]
  );

  const handleDeleteTask = useCallback(
    (id: string) => {
      removeTask(id);
    },
    [removeTask]
  );

  const handleAddTask = useCallback(
    (name: string, description: string, date: Date) => {
      addTask({
        id: Date.now().toString(),
        name,
        description: description || undefined,
        date,
      });
    },
    [addTask]
  );

  const handleOpenModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      let aVal: number;
      let bVal: number;

      if (sortKey === TASK_SORT_KEYS.NAME) {
        aVal = a.name.localeCompare(b.name);
        return sortDirection === SORT_DIRECTIONS.ASC ? aVal : -aVal;
      } else {
        aVal =
          sortKey === TASK_SORT_KEYS.DATE
            ? new Date(a.date).getTime()
            : a.dateFinished
            ? new Date(a.dateFinished).getTime()
            : Number.MAX_SAFE_INTEGER;
        bVal =
          sortKey === TASK_SORT_KEYS.DATE
            ? new Date(b.date).getTime()
            : b.dateFinished
            ? new Date(b.dateFinished).getTime()
            : Number.MAX_SAFE_INTEGER;
        return sortDirection === SORT_DIRECTIONS.ASC
          ? aVal - bVal
          : bVal - aVal;
      }
    });
  }, [tasks, sortKey, sortDirection]);

  // Style classes
  const containerClasses =
    "task-board-container max-w-7xl mx-auto p-8 rounded-3xl shadow-2xl bg-base-200";
  const headingClasses =
    "text-4xl font-bold text-center mb-2 flex items-center justify-center gap-2 text-base-content";

  return (
    <motion.div
      className={containerClasses}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className={headingClasses} variants={itemVariants}>
        Task Board 📋
      </motion.h1>
      <motion.div className="flex justify-end mb-4" variants={itemVariants}>
        <motion.button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenModal}
          {...buttonHoverTap}
        >
          Add Task
        </motion.button>
      </motion.div>
      {sortedTasks.length === 0 ? (
        <motion.p
          className="text-center"
          variants={emptyStateVariants}
          initial="hidden"
          animate="visible"
        >
          No tasks available.
        </motion.p>
      ) : (
        <motion.div variants={itemVariants}>
          <TaskTable
            sortedTasks={sortedTasks}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            onToggleFinished={handleToggleFinished}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </motion.div>
      )}

      <AddTaskModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddTask}
      />
    </motion.div>
  );
}

export default TaskBoard;
