import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RawTask, Task, TaskStore } from '../types/task.type';

const persistOptions = {
    name: 'task-store',
    deserialize: (str: string) => {
        const parsed = JSON.parse(str);
        if (parsed.state?.tasks) {
            parsed.state.tasks = parsed.state.tasks.map((task: RawTask) => ({
                ...task,
                dateCreated: new Date(task.dateCreated),
                dateFinished: task.dateFinished ? new Date(task.dateFinished) : undefined,
            } as Task));
        }
        return parsed;
    },
} as const;

export const useTaskStore = create<TaskStore>()(
    persist(
        (set) => ({
            tasks: [],
            addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
            removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
            updateTask: (id, updates) =>
                set((state) => ({
                    tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
                })),
        }),
        persistOptions
    )
);