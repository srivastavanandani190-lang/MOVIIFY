'use client';

import { useUser, useAuth, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, collection, deleteDoc, writeBatch, query, orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, StorageError } from 'firebase/storage';
import { User, Trash2, Upload, History, X, Image as ImageIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useMemoFirebase, useCollection } from '@/firebase';

interface UserProfile {
    displayName: string;
    photoURL: string;
    email: string;
    createdAt: any;
    updatedAt: any;
}

interface SearchHistoryItem {
    id: string;
    query: string;
    timestamp: any;
}

// Dedicated helper function to handle the file upload and progress tracking
const uploadAvatar = (
    file: File, 
    userId: string, 
    setProgress: (progress: number) => void
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const storage = getStorage();
        // Use a consistent file name for the avatar to overwrite it
        const storageRef = ref(storage, `avatars/${userId}/profile.jpg`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        console.log("Starting upload for file:", file.name);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done. Transferred: ${snapshot.bytesTransferred}, Total: ${snapshot.totalBytes}`);
                setProgress(Math.round(progress));
            },
            (error: StorageError) => {
                console.error("Upload failed:", error);
                reject(error);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log("File available at", downloadURL);
                    setProgress(100);
                    resolve(downloadURL);
                } catch (error) {
                    console.error("Failed to get download URL:", error);
                    reject(error as StorageError);
                }
            }
        );
    });
};

export default function ProfilePage() {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [displayName, setDisplayName] = useState('');
    const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    
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

    const fetchUserProfile = useCallback(async () => {
        if (user && firestore) {
            const userDocRef = doc(firestore, 'users', user.uid);
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                const data = docSnap.data() as UserProfile;
                setProfile(data);
                setDisplayName(data.displayName || user.displayName || '');
            } else {
                 const newProfileData: UserProfile = {
                    displayName: user.displayName || user.email?.split('@')[0] || 'User',
                    photoURL: user.photoURL || '',
                    email: user.email || '',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                };
                await setDoc(userDocRef, newProfileData);
                setProfile(newProfileData);
                setDisplayName(newProfileData.displayName);
            }
        }
    }, [user, firestore]);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        
        setNewAvatarFile(file);
        setUploadProgress(0); // Reset progress on new file selection
        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);
    };
    
    useEffect(() => {
        // Cleanup for the object URL
        return () => {
            if (avatarPreview && avatarPreview.startsWith('blob:')) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);
    

    const handleSaveProfile = async () => {
        if (!user || !auth.currentUser || !firestore) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to update your profile.' });
            return;
        }

        setIsSaving(true);
        setUploadProgress(null);
        
        try {
            let finalPhotoURL = profile?.photoURL || user.photoURL || '';

            // --- 1. Upload new avatar if one is selected ---
            if (newAvatarFile) {
                console.log("A new avatar file is selected, starting upload process.");
                setUploadProgress(0); // Show progress bar
                finalPhotoURL = await uploadAvatar(newAvatarFile, user.uid, setUploadProgress);
                console.log("Upload complete, got final URL:", finalPhotoURL);
            }

            // --- 2. Update Auth and Firestore ---
            const nameChanged = displayName !== (profile?.displayName || user.displayName);
            const avatarChanged = finalPhotoURL !== (profile?.photoURL || user.photoURL);

            if (nameChanged || avatarChanged) {
                 const updates: { displayName: string, photoURL: string, updatedAt: any, email?: string } = {
                    displayName,
                    photoURL: finalPhotoURL,
                    updatedAt: serverTimestamp(),
                };

                 if (user.email) {
                    updates.email = user.email;
                }
                
                console.log("Updating Auth and Firestore with:", updates);
                
                await updateProfile(auth.currentUser, { 
                    displayName, 
                    photoURL: finalPhotoURL 
                });
                
                const userDocRef = doc(firestore, 'users', user.uid);
                await setDoc(userDocRef, updates, { merge: true });

                 console.log("Firestore document updated successfully.");
            }
            
            // --- 3. Refresh local profile state from DB ---
            await fetchUserProfile(); 
            setNewAvatarFile(null); // Clear the selected file
            setAvatarPreview(null); // Clear the temporary preview

            toast({ title: 'Profile updated successfully!' });

        } catch (error: any) {
            console.error("Error updating profile:", error);
            toast({ variant: 'destructive', title: 'Error updating profile', description: error.message || "An unexpected error occurred." });
            setUploadProgress(null); // Hide progress bar on error
        } finally {
            setIsSaving(false);
            if (uploadProgress === 100) {
                 setTimeout(() => setUploadProgress(null), 3000);
            }
        }
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

    if (isUserLoading || !profile) {
        return (
            <div className="container flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }
    
    const getButtonText = () => {
        if (isSaving) {
            if (uploadProgress !== null && uploadProgress < 100) {
                return `Uploading: ${uploadProgress}%`;
            }
            return 'Saving...';
        }
        return 'Save Changes';
    };

    const hasChanges = newAvatarFile !== null || (profile && displayName !== profile.displayName);
    const imageToShow = avatarPreview || profile?.photoURL;
    const fallbackInitial = displayName ? displayName[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : 'U');

    return (
        <div className="container py-12">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Account Settings</CardTitle>
                            <CardDescription>Update your display name and avatar.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative group">
                                    <Avatar className="h-36 w-36 border-4 border-accent shadow-lg">
                                        <AvatarImage src={imageToShow || undefined} alt={displayName} />
                                        <AvatarFallback className="text-5xl">{fallbackInitial}</AvatarFallback>
                                    </Avatar>
                                    <Button 
                                        onClick={() => fileInputRef.current?.click()}
                                        variant="outline"
                                        size="icon"
                                        className="absolute bottom-1 right-1 h-10 w-10 rounded-full bg-background/80 group-hover:bg-accent"
                                        aria-label="Upload new avatar"
                                        disabled={isSaving}
                                    >
                                        <Upload className="h-5 w-5" />
                                    </Button>
                                    <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/png, image/jpeg, image/webp" className="hidden" />
                                </div>
                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                            </div>

                            {uploadProgress !== null && (
                                <div className="w-full space-y-2 text-center">
                                    <Progress value={uploadProgress} className="h-2 [&>div]:bg-primary" />
                                    <p className="text-xs text-primary">
                                        {uploadProgress < 100 ? `Uploading: ${uploadProgress}%` : 'Upload complete!'}
                                    </p>
                                </div>
                            )}
                            
                            <div className="space-y-2">
                                <Label htmlFor="displayName">Display Name</Label>
                                <Input id="displayName" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} disabled={isSaving}/>
                            </div>
                            
                            <Button onClick={handleSaveProfile} disabled={isSaving || !hasChanges} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                               {getButtonText()}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2 space-y-8">
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
                                <div className="text-center py-8 text-muted-foreground">
                                    <ImageIcon className="mx-auto h-12 w-12 mb-2" />
                                    <p>No search history yet.</p>
                                </div>
                            )}
                            {searchHistory && searchHistory.length > 0 && (
                                <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                    {searchHistory.map(item => (
                                        <li key={item.id} className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{item.query}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {item.timestamp ? new Date(item.timestamp.toDate()).toLocaleString() : 'Just now'}
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