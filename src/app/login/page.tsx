'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOVIIFYLogo } from "@/components/icons";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                router.push('/');
                toast({
                    title: "Login Successful",
                    description: `Welcome back, ${userCredential.user.email}!`,
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                let errorMessage = "Failed to login. Please try again.";
                if (errorCode === 'auth/user-not-found') {
                    errorMessage = "No account found with this email address.";
                } else if (errorCode === 'auth/wrong-password') {
                    errorMessage = "Incorrect password. Please try again.";
                } else if (errorCode === 'auth/invalid-credential') {
                    errorMessage = "Incorrect email or password. Please try again.";
                }
                setError(errorMessage);
                toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: errorMessage,
                });
            });
    }

    return (
        <div className="container flex items-center justify-center py-20">
            <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <MOVIIFYLogo className="h-16 w-auto mx-auto mb-4" />
                    <CardTitle className="font-headline text-3xl">Welcome Back</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="name@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Login</Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="underline hover:text-primary">
                            Sign Up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
