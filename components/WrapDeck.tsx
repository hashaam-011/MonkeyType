'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Home, Type, Clock, Trophy, Activity, Flame, Users, User, Keyboard, Crown, Music, Volume2, VolumeX, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// --- Assets ---
// Using a placeholder Lo-Fi track. In a real app, this would be a local asset or a stable CDN link.
// For this demo, I'll use a reliable public domain or creative commons example if possible, 
// otherwise I'll put a placeholder that works if the user provides a file.
// Let's use a generic nature/ambient sound or a known free track URL effectively.
// Given constraints, I will use a reliable external URL for a simple beat.
const MUSIC_URL = "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3"; // "Lofi Study" style clip

// --- Card Wrapper ---
const PlayingCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={cn(
            "relative w-full max-w-sm md:max-w-md aspect-[3/4] bg-zinc-950 rounded-3xl border-4 border-zinc-800 shadow-2xl flex flex-col items-center justify-center p-8 overflow-hidden transform-gpu transition-all",
            // Subtle gradient shine
            "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none",
            className
        )}>
            {/* Decorative inner border */}
            <div className="absolute inset-4 border border-zinc-800/50 rounded-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center">
                {children}
            </div>
        </div>
    );
};

// --- Music Player ---
const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio(MUSIC_URL);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.4;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.log("Audio play failed (interaction required)", e));
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <button
            onClick={togglePlay}
            className="absolute top-6 right-6 z-30 p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-yellow-500 transition-all hover:scale-110"
        >
            {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
    );
};

// --- Slides ---

const IntroSlide = ({ data }: { data: any }) => (
    <PlayingCard className="border-yellow-500/50 shadow-yellow-500/10">
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-500 mb-6 shadow-lg shadow-yellow-500/20"
        >
            {/* Avatar */}
            <img src={data.avatarUrl} alt={data.name} className="w-full h-full object-cover" />
        </motion.div>
        <h2 className="text-4xl font-bold text-white tracking-tight mb-2">
            Hello,
        </h2>
        <h1 className="text-5xl font-black text-yellow-500 mb-8 break-all line-clamp-2">
            {data.name}
        </h1>
        <p className="text-xl text-zinc-400 font-light max-w-[200px]">
            Your <span className="font-mono text-white font-bold">2025</span> Typing Wrap is ready.
        </p>
    </PlayingCard>
);

const TestsSlide = ({ data }: { data: any }) => (
    <PlayingCard>
        <div className="absolute top-8 right-8 text-yellow-500/20">
            <Activity className="w-24 h-24" />
        </div>
        <p className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-8 font-semibold">Tests Completed</p>
        <motion.h2
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-8xl font-black text-white leading-none mb-4"
        >
            {data.stats.completedTests}
        </motion.h2>
        <p className="text-lg text-zinc-400">Total tests run</p>
    </PlayingCard>
);

const TimeSlide = ({ data }: { data: any }) => (
    <PlayingCard className="border-blue-500/20">
        <div className="absolute top-8 left-8 text-blue-500/20">
            <Clock className="w-24 h-24" />
        </div>
        <p className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-8 font-semibold">Time Spent</p>
        <motion.h2
            className="text-7xl font-black text-blue-500 mb-2"
        >
            {(data.stats.timeTyping / 3600).toFixed(1)}
        </motion.h2>
        <p className="text-2xl font-bold text-white mb-4">Hours</p>
        <p className="text-sm text-zinc-400 max-w-[200px]">That's a lot of clacking.</p>
    </PlayingCard>
);

const WpmSlide = ({ data }: { data: any }) => {
    const best60 = data.personalBests?.time?.[60]?.[0]?.wpm || 0;
    const best15 = data.personalBests?.time?.[15]?.[0]?.wpm || 0;
    const best = Math.max(best60, best15);

    return (
        <PlayingCard className="border-green-500/20">
            <div className="absolute -bottom-4 -right-4 text-green-500/10">
                <Trophy className="w-48 h-48" />
            </div>
            <p className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-6 font-semibold">Top Speed</p>
            <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-8xl font-black text-green-500 mb-2"
            >
                {best > 0 ? Math.round(best) : '-'}
            </motion.h2>
            <span className="text-xl font-bold text-white bg-green-500/10 px-4 py-1 rounded-full border border-green-500/20">WPM</span>

            <div className="mt-12 w-full px-8 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">15s PB</span>
                    <span className="text-white font-mono">{best15 || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">60s PB</span>
                    <span className="text-white font-mono">{best60 || '-'}</span>
                </div>
            </div>
        </PlayingCard>
    );
};

const StorySlide = ({ data }: { data: any }) => {
    // Determine "Best Day" - looking for the PB timestamps
    const pb60 = data.personalBests?.time?.[60]?.[0];
    const pb15 = data.personalBests?.time?.[15]?.[0];

    // Choose the better PB as the "hero moment"
    const heroPb = (pb60?.wpm || 0) > (pb15?.wpm || 0) ? pb60 : pb15;

    // Default values if no data
    const date = heroPb ? new Date(heroPb.timestamp) : new Date();
    const wpm = heroPb ? Math.round(heroPb.wpm) : 0;
    const acc = heroPb ? Math.round(heroPb.acc) : 0;

    const formattedDate = date.toLocaleDateString("en-US", { month: 'long', day: 'numeric' });

    return (
        <PlayingCard className="border-zinc-700 bg-[#121212]">
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-zinc-800">
                <BookOpen className="w-32 h-32 opacity-20" />
            </div>

            <p className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-12 font-semibold relative z-10">The Chapter of {date.getFullYear()}</p>

            <div className="text-left space-y-6 relative z-10 px-2 font-serif leading-relaxed text-zinc-300 text-lg">
                <p>
                    It was a <span className="text-yellow-500 font-bold">{formattedDate}</span>.
                </p>
                <p>
                    You sat down, cracked your knuckles, and locked in.
                </p>
                <p>
                    For a moment, time stopped. You hit a blazing <span className="text-green-500 font-bold">{wpm} WPM</span> with <span className="text-blue-500 font-bold">{acc}%</span> accuracy.
                </p>
                <p>
                    It wasn't just typing. It was <span className="italic text-white">flow</span>.
                </p>
            </div>

            <div className="absolute bottom-8 right-8 text-zinc-700 text-xs font-mono">
                PAGE {wpm}
            </div>
        </PlayingCard>
    );
}

const PercentileSlide = ({ data }: { data: any }) => {
    const percentile = data.calculatedProfile?.percentile60s || 0;
    const topVal = Math.max(1, 100 - Math.round(percentile));

    if (percentile === 0) {
        return (
            <PlayingCard>
                <Users className="w-12 h-12 text-purple-500 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">Unranked</h3>
                <p className="text-zinc-500 text-sm">Play 60s mode to get ranked!</p>
            </PlayingCard>
        );
    }

    return (
        <PlayingCard className="border-purple-500/30">
            <div className="absolute top-0 right-0 p-6 opacity-20">
                <Crown className="w-32 h-32 text-purple-500" />
            </div>
            <p className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 font-semibold">Global Rank</p>
            <div className="mb-2">
                <p className="text-zinc-400 text-lg">Top</p>
                <motion.h2
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-9xl font-black text-purple-500 leading-none"
                    style={{ textShadow: '0 0 30px rgba(168,85,247,0.3)' }}
                >
                    {topVal}%
                </motion.h2>
            </div>
            <p className="text-sm text-zinc-500 mt-6 max-w-[220px]">
                Faster than <span className="text-white font-bold">{Math.round(percentile)}%</span> of users in 60s tests.
            </p>
        </PlayingCard>
    );
};

const DedicationSlide = ({ data }: { data: any }) => {
    return (
        <PlayingCard className="border-orange-500/20 bg-zinc-950">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/10 to-transparent pointer-events-none" />
            <Flame className="w-12 h-12 text-orange-500 mb-6" />
            <p className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-8 font-semibold">Dedication</p>

            <div className="w-full space-y-6 px-4">
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
                    <p className="text-3xl font-bold text-white mb-1">{data.maxStreak || 0}</p>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Day Streak</p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
                    <p className="text-2xl font-bold text-white mb-1">{Math.floor(data.xp || 0).toLocaleString()}</p>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Experience Points</p>
                </div>
            </div>
        </PlayingCard>
    );
};

const IdentitySlide = ({ data }: { data: any }) => {
    // Try to get keyboard from details; if missing, attempt to parse it from the bio string.
    const extractKeyboardFromBio = (bio) => {
        if (!bio) return null;
        const match = bio.match(/keyboard[:\s]+([\w\s-]+)/i);
        return match ? match[1].trim() : null;
    };
    const keyboard = data.details?.keyboard || extractKeyboardFromBio(data.details?.bio) || 'Unknown Keyboard';
    const website = data.website || null;

    return (
        <PlayingCard className="border-pink-500/20">
            <User className="w-12 h-12 text-pink-500 mb-6" />
            <p className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-8 font-semibold">Identity</p>

            <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-[280px] space-y-4">
                <div className="flex justify-center">
                    <Keyboard className="w-8 h-8 text-zinc-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white line-clamp-2 leading-tight">{keyboard}</h3>
                    <p className="text-xs text-zinc-600 mt-2">Main Driver</p>
                </div>
            </div>
            <div className="mt-8 px-8">
                <p className="text-lg text-white font-serif italic opacity-80 leading-relaxed">
                    "{data.details?.bio || 'Just typing.'}"
                </p>
                {website && (
                    <p className="mt-4 text-center">
                        <a href={website} target="_blank" rel="noopener noreferrer" className="text-yellow-400 underline">
                            Visit Website
                        </a>
                    </p>
                )}
            </div>
        </PlayingCard>
    );
};

const SummarySlide = ({ data }: { data: any }) => {
    const best60 = data.personalBests?.time?.[60]?.[0]?.wpm || 0;
    const best15 = data.personalBests?.time?.[15]?.[0]?.wpm || 0;
    const best = Math.max(best60, best15);
    const hours = (data.stats.timeTyping / 3600).toFixed(1);
    const percentile = data.calculatedProfile?.percentile60s;
    const topVal = percentile ? Math.max(1, 100 - Math.round(percentile)) : null;
    //
    return (
        <div className="relative w-full max-w-sm aspect-[3/4.5] bg-black rounded-3xl border border-zinc-700 p-6 flex flex-col justify-between shadow-2xl scale-[0.95] md:scale-100">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-700">
                    <img src={data.avatarUrl} alt={data.name} className="w-full h-full object-cover" />
                </div>
                <div>
                    <h3 className="font-bold text-xl text-white">{data.name}</h3>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">2025 Wrap</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 my-4">
                <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
                    <p className="text-[10px] text-zinc-500 uppercase mb-1">Tests</p>
                    <p className="text-2xl font-bold text-white">{data.stats.completedTests}</p>
                </div>
                <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
                    <p className="text-[10px] text-zinc-500 uppercase mb-1">Hours</p>
                    <p className="text-2xl font-bold text-blue-500">{hours}</p>
                </div>
                <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
                    <p className="text-[10px] text-zinc-500 uppercase mb-1">Peak WPM</p>
                    <p className="text-2xl font-bold text-green-500">{Math.round(best)}</p>
                </div>
                <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
                    <p className="text-[10px] text-zinc-500 uppercase mb-1">Rank</p>
                    <p className="text-2xl font-bold text-purple-500">
                        {topVal ? `Top ${topVal}%` : '-'}
                    </p>
                </div>
                <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 col-span-2 flex justify-between items-center">
                    <div>
                        <p className="text-[10px] text-zinc-500 uppercase mb-1">Streak</p>
                        <p className="text-xl font-bold text-orange-500">{data.maxStreak || 0} days</p>
                    </div>
                    <Flame className="w-6 h-6 text-orange-500/50" />
                </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-zinc-800 text-center">
                <div className="flex justify-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <p className="text-zinc-600 text-xs tracking-wider">MONKEYWRAP.VERCEL.APP</p>
            </div>
        </div>
    );
};

export default function WrapDeck({ data }: { data: any }) {
    const [step, setStep] = useState(0);

    const slides = [
        { id: 'intro', component: IntroSlide },
        { id: 'story', component: StorySlide }, // Inserted Story slide here
        { id: 'tests', component: TestsSlide },
        { id: 'time', component: TimeSlide },
        { id: 'wpm', component: WpmSlide },
        { id: 'percentile', component: PercentileSlide },
        { id: 'dedication', component: DedicationSlide },
        { id: 'identity', component: IdentitySlide },
        { id: 'summary', component: SummarySlide },
    ];

    const CurrentSlide = slides[step].component;

    const nextStep = () => {
        if (step < slides.length - 1) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 0) setStep(step - 1);
    };

    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-center p-6 bg-black overflow-hidden font-sans">
            {/* Ambient Background - Dynamic based on slide */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-800/50 to-transparent" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-zinc-900/20 rounded-full blur-[120px]" />
            </div>

            <MusicPlayer />

            <Link href="/" className="absolute top-6 left-6 z-20 p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all hover:bg-zinc-800 hover:scale-110">
                <Home className="w-5 h-5" />
            </Link>

            <div className="flex-1 flex items-center justify-center w-full max-w-6xl z-10 perspective-[1000px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 100, rotateX: -10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -100, rotateX: 10, scale: 0.8 }}
                        transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
                        className="w-full flex items-center justify-center"
                    >
                        <CurrentSlide data={data} />
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex items-center gap-8 pb-12 z-20">
                <button
                    onClick={prevStep}
                    disabled={step === 0}
                    className="p-4 rounded-full bg-zinc-900 border border-zinc-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 hover:scale-110 active:scale-95 transition-all"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex gap-2">
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-500 ease-out ${i === step ? 'w-8 bg-zinc-200' : 'w-2 bg-zinc-800'}`}
                        />
                    ))}
                </div>

                <button
                    onClick={nextStep}
                    disabled={step === slides.length - 1}
                    className="p-4 rounded-full bg-zinc-900 border border-zinc-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 hover:scale-110 active:scale-95 transition-all"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
