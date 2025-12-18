# 📚 Ebook Store

A modern digital library platform built with Next.js 14, TypeScript, and Tailwind CSS. Browse, purchase, and read ebooks with a beautiful glassmorphic UI.


## ✨ Features

- 📖 Browse and search digital books
- 🛒 Shopping cart with seamless checkout
- 📚 Built-in reader with chapter navigation
- 🔐 User authentication and library management
- 👨‍💼 Admin panel for adding books
- 🎨 Glassmorphic UI with smooth animations
- 📱 Fully responsive design

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **Lucide React** - Modern icons

## 📁 Project Structure

```
app/
├── page.tsx              # Home page
├── books/[slug]/         # Book details
├── read/[slug]/          # Book reader
├── login/                # Authentication
├── add-book/             # Admin panel
├── my-library/           # User library
└── checkout/             # Checkout flow

components/
├── layout/               # Header & footer
├── ui/                   # Reusable components
└── reviews/              # Review system

data/
├── books.ts              # Book catalog
└── book-content.ts       # Chapter content
```

## 📖 Usage

1. **Browse** - Explore the book collection
2. **Preview** - Read first chapter for free
3. **Purchase** - Add to cart and checkout
4. **Read** - Access purchased books anytime

## 🔧 Configuration

Create a `.env.local` file for environment variables:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚧 Development

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Lint
npm run lint
```

## 📝 Notes

- Uses localStorage for demo purposes
- First chapter of each book is free to preview
- Admin features require authentication
- For production, implement proper backend and database

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Built with ❤️ using Next.js and TypeScript by Sutapa**