import { Suspense } from 'react';
import KeyboardTestClient from '@/components/KeyboardTestClient';

export const dynamic = 'force-dynamic';

export default function KeyboardTestPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
            <KeyboardTestClient />
        </Suspense>
    );
}
