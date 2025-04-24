import { Moon, Sun } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useTheme } from '../components/theme-provider';

export function ModeToggle() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <Button variant="link" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 stroke-[1.5] dark:scale-0 text-stone-100 dark:text-stone-100" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 stroke-[1.5] dark:scale-100 text-stone-100 dark:text-stone-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
