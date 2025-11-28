'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOVIIFYLogo } from "@/components/icons";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
    const [step, setStep] = useState('login'); // 'login', 'otp'
    const [email, setEmail] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder for login logic
        setStep('otp');
    }

    const handleOtp = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder for OTP verification
        alert('Login successful! (Demo)');
    }

    return (
        <div className="container flex items-center justify-center py-20">
            {step === 'login' && (
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
                                <Input id="password" type="password" required />
                            </div>
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
            )}
            {step === 'otp' && (
                 <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm">
                    <CardHeader className="text-center">
                        <MOVIIFYLogo className="h-16 w-auto mx-auto mb-4" />
                        <CardTitle className="font-headline text-3xl">Verify Your Identity</CardTitle>
                        <CardDescription>An OTP has been sent to {email}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleOtp} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="otp">One-Time Password</Label>
                                <Input id="otp" type="text" placeholder="Enter OTP" required />
                            </div>
                            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Verify</Button>
                        </form>
                        <div className="mt-4 text-center text-sm">
                            Didn&apos;t receive the code?{' '}
                            <button className="underline hover:text-primary">
                                Resend
                            </button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
