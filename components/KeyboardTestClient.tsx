'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { RefreshCw, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const WORDS = "the quick brown fox jumps over the lazy dog typist fast speed keyboard mechanical switch click clack";

export default function KeyboardTestPage() {
    const searchParams = useSearchParams();
    const targetWpm = parseFloat(searchParams.get('wpm') || '0');
    const returnStep = searchParams.get('returnStep') || '0';
    const username = searchParams.get('username') || '';

    // Test state
    const [input, setInput] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [wpm, setWpm] = useState(0);
    const [finished, setFinished] = useState(false);

    const targetText = WORDS;

    const calculateWpm = (currentInput: string) => {
        if (!startTime) return 0;
        const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
        if (timeElapsed === 0) return 0;
        const words = currentInput.length / 5;
        return Math.round(words / timeElapsed);
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        if (!startTime) setStartTime(Date.now());

        setInput(val);
        setWpm(calculateWpm(val));

        if (val.length >= targetText.length) {
            setFinished(true);
        }
    };

    const reset = () => {
        setInput('');
        setStartTime(null);
        setWpm(0);
        setFinished(false);
    };

    const getComment = () => {
        if (targetWpm === 0) return "Not bad!";
        if (wpm > targetWpm) return "🚀 New Personal Best? You're flying!";
        if (wpm > targetWpm * 0.9) return "🔥 Consistent! You still got it.";
        return "❄️ A bit rusty? Or just warming up.";
    };

    return (
        <div className="min-h-screen bg-black text-white grid md:grid-cols-2">
            {/* Left Side: Stats & Context */}
            <div className="p-12 flex flex-col justify-center items-start border-r border-zinc-800 relative">

                <h1 className="text-4xl font-bold mb-8">Speed Check</h1>

                <div className="space-y-8">
                    <div>
                        <p className="text-zinc-500 text-sm uppercase tracking-widest mb-2">Yearly Best</p>
                        <p className="text-6xl font-black text-zinc-800">{Math.round(targetWpm)} <span className="text-xl text-zinc-800 font-medium">WPM</span></p>
                    </div>

                    <div>
                        <p className="text-zinc-500 text-sm uppercase tracking-widest mb-2">Current Speed</p>
                        <p className={`text-6xl font-black ${finished ? (wpm >= targetWpm ? 'text-green-500' : 'text-yellow-500') : 'text-white'}`}>
                            {wpm} <span className="text-xl text-zinc-500 font-medium">WPM</span>
                        </p>
                    </div>

                    {finished && (
                        <div className="mt-8 space-y-4">
                            <div className="p-4 bg-zinc-900 rounded-xl border-l-4 border-yellow-500">
                                <p className="text-lg font-serif italic text-zinc-300">"{getComment()}"</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side: Keyboard Test */}
            <div className="p-12 bg-[#0a0a0a] flex flex-col justify-center items-center relative">
                <div className="w-full max-w-xl">
                    <p className="mb-4 text-zinc-500 font-mono text-lg select-none">
                        {targetText}
                    </p>
                    <textarea
                        value={input}
                        onChange={handleInput}
                        disabled={finished}
                        placeholder="Start typing here..."
                        className="w-full h-40 bg-transparent text-2xl font-mono text-white placeholder:text-zinc-800 resize-none outline-none border-b-2 border-zinc-800 focus:border-yellow-500 transition-colors"
                        autoFocus
                    />

                    <div className="mt-8 flex justify-end gap-4 items-center">
                        <button
                            onClick={reset}
                            className="p-3 rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all"
                        >
                            <RefreshCw className="w-6 h-6" />
                        </button>

                        {finished && (
                            <Link
                                href={`/wrap?step=${returnStep}${username ? `&username=${username}` : ''}`}
                                className="p-3 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition-all active:scale-95 shadow-lg shadow-yellow-500/20"
                            >
                                <ArrowRight className="w-6 h-6" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
