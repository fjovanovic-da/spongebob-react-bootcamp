import "react";
import type { Task } from "./task.type";

// Extend JSX to include cally web components
declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            "calendar-date": React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement> & {
                    class?: string;
                    value?: string;
                    locale?: string;
                },
                HTMLElement
            >;
            "calendar-month": React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            >;
        }
    }
}

// Extend SVGProps to include slot
declare module "react" {
    // biome-ignore lint/correctness/noUnusedVariables: Required for type augmentation
    interface SVGProps<T> {
        slot?: string;
    }
}

export interface SelectedDayTasksProps {
    formattedSelectedDate: string;
    tasksForSelectedDate: Task[];
    onToggleFinished: (id: string, finished: boolean) => void;
    onAddTask: () => void;
}

export interface TaskCalendarProps {
    calendarRef: React.RefObject<HTMLElement | null>;
    calendarKey: string;
    selectedDate: string;
}
