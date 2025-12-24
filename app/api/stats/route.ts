import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const key = searchParams.get('key');

    if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (key) {
            headers['Authorization'] = `ApeKey ${key}`;
        }

        const response = await fetch(`https://api.monkeytype.com/users/${username}/profile`, {
            headers,
            next: { revalidate: 60 }, // Cache for 60 seconds
        });

        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }
            return NextResponse.json(
                { error: 'Failed to fetch Monkeytype data' },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Fetch global speed histogram (English 60s as benchmark)
        const histogramRes = await fetch('https://api.monkeytype.com/public/speedHistogram?language=english&mode=time&mode2=60', {
            headers: { 'Content-Type': 'application/json' },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        let percentile = 0;
        if (histogramRes.ok) {
            const histData = await histogramRes.json();
            // Calculate Percentile
            // Find user's best 60s WPM
            const userBest60 = data.data.personalBests?.time?.[60]?.[0]?.wpm || 0;

            if (userBest60 > 0 && histData.data) {
                let totalUsers = 0;
                let usersSlower = 0;

                // Histogram data keys are WPM buckets (10, 20, 30...)
                Object.entries(histData.data).forEach(([wpmBucket, count]) => {
                    const bucketSpeed = parseInt(wpmBucket);
                    const numCount = count as number;
                    totalUsers += numCount;
                    if (bucketSpeed < userBest60) {
                        usersSlower += numCount;
                    }
                });

                if (totalUsers > 0) {
                    percentile = (usersSlower / totalUsers) * 100;
                }
            }
        }

        const dataPayload = data.data;

        const discordId = dataPayload.discordId;
        const discordAvatar = dataPayload.discordAvatar;
        let avatarUrl = 'https://monkeytype.com/images/logo/logo-square.png'; // Default

        if (discordId && discordAvatar) {
            avatarUrl = `https://cdn.discordapp.com/avatars/${discordId}/${discordAvatar}`;
        }

        // Extract relevant data for the Wrap
        const extractedData = {
            name: dataPayload.name,
            uid: dataPayload.uid,
            joined: dataPayload.addedAt,
            avatarUrl: avatarUrl,
            stats: {
                completedTests: dataPayload.typingStats.completedTests,
                startedTests: dataPayload.typingStats.startedTests,
                timeTyping: dataPayload.typingStats.timeTyping, // in seconds
            },
            personalBests: dataPayload.personalBests,
            xp: dataPayload.xp,
            // specific features
            streak: dataPayload.streak,
            maxStreak: dataPayload.maxStreak,
            details: dataPayload.details, // bio, keyboard, socialProfiles
            inventory: dataPayload.inventory, // badges
            allTimeLbs: dataPayload.allTimeLbs, // rank data
            website: dataPayload.details?.socialProfiles?.website || null,
            calculatedProfile: {
                percentile60s: percentile
            }
        };

        return NextResponse.json(extractedData);
    } catch (error) {
        console.error('Error fetching Monkeytype stats:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
