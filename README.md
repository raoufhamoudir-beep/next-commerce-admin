# Multi-Website Dashboard – E-commerce Builder & Management

A powerful **admin dashboard** that lets users create, customize and manage their own modern e-commerce websites without coding.

Users can:

- Create multiple websites from templates
- Customize layout, colors, fonts, sections (drag & drop)
- Add / edit / delete products with images & variants
- Receive and manage customer orders
- Set delivery prices per city/region
- Integrate delivery companies (send ready orders automatically)
- Track sales, customers, analytics

Built with **React 19**, **TypeScript**, **Tailwind CSS**, **Vite**, and modern state & form management tools.

## Features

- 🏗️ **Website Builder** – Drag & drop sections, real-time preview
- 🎨 Full **theme/style customization** (colors, typography, spacing…)
- 🛍️ **Product Management** – variants, images, categories, SEO fields
- 📦 **Order Management** – status tracking, notifications, export
- 🚚 **Delivery Control** – per-region pricing, delivery company integration
- 🌍 **Multi-language support** (Arabic, French, English ready)
- 🔐 Authentication & role-based access
- 📱 Responsive admin dashboard
- ⚡ Fast development with Vite + hot module replacement
- 📊 Basic analytics & reports

## Tech Stack

| Category             | Tools / Libraries                                  |
|----------------------|-----------------------------------------------------|
| Framework            | React 19, TypeScript                                |
| Build Tool           | Vite                                                |
| Styling              | Tailwind CSS 4, tailwind-merge, clsx                |
| State Management     | Zustand, TanStack Query (React Query)               |
| Forms & Validation   | React Hook Form + Zod                               |
| Drag & Drop          | @dnd-kit/core, @dnd-kit/sortable                    |
| Internationalization | i18next + react-i18next                             |
| HTTP Client          | Axios                                               |
| UI Components        | lucide-react (icons), react-hot-toast, react-photo-view |
| Others               | date-fns, js-cookie, jwt-decode, browser-image-compression |

## Project Structure (main folders)

src/
├── assets/                 → images, fonts, icons...
├── components/             → reusable UI components
│   ├── ui/                 → basic components (Button, Card, Input...)
│   └── layout/             → Header, Sidebar, PageContainer...
├── features/
│   ├── auth/               → login, register, useUser hook
│   ├── Upgrade/            → subscription & payment flow
│   ├── updateStore/            → builder, editor, preview
│   ├── Products/           → CRUD products
│   ├── Orders/             → manage orders, delivery
│   └── Settings/           → delivery prices, profile...
├── hooks/                  → custom hooks (useUser, useOffer...)
├── lib/                    → utilities, formatters, api client
├── router/                 → routes configuration
├── stores/                 → Zustand stores
├── types/                  → TypeScript interfaces
└── locales/                → translation files (ar, en, fr)


## Getting Started

### Prerequisites

- Node.js ≥ 20
- pnpm or npm or yarn

### Installation

```bash
# Clone the project
git clone https://github.com/yourusername/multi-website-dashboard.git
cd multi-website-dashboard

# Install dependencies
pnpm install
# or
npm install

# Start development server
pnpm dev
# or
npm run dev


pnpm build
# or
npm run build

pnpm dev      → start dev server
pnpm build    → build for production
pnpm lint     → run ESLint
pnpm preview  → preview production build locally

