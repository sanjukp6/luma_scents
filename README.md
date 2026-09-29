# Luma Scents — Artisanal Haute Parfumerie E-Commerce

A modern, responsive e-commerce web application built for **Luma Scents**, crafted with React, TypeScript, Vite, and Tailwind CSS. Structured with clean component separation to facilitate Google Tag Manager (GTM) and GA4 e-commerce tracking implementations.

---

## 🌟 Features

- **Artisanal Fragrance Catalog**: 8 luxury fragrances with detailed olfactory notes architecture (Top, Heart, Base notes), bottle sizes, stock statuses, and categories.
- **Search & Filter Atelier**: Filter by fragrance families (*Perfume*, *Woody*, *Floral*, *Oriental*, *Body Mist*, *Perfume Oil*), sort by price/ratings, and instant search.
- **Shopping Bag & Dynamic Calculations**:
  - Live subtotal calculation: $\sum (\text{price} \times \text{quantity})$.
  - Free shipping progress bar (Free for orders $\ge ₹1,000$, else $₹99$).
  - Persistent shopping bag powered by `localStorage`.
- **Checkout Portal**: Client validation for contact & shipping details with mock order authorization.
- **Order Confirmation**: Displays generated unique transaction IDs (`LS-2026-XXXXXX`), itemized breakdown, and delivery destination.
- **Prepared for GTM & GA4**: Decoupled business logic (`addToCart`, `placeOrder`) ready for `dataLayer.push` e-commerce events.

---

## 🛠️ Tech Stack

- **Framework**: React 18 & TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS (Custom luxury noir/gold palette)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Deployment**: Vercel ready (`vercel.json` SPA rewrites configured)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/sanjukp6/luma_scents.git
cd luma_scents
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start local development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production
```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── components/          # Navbar, Footer, ProductCard, Toast
├── context/             # CartContext & OrderContext
├── data/                # Mock perfume products catalog
├── pages/               # Home, Products, Product Details, Cart, Checkout, Order Success, 404
├── types/               # TypeScript interfaces (Product, CartItem, Customer, Order)
├── utils/               # Formatters (INR currency, dates) & ID generator
├── App.tsx              # Routes & Context Providers
└── main.tsx             # Entry point
```

---

## 🚢 Deploy to Vercel

1. Import this repository into [Vercel](https://vercel.com).
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Click **Deploy**.
