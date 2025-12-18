"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Library, ShoppingBag } from "lucide-react";

export default function MyLibraryPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [purchasedBooks, setPurchasedBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }

        // Load purchased books from localStorage
        const books = localStorage.getItem(`purchased-${user.email}`);
        if (books) {
            setPurchasedBooks(JSON.parse(books));
        }
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

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[100px]" />
            </div>

            <Header />

            <main className="flex-1 pt-32 pb-16 px-4 md:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-full bg-primary/20">
                                <Library className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold">My Library</h1>
                                <p className="text-muted-foreground">
                                    {purchasedBooks.length} {purchasedBooks.length === 1 ? 'book' : 'books'} in your collection
                                </p>
                            </div>
                        </div>
                    </div>

                    {purchasedBooks.length === 0 ? (
                        <GlassPanel intensity="medium" className="p-12 text-center space-y-6">
                            <div className="inline-flex items-center justify-center p-4 rounded-full bg-muted/50">
                                <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">No books yet</h2>
                                <p className="text-muted-foreground">Start building your library by purchasing some books</p>
                            </div>
                            <Button onClick={() => router.push("/")} size="lg">
                                Browse Library
                            </Button>
                        </GlassPanel>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {purchasedBooks.map((book) => (
                                <GlassPanel
                                    key={book.slug}
                                    intensity="medium"
                                    className="group overflow-hidden hover:scale-105 transition-transform duration-300"
                                >
                                    <Link href={`/read/${book.slug}/1`} className="block">
                                        <div className="relative aspect-[2/3] overflow-hidden">
                                            <Image
                                                src={book.coverImage}
                                                alt={book.title}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className={`absolute inset-0 bg-gradient-to-br ${book.coverColor} opacity-20 mix-blend-overlay`} />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                                                <div className="bg-white dark:bg-black px-4 py-2 rounded-full text-sm font-medium">
                                                    <BookOpen className="inline-block mr-2 h-4 w-4" />
                                                    Start Reading
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    <div className="p-4 space-y-3">
                                        <div>
                                            <Link href={`/read/${book.slug}/1`}>
                                                <h3 className="font-semibold text-lg line-clamp-2 mb-1 hover:text-primary transition-colors">
                                                    {book.title}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-muted-foreground">{book.author}</p>
                                        </div>

                                        {book.tags && book.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {book.tags.slice(0, 2).map((tag: string) => (
                                                    <Tag key={tag} variant="secondary" className="text-xs">
                                                        {tag}
                                                    </Tag>
                                                ))}
                                                {book.tags.length > 2 && (
                                                    <Tag variant="secondary" className="text-xs">
                                                        +{book.tags.length - 2}
                                                    </Tag>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-white/10">
                                            <span>Purchased</span>
                                            <span>{new Date(book.purchaseDate).toLocaleDateString()}</span>
                                        </div>

                                        <Button className="w-full" size="sm" asChild>
                                            <Link href={`/read/${book.slug}/1`}>
                                                <BookOpen className="mr-2 h-4 w-4" />
                                                Continue Reading
                                            </Link>
                                        </Button>
                                    </div>
                                </GlassPanel>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}