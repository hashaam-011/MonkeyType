import { Keyboard } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface KeyboardTestButtonProps {
    className?: string;
    wpm: number;
    returnStep?: number;
    username: string;
}

export default function KeyboardTestButton({ className, wpm, returnStep = 0, username }: KeyboardTestButtonProps) {
    // In a real app, this would link to a dedicated test page or open a modal.
    // For now, we'll link to a placeholder page.
    return (
        <Link href={`/keyboard-test?wpm=${wpm}&returnStep=${returnStep}&username=${username}`} className={cn(
            "flex items-center gap-2 px-4 py-2 mt-4 text-sm font-bold text-black bg-yellow-500 rounded-full hover:bg-yellow-400 transition-all active:scale-95",
            className
        )}>
            <Keyboard className="w-4 h-4" />
            <span>Test vs Year ({Math.round(wpm)} WPM)</span>
        </Link>
    );
}
