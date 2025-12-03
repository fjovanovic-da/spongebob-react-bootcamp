import { MoonIcon, SunIcon } from "../components/icons";
import { useThemeStore } from "../stores";

function SettingsBoard() {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "aqua";

  const containerClasses =
    "settings-board-container max-w-7xl mx-auto p-8 rounded-3xl shadow-2xl bg-base-200";
  const headingClasses =
    "text-4xl font-bold text-center mb-8 flex items-center justify-center gap-2 text-base-content";

  return (
    <div className={containerClasses}>
      <h1 className={headingClasses}>⚙️ Settings</h1>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Appearance</h2>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-4">
              <span className="label-text text-base">Theme</span>
              <label className="toggle text-base-content">
                <input
                  type="checkbox"
                  checked={isDark}
                  onChange={toggleTheme}
                  className="theme-controller"
                  value="aqua"
                />
                <SunIcon />
                <MoonIcon />
              </label>
              <span className="label-text text-sm opacity-60">
                {isDark ? "Dark (Aqua)" : "Light (Cupcake)"}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsBoard;
