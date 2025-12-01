import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SORT_DIRECTIONS, TASK_SORT_KEYS } from "../../config";
import type { Task, TaskTableProps } from "../../types/task.type";

const taskUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type TaskUpdateForm = z.infer<typeof taskUpdateSchema>;

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskUpdateForm>({
    resolver: zodResolver(taskUpdateSchema),
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    reset({ name: task.name, description: task.description || "" });
  };

  const handleSave = handleSubmit((data) => {
    if (editingId) {
      onUpdateTask(editingId, data);
      setEditingId(null);
    }
  });

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDeleteTask(id);
    }
  };

  return (
    <>
      {!isMobile ? (
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th
                className="cursor-pointer"
                onClick={() => onSort(TASK_SORT_KEYS.NAME)}
              >
                Name{" "}
                {sortKey === TASK_SORT_KEYS.NAME &&
                  (sortDirection === SORT_DIRECTIONS.ASC ? "↑" : "↓")}
              </th>
              <th>Description</th>
              <th
                className="cursor-pointer"
                onClick={() => onSort(TASK_SORT_KEYS.DATE)}
              >
                Date{" "}
                {sortKey === TASK_SORT_KEYS.DATE &&
                  (sortDirection === SORT_DIRECTIONS.ASC ? "↑" : "↓")}
              </th>
              <th
                className="cursor-pointer"
                onClick={() => onSort(TASK_SORT_KEYS.DATE_FINISHED)}
              >
                Finished{" "}
                {sortKey === TASK_SORT_KEYS.DATE_FINISHED &&
                  (sortDirection === SORT_DIRECTIONS.ASC ? "↑" : "↓")}
              </th>
              <th>Completed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTasks.map((task) => (
              <tr key={task.id}>
                <td>
                  {editingId === task.id ? (
                    <>
                      <input
                        {...register("name")}
                        className="input input-bordered input-sm"
                      />
                      {errors.name && (
                        <span className="text-error text-xs">
                          {errors.name.message}
                        </span>
                      )}
                    </>
                  ) : (
                    task.name
                  )}
                </td>
                <td>
                  {editingId === task.id ? (
                    <>
                      <input
                        {...register("description")}
                        className="input input-bordered input-sm"
                      />
                      {errors.description && (
                        <span className="text-error text-xs">
                          {errors.description.message}
                        </span>
                      )}
                    </>
                  ) : (
                    task.description || ""
                  )}
                </td>
                <td>{new Date(task.date).toLocaleDateString()}</td>
                <td>
                  {task.dateFinished
                    ? new Date(task.dateFinished).toLocaleDateString()
                    : "Not finished"}
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={!!task.dateFinished}
                    onChange={(e) =>
                      onToggleFinished(task.id, e.target.checked)
                    }
                  />
                </td>
                <td>
                  {editingId === task.id ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEdit(task)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-error btn-sm"
                        onClick={() => handleDelete(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="space-y-4">
          {sortedTasks.map((task) => (
            <div key={task.id} className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h3 className="card-title">
                  {editingId === task.id ? (
                    <>
                      <input
                        {...register("name")}
                        className="input input-bordered input-sm w-full"
                        placeholder="Task Name"
                      />
                      {errors.name && (
                        <span className="text-error text-xs">
                          {errors.name.message}
                        </span>
                      )}
                    </>
                  ) : (
                    task.name
                  )}
                </h3>
                <p>
                  {editingId === task.id ? (
                    <>
                      <input
                        {...register("description")}
                        className="input input-bordered input-sm w-full"
                        placeholder="Description"
                      />
                      {errors.description && (
                        <span className="text-error text-xs">
                          {errors.description.message}
                        </span>
                      )}
                    </>
                  ) : (
                    task.description || "No description"
                  )}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(task.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Finished:</strong>{" "}
                  {task.dateFinished
                    ? new Date(task.dateFinished).toLocaleDateString()
                    : "Not finished"}
                </p>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Completed</span>
                    <input
                      type="checkbox"
                      checked={!!task.dateFinished}
                      onChange={(e) =>
                        onToggleFinished(task.id, e.target.checked)
                      }
                      className="checkbox"
                    />
                  </label>
                </div>
                <div className="card-actions justify-end">
                  {editingId === task.id ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEdit(task)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-error btn-sm"
                        onClick={() => handleDelete(task.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default TaskTable;
