import { Switch } from "../ui/switch";
import { useTheme } from "../providers/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="w-full flex justify-between">
      <span className="text-gray-950 dark:text-gray-100">Dark Mode</span>
      <Switch
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
        // disabled
        aria-readonly
      />
    </div>
  );
}
