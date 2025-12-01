import { useThemeStore } from "../stores/useThemeStore";

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
                {/* Sun icon */}
                <svg
                  aria-label="sun"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <title>Sun</title>
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                  </g>
                </svg>
                {/* Moon icon */}
                <svg
                  aria-label="moon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <title>Moon</title>
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </g>
                </svg>
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
