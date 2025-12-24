import { Suspense } from 'react';
import WrapPageClient from '@/components/WrapPageClient';

export const dynamic = 'force-dynamic';

export default function WrapPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-black text-white">Loading...</div>}>
            <WrapPageClient />
        </Suspense>
    );
}
