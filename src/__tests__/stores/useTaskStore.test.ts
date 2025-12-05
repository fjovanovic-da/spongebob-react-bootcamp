import { beforeEach, describe, expect, it } from "vitest";
import { useTaskStore } from "../../stores/useTaskStore";
import type { Task } from "../../types/task.type";

describe("useTaskStore", () => {
    beforeEach(() => {
        // Reset store state before each test
        useTaskStore.setState({ tasks: [] });
    });

    const createMockTask = (overrides?: Partial<Task>): Task => ({
        id: "task-1",
        name: "Test Task",
        description: "Test description",
        date: new Date("2025-12-04"),
        ...overrides,
    });

    describe("initial state", () => {
        it("should have empty tasks array", () => {
            const { tasks } = useTaskStore.getState();
            expect(tasks).toEqual([]);
        });
    });

    describe("addTask", () => {
        it("should add a task to the store", () => {
            const task = createMockTask();
            const { addTask } = useTaskStore.getState();

            addTask(task);

            const { tasks } = useTaskStore.getState();
            expect(tasks).toHaveLength(1);
            expect(tasks[0]).toEqual(task);
        });

        it("should add multiple tasks", () => {
            const task1 = createMockTask({ id: "task-1", name: "Task 1" });
            const task2 = createMockTask({ id: "task-2", name: "Task 2" });
            const task3 = createMockTask({ id: "task-3", name: "Task 3" });

            const { addTask } = useTaskStore.getState();
            addTask(task1);
            addTask(task2);
            addTask(task3);

            const { tasks } = useTaskStore.getState();
            expect(tasks).toHaveLength(3);
            expect(tasks[0].name).toBe("Task 1");
            expect(tasks[1].name).toBe("Task 2");
            expect(tasks[2].name).toBe("Task 3");
        });

        it("should preserve existing tasks when adding new one", () => {
            const existingTask = createMockTask({ id: "existing", name: "Existing" });
            useTaskStore.setState({ tasks: [existingTask] });

            const newTask = createMockTask({ id: "new", name: "New Task" });
            useTaskStore.getState().addTask(newTask);

            const { tasks } = useTaskStore.getState();
            expect(tasks).toHaveLength(2);
            expect(tasks).toContainEqual(existingTask);
            expect(tasks).toContainEqual(newTask);
        });

        it("should add task with optional dateFinished", () => {
            const taskWithFinishDate = createMockTask({
                id: "finished-task",
                dateFinished: new Date("2025-12-05"),
            });

            useTaskStore.getState().addTask(taskWithFinishDate);

            const { tasks } = useTaskStore.getState();
            expect(tasks[0].dateFinished).toEqual(new Date("2025-12-05"));
        });

        it("should add task without description", () => {
            const taskWithoutDescription: Task = {
                id: "no-desc",
                name: "No Description Task",
                date: new Date("2025-12-04"),
            };

            useTaskStore.getState().addTask(taskWithoutDescription);

            const { tasks } = useTaskStore.getState();
            expect(tasks[0].description).toBeUndefined();
        });
    });

    describe("removeTask", () => {
        it("should remove a task by id", () => {
            const task = createMockTask({ id: "to-remove" });
            useTaskStore.setState({ tasks: [task] });

            const { removeTask } = useTaskStore.getState();
            removeTask("to-remove");

            const { tasks } = useTaskStore.getState();
            expect(tasks).toHaveLength(0);
        });

        it("should only remove the specified task", () => {
            const task1 = createMockTask({ id: "task-1", name: "Task 1" });
            const task2 = createMockTask({ id: "task-2", name: "Task 2" });
            const task3 = createMockTask({ id: "task-3", name: "Task 3" });
            useTaskStore.setState({ tasks: [task1, task2, task3] });

            useTaskStore.getState().removeTask("task-2");

            const { tasks } = useTaskStore.getState();
            expect(tasks).toHaveLength(2);
            expect(tasks.map((t) => t.id)).toEqual(["task-1", "task-3"]);
        });

        it("should do nothing if task id does not exist", () => {
            const task = createMockTask({ id: "existing" });
            useTaskStore.setState({ tasks: [task] });

            useTaskStore.getState().removeTask("non-existent");

            const { tasks } = useTaskStore.getState();
            expect(tasks).toHaveLength(1);
            expect(tasks[0].id).toBe("existing");
        });

        it("should handle removing from empty tasks array", () => {
            useTaskStore.getState().removeTask("any-id");

            const { tasks } = useTaskStore.getState();
            expect(tasks).toEqual([]);
        });
    });

    describe("updateTask", () => {
        it("should update task name", () => {
            const task = createMockTask({ id: "task-1", name: "Original Name" });
            useTaskStore.setState({ tasks: [task] });

            useTaskStore.getState().updateTask("task-1", { name: "Updated Name" });

            const { tasks } = useTaskStore.getState();
            expect(tasks[0].name).toBe("Updated Name");
        });

        it("should update task description", () => {
            const task = createMockTask({ id: "task-1", description: "Original" });
            useTaskStore.setState({ tasks: [task] });

            useTaskStore.getState().updateTask("task-1", { description: "Updated" });

            const { tasks } = useTaskStore.getState();
            expect(tasks[0].description).toBe("Updated");
        });

        it("should update task date", () => {
            const task = createMockTask({ id: "task-1" });
            useTaskStore.setState({ tasks: [task] });

            const newDate = new Date("2025-12-25");
            useTaskStore.getState().updateTask("task-1", { date: newDate });

            const { tasks } = useTaskStore.getState();
            expect(tasks[0].date).toEqual(newDate);
        });

        it("should update task dateFinished", () => {
            const task = createMockTask({ id: "task-1" });
            useTaskStore.setState({ tasks: [task] });

            const finishedDate = new Date("2025-12-10");
            useTaskStore.getState().updateTask("task-1", { dateFinished: finishedDate });

            const { tasks } = useTaskStore.getState();
            expect(tasks[0].dateFinished).toEqual(finishedDate);
        });

        it("should update multiple fields at once", () => {
            const task = createMockTask({ id: "task-1" });
            useTaskStore.setState({ tasks: [task] });

            useTaskStore.getState().updateTask("task-1", {
                name: "New Name",
                description: "New Description",
                dateFinished: new Date("2025-12-15"),
            });

            const { tasks } = useTaskStore.getState();
            expect(tasks[0].name).toBe("New Name");
            expect(tasks[0].description).toBe("New Description");
            expect(tasks[0].dateFinished).toEqual(new Date("2025-12-15"));
        });

        it("should only update the specified task", () => {
            const task1 = createMockTask({ id: "task-1", name: "Task 1" });
            const task2 = createMockTask({ id: "task-2", name: "Task 2" });
            useTaskStore.setState({ tasks: [task1, task2] });

            useTaskStore.getState().updateTask("task-1", { name: "Updated Task 1" });

            const { tasks } = useTaskStore.getState();
            expect(tasks[0].name).toBe("Updated Task 1");
            expect(tasks[1].name).toBe("Task 2");
        });

        it("should preserve other fields when updating", () => {
            const task = createMockTask({
                id: "task-1",
                name: "Original",
                description: "Original Description",
                date: new Date("2025-12-04"),
            });
            useTaskStore.setState({ tasks: [task] });

            useTaskStore.getState().updateTask("task-1", { name: "Updated" });

            const { tasks } = useTaskStore.getState();
            expect(tasks[0].name).toBe("Updated");
            expect(tasks[0].description).toBe("Original Description");
            expect(tasks[0].date).toEqual(new Date("2025-12-04"));
        });

        it("should do nothing if task id does not exist", () => {
            const task = createMockTask({ id: "existing", name: "Original" });
            useTaskStore.setState({ tasks: [task] });

            useTaskStore.getState().updateTask("non-existent", { name: "Updated" });

            const { tasks } = useTaskStore.getState();
            expect(tasks[0].name).toBe("Original");
        });

        it("should clear dateFinished when set to undefined", () => {
            const task = createMockTask({
                id: "task-1",
                dateFinished: new Date("2025-12-05"),
            });
            useTaskStore.setState({ tasks: [task] });

            useTaskStore.getState().updateTask("task-1", { dateFinished: undefined });

            const { tasks } = useTaskStore.getState();
            expect(tasks[0].dateFinished).toBeUndefined();
        });
    });

    describe("combined operations", () => {
        it("should handle add, update, and remove in sequence", () => {
            const { addTask, updateTask, removeTask } = useTaskStore.getState();

            // Add tasks
            addTask(createMockTask({ id: "task-1", name: "Task 1" }));
            addTask(createMockTask({ id: "task-2", name: "Task 2" }));

            // Update a task
            updateTask("task-1", { name: "Updated Task 1" });

            // Remove a task
            removeTask("task-2");

            const { tasks } = useTaskStore.getState();
            expect(tasks).toHaveLength(1);
            expect(tasks[0].id).toBe("task-1");
            expect(tasks[0].name).toBe("Updated Task 1");
        });
    });
});
