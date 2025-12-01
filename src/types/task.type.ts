import type { SortDirection, TaskSortKey } from "../config";

export interface Task {
    id: string;
    name: string;
    description?: string;
    dateCreated: Date;
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
    dateCreated: string;
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
    onSubmit: (name: string, description: string) => void;
}