"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BookPlus, Plus, Trash2 } from "lucide-react";

export default function AddBookPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        description: "",
        price: "299",
        coverImage: "",
        tags: "",
        totalChapters: "5",
        coverColor: "from-blue-500 to-purple-500"
    });
    const [chapters, setChapters] = useState<{ title: string; content: string }[]>([
        { title: "Chapter 1", content: "" }
    ]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const isAdmin = user?.email === "sutapajana353@gmail.com";

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <GlassPanel intensity="medium" className="p-8">
                    <p className="text-destructive">Access Denied: Admin only</p>
                    <Button onClick={() => router.push("/")} className="mt-4">
                        Go Home
                    </Button>
                </GlassPanel>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleChapterChange = (index: number, field: 'title' | 'content', value: string) => {
        const newChapters = [...chapters];
        newChapters[index][field] = value;
        setChapters(newChapters);
    };

    const addChapter = () => {
        setChapters([...chapters, { title: `Chapter ${chapters.length + 1}`, content: "" }]);
        setFormData({ ...formData, totalChapters: (chapters.length + 1).toString() });
    };

    const removeChapter = (index: number) => {
        if (chapters.length > 1) {
            const newChapters = chapters.filter((_, i) => i !== index);
            setChapters(newChapters);
            setFormData({ ...formData, totalChapters: newChapters.length.toString() });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!formData.title || !formData.author || !formData.price) {
            setError("Please fill in all required fields");
            return;
        }

        // Check if all chapters have content
        const emptyChapters = chapters.filter(ch => !ch.content.trim());
        if (emptyChapters.length > 0) {
            setError("Please add content to all chapters");
            return;
        }

        const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const newBook = {
            slug,
            title: formData.title,
            author: formData.author,
            description: formData.description || "No description available",
            coverImage: formData.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
            coverColor: formData.coverColor,
            tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
            totalChapters: chapters.length,
            price: parseFloat(formData.price),
            createdAt: new Date().toISOString(),
            addedBy: user.email
        };

        // Save book
        const storedBooks = localStorage.getItem("custom-books");
        const books = storedBooks ? JSON.parse(storedBooks) : [];
        books.push(newBook);
        localStorage.setItem("custom-books", JSON.stringify(books));

        // Save chapters
        const bookContent = localStorage.getItem("book-content");
        const allContent = bookContent ? JSON.parse(bookContent) : {};
        
        allContent[slug] = {};
        chapters.forEach((chapter, index) => {
            allContent[slug][index + 1] = {
                title: chapter.title,
                content: chapter.content
            };
        });
        
        localStorage.setItem("book-content", JSON.stringify(allContent));

        setSuccess("Book added successfully!");
        
        setTimeout(() => {
            router.push("/");
        }, 2000);
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[100px] animate-pulse" />
            </div>

            <Header />

            <main className="flex-1 pt-32 pb-16 px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <GlassPanel intensity="medium" className="p-8 md:p-10">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
                                <BookPlus className="h-8 w-8 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold">Add New Book</h1>
                            <p className="text-muted-foreground mt-2">Fill in the details and chapters</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Basic Info */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold">Book Information</h2>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Book Title *</label>
                                    <Input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter book title"
                                        required
                                        className="bg-white/50 dark:bg-black/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Author *</label>
                                    <Input
                                        name="author"
                                        value={formData.author}
                                        onChange={handleChange}
                                        placeholder="Enter author name"
                                        required
                                        className="bg-white/50 dark:bg-black/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter book description"
                                        rows={4}
                                        className="w-full rounded-md border border-input bg-white/50 dark:bg-black/20 px-3 py-2 text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Price (₹) *</label>
                                        <Input
                                            name="price"
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={handleChange}
                                            placeholder="299"
                                            required
                                            className="bg-white/50 dark:bg-black/20"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Cover Color Gradient</label>
                                        <select
                                            name="coverColor"
                                            value={formData.coverColor}
                                            onChange={(e: any) => handleChange(e)}
                                            className="w-full rounded-md border border-input bg-white/50 dark:bg-black/20 px-3 py-2 text-sm h-10"
                                        >
                                            <option value="from-blue-500 to-purple-500">Blue to Purple</option>
                                            <option value="from-pink-500 to-orange-500">Pink to Orange</option>
                                            <option value="from-green-500 to-teal-500">Green to Teal</option>
                                            <option value="from-red-500 to-pink-500">Red to Pink</option>
                                            <option value="from-yellow-500 to-orange-500">Yellow to Orange</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Cover Image URL</label>
                                    <Input
                                        name="coverImage"
                                        value={formData.coverImage}
                                        onChange={handleChange}
                                        placeholder="https://images.unsplash.com/photo-..."
                                        className="bg-white/50 dark:bg-black/20"
                                    />
                                    <p className="text-xs text-muted-foreground">Leave blank for default book cover</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tags (comma-separated)</label>
                                    <Input
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        placeholder="Fiction, Adventure, Mystery"
                                        className="bg-white/50 dark:bg-black/20"
                                    />
                                </div>
                            </div>

                            {/* Chapters */}
                            <div className="space-y-6 border-t border-white/10 pt-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">Chapters ({chapters.length})</h2>
                                    <Button type="button" onClick={addChapter} size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Chapter
                                    </Button>
                                </div>

                                {chapters.map((chapter, index) => (
                                    <div key={index} className="space-y-3 p-4 rounded-lg bg-white/5 border border-white/10">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium">Chapter {index + 1}</label>
                                            {chapters.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeChapter(index)}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                        
                                        <Input
                                            value={chapter.title}
                                            onChange={(e) => handleChapterChange(index, 'title', e.target.value)}
                                            placeholder="Chapter title"
                                            className="bg-white/50 dark:bg-black/20"
                                        />
                                        
                                        <textarea
                                            value={chapter.content}
                                            onChange={(e) => handleChapterChange(index, 'content', e.target.value)}
                                            placeholder="Chapter content (write the full chapter text here)"
                                            rows={8}
                                            className="w-full rounded-md border border-input bg-white/50 dark:bg-black/20 px-3 py-2 text-sm"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>

                            {error && (
                                <p className="text-sm text-destructive text-center">{error}</p>
                            )}

                            {success && (
                                <p className="text-sm text-green-500 text-center">{success}</p>
                            )}

                            <div className="flex gap-4">
                                <Button type="submit" className="flex-1" size="lg">
                                    <BookPlus className="mr-2 h-5 w-5" />
                                    Add Book
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push("/")}
                                    size="lg"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </GlassPanel>
                </div>
            </main>

            <Footer />
        </div>
    );
}