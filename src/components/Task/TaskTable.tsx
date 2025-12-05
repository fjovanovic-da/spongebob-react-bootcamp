import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  SORT_DIRECTIONS,
  TABLE_ITEMS_PER_PAGE,
  TASK_SORT_KEYS,
} from "../../config";
import { useMediaQuery } from "../../hooks";
import type {
  Task,
  TaskTableProps,
  TaskUpdateFormData,
} from "../../types/task.type";
import Pagination from "../Pagination";
import TaskMobileCard from "./TaskMobileCard";
import TaskTableRow from "./TaskTableRow";

const createTaskUpdateSchema = (dateFinished?: Date) =>
  z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    date: z
      .string()
      .min(1, "Date is required")
      .refine(
        (val) => {
          if (!dateFinished) return true;
          const selectedDate = new Date(val);
          return selectedDate <= dateFinished;
        },
        {
          message: "Date cannot be after the finished date",
        }
      ),
  });

// Helper to format Date to YYYY-MM-DD string for input[type="date"]
const toDateInputValue = (date: Date): string => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

function TaskTable({
  sortedTasks,
  sortKey,
  sortDirection,
  onSort,
  onToggleFinished,
  onUpdateTask,
  onDeleteTask,
}: TaskTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskUpdateFormData>({
    resolver: zodResolver(createTaskUpdateSchema(editingTask?.dateFinished)),
  });

  // Pagination calculations
  const totalItems = sortedTasks.length;
  const totalPages = Math.ceil(totalItems / TABLE_ITEMS_PER_PAGE);

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * TABLE_ITEMS_PER_PAGE;
    const endIndex = startIndex + TABLE_ITEMS_PER_PAGE;
    return sortedTasks.slice(startIndex, endIndex);
  }, [sortedTasks, currentPage]);

  // Reset to page 1 when tasks change significantly (e.g., filtering)
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleEdit = useCallback(
    (task: Task) => {
      setEditingId(task.id);
      setEditingTask(task);
      reset({
        name: task.name,
        description: task.description || "",
        date: toDateInputValue(task.date),
      });
    },
    [reset]
  );

  const handleSave = useCallback(() => {
    handleSubmit((data) => {
      if (editingId) {
        onUpdateTask(editingId, {
          name: data.name,
          description: data.description,
          date: new Date(data.date),
        });
        setEditingId(null);
        setEditingTask(null);
      }
    })();
  }, [editingId, handleSubmit, onUpdateTask]);

  const handleCancel = useCallback(() => {
    setEditingId(null);
    setEditingTask(null);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      if (window.confirm("Are you sure you want to delete this task?")) {
        onDeleteTask(id);
        // If we deleted the last item on the current page, go to previous page
        if (paginatedTasks.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
    },
    [onDeleteTask, paginatedTasks.length, currentPage]
  );

  const handleSortName = useCallback(() => {
    onSort(TASK_SORT_KEYS.NAME);
    setCurrentPage(1);
  }, [onSort]);

  const handleSortDate = useCallback(() => {
    onSort(TASK_SORT_KEYS.DATE);
    setCurrentPage(1);
  }, [onSort]);

  const handleSortDateFinished = useCallback(() => {
    onSort(TASK_SORT_KEYS.DATE_FINISHED);
    setCurrentPage(1);
  }, [onSort]);

  const sortIndicator = sortDirection === SORT_DIRECTIONS.ASC ? "↑" : "↓";

  return (
    <>
      {!isMobile ? (
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="cursor-pointer" onClick={handleSortName}>
                Name {sortKey === TASK_SORT_KEYS.NAME && sortIndicator}
              </th>
              <th>Description</th>
              <th className="cursor-pointer" onClick={handleSortDate}>
                Date {sortKey === TASK_SORT_KEYS.DATE && sortIndicator}
              </th>
              <th className="cursor-pointer" onClick={handleSortDateFinished}>
                Finished{" "}
                {sortKey === TASK_SORT_KEYS.DATE_FINISHED && sortIndicator}
              </th>
              <th>Completed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTasks.map((task) => (
              <TaskTableRow
                key={task.id}
                task={task}
                isEditing={editingId === task.id}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                onDelete={handleDelete}
                onToggleFinished={onToggleFinished}
                formRegister={register}
                formErrors={errors}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <div className="space-y-4">
          {paginatedTasks.map((task) => (
            <TaskMobileCard
              key={task.id}
              task={task}
              isEditing={editingId === task.id}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onDelete={handleDelete}
              onToggleFinished={onToggleFinished}
              formRegister={register}
              formErrors={errors}
            />
          ))}
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={TABLE_ITEMS_PER_PAGE}
        totalItems={totalItems}
      />
    </>
  );
}

export default memo(TaskTable);
