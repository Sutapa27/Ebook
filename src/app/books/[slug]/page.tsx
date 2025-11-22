import { books } from "@/data/books";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { ArrowLeft, BookOpen, PlayCircle } from "lucide-react";
import { ReviewSection } from "@/components/reviews/review-section";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function BookPage({ params }: PageProps) {
    const { slug } = await params;
    const book = books.find((b) => b.slug === slug);

    if (!book) {
        notFound();
    }

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background Gradients */}
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
                        {/* Cover Image Area */}
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
                                <Button className="w-full" size="lg" asChild>
                                    <Link href={`/read/${book.slug}/1`}>
                                        <BookOpen className="mr-2 h-5 w-5" />
                                        Start Reading
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Metadata & Chapters */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{book.title}</h1>
                                <p className="text-xl text-muted-foreground font-medium">{book.author}</p>
                                <div className="flex flex-wrap gap-2">
                                    {book.tags.map((tag) => (
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
                                    {Array.from({ length: book.totalChapters }).map((_, i) => (
                                        <Link
                                            key={i}
                                            href={`/read/${book.slug}/${i + 1}`}
                                            className="group flex items-center justify-between p-4 rounded-xl hover:bg-white/40 dark:hover:bg-white/5 transition-all border border-transparent hover:border-white/20"
                                        >
                                            <span className="font-medium group-hover:text-primary transition-colors">
                                                Chapter {i + 1}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                Read &rarr;
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </GlassPanel>

                            {/* Reviews Section */}
                            <ReviewSection bookSlug={book.slug} />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
