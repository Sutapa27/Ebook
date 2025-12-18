"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { BookOpen, ShoppingCart, Library, BookPlus, LogOut, User, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Header() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        // Update cart count
        const updateCartCount = () => {
            const cart = localStorage.getItem("cart");
            if (cart) {
                const cartItems = JSON.parse(cart);
                setCartCount(cartItems.length);
            } else {
                setCartCount(0);
            }
        };

        updateCartCount();

        // Listen for storage changes
        window.addEventListener("storage", updateCartCount);
        
        // Custom event for cart updates within the same tab
        window.addEventListener("cartUpdated", updateCartCount);

        return () => {
            window.removeEventListener("storage", updateCartCount);
            window.removeEventListener("cartUpdated", updateCartCount);
        };
    }, []);

    const isAdmin = user?.email === "sutapajana353@gmail.com";

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-xl font-bold hidden sm:inline">Sutapa&apos;s Library</span>
                    </Link>

                    <nav className="flex items-center gap-2 md:gap-3">
                        {user ? (
                            <>
                                <div className="hidden lg:flex items-center gap-2 mr-2 px-3 py-1 rounded-full bg-primary/10">
                                    <User className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium">{user.name}</span>
                                </div>

                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/dashboard">
                                        <LayoutDashboard className="h-4 w-4 md:mr-2" />
                                        <span className="hidden md:inline">Dashboard</span>
                                    </Link>
                                </Button>

                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/my-library">
                                        <Library className="h-4 w-4 md:mr-2" />
                                        <span className="hidden md:inline">Library</span>
                                    </Link>
                                </Button>

                                {isAdmin && (
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href="/add-book">
                                            <BookPlus className="h-4 w-4 md:mr-2" />
                                            <span className="hidden lg:inline">Add Book</span>
                                        </Link>
                                    </Button>
                                )}

                                <Button variant="ghost" size="sm" asChild className="relative">
                                    <Link href="/checkout">
                                        <ShoppingCart className="h-4 w-4 md:mr-2" />
                                        <span className="hidden md:inline">Cart</span>
                                        {cartCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                                                {cartCount}
                                            </span>
                                        )}
                                    </Link>
                                </Button>

                                <Button variant="ghost" size="sm" onClick={handleLogout}>
                                    <LogOut className="h-4 w-4 md:mr-2" />
                                    <span className="hidden md:inline">Logout</span>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/login">Sign In</Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href="/register">Register</Link>
                                </Button>
                            </>
                        )}

                        <ThemeToggle />
                    </nav>
                </div>
            </div>
        </header>
    );
}