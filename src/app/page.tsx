"use client";

import { books } from "@/data/books";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ShoppingCart, CheckCircle, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [allBooks, setAllBooks] = useState<any[]>([]);
    const [cartItems, setCartItems] = useState<string[]>([]);
    const [purchasedBooks, setPurchasedBooks] = useState<string[]>([]);

    useEffect(() => {
        // Load all books (default + custom)
        const customBooks = localStorage.getItem("custom-books");
        const customBooksArray = customBooks ? JSON.parse(customBooks) : [];
        setAllBooks([...books, ...customBooksArray]);

        // Load cart
        const cart = localStorage.getItem("cart");
        if (cart) {
            const cartArray = JSON.parse(cart);
            setCartItems(cartArray.map((item: any) => item.slug));
        }

        // Load purchased books
        if (user) {
            const purchased = localStorage.getItem(`purchased-${user.email}`);
            if (purchased) {
                const purchasedArray = JSON.parse(purchased);
                setPurchasedBooks(purchasedArray.map((item: any) => item.slug));
            }
        }
    }, [user]);

    const addToCart = (book: any) => {
        if (!user) {
            router.push("/login");
            return;
        }

        const cart = localStorage.getItem("cart");
        const cartArray = cart ? JSON.parse(cart) : [];

        if (!cartArray.find((item: any) => item.slug === book.slug)) {
            cartArray.push(book);
            localStorage.setItem("cart", JSON.stringify(cartArray));
            setCartItems([...cartItems, book.slug]);
            window.dispatchEvent(new Event("cartUpdated"));
        }
    };

    const removeFromCart = (bookSlug: string) => {
        const cart = localStorage.getItem("cart");
        if (cart) {
            const cartArray = JSON.parse(cart);
            const updatedCart = cartArray.filter((item: any) => item.slug !== bookSlug);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            setCartItems(cartItems.filter(slug => slug !== bookSlug));
            window.dispatchEvent(new Event("cartUpdated"));
        }
    };

    const isPurchased = (bookSlug: string) => purchasedBooks.includes(bookSlug);
    const isInCart = (bookSlug: string) => cartItems.includes(bookSlug);

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[100px]" />
            </div>

            <Header />

            <main className="flex-1 pt-32 pb-16 px-4 md:px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Welcome to the Library</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Discover Your Next Great Read
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Explore our curated collection of ebooks across all genres
                        </p>
                    </div>

                    {/* Books Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {allBooks.map((book) => {
                            const purchased = isPurchased(book.slug);
                            const inCart = isInCart(book.slug);

                            return (
                                <GlassPanel
                                    key={book.slug}
                                    intensity="medium"
                                    className="group overflow-hidden hover:scale-105 transition-transform duration-300"
                                >
                                    <Link href={`/books/${book.slug}`}>
                                        <div className="relative aspect-[3/4] overflow-hidden">
                                            <Image
                                                src={book.coverImage}
                                                alt={book.title}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className={`absolute inset-0 bg-gradient-to-br ${book.coverColor} opacity-20 mix-blend-overlay`} />
                                            
                                            {/* Purchased Badge */}
                                            {purchased && (
                                                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                                    <CheckCircle className="h-3 w-3" />
                                                    Owned
                                                </div>
                                            )}

                                            {/* Price Badge */}
                                            {!purchased && book.price && (
                                                <div className="absolute top-3 left-3 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                    ₹{book.price.toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    <div className="p-4 space-y-2">
                                        <div>
                                            <Link href={`/books/${book.slug}`}>
                                                <h3 className="font-semibold text-base line-clamp-2 mb-1 hover:text-primary transition-colors">
                                                    {book.title}
                                                </h3>
                                            </Link>
                                            <p className="text-xs text-muted-foreground">{book.author}</p>
                                        </div>

                                        <div className="flex flex-wrap gap-1">
                                            {book.tags && book.tags.slice(0, 2).map((tag: string) => (
                                                <Tag key={tag} variant="secondary" className="text-xs py-0 px-2">
                                                    {tag}
                                                </Tag>
                                            ))}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-1.5 pt-1">
                                            {purchased ? (
                                                <Button className="w-full h-8 text-xs" size="sm" asChild>
                                                    <Link href={`/read/${book.slug}/1`}>
                                                        <BookOpen className="mr-1 h-3 w-3" />
                                                        Read Now
                                                    </Link>
                                                </Button>
                                            ) : (
                                                <>
                                                    {inCart ? (
                                                        <>
                                                            <Button 
                                                                className="w-full h-8 text-xs" 
                                                                size="sm"
                                                                onClick={() => router.push("/checkout")}
                                                            >
                                                                <CheckCircle className="mr-1 h-3 w-3" />
                                                                Checkout
                                                            </Button>
                                                            <Button 
                                                                variant="outline" 
                                                                className="w-full h-8 text-xs" 
                                                                size="sm"
                                                                onClick={() => removeFromCart(book.slug)}
                                                            >
                                                                Remove
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button 
                                                                className="w-full h-8 text-xs" 
                                                                size="sm"
                                                                onClick={() => addToCart(book)}
                                                            >
                                                                <ShoppingCart className="mr-1 h-3 w-3" />
                                                                Add to Cart
                                                            </Button>
                                                            <Button 
                                                                variant="outline" 
                                                                className="w-full h-8 text-xs" 
                                                                size="sm"
                                                                asChild
                                                            >
                                                                <Link href={`/books/${book.slug}`}>
                                                                    <BookOpen className="mr-1 h-3 w-3" />
                                                                    Read
                                                                </Link>
                                                            </Button>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </GlassPanel>
                            );
                        })}
                    </div>

                    {/* Empty State */}
                    {allBooks.length === 0 && (
                        <div className="text-center py-16">
                            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h2 className="text-2xl font-bold mb-2">No books available</h2>
                            <p className="text-muted-foreground">Check back soon for new additions!</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}