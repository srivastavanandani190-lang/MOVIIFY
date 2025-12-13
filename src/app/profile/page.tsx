'use client';

import { useUser, useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { User as FirebaseUser, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, collection, deleteDoc, writeBatch, query, orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { User, Trash2, Upload, History, X, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface UserProfile {
    displayName: string;
    photoURL: string;
    createdAt: any;
    updatedAt: any;
}

interface SearchHistoryItem {
    id: string;
    query: string;
    timestamp: any;
}

export default function ProfilePage() {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();

    const [displayName, setDisplayName] = useState('');
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const searchHistoryQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(collection(firestore, `users/${user.uid}/searchHistory`), orderBy('timestamp', 'desc'));
    }, [firestore, user]);

    const { data: searchHistory, isLoading: isHistoryLoading } = useCollection<SearchHistoryItem>(searchHistoryQuery);


    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [isUserLoading, user, router]);

    useEffect(() => {
        if (user && firestore) {
            const userDocRef = doc(firestore, 'users', user.uid);
            getDoc(userDocRef).then((docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data() as UserProfile;
                    setUserProfile(data);
                    setDisplayName(data.displayName || '');
                } else {
                    // Create a profile if it doesn't exist
                    const newProfile: UserProfile = {
                        displayName: user.displayName || user.email?.split('@')[0] || '',
                        photoURL: user.photoURL || '',
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                    };
                    setDoc(userDocRef, newProfile).then(() => {
                        setUserProfile(newProfile);
                        setDisplayName(newProfile.displayName);
                    });
                }
            });
        }
    }, [user, firestore]);

    const handleSaveProfile = async () => {
        if (!user || !firestore) return;
        setIsSaving(true);
        const userDocRef = doc(firestore, 'users', user.uid);
        try {
            await updateProfile(user, { displayName });
            await setDoc(userDocRef, { displayName, updatedAt: serverTimestamp() }, { merge: true });
            toast({ title: 'Profile updated successfully!' });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error updating profile', description: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) return;
        const file = event.target.files?.[0];
        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast({ variant: 'destructive', title: 'Invalid file type', description: 'Please select a JPG, PNG, or WEBP image.' });
            return;
        }

        if (file.size > 2 * 1024 * 1024) { // 2MB
            toast({ variant: 'destructive', title: 'File too large', description: 'Please select an image smaller than 2MB.' });
            return;
        }

        const storage = getStorage();
        const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                toast({ variant: 'destructive', title: 'Upload failed', description: error.message });
                setUploadProgress(null);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                await updateProfile(user, { photoURL: downloadURL });
                const userDocRef = doc(firestore, 'users', user.uid);
                await setDoc(userDocRef, { photoURL: downloadURL, updatedAt: serverTimestamp() }, { merge: true });

                setUserProfile(prev => prev ? { ...prev, photoURL: downloadURL } : null);

                toast({ title: 'Avatar updated successfully!' });
                setUploadProgress(null);
            }
        );
    };

    const handleDeleteHistoryItem = async (historyId: string) => {
        if (!user) return;
        const historyDocRef = doc(firestore, `users/${user.uid}/searchHistory`, historyId);
        try {
            await deleteDoc(historyDocRef);
            toast({ title: 'Search item removed.' });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error removing item', description: error.message });
        }
    };

    const handleClearHistory = async () => {
        if (!user || !searchHistory || searchHistory.length === 0) return;
        const batch = writeBatch(firestore);
        searchHistory.forEach(item => {
            const docRef = doc(firestore, `users/${user.uid}/searchHistory`, item.id);
            batch.delete(docRef);
        });
        try {
            await batch.commit();
            toast({ title: 'Search history cleared.' });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error clearing history', description: error.message });
        }
    };

    if (isUserLoading || !user) {
        return (
            <div className="container flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container py-12">
            <h1 className="font-headline text-4xl font-bold mb-8">Your Profile</h1>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Picture</CardTitle>
                            <CardDescription>Update your avatar.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <Avatar className="h-32 w-32">
                                <AvatarImage src={userProfile?.photoURL || user.photoURL || ''} alt={displayName} />
                                <AvatarFallback className="text-4xl"><User /></AvatarFallback>
                            </Avatar>
                            {uploadProgress !== null && <Progress value={uploadProgress} className="w-full" />}
                            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/png, image/jpeg, image/webp" className="hidden" />
                            <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline">
                                <Upload className="mr-2" />
                                Change Avatar
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>Manage your account details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={user.email || ''} readOnly disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="displayName">Display Name</Label>
                                <Input id="displayName" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                            </div>
                            <Button onClick={handleSaveProfile} disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2"><History />Search History</CardTitle>
                                <CardDescription>Your recent movie searches.</CardDescription>
                            </div>
                            {searchHistory && searchHistory.length > 0 && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm"><Trash2 className="mr-2"/> Clear All</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your entire search history.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleClearHistory} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </CardHeader>
                        <CardContent>
                            {isHistoryLoading && <p>Loading history...</p>}
                            {!isHistoryLoading && (!searchHistory || searchHistory.length === 0) && (
                                <p className="text-muted-foreground text-center py-4">No search history yet.</p>
                            )}
                            {searchHistory && searchHistory.length > 0 && (
                                <ul className="space-y-3">
                                    {searchHistory.map(item => (
                                        <li key={item.id} className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{item.query}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(item.timestamp?.toDate()).toLocaleString()}
                                                </span>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteHistoryItem(item.id)}>
                                                <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
    