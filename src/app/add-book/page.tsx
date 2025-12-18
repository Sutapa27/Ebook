"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BookPlus, Upload } from "lucide-react";

export default function AddBookPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        description: "",
        price: "",
        coverImage: "",
        tags: "",
        totalChapters: "",
        coverColor: "from-blue-500 to-purple-500"
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Check if user is admin (you can modify this check)
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validate required fields
        if (!formData.title || !formData.author || !formData.price || !formData.totalChapters) {
            setError("Please fill in all required fields");
            return;
        }

        // Create slug from title
        const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        // Create book object
        const newBook = {
            slug,
            title: formData.title,
            author: formData.author,
            description: formData.description || "No description available",
            coverImage: formData.coverImage || "/placeholder-book.jpg",
            coverColor: formData.coverColor,
            tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
            totalChapters: parseInt(formData.totalChapters),
            price: parseFloat(formData.price),
            createdAt: new Date().toISOString()
        };

        // Get existing books from localStorage
        const storedBooks = localStorage.getItem("custom-books");
        const books = storedBooks ? JSON.parse(storedBooks) : [];

        // Add new book
        books.push(newBook);
        localStorage.setItem("custom-books", JSON.stringify(books));

        setSuccess("Book added successfully!");
        
        // Reset form
        setFormData({
            title: "",
            author: "",
            description: "",
            price: "",
            coverImage: "",
            tags: "",
            totalChapters: "",
            coverColor: "from-blue-500 to-purple-500"
        });

        // Redirect after 2 seconds
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
                <div className="max-w-3xl mx-auto">
                    <GlassPanel intensity="medium" className="p-8 md:p-10">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
                                <BookPlus className="h-8 w-8 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold">Add New Book</h1>
                            <p className="text-muted-foreground mt-2">Fill in the details to add a book to the library</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                        placeholder="299.99"
                                        required
                                        className="bg-white/50 dark:bg-black/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Total Chapters *</label>
                                    <Input
                                        name="totalChapters"
                                        type="number"
                                        value={formData.totalChapters}
                                        onChange={handleChange}
                                        placeholder="10"
                                        required
                                        className="bg-white/50 dark:bg-black/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cover Image URL</label>
                                <Input
                                    name="coverImage"
                                    value={formData.coverImage}
                                    onChange={handleChange}
                                    placeholder="https://example.com/image.jpg"
                                    className="bg-white/50 dark:bg-black/20"
                                />
                                <p className="text-xs text-muted-foreground">Leave blank for default placeholder</p>
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

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cover Color Gradient</label>
                                <select
                                    name="coverColor"
                                    value={formData.coverColor}
                                    onChange={(e: any) => handleChange(e)}
                                    className="w-full rounded-md border border-input bg-white/50 dark:bg-black/20 px-3 py-2 text-sm"
                                >
                                    <option value="from-blue-500 to-purple-500">Blue to Purple</option>
                                    <option value="from-pink-500 to-orange-500">Pink to Orange</option>
                                    <option value="from-green-500 to-teal-500">Green to Teal</option>
                                    <option value="from-red-500 to-pink-500">Red to Pink</option>
                                    <option value="from-yellow-500 to-orange-500">Yellow to Orange</option>
                                </select>
                            </div>

                            {error && (
                                <p className="text-sm text-destructive text-center">{error}</p>
                            )}

                            {success && (
                                <p className="text-sm text-green-500 text-center">{success}</p>
                            )}

                            <div className="flex gap-4">
                                <Button type="submit" className="flex-1" size="lg">
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