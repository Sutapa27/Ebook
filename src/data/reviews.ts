export interface Review {
    id: string;
    bookSlug: string;
    userName: string;
    rating: number;
    date: string;
    content: string;
}

export const reviews: Review[] = [
    {
        id: "1",
        bookSlug: "meditations",
        userName: "Aarav Patel",
        rating: 5,
        date: "2023-10-15",
        content: "Absolutely life-changing. Marcus Aurelius's wisdom is timeless. Every page has something to reflect on.",
    },
    {
        id: "2",
        bookSlug: "meditations",
        userName: "Diya Sharma",
        rating: 4,
        date: "2023-11-02",
        content: "A bit dense at times, but very rewarding. It helps me stay calm in stressful situations.",
    },
    {
        id: "3",
        bookSlug: "the-republic",
        userName: "Vihaan Gupta",
        rating: 5,
        date: "2023-09-20",
        content: "Plato's vision of the ideal state is fascinating. The Allegory of the Cave is a must-read for everyone.",
    },
    {
        id: "4",
        bookSlug: "letters-from-a-stoic",
        userName: "Ananya Singh",
        rating: 5,
        date: "2023-12-05",
        content: "Seneca writes like a friend giving advice. His letters are so practical and relatable even today.",
    },
    {
        id: "5",
        bookSlug: "beyond-good-and-evil",
        userName: "Rohan Mehta",
        rating: 4,
        date: "2024-01-10",
        content: "Nietzsche is provocative and challenging. Not for the faint of heart, but it really makes you think.",
    },
    {
        id: "6",
        bookSlug: "nicomachean-ethics",
        userName: "Ishaan Kumar",
        rating: 5,
        date: "2023-08-12",
        content: "Aristotle's breakdown of virtues is incredibly detailed. A foundational text for understanding ethics.",
    },
    {
        id: "7",
        bookSlug: "critique-of-pure-reason",
        userName: "Saanvi Reddy",
        rating: 3,
        date: "2023-11-25",
        content: "Very difficult to read, but I can see why it's important. Requires a lot of patience.",
    },
    {
        id: "8",
        bookSlug: "meditations",
        userName: "Arjun Nair",
        rating: 5,
        date: "2024-02-01",
        content: "I read a passage every morning. It sets the tone for my day.",
    },
];
