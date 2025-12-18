"use client";

import { books } from "@/data/books";
import { bookContent } from "@/data/book-content";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { ArrowLeft, BookOpen, PlayCircle, ShoppingCart, CheckCircle, Trash2 } from "lucide-react";
import { ReviewSection } from "@/components/reviews/review-section";
import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default function BookPage({ params }: PageProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [slug, setSlug] = useState("");
    const [book, setBook] = useState<any>(null);
    const [hasPurchased, setHasPurchased] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isOwnBook, setIsOwnBook] = useState(false);

    const isAdmin = user?.email === "sutapajana353@gmail.com";

    useEffect(() => {
        params.then(p => {
            setSlug(p.slug);
            const foundBook = books.find((b) => b.slug === p.slug);
            
            const customBooks = localStorage.getItem("custom-books");
            const customBooksArray = customBooks ? JSON.parse(customBooks) : [];
            const customBook = customBooksArray.find((b: any) => b.slug === p.slug);
            
            const finalBook = foundBook || customBook;
            setBook(finalBook);

            if (!finalBook) {
                setLoading(false);
                return;
            }

            // Check if admin owns this book
            if (user && finalBook.addedBy === user.email) {
                setIsOwnBook(true);
            }

            if (user && finalBook) {
                const purchased = localStorage.getItem(`purchased-${user.email}`);
                if (purchased) {
                    const purchasedBooks = JSON.parse(purchased);
                    setHasPurchased(purchasedBooks.some((pb: any) => pb.slug === p.slug));
                }
            }

            const cart = localStorage.getItem("cart");
            if (cart) {
                const cartItems = JSON.parse(cart);
                setAddedToCart(cartItems.some((item: any) => item.slug === p.slug));
            }

            setLoading(false);
        });
    }, [params, user]);

    const addToCart = () => {
        if (!user) {
            router.push("/login");
            return;
        }

        const cart = localStorage.getItem("cart");
        const cartItems = cart ? JSON.parse(cart) : [];

        if (!cartItems.find((item: any) => item.slug === book.slug)) {
            cartItems.push(book);
            localStorage.setItem("cart", JSON.stringify(cartItems));
            setAddedToCart(true);
            window.dispatchEvent(new Event("cartUpdated"));
        }
    };

    const goToCheckout = () => {
        if (!user) {
            router.push("/login");
            return;
        }
        router.push("/checkout");
    };

    const deleteBook = () => {
        if (!isAdmin) return;

        const confirmed = confirm(`Are you sure you want to delete "${book.title}"? This action cannot be undone.`);
        if (!confirmed) return;

        // Remove from custom books
        const customBooks = localStorage.getItem("custom-books");
        if (customBooks) {
            const booksArray = JSON.parse(customBooks);
            const updatedBooks = booksArray.filter((b: any) => b.slug !== book.slug);
            localStorage.setItem("custom-books", JSON.stringify(updatedBooks));
        }

        // Remove chapters
        const content = localStorage.getItem("book-content");
        if (content) {
            const allContent = JSON.parse(content);
            delete allContent[book.slug];
            localStorage.setItem("book-content", JSON.stringify(allContent));
        }

        router.push("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        );
    }

    if (!book) {
        notFound();
    }

    const canPurchase = !isOwnBook && !hasPurchased;

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            <div className="fixed inset-0 -z-10">
                <div className={`absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br ${book.coverColor} opacity-30 blur-[120px] animate-pulse`} />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]" />
            </div>

            <Header />

            <main className="flex-1 pt-32 pb-16 px-4 md:px-6">
                <div className="max-w-5xl mx-auto">
                    <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Library
                    </Link>

                    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 md:gap-12">
                        <div className="space-y-6">
                            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                                <Image
                                    src={book.coverImage}
                                    alt={book.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className={`absolute inset-0 bg-gradient-to-br ${book.coverColor} opacity-20 mix-blend-overlay`} />
                            </div>

                            <div className="flex flex-col gap-3">
                                {isOwnBook ? (
                                    <>
                                        <div className="flex items-center justify-center gap-2 py-2 text-blue-500">
                                            <CheckCircle className="h-5 w-5" />
                                            <span className="text-sm font-medium">Your Book</span>
                                        </div>
                                        <Button className="w-full" size="lg" asChild>
                                            <Link href={`/read/${book.slug}/1`}>
                                                <BookOpen className="mr-2 h-5 w-5" />
                                                Read Book
                                            </Link>
                                        </Button>
                                        {isAdmin && (
                                            <Button 
                                                variant="destructive" 
                                                className="w-full" 
                                                size="lg"
                                                onClick={deleteBook}
                                            >
                                                <Trash2 className="mr-2 h-5 w-5" />
                                                Delete Book
                                            </Button>
                                        )}
                                    </>
                                ) : hasPurchased ? (
                                    <>
                                        <div className="flex items-center justify-center gap-2 py-2 text-green-500">
                                            <CheckCircle className="h-5 w-5" />
                                            <span className="text-sm font-medium">You own this book</span>
                                        </div>
                                        <Button className="w-full" size="lg" asChild>
                                            <Link href={`/read/${book.slug}/1`}>
                                                <BookOpen className="mr-2 h-5 w-5" />
                                                Start Reading
                                            </Link>
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-center py-3 border-b border-white/10">
                                            <p className="text-3xl font-bold">
                                                ₹{book.price.toFixed(2)}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">One-time purchase</p>
                                        </div>
                                        
                                        {addedToCart ? (
                                            <>
                                                <Button className="w-full" size="lg" onClick={goToCheckout}>
                                                    <CheckCircle className="mr-2 h-5 w-5" />
                                                    Go to Checkout
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    className="w-full" 
                                                    size="lg" 
                                                    onClick={() => {
                                                        const cart = localStorage.getItem("cart");
                                                        if (cart) {
                                                            const cartItems = JSON.parse(cart);
                                                            const updatedCart = cartItems.filter((item: any) => item.slug !== book.slug);
                                                            localStorage.setItem("cart", JSON.stringify(updatedCart));
                                                            setAddedToCart(false);
                                                            window.dispatchEvent(new Event("cartUpdated"));
                                                        }
                                                    }}
                                                >
                                                    Remove from Cart
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button className="w-full" size="lg" onClick={addToCart}>
                                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                                    Add to Cart
                                                </Button>
                                                <Button variant="outline" className="w-full" size="lg" asChild>
                                                    <Link href={`/read/${book.slug}/1`}>
                                                        <BookOpen className="mr-2 h-5 w-5" />
                                                        Preview Chapter 1
                                                    </Link>
                                                </Button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{book.title}</h1>
                                <p className="text-xl text-muted-foreground font-medium">{book.author}</p>
                                <div className="flex flex-wrap gap-2">
                                    {book.tags && book.tags.map((tag: string) => (
                                        <Tag key={tag} variant="secondary">
                                            {tag}
                                        </Tag>
                                    ))}
                                </div>
                                <p className="text-lg leading-relaxed text-muted-foreground/90 max-w-2xl">
                                    {book.description}
                                </p>
                            </div>

                            <GlassPanel intensity="low" className="p-6 md:p-8">
                                <h2 className="text-xl font-semibold mb-6 flex items-center">
                                    <span className="bg-primary/20 p-2 rounded-lg mr-3">
                                        <PlayCircle className="h-5 w-5 text-primary" />
                                    </span>
                                    Table of Contents
                                </h2>
                                <div className="grid gap-3">
                                    {Array.from({ length: book.totalChapters }).map((_, i) => {
                                        const isLocked = !hasPurchased && !isOwnBook && i > 0;
                                        return (
                                            <Link
                                                key={i}
                                                href={`/read/${book.slug}/${i + 1}`}
                                                className={`group flex items-center justify-between p-4 rounded-xl transition-all border ${
                                                    isLocked 
                                                        ? 'opacity-60 hover:bg-white/20 dark:hover:bg-white/5 border-transparent' 
                                                        : 'hover:bg-white/40 dark:hover:bg-white/5 border-transparent hover:border-white/20'
                                                }`}
                                            >
                                                <span className="font-medium group-hover:text-primary transition-colors">
                                                    Chapter {i + 1}
                                                    {i === 0 && !hasPurchased && !isOwnBook && (
                                                        <span className="ml-2 text-xs text-primary">(Preview)</span>
                                                    )}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {isLocked ? "🔒 Locked" : "Read →"}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                                {!hasPurchased && !isOwnBook && (
                                    <div className="mt-4 p-4 bg-primary/10 rounded-lg text-center">
                                        <p className="text-sm text-muted-foreground">
                                            Purchase this book to unlock all {book.totalChapters} chapters
                                        </p>
                                    </div>
                                )}
                            </GlassPanel>

                            <ReviewSection bookSlug={book.slug} />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}