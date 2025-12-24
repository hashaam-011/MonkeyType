"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserForm() {
    const [username, setUsername] = useState("");
    const [key, setKey] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;

        setIsLoading(true);

        // Validate user exists (optional, could just redirect)
        // For now, let's just redirect and let the wrap page handle the loading state
        // This makes the initial interaction snappier

        const params = new URLSearchParams();
        params.set("username", username);
        if (key.trim()) params.set("key", key);

        router.push(`/wrap?${params.toString()}`);
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="w-full max-w-md space-y-4"
        >
            <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-zinc-400">
                    Monkeytype Username
                </label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. miodec"
                    className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-3 text-white placeholder-zinc-600 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all font-mono"
                    required
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label htmlFor="apikey" className="text-sm font-medium text-zinc-400">
                        ApeKey (Optional)
                    </label>
                    <span className="text-xs text-zinc-600">For private profiles</span>
                </div>
                <input
                    id="apikey"
                    type="password"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Your secret key"
                    className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-3 text-white placeholder-zinc-600 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all font-mono"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading || !username.trim()}
                className={cn(
                    "group flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-3 font-medium text-black transition-all hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed",
                    isLoading && "opacity-70"
                )}
            >
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <>
                        Get Your Wrap
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                )}
            </button>
        </motion.form>
    );
}
