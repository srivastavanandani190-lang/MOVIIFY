'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOVIIFYLogo } from "@/components/icons";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const auth = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                router.push('/');
                toast({
                    title: "Signup Successful",
                    description: "Your account has been created.",
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                let errorMessage = "Failed to sign up. Please try again.";
                if (errorCode === 'auth/email-already-in-use') {
                    errorMessage = "This email address is already in use.";
                } else if (errorCode === 'auth/invalid-email') {
                    errorMessage = "Please enter a valid email address.";
                } else if (errorCode === 'auth/weak-password') {
                    errorMessage = "The password is too weak. Please choose a stronger password.";
                }
                setError(errorMessage);
                 toast({
                    variant: "destructive",
                    title: "Signup Failed",
                    description: errorMessage,
                });
            });
    }

    return (
        <div className="container flex items-center justify-center py-20">
            <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <MOVIIFYLogo className="h-16 w-auto mx-auto mb-4" />
                    <CardTitle className="font-headline text-3xl">Create an Account</CardTitle>
                    <CardDescription>Join MOVIIFY to review and rate movies.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="name@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input id="confirm-password" type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Sign Up</Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="underline hover:text-primary">
                            Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
