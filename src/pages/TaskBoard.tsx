import { useState } from "react";
import AddTaskModal from "../components/Task/AddTaskModal";
import TaskTable from "../components/Task/TaskTable";
import {
  SORT_DIRECTIONS,
  type SortDirection,
  TASK_SORT_KEYS,
  type TaskSortKey,
} from "../config";
import { useTaskStore } from "../stores/useTaskStore";
import type { Task } from "../types/task.type";

function TaskBoard() {
  const { tasks, updateTask, addTask, removeTask } = useTaskStore();
  const [sortKey, setSortKey] = useState<TaskSortKey>(TASK_SORT_KEYS.DATE);
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SORT_DIRECTIONS.ASC
  );
  const [modalOpen, setModalOpen] = useState(false);

  const handleSort = (key: TaskSortKey) => {
    if (sortKey === key) {
      setSortDirection(
        sortDirection === SORT_DIRECTIONS.ASC
          ? SORT_DIRECTIONS.DESC
          : SORT_DIRECTIONS.ASC
      );
    } else {
      setSortKey(key);
      setSortDirection(SORT_DIRECTIONS.ASC);
    }
  };

  const handleToggleFinished = (id: string, checked: boolean) => {
    updateTask(id, { dateFinished: checked ? new Date() : undefined });
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    updateTask(id, updates);
  };

  const handleDeleteTask = (id: string) => {
    removeTask(id);
  };

  const handleAddTask = (name: string, description: string, date: Date) => {
    addTask({
      id: Date.now().toString(),
      name,
      description: description || undefined,
      date,
    });
  };

  const sortedTasks = [...tasks].sort((a, b) => {
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
      return sortDirection === SORT_DIRECTIONS.ASC ? aVal - bVal : bVal - aVal;
    }
  });

  // Style classes
  const containerClasses =
    "task-board-container max-w-7xl mx-auto p-8 rounded-3xl shadow-2xl bg-base-200";
  const headingClasses =
    "text-4xl font-bold text-center mb-2 flex items-center justify-center gap-2 text-base-content";

  return (
    <div className={containerClasses}>
      <h1 className={headingClasses}>Task Board 📋</h1>
      <div className="flex justify-end mb-4">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setModalOpen(true)}
        >
          Add Task
        </button>
      </div>
      {sortedTasks.length === 0 ? (
        <p className="text-center">No tasks available.</p>
      ) : (
        <TaskTable
          sortedTasks={sortedTasks}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
          onToggleFinished={handleToggleFinished}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      <AddTaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddTask}
      />
    </div>
  );
}

export default TaskBoard;
