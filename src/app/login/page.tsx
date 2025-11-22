"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassPanel } from "@/components/ui/glass-panel";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (email === "sutapajana353@gmail.com" && password === "sutapa") {
            login({ name: "Sutapa", email });
            return;
        }

        // Check for registered users in localStorage
        const storedUsers = localStorage.getItem("ebook-users");
        if (storedUsers) {
            const users = JSON.parse(storedUsers);
            const user = users.find((u: any) => u.email === email && u.password === password);
            if (user) {
                login({ name: user.name, email: user.email });
                return;
            }
        }

        setError("Invalid credentials, try again.");
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background p-4">
            {/* Background Gradients */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[100px] animate-pulse delay-1000" />
            </div>

            <GlassPanel intensity="medium" className="w-full max-w-md p-8 md:p-10 space-y-8">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
                        <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
                    <p className="text-sm text-muted-foreground">
                        Sign in to access your library
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-white/50 dark:bg-black/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-white/50 dark:bg-black/20"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-destructive text-center">{error}</p>
                    )}

                    <Button type="submit" className="w-full" size="lg">
                        Sign In
                    </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground space-y-2">
                    <div>
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-primary hover:underline font-medium">
                            Register
                        </Link>
                    </div>
                    <div>
                        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-xs">
                            Browse Library as Guest &rarr;
                        </Link>
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
}
