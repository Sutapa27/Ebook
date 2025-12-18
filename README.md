# Ebook Store - Modern Digital Library Platform

A beautiful, feature-rich ebook store built with Next.js 14, TypeScript, and Tailwind CSS. Browse, purchase, and read digital books with a stunning glassmorphic UI.

## ✨ Key Features

- 📚 **Digital Library** - Browse and discover books with beautiful card layouts
- 🛒 **Shopping Cart** - Add books to cart and checkout seamlessly
- 📖 **Built-in Reader** - Read purchased books directly in the browser
- 🔐 **User Authentication** - Secure login/register system with localStorage
- 👨‍💼 **Admin Panel** - Add new books dynamically (admin-only access)
- 💳 **Purchase Management** - Track purchased books per user
- 🎨 **Glassmorphic UI** - Modern, elegant design with glass panel effects
- 📱 **Fully Responsive** - Optimized for all devices
- 🌙 **Dark Mode Ready** - Supports dark/light themes
- ⚡ **Fast & Smooth** - Built with Next.js App Router for optimal performance

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom glass-panel components with shadcn/ui
- **Icons**: Lucide React
- **Storage**: LocalStorage for demo purposes

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📖 User Flow

1. **Browse** - Explore the book collection on the homepage
2. **Preview** - Click "Read" to preview books before purchasing
3. **Purchase** - Add books to cart and checkout
4. **Read** - Access your purchased books anytime in "My Library"

## 🔑 Admin Access

- **Email**: sutapajana353@gmail.com
- **Password**: sutapa
- **Admin Route**: `/add-book` (restricted to admin only)

## 📁 Project Structure

```
app/
├── page.tsx                 # Home page (book grid)
├── books/[slug]/           # Book detail & preview
├── read/[slug]/[chapter]/  # Book reader
├── login/                   # Login page
├── register/                # Register page
├── add-book/                # Admin: Add new books
├── my-library/              # User's purchased books
└── checkout/                # Checkout page
```

## 🎨 Design Features

- Animated gradient backgrounds
- Glass panel effects with backdrop blur
- Smooth hover animations and transitions
- Compact, space-efficient card layouts
- Clean typography and spacing
- Color-coded book covers with gradients

## 📝 License

MIT License - feel free to use for personal or commercial projects

---

**Note**: This is a demo application using localStorage for data persistence. For production use, integrate a proper backend and database.

---
 
 Made with 🤍 by Sutapa