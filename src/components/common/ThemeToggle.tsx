import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/use-theme";
import { Button } from "../common/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative hover:bg-accent/50 transition-colors"
      aria-label="Toggle theme"
      title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      <Sun
        className="h-5 w-5 transition-all duration-300 
                   rotate-0 scale-100 dark:-rotate-90 dark:scale-0"
        aria-hidden="true"
      />
      <Moon
        className="absolute h-5 w-5 transition-all duration-300 
                   rotate-90 scale-0 dark:rotate-0 dark:scale-100"
        aria-hidden="true"
      />
      <span className="sr-only">
        {`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      </span>
    </Button>
  );
}
