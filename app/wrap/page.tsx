'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import WrapDeck from '@/components/WrapDeck';
import { motion } from 'framer-motion';

export default function WrapPage() {
    const searchParams = useSearchParams();
    const username = searchParams.get('username');
    const key = searchParams.get('key');
    const router = useRouter();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!username) {
            router.push('/');
            return;
        }

        const fetchData = async () => {
            try {
                const res = await fetch(`/api/stats?username=${username}${key ? `&key=${key}` : ''}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch stats');
                }
                const jsonData = await res.json();
                setData(jsonData);
            } catch (err) {
                setError('Could not find user or fetch data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username, key, router]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
                    <p className="text-zinc-400">Crunching the numbers...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-black gap-4 text-white">
                <p className="text-red-400">{error}</p>
                <button
                    onClick={() => router.push('/')}
                    className="rounded-lg bg-zinc-800 px-4 py-2 hover:bg-zinc-700"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <main className="flex min-h-screen flex-col bg-black text-white overflow-hidden">
            <WrapDeck data={data} />
        </main>
    );
}
