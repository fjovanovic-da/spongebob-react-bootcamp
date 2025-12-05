import { motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import "../types/cally.type";
import {
  FavoritesSection,
  SelectedDayTasks,
  TaskCalendar,
  TaskSummary,
} from "../components/Dashboard";
import AddTaskModal from "../components/Task/AddTaskModal";
import { useDashboardCalendar, useMeals } from "../hooks";
import { useFavoritesStore, useTaskStore } from "../stores";
import { containerVariants, itemVariants } from "../utils/animations";

function Dashboard() {
  const { meals, loading, error } = useMeals();
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
    <motion.div
      className={containerClasses}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className={headingClasses} variants={itemVariants}>
        📊 Dashboard
      </motion.h1>

      {/* Calendar and Selected Day Tasks - Side by Side */}
      <motion.div
        className="card bg-base-100 shadow-xl mb-8"
        variants={itemVariants}
      >
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
      </motion.div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitTask}
        defaultDate={selectedDate}
      />

      {/* Task Summary Section */}
      <motion.div variants={itemVariants}>
        <TaskSummary tasks={tasks} />
      </motion.div>

      {/* Favorites Section */}
      <motion.div variants={itemVariants}>
        <FavoritesSection
          meals={meals}
          favoriteMeals={favoriteMeals}
          loading={loading}
          error={error}
        />
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;
