'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, StorageError } from 'firebase/storage';
import { Upload } from 'lucide-react';
import type { UserProfile } from '@/types';

interface AccountSettingsProps {
    profile: UserProfile;
    onProfileUpdate: () => void;
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

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(Math.round(progress));
            },
            (error: StorageError) => {
                console.error("Upload failed:", error);
                reject(error);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                } catch (error) {
                    console.error("Failed to get download URL:", error);
                    reject(error as StorageError);
                }
            }
        );
    });
};


export function AccountSettings({ profile, onProfileUpdate }: AccountSettingsProps) {
    const { user } = useUser();
    const auth = useAuth();
    const firestore = useFirestore();
    const { toast } = useToast();

    const [displayName, setDisplayName] = useState(profile.displayName || '');
    const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    
    const [isSaving, setIsSaving] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Keep local state in sync if the profile prop changes
    useEffect(() => {
        setDisplayName(profile.displayName || '');
    }, [profile]);
    
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
        setAvatarPreview(URL.createObjectURL(file));
        setUploadProgress(0); // Reset progress for new file
    };

    const handleSaveProfile = async () => {
        if (!user || !auth.currentUser || !firestore) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
            return;
        }

        setIsSaving(true);
        setUploadProgress(null);
        
        try {
            let finalPhotoURL = profile.photoURL;

            // 1. Upload new avatar if one is selected
            if (newAvatarFile) {
                setUploadProgress(0); // Show progress bar
                finalPhotoURL = await uploadAvatar(newAvatarFile, user.uid, setUploadProgress);
            }

            // 2. Update Auth and Firestore
            const updates: { displayName: string; photoURL: string; updatedAt: any, email: string } = {
                displayName,
                photoURL: finalPhotoURL,
                updatedAt: serverTimestamp(),
                email: profile.email, // Preserve existing email
            };

            await updateProfile(auth.currentUser, { displayName, photoURL: finalPhotoURL });
            const userDocRef = doc(firestore, 'users', user.uid);
            await setDoc(userDocRef, updates, { merge: true });
            
            // 3. Reset state and trigger parent refresh
            setNewAvatarFile(null);
            setAvatarPreview(null);
            onProfileUpdate(); // Tell the parent page to re-fetch profile data

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

    const getButtonText = () => {
        if (isSaving) {
            if (uploadProgress !== null && uploadProgress < 100) {
                return `Uploading: ${uploadProgress}%`;
            }
            return 'Saving...';
        }
        return 'Save Changes';
    };

    const hasChanges = newAvatarFile !== null || displayName !== profile.displayName;
    const imageToShow = avatarPreview || profile.photoURL;
    const fallbackInitial = (displayName || profile.displayName || profile.email)[0]?.toUpperCase();

    return (
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
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
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
    );
}
