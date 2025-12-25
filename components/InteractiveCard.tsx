import { useState } from 'react';
import { cn } from '@/lib/utils';

interface InteractiveCardProps {
    title: string;
    cover?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    unlockAction?: (unlock: () => void) => React.ReactNode;
}

export default function InteractiveCard({ title, cover, children, className, unlockAction }: InteractiveCardProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className={cn(
            "relative w-full max-w-sm md:max-w-md aspect-[3/4] bg-[var(--card-bg)] rounded-3xl border-4 border-zinc-800 shadow-2xl flex flex-col overflow-hidden transform-gpu transition-all",
            className
        )}>
            {/* Header / Trigger Area */}
            <button
                onClick={() => setOpen(!open)}
                className="z-20 w-full p-6 text-left text-2xl font-bold text-white hover:text-[var(--accent-color)] transition-colors bg-black/20 backdrop-blur-sm border-b border-zinc-800/50 flex justify-between items-center"
            >
                <span>{title}</span>
                <span className="text-sm text-zinc-500 font-mono">{open ? 'CLOSE' : 'OPEN'}</span>
            </button>

            {/* Main Content Area */}
            <div className="relative flex-1 w-full h-full overflow-hidden">

                {/* Cover Content (Visible when closed) */}
                <div
                    className={`absolute inset-0 flex flex-col items-center justify-center p-8 transition-opacity duration-500 ${open ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                    {cover}

                    {/* Render Custom Unlock Action if provided and not yet open */}
                    {!open && unlockAction && (
                        <div className="absolute inset-0 z-50">
                            {unlockAction(() => setOpen(true))}
                        </div>
                    )}
                </div>

                {/* Revealed Content (Visible when open) */}
                <div
                    className={`absolute inset-0 p-8 overflow-y-auto transition-all duration-500 transform ${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'}`}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
