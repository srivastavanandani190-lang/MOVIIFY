'use client';

import { useUser, useFirestore } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { doc, deleteDoc, writeBatch } from 'firebase/firestore';
import { Trash2, History, X, Image as ImageIcon } from 'lucide-react';
import type { SearchHistoryItem } from '@/types';

interface SearchHistoryProps {
    searchHistory: SearchHistoryItem[] | null;
    isLoading: boolean;
}

export function SearchHistory({ searchHistory, isLoading }: SearchHistoryProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    
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

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2"><History />Search History</CardTitle>
                    <CardDescription>Your recent movie searches.</CardDescription>
                </div>
                {searchHistory && searchHistory.length > 0 && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4"/> Clear All</Button>
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
                {isLoading && <div className="text-center py-8 text-muted-foreground">Loading history...</div>}
                {!isLoading && (!searchHistory || searchHistory.length === 0) && (
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
    );
}
