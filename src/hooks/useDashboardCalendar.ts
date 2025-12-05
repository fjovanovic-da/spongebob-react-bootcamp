import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Task } from "../types/task.type";

interface UseDashboardCalendarReturn {
    calendarRef: React.RefObject<HTMLElement | null>;
    selectedDate: string;
    tasksForSelectedDate: Task[];
    formattedSelectedDate: string;
    calendarKey: string;
}

export function useDashboardCalendar(tasks: Task[]): UseDashboardCalendarReturn {
    const calendarRef = useRef<HTMLElement>(null);

    // State for selected date (default to today)
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        return new Date().toISOString().split("T")[0];
    });

    // Create a set of date strings (YYYY-MM-DD) that have tasks - memoized
    const taskDateStrings = useMemo(() => {
        return tasks.map((task) => {
            const date = new Date(task.date);
            return date.toISOString().split("T")[0];
        });
    }, [tasks]);

    // Filter tasks for the selected date
    const tasksForSelectedDate = useMemo(() => {
        return tasks.filter((task) => {
            const taskDate = new Date(task.date).toISOString().split("T")[0];
            return taskDate === selectedDate;
        });
    }, [tasks, selectedDate]);

    // Format selected date for display
    const formattedSelectedDate = useMemo(() => {
        const date = new Date(selectedDate);
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }, [selectedDate]);

    // Create a stable key for the calendar to force re-render when tasks change
    const calendarKey = useMemo(
        () => taskDateStrings.join(","),
        [taskDateStrings]
    );

    // Stable callback for getDayParts
    const getDayParts = useCallback(
        (date: Date) => {
            const dateStr = date.toISOString().split("T")[0];
            if (taskDateStrings.includes(dateStr)) {
                return "has-task";
            }
            return "";
        },
        [taskDateStrings]
    );

    // Handle date selection from calendar
    const handleDateChange = useCallback((e: Event) => {
        const target = e.target as HTMLElement & { value: string };
        if (target.value) {
            setSelectedDate(target.value);
        }
    }, []);

    // Set up the getDayParts function and change event on the calendar element
    useEffect(() => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            (
                calendarEl as unknown as { getDayParts: (date: Date) => string }
            ).getDayParts = getDayParts;

            // Add change event listener
            calendarEl.addEventListener("change", handleDateChange);

            return () => {
                calendarEl.removeEventListener("change", handleDateChange);
            };
        }
    }, [getDayParts, handleDateChange]);

    return {
        calendarRef,
        selectedDate,
        tasksForSelectedDate,
        formattedSelectedDate,
        calendarKey,
    };
}
