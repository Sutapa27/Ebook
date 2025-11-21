import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SearchBar } from "@/components/ui/search-bar";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import { books } from "@/data/books";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.toLowerCase() || "";

  const filteredBooks = books.filter((book) => {
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[120px] animate-pulse delay-1000" />
      </div>

      <Header />

      <main className="flex-1 pt-32 pb-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Hero Section */}
          <section className="text-center space-y-6 relative">
            <div className="inline-block mb-4">
              <Tag variant="accent" className="px-4 py-1 text-sm text-zinc-500 dark:text-zinc-400">
                Western Philosophy
              </Tag>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground drop-shadow-sm">
              Sutapa's <span className="text-primary">Ebook</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A curated collection of timeless wisdom, presented in a calm,
              distraction-free environment.
            </p>

            <div className="pt-8">
              <SearchBar />
            </div>
          </section>

          {/* Book Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredBooks.map((book) => (
              <Link key={book.id} href={`/books/${book.slug}`} className="group">
                <Card className="h-full flex flex-col gap-4 transition-transform duration-300 group-hover:-translate-y-1">
                  <div
                    className={`h-48 relative rounded-2xl overflow-hidden shadow-inner`}
                  >
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${book.coverColor} opacity-20 mix-blend-overlay`} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">
                      {book.author}
                    </p>
                    <p className="text-sm text-muted-foreground/80 line-clamp-2">
                      {book.description}
                    </p>
                  </div>
                  <div className="mt-auto pt-4 flex flex-wrap gap-2">
                    {book.tags.map((tag) => (
                      <Tag key={tag} variant="secondary">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </Card>
              </Link>
            ))}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
