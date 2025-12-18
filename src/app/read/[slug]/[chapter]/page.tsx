"use client";

import { books } from "@/data/books";
import { bookContent } from "@/data/book-content";
import { notFound, useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";

interface PageProps {
    params: Promise<{ slug: string; chapter: string }>;
}

export default function ReaderPage({ params }: PageProps) {
    const [slug, setSlug] = useState("");
    const [chapterIndex, setChapterIndex] = useState(0);
    const [book, setBook] = useState<any>(null);
    const [chapterData, setChapterData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        params.then(p => {
            setSlug(p.slug);
            const chIdx = parseInt(p.chapter);
            setChapterIndex(chIdx);

            // Find book
            const foundBook = books.find((b) => b.slug === p.slug);
            const customBooks = localStorage.getItem("custom-books");
            const customBooksArray = customBooks ? JSON.parse(customBooks) : [];
            const customBook = customBooksArray.find((b: any) => b.slug === p.slug);
            const finalBook = foundBook || customBook;

            if (!finalBook || isNaN(chIdx) || chIdx < 1 || chIdx > finalBook.totalChapters) {
                setLoading(false);
                return;
            }

            setBook(finalBook);

            // Load chapter content
            // First check default book content
            let content = bookContent[p.slug]?.[chIdx];

            // Then check custom book content in localStorage
            if (!content) {
                const storedContent = localStorage.getItem("book-content");
                if (storedContent) {
                    const allContent = JSON.parse(storedContent);
                    content = allContent[p.slug]?.[chIdx];
                }
            }

            setChapterData(content);
            setLoading(false);
        });
    }, [params]);

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

    const prevChapter = chapterIndex > 1 ? chapterIndex - 1 : null;
    const nextChapter = chapterIndex < book.totalChapters ? chapterIndex + 1 : null;

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
            <div className="fixed inset-0 -z-10 opacity-50">
                <div className={`absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br ${book.coverColor} opacity-20 blur-[120px]`} />
            </div>

            <Header />

            <main className="flex-1 pt-24 pb-16 px-4 md:px-6">
                <div className="max-w-3xl mx-auto relative">
                    <div className="flex items-center justify-between mb-8 sticky top-24 z-10 py-4">
                        <Button variant="ghost" size="sm" asChild className="backdrop-blur-md bg-white/30 dark:bg-black/30">
                            <Link href={`/books/${book.slug}`}>
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                        <span className="text-sm font-medium text-muted-foreground">
                            Chapter {chapterIndex} of {book.totalChapters}
                        </span>
                    </div>

                    <GlassPanel intensity="low" className="p-8 md:p-12 min-h-[60vh]">
                        <h1 className="text-3xl font-serif font-bold mb-8 text-foreground">
                            {chapterData?.title || `Chapter ${chapterIndex}`}
                        </h1>

                        <div className="prose prose-lg dark:prose-invert max-w-none font-serif leading-relaxed text-foreground/90 whitespace-pre-line">
                            {chapterData?.content || (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground mb-4">Content not available for this chapter.</p>
                                    <p className="text-sm text-muted-foreground">
                                        The author hasn't added content for this chapter yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </GlassPanel>

                    <div className="flex items-center justify-between mt-8">
                        {prevChapter ? (
                            <Button variant="outline" asChild>
                                <Link href={`/read/${book.slug}/${prevChapter}`}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Previous Chapter
                                </Link>
                            </Button>
                        ) : (
                            <div />
                        )}

                        {nextChapter ? (
                            <Button asChild>
                                <Link href={`/read/${book.slug}/${nextChapter}`}>
                                    Next Chapter
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        ) : (
                            <Button variant="outline" asChild>
                                <Link href={`/books/${book.slug}`}>
                                    Finish Book
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}