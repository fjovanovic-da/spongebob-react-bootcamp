import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { SortDirection, TaskSortKey } from "../config";

export interface Task {
    id: string;
    name: string;
    description?: string;
    date: Date;
    dateFinished?: Date;
}

export interface TaskStore {
    tasks: Task[];
    addTask: (task: Task) => void;
    removeTask: (id: string) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
}

export interface RawTask {
    id: string;
    name: string;
    description?: string;
    date: string;
    dateFinished?: string;
}

export interface TaskTableProps {
    sortedTasks: Task[];
    sortKey: TaskSortKey;
    sortDirection: SortDirection;
    onSort: (key: TaskSortKey) => void;
    onToggleFinished: (id: string, checked: boolean) => void;
    onUpdateTask: (id: string, updates: Partial<Task>) => void;
    onDeleteTask: (id: string) => void;
}

export interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, description: string, date: Date) => void;
    defaultDate?: string;
}

export interface TaskSummaryProps {
    tasks: Task[];
}

export interface TaskUpdateFormData {
    name: string;
    description?: string;
    date: string;
}

export interface TaskTableRowProps {
    task: Task;
    isEditing: boolean;
    onEdit: (task: Task) => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete: (id: string) => void;
    onToggleFinished: (id: string, checked: boolean) => void;
    formRegister: UseFormRegister<TaskUpdateFormData>;
    formErrors: FieldErrors<TaskUpdateFormData>;
}