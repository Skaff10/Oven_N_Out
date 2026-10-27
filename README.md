# 🍔 Oven & Out — Online Ordering & Restaurant Management System

[![Live Website](https://img.shields.io/badge/Live%20Website-ovenandout.org-FF5722?style=for-the-badge&logo=google-chrome&logoColor=white)](https://ovenandout.cloud)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.10-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> **"IN TASTE WE TRUST"**  
> Official Website: **[https://ovenandout.org](https://ovenandout.org)**

---

## 📖 Overview

**Oven & Out** is a full-stack, production-ready web application built for the modern restaurant and cloud kitchen ecosystem. It delivers a fast, appetizing customer ordering experience paired with a robust back-office operations suite.

Customers can browse a rich menu featuring signature loaded meat boxes, artisan burgers, crispy wings, pastas, and beverages, customize their items, select their delivery area with dynamic fee computation, and place orders seamlessly. Restaurant staff receive instantaneous **Telegram notifications** for every order and manage end-to-end kitchen workflows, expense logging, and real-time financial reporting through a secure admin portal.

---

## ✨ Features

### 🛒 Customer Storefront
- **Modern & Responsive UI**: Visually striking aesthetic with mobile-first responsive design, custom typography, promotional marquees, and hero visuals.
- **Categorized Menu**: Organized menu categories including **Meat Boxes, Burgers, Wings, Pasta, Sides, Chow Mein, Shakes, Drinks, and Sauces**.
- **Interactive Cart & Customization**: Item variant selection, custom cooking instructions/notes, and reactive subtotal calculations.
- **Location-Based Delivery Fee Engine**: Automated zone-based delivery calculation supporting local zones (Mugda, Manda, Maniknagar, Bashabo) with configurable fallback defaults.
- **Checkout & Multi-Payment**: Smooth checkout supporting Cash on Delivery (COD) as well as popular digital payment methods (bKash, Nagad).
- **Order Tracking**: Real-time status tracker following orders through preparation and dispatch steps.

### ⚡ Kitchen & Admin Operations (`/admin`)
- **Secure PIN Authentication**: Fast, secure PIN-based verification for restaurant crew and managers.
- **Live Order Management**: Real-time Firestore sync tracking orders across active stages:
  - `Pending` ➔ `Confirmed` ➔ `Preparing` ➔ `On the Way` ➔ `Delivered` / `Cancelled`
- **Manual Order Creation**: Capability to quickly punch in walk-in, phone call, Facebook, Pathao, or Foodpanda orders into the unified system.
- **Telegram Bot Instant Alerts**: Automated real-time notifications dispatched directly to staff Telegram groups with full customer info, itemized list, delivery address, and total amount.
- **Daily & Monthly Financial Analytics**:
  - Net sales, revenue trends, and delivery breakdown.
  - Expense tracker categorized by inventory, packaging, utility, staff wages, and operational overhead.
  - Interactive graphical visualizations powered by **Recharts**.
- **Dynamic Menu Control**: Real-time toggling of item availability (in-stock / 86'd) and live price modifications without code deploys.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Actions) |
| **Frontend Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS custom variables |
| **Icons & Visuals** | [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/) |
| **Database & Auth** | [Firebase](https://firebase.google.com/) (Cloud Firestore) |
| **Data Visualization** | [Recharts](https://recharts.org/) |
| **Notifications** | Telegram Bot API integration |
| **Production Domain** | [ovenandout.org](https://ovenandout.org) |

---

## 📁 Project Structure

```text
ovennout/
├── app/
│   ├── admin/                    # Admin portal
│   │   ├── expenses/             # Expense recording and management
│   │   ├── login/                # PIN authentication screen
│   │   ├── orders/               # Kitchen live order list & manual order entry
│   │   ├── reports/              # Daily and monthly financial analytics
│   │   ├── AdminDashboardClient.tsx
│   │   └── page.tsx              # Admin overview dashboard
│   ├── menu/                     # Public customer menu page
│   ├── order/                    # Cart review, delivery form & checkout
│   ├── globals.css               # Global theme tokens, typography, and styles
│   ├── layout.tsx                # Root application layout
│   └── page.tsx                  # Home landing page with crowd favorites
├── components/
│   ├── admin/                    # Admin cards, filters, and stat widgets
│   ├── order/                    # Cart drawers, order items, and checkout widgets
│   ├── ui/                       # Reusable UI elements (Input, Button, Badges)
│   ├── Footer.tsx                # Footer with links, social handles & contacts
│   ├── Marquee.tsx               # Announcement marquee ticker
│   ├── Navbar.tsx                # Sticky top navigation with cart counter
│   └── SiteShell.tsx             # Responsive layout wrapper
├── config/
│   └── constants.ts              # Delivery zones, pricing rules, categories
├── context/
│   └── CartContext.tsx           # Global shopping cart state & localStorage sync
├── lib/
│   ├── actions/                  # Next.js Server Actions
│   ├── adminAuth.ts              # Admin session and PIN security validation
│   ├── expenses.ts               # Expense CRUD operations
│   ├── firebase.ts               # Firebase App & Firestore initialization
│   ├── menu.ts                   # Firestore menu fetchers & updates
│   ├── menuData.ts               # Default seed menu catalogue
│   ├── orders.ts                 # Order lifecycle & Firestore persistence
│   └── telegram.ts               # Telegram Bot order notification dispatcher
├── public/
│   └── images/                   # Food photography, logos, and banners
├── types/
│   └── index.ts                  # TypeScript schemas and shared interfaces
└── firestore.rules               # Cloud Firestore security rules
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.18.0 or higher (Node 20+ recommended)
- **npm**, **pnpm**, or **yarn**
- A **Firebase** project with Cloud Firestore enabled
- *(Optional)* A **Telegram Bot Token** and **Chat ID** for notifications

### 2. Clone the Repository
```bash
git clone https://github.com/Skaff10/Oven_N_Out.git
cd Oven_N_Out
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin Security PIN (required to access /admin)
ADMIN_PIN=your_secure_admin_pin

# Telegram Order Alerts (optional but recommended)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

### 5. Start the Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | **Yes** | Firebase Web API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | **Yes** | Firebase Authentication domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | **Yes** | Firebase Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`| **Yes** | Firebase Cloud Storage bucket URL |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | **Yes** | Firebase Cloud Messaging Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | **Yes** | Firebase Web Application ID |
| `ADMIN_PIN` | **Yes** | Secret PIN used to authenticate at `/admin/login` |
| `TELEGRAM_BOT_TOKEN` | Optional | Telegram Bot API token for dispatching order alerts |
| `TELEGRAM_CHAT_ID` | Optional | Telegram Target Group or Channel ID |

---

## 🚢 Production & Deployment

To generate an optimized production bundle:

```bash
npm run build
npm run start
```

### Deploying to Vercel
1. Push your code to your GitHub/GitLab repository.
2. Import the project in the [Vercel Dashboard](https://vercel.com/new).
3. Add the environment variables listed above in the Vercel Project Settings.
4. Set the custom domain to **[ovenandout.org](https://ovenandout.org)**.
5. Deploy!

---

## 📞 Contact & Support

- **Live Site**: [ovenandout.org](https://ovenandout.org)
- **Order Hotline**: `+880 1610-150538`
- **Location**: Dhaka, Bangladesh

---

© Oven & Out. Crafted with passion for exceptional taste.
