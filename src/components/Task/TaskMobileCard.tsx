import { memo, useCallback } from "react";
import type { TaskTableRowProps } from "../../types/task.type";
import { formatDate } from "../../utils/formatDate";

type TaskMobileCardProps = TaskTableRowProps;

const TaskMobileCard = memo(function TaskMobileCard({
  task,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onToggleFinished,
  formRegister,
  formErrors,
}: TaskMobileCardProps) {
  const handleToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onToggleFinished(task.id, e.target.checked);
    },
    [onToggleFinished, task.id]
  );

  const handleEditClick = useCallback(() => {
    onEdit(task);
  }, [onEdit, task]);

  const handleDeleteClick = useCallback(() => {
    onDelete(task.id);
  }, [onDelete, task.id]);

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <h3 className="card-title">
          {isEditing ? (
            <>
              <input
                {...formRegister("name")}
                className="input input-bordered input-sm w-full"
                placeholder="Task Name"
              />
              {formErrors.name && (
                <span className="text-error text-xs">
                  {formErrors.name.message}
                </span>
              )}
            </>
          ) : (
            task.name
          )}
        </h3>
        <p>
          {isEditing ? (
            <>
              <input
                {...formRegister("description")}
                className="input input-bordered input-sm w-full"
                placeholder="Description"
              />
              {formErrors.description && (
                <span className="text-error text-xs">
                  {formErrors.description.message}
                </span>
              )}
            </>
          ) : (
            task.description || "No description"
          )}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {isEditing ? (
            <>
              <input
                type="date"
                {...formRegister("date")}
                className="input input-bordered input-sm"
              />
              {formErrors.date && (
                <span className="text-error text-xs block">
                  {formErrors.date.message}
                </span>
              )}
            </>
          ) : (
            formatDate(task.date)
          )}
        </p>
        <p>
          <strong>Finished:</strong>{" "}
          {task.dateFinished ? formatDate(task.dateFinished) : "Not finished"}
        </p>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Completed</span>
            <input
              type="checkbox"
              checked={!!task.dateFinished}
              onChange={handleToggle}
              className="checkbox"
            />
          </label>
        </div>
        <div className="card-actions justify-end">
          {isEditing ? (
            <>
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={onSave}
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onCancel}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleEditClick}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-error btn-sm"
                onClick={handleDeleteClick}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default TaskMobileCard;
