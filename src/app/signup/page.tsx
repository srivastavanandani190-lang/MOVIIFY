'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOVIIFYLogo } from "@/components/icons";
import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
    const [step, setStep] = useState('signup'); // 'signup', 'otp'
    const [email, setEmail] = useState('');

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder for signup logic
        setStep('otp');
    }
     const handleOtp = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder for OTP verification
        alert('Signup successful! (Demo)');
    }

    return (
        <div className="container flex items-center justify-center py-20">
            {step === 'signup' && (
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
                                <Input id="password" type="password" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input id="confirm-password" type="password" required />
                            </div>
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
            )}
             {step === 'otp' && (
                 <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm">
                    <CardHeader className="text-center">
                        <MOVIIFYLogo className="h-16 w-auto mx-auto mb-4" />
                        <CardTitle className="font-headline text-3xl">Verify Your Email</CardTitle>
                        <CardDescription>A verification code has been sent to {email}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleOtp} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="otp">Verification Code</Label>
                                <Input id="otp" type="text" placeholder="Enter code" required />
                            </div>
                            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Verify Email</Button>
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
