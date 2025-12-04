import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDashboardCalendar } from "../../hooks/useDashboardCalendar";
import type { Task } from "../../types/task.type";

describe("useDashboardCalendar", () => {
    const mockTasks: Task[] = [
        {
            id: "task-1",
            name: "Task 1",
            description: "Description 1",
            date: new Date("2025-12-04"),
        },
        {
            id: "task-2",
            name: "Task 2",
            description: "Description 2",
            date: new Date("2025-12-04"),
        },
        {
            id: "task-3",
            name: "Task 3",
            description: "Description 3",
            date: new Date("2025-12-05"),
        },
        {
            id: "task-4",
            name: "Task 4",
            date: new Date("2025-12-10"),
        },
    ];

    beforeEach(() => {
        // Mock the current date to ensure consistent tests
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2025-12-04"));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe("initial state", () => {
        it("should return a calendar ref", () => {
            const { result } = renderHook(() => useDashboardCalendar([]));

            expect(result.current.calendarRef).toBeDefined();
            expect(result.current.calendarRef.current).toBeNull();
        });

        it("should default selectedDate to today", () => {
            const { result } = renderHook(() => useDashboardCalendar([]));

            expect(result.current.selectedDate).toBe("2025-12-04");
        });

        it("should return empty tasksForSelectedDate when no tasks", () => {
            const { result } = renderHook(() => useDashboardCalendar([]));

            expect(result.current.tasksForSelectedDate).toEqual([]);
        });

        it("should format selectedDate correctly", () => {
            const { result } = renderHook(() => useDashboardCalendar([]));

            // The format is "weekday, month day, year"
            expect(result.current.formattedSelectedDate).toContain("2025");
            expect(result.current.formattedSelectedDate).toContain("December");
            expect(result.current.formattedSelectedDate).toContain("4");
        });
    });

    describe("tasksForSelectedDate", () => {
        it("should filter tasks for the selected date", () => {
            const { result } = renderHook(() => useDashboardCalendar(mockTasks));

            // Default selectedDate is "2025-12-04" (today)
            expect(result.current.tasksForSelectedDate).toHaveLength(2);
            expect(result.current.tasksForSelectedDate[0].id).toBe("task-1");
            expect(result.current.tasksForSelectedDate[1].id).toBe("task-2");
        });

        it("should return empty array when no tasks match selected date", () => {
            vi.setSystemTime(new Date("2025-12-01"));

            const { result } = renderHook(() => useDashboardCalendar(mockTasks));

            expect(result.current.tasksForSelectedDate).toEqual([]);
        });

        it("should update tasksForSelectedDate when tasks change", () => {
            const { result, rerender } = renderHook(
                ({ tasks }) => useDashboardCalendar(tasks),
                { initialProps: { tasks: mockTasks } }
            );

            expect(result.current.tasksForSelectedDate).toHaveLength(2);

            // Add a new task for the same date
            const newTasks = [
                ...mockTasks,
                {
                    id: "task-5",
                    name: "Task 5",
                    date: new Date("2025-12-04"),
                },
            ];

            rerender({ tasks: newTasks });

            expect(result.current.tasksForSelectedDate).toHaveLength(3);
        });
    });

    describe("formattedSelectedDate", () => {
        it("should format date in US locale with full weekday and month", () => {
            const { result } = renderHook(() => useDashboardCalendar([]));

            // Thursday, December 4, 2025
            expect(result.current.formattedSelectedDate).toMatch(/Thursday/);
            expect(result.current.formattedSelectedDate).toMatch(/December/);
            expect(result.current.formattedSelectedDate).toMatch(/4/);
            expect(result.current.formattedSelectedDate).toMatch(/2025/);
        });
    });

    describe("calendarKey", () => {
        it("should generate key from task dates", () => {
            const { result } = renderHook(() => useDashboardCalendar(mockTasks));

            // Key should be a comma-separated list of date strings
            expect(result.current.calendarKey).toContain("2025-12-04");
            expect(result.current.calendarKey).toContain("2025-12-05");
            expect(result.current.calendarKey).toContain("2025-12-10");
        });

        it("should return empty string when no tasks", () => {
            const { result } = renderHook(() => useDashboardCalendar([]));

            expect(result.current.calendarKey).toBe("");
        });

        it("should update key when tasks change", () => {
            const { result, rerender } = renderHook(
                ({ tasks }) => useDashboardCalendar(tasks),
                { initialProps: { tasks: mockTasks } }
            );

            const initialKey = result.current.calendarKey;

            const newTasks = [
                ...mockTasks,
                { id: "task-new", name: "New Task", date: new Date("2025-12-25") },
            ];

            rerender({ tasks: newTasks });

            expect(result.current.calendarKey).not.toBe(initialKey);
            expect(result.current.calendarKey).toContain("2025-12-25");
        });
    });

    describe("memoization", () => {
        it("should not change tasksForSelectedDate reference if tasks are the same", () => {
            const { result, rerender } = renderHook(
                ({ tasks }) => useDashboardCalendar(tasks),
                { initialProps: { tasks: mockTasks } }
            );

            const firstResult = result.current.tasksForSelectedDate;

            rerender({ tasks: mockTasks });

            expect(result.current.tasksForSelectedDate).toBe(firstResult);
        });

        it("should not change calendarKey reference if task dates are the same", () => {
            const { result, rerender } = renderHook(
                ({ tasks }) => useDashboardCalendar(tasks),
                { initialProps: { tasks: mockTasks } }
            );

            const firstKey = result.current.calendarKey;

            rerender({ tasks: mockTasks });

            expect(result.current.calendarKey).toBe(firstKey);
        });
    });

    describe("edge cases", () => {
        it("should handle tasks with same date", () => {
            const sameDateTasks: Task[] = [
                { id: "1", name: "Task 1", date: new Date("2025-12-04") },
                { id: "2", name: "Task 2", date: new Date("2025-12-04") },
                { id: "3", name: "Task 3", date: new Date("2025-12-04") },
            ];

            const { result } = renderHook(() => useDashboardCalendar(sameDateTasks));

            expect(result.current.tasksForSelectedDate).toHaveLength(3);
        });

        it("should handle tasks with dateFinished", () => {
            const tasksWithFinished: Task[] = [
                {
                    id: "1",
                    name: "Finished Task",
                    date: new Date("2025-12-04"),
                    dateFinished: new Date("2025-12-04"),
                },
            ];

            const { result } = renderHook(() =>
                useDashboardCalendar(tasksWithFinished)
            );

            expect(result.current.tasksForSelectedDate).toHaveLength(1);
            expect(result.current.tasksForSelectedDate[0].dateFinished).toBeDefined();
        });
    });
});
