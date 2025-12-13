'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { doc, getDoc, setDoc, serverTimestamp, collection, query, orderBy } from 'firebase/firestore';
import type { UserProfile, SearchHistoryItem } from '@/types';
import { useCollection } from '@/firebase/firestore/use-collection';
import { AccountSettings } from '@/components/profile/account-settings';
import { SearchHistory } from '@/components/profile/search-history';
import { Skeleton } from '@/components/ui/skeleton';

// Helper to fetch or create a user profile in Firestore
const getOrCreateUserProfile = async (firestore: any, user: any): Promise<UserProfile> => {
    const userDocRef = doc(firestore, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
    } else {
        const newProfileData: UserProfile = {
            displayName: user.displayName || user.email?.split('@')[0] || 'New User',
            photoURL: user.photoURL || '',
            email: user.email || '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };
        await setDoc(userDocRef, newProfileData);
        return newProfileData;
    }
};

export default function ProfilePage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    const [profile, setProfile] = useState<UserProfile | null>(null);

    // Redirect if not logged in
    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [isUserLoading, user, router]);

    // Function to fetch/refresh profile data, memoized with useCallback
    const fetchProfile = useCallback(async () => {
        if (user && firestore) {
            const userProfile = await getOrCreateUserProfile(firestore, user);
            setProfile(userProfile);
        }
    }, [user, firestore]);

    // Initial fetch of profile data
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);
    
    // Memoized query for the user's search history
    const searchHistoryQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(collection(firestore, `users/${user.uid}/searchHistory`), orderBy('timestamp', 'desc'));
    }, [firestore, user]);

    // Hook to get live updates for search history
    const { data: searchHistory, isLoading: isHistoryLoading } = useCollection<SearchHistoryItem>(searchHistoryQuery);

    // Loading state UI
    if (isUserLoading || !profile) {
        return (
            <div className="container py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Skeleton for Account Settings Card */}
                    <div className="md:col-span-1 space-y-8">
                        <div className="space-y-6">
                            <Skeleton className="h-8 w-3/4" />
                            <div className="flex flex-col items-center space-y-4">
                                <Skeleton className="h-36 w-36 rounded-full" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                     {/* Skeleton for Search History Card */}
                    <div className="md:col-span-2 space-y-8">
                         <div className="space-y-6">
                            <Skeleton className="h-8 w-1/2" />
                             <div className="space-y-3">
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-12">
            <div className="grid md:grid-cols-3 gap-8">
                {/* Account Settings Column */}
                <div className="md:col-span-1">
                    <AccountSettings profile={profile} onProfileUpdate={fetchProfile} />
                </div>

                {/* Search History Column */}
                <div className="md:col-span-2">
                    <SearchHistory 
                        searchHistory={searchHistory} 
                        isLoading={isHistoryLoading} 
                    />
                </div>
            </div>
        </div>
    );
}
