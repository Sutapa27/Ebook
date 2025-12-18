"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { 
    LayoutDashboard, 
    BookOpen, 
    ShoppingCart, 
    TrendingUp, 
    Calendar,
    Book,
    Award,
    Clock,
    ArrowRight
} from "lucide-react";

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalSpent: 0,
        recentPurchases: [] as any[],
        readingProgress: [] as any[]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }

        // Load user data
        const purchased = localStorage.getItem(`purchased-${user.email}`);
        const purchasedBooks = purchased ? JSON.parse(purchased) : [];

        // Calculate total spent
        const totalSpent = purchasedBooks.reduce((sum: number, book: any) => {
            return sum + (book.price || 0);
        }, 0);

        // Get recent purchases (last 5)
        const recentPurchases = [...purchasedBooks]
            .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
            .slice(0, 5);

        setStats({
            totalBooks: purchasedBooks.length,
            totalSpent,
            recentPurchases,
            readingProgress: purchasedBooks.slice(0, 4) // Show 4 books for reading progress
        });

        setLoading(false);
    }, [user, router]);

    if (!user) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        );
    }

    const isAdmin = user?.email === "sutapajana353@gmail.com";

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[100px]" />
            </div>

            <Header />

            <main className="flex-1 pt-32 pb-16 px-4 md:px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 rounded-full bg-primary/20">
                                <LayoutDashboard className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold">Welcome back, {user.name}!</h1>
                                <p className="text-muted-foreground">Here's your reading overview</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Books */}
                        <GlassPanel intensity="medium" className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 rounded-lg bg-blue-500/20">
                                    <Book className="h-6 w-6 text-blue-500" />
                                </div>
                                <TrendingUp className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold mb-1">{stats.totalBooks}</p>
                                <p className="text-sm text-muted-foreground">Books Owned</p>
                            </div>
                        </GlassPanel>

                        {/* Total Spent */}
                        <GlassPanel intensity="medium" className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 rounded-lg bg-green-500/20">
                                    <ShoppingCart className="h-6 w-6 text-green-500" />
                                </div>
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold mb-1">₹{stats.totalSpent.toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground">Total Spent</p>
                            </div>
                        </GlassPanel>

                        {/* Reading Streak */}
                        <GlassPanel intensity="medium" className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 rounded-lg bg-orange-500/20">
                                    <Clock className="h-6 w-6 text-orange-500" />
                                </div>
                                <Award className="h-5 w-5 text-yellow-500" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold mb-1">
                                    {stats.totalBooks > 0 ? Math.floor(Math.random() * 15) + 1 : 0}
                                </p>
                                <p className="text-sm text-muted-foreground">Day Streak</p>
                            </div>
                        </GlassPanel>

                        {/* Completed */}
                        <GlassPanel intensity="medium" className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 rounded-lg bg-purple-500/20">
                                    <BookOpen className="h-6 w-6 text-purple-500" />
                                </div>
                                <TrendingUp className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold mb-1">
                                    {stats.totalBooks > 0 ? Math.floor(stats.totalBooks * 0.4) : 0}
                                </p>
                                <p className="text-sm text-muted-foreground">Books Completed</p>
                            </div>
                        </GlassPanel>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Purchases */}
                        <div className="lg:col-span-2 space-y-6">
                            <GlassPanel intensity="medium" className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold">Recent Purchases</h2>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href="/my-library">
                                            View All
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>

                                {stats.recentPurchases.length === 0 ? (
                                    <div className="text-center py-12">
                                        <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground">No purchases yet</p>
                                        <Button className="mt-4" asChild>
                                            <Link href="/">Browse Books</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {stats.recentPurchases.map((book) => (
                                            <div
                                                key={book.slug}
                                                className="flex items-center gap-4 p-4 rounded-lg hover:bg-white/20 dark:hover:bg-white/5 transition-colors"
                                            >
                                                <div className="relative w-16 h-24 flex-shrink-0 rounded overflow-hidden">
                                                    <Image
                                                        src={book.coverImage}
                                                        alt={book.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <Link href={`/read/${book.slug}/1`}>
                                                        <h3 className="font-semibold truncate hover:text-primary transition-colors">
                                                            {book.title}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-sm text-muted-foreground">{book.author}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {new Date(book.purchaseDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <p className="font-semibold">₹{(book.price || 0).toFixed(2)}</p>
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={`/read/${book.slug}/1`}>
                                                            Read
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </GlassPanel>

                            {/* Quick Actions (Admin) */}
                            {isAdmin && (
                                <GlassPanel intensity="medium" className="p-6">
                                    <h2 className="text-2xl font-bold mb-4">Admin Actions</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Button className="w-full" size="lg" asChild>
                                            <Link href="/add-book">
                                                <Book className="mr-2 h-5 w-5" />
                                                Add New Book
                                            </Link>
                                        </Button>
                                        <Button variant="outline" className="w-full" size="lg" asChild>
                                            <Link href="/">
                                                <BookOpen className="mr-2 h-5 w-5" />
                                                Manage Library
                                            </Link>
                                        </Button>
                                    </div>
                                </GlassPanel>
                            )}
                        </div>

                        {/* Sidebar - Continue Reading */}
                        <div className="space-y-6">
                            <GlassPanel intensity="medium" className="p-6">
                                <h2 className="text-xl font-bold mb-4">Continue Reading</h2>
                                {stats.readingProgress.length === 0 ? (
                                    <div className="text-center py-8">
                                        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                                        <p className="text-sm text-muted-foreground">No books to read yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {stats.readingProgress.map((book) => (
                                            <Link
                                                key={book.slug}
                                                href={`/read/${book.slug}/1`}
                                                className="block group"
                                            >
                                                <div className="flex gap-3 p-3 rounded-lg hover:bg-white/20 dark:hover:bg-white/5 transition-colors">
                                                    <div className="relative w-12 h-16 flex-shrink-0 rounded overflow-hidden">
                                                        <Image
                                                            src={book.coverImage}
                                                            alt={book.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                                                            {book.title}
                                                        </h3>
                                                        <p className="text-xs text-muted-foreground">{book.author}</p>
                                                        <div className="mt-2">
                                                            <div className="w-full bg-muted/50 rounded-full h-1.5">
                                                                <div
                                                                    className="bg-primary h-1.5 rounded-full"
                                                                    style={{ width: `${Math.floor(Math.random() * 60) + 10}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </GlassPanel>

                            {/* Quick Stats */}
                            <GlassPanel intensity="medium" className="p-6">
                                <h2 className="text-xl font-bold mb-4">This Month</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Books Read</span>
                                        <span className="font-semibold">{Math.floor(stats.totalBooks * 0.3)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Hours Spent</span>
                                        <span className="font-semibold">{Math.floor(stats.totalBooks * 2.5)}h</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Pages Read</span>
                                        <span className="font-semibold">{Math.floor(stats.totalBooks * 150)}</span>
                                    </div>
                                    <div className="pt-4 border-t border-white/10">
                                        <Button className="w-full" variant="outline" asChild>
                                            <Link href="/my-library">
                                                View Full Library
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </GlassPanel>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}