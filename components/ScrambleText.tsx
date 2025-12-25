'use client';

import { useState, useEffect, useRef } from 'react';

interface ScrambleTextProps {
    text: string;
    className?: string;
    delay?: number; // Delay before starting
    duration?: number; // Total duration of scramble
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

export default function ScrambleText({ text, className, delay = 0, duration = 1000 }: ScrambleTextProps) {
    const [display, setDisplay] = useState('');
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(timeout);
    }, [delay]);

    useEffect(() => {
        if (!started) {
            // Keep it empty or scrambled? Let's hide it until start.
            setDisplay('');
            return;
        }

        let frame = 0;
        const totalFrames = duration / 30; // Approx 30ms per frame
        const length = text.length;

        const interval = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const revealCount = Math.floor(progress * length);

            let output = '';
            for (let i = 0; i < length; i++) {
                if (i < revealCount) {
                    output += text[i];
                } else {
                    // Add some randomness, occasionally space should be preserved or char
                    output += CHARS[Math.floor(Math.random() * CHARS.length)];
                }
            }

            setDisplay(output);

            if (frame >= totalFrames) {
                clearInterval(interval);
                setDisplay(text);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [text, started, duration]);

    return <span className={className}>{display}</span>;
}
