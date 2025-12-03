import { memo, useCallback } from "react";
import type { TaskTableRowProps } from "../../types/task.type";
import { formatDate } from "../../utils/formatDate";

const TaskTableRow = memo(function TaskTableRow({
  task,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onToggleFinished,
  formRegister,
  formErrors,
}: TaskTableRowProps) {
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
    <tr>
      <td>
        {isEditing ? (
          <>
            <input
              {...formRegister("name")}
              className="input input-bordered input-sm"
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
      </td>
      <td>
        {isEditing ? (
          <>
            <input
              {...formRegister("description")}
              className="input input-bordered input-sm"
            />
            {formErrors.description && (
              <span className="text-error text-xs">
                {formErrors.description.message}
              </span>
            )}
          </>
        ) : (
          task.description || ""
        )}
      </td>
      <td>
        {isEditing ? (
          <>
            <input
              type="date"
              {...formRegister("date")}
              className="input input-bordered input-sm"
            />
            {formErrors.date && (
              <span className="text-error text-xs">
                {formErrors.date.message}
              </span>
            )}
          </>
        ) : (
          formatDate(task.date)
        )}
      </td>
      <td>
        {task.dateFinished ? formatDate(task.dateFinished) : "Not finished"}
      </td>
      <td>
        <input
          type="checkbox"
          checked={!!task.dateFinished}
          onChange={handleToggle}
        />
      </td>
      <td>
        {isEditing ? (
          <div className="flex gap-2">
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
          </div>
        ) : (
          <div className="flex gap-2">
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
          </div>
        )}
      </td>
    </tr>
  );
});

export default TaskTableRow;
