import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from '@clerk/nextjs';
import { useTheme } from 'next-themes';

export default function Home() {
    return (
        <div>
            <UserButton afterSignOutUrl="/" />
            <ModeToggle />
        </div>
    );
}
