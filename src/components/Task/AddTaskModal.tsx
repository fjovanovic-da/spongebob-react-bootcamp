import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { AddTaskModalProps } from "../../types/task.type";

const taskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
});

type TaskFormData = z.infer<typeof taskSchema>;

function AddTaskModal({ isOpen, onClose, onSubmit }: AddTaskModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmitForm = (data: TaskFormData) => {
    onSubmit(data.name, data.description || "", new Date(data.date));
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add New Task</h3>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="form-control">
            <label className="label" htmlFor="task-name">
              <span className="label-text">Task Name</span>
            </label>
            <input
              id="task-name"
              type="text"
              placeholder="Enter task name"
              className="input input-bordered w-full"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-error text-sm">{errors.name.message}</span>
            )}
          </div>
          <div className="form-control">
            <label className="label" htmlFor="task-description">
              <span className="label-text">Description (optional)</span>
            </label>
            <textarea
              id="task-description"
              placeholder="Enter task description"
              className="textarea textarea-bordered w-full"
              {...register("description")}
            />
            {errors.description && (
              <span className="text-error text-sm">
                {errors.description.message}
              </span>
            )}
          </div>
          <div className="form-control">
            <label className="label" htmlFor="task-date">
              <span className="label-text">Date</span>
            </label>
            <input
              id="task-date"
              type="date"
              className="input input-bordered w-full"
              {...register("date")}
            />
            {errors.date && (
              <span className="text-error text-sm">{errors.date.message}</span>
            )}
          </div>
          <div className="modal-action">
            <button type="button" className="btn" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;
