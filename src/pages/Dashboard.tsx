import { useCallback, useMemo, useState } from "react";
import "../types/cally.type";
import {
  FavoritesSection,
  SelectedDayTasks,
  TaskCalendar,
  TaskSummary,
} from "../components/Dashboard";
import AddTaskModal from "../components/Task/AddTaskModal";
import { useDashboardCalendar } from "../hooks";
import { useFavoritesStore, useTaskStore } from "../stores";
import type { MenuBoardProps } from "../types";

function Dashboard({ meals, loading, error }: MenuBoardProps) {
  const tasks = useTaskStore((state) => state.tasks);
  const updateTask = useTaskStore((state) => state.updateTask);
  const addTask = useTaskStore((state) => state.addTask);
  const favorites = useFavoritesStore((state) => state.favorites);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use custom calendar hook
  const {
    calendarRef,
    selectedDate,
    tasksForSelectedDate,
    formattedSelectedDate,
    calendarKey,
  } = useDashboardCalendar(tasks);

  // Get favorite meals
  const favoriteMeals = useMemo(() => {
    return meals.filter((meal) => favorites.includes(meal.id));
  }, [meals, favorites]);

  // Handle toggling task completion
  const handleToggleFinished = useCallback(
    (id: string, finished: boolean) => {
      updateTask(id, {
        dateFinished: finished ? new Date() : undefined,
      });
    },
    [updateTask]
  );

  // Handle opening the add task modal
  const handleAddTask = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Handle submitting a new task
  const handleSubmitTask = useCallback(
    (name: string, description: string, date: Date) => {
      addTask({
        id: crypto.randomUUID(),
        name,
        description: description || undefined,
        date,
      });
    },
    [addTask]
  );

  const containerClasses =
    "dashboard-container max-w-7xl mx-auto p-8 rounded-3xl shadow-2xl bg-base-200";
  const headingClasses =
    "text-4xl font-bold text-center mb-8 flex items-center justify-center gap-2 text-base-content";

  return (
    <div className={containerClasses}>
      <h1 className={headingClasses}>📊 Dashboard</h1>

      {/* Calendar and Selected Day Tasks - Side by Side */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <div className="flex flex-col dashboard-flex gap-8">
            <TaskCalendar
              calendarRef={calendarRef}
              calendarKey={calendarKey}
              selectedDate={selectedDate}
            />
            <SelectedDayTasks
              formattedSelectedDate={formattedSelectedDate}
              tasksForSelectedDate={tasksForSelectedDate}
              onToggleFinished={handleToggleFinished}
              onAddTask={handleAddTask}
            />
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitTask}
        defaultDate={selectedDate}
      />

      {/* Task Summary Section */}
      <TaskSummary tasks={tasks} />

      {/* Favorites Section */}
      <FavoritesSection
        meals={meals}
        favoriteMeals={favoriteMeals}
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default Dashboard;
