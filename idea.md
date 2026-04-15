# 💡 Project Idea: GenZ Fashion Discovery & Wishlist Platform

## Overview

**GenZ Fashion Hub** is a full-stack fashion e-commerce discovery platform powered by a dataset of **367,000+ real product listings** scraped from AJIO. It enables users to browse, filter, search, and wishlist fashion products across Men's and Women's categories, with intelligent recommendations and price-drop alerts.

The platform is designed with a **GenZ aesthetic** — fast, visual-first, and personalized — while being backed by a robust, scalable backend built on clean software engineering principles.

---

## Problem Statement

GenZ shoppers are overwhelmed by massive e-commerce catalogs. They need:
- A **curated, fast-loading** product discovery experience
- **Smart filtering** by brand, color, category, and price range
- **Wishlist & tracking** features with price-drop notifications
- A **personalized feed** based on browsing behavior

---

## Scope

### Phase 1 — Core Platform
- User registration, login (JWT-based auth)
- Product catalog with pagination, search, and multi-filter
- Product detail pages with image, brand, price, discount info
- Wishlist management (add/remove/view)

### Phase 2 — Intelligence Layer
- Price-drop alert system (email notification when discounted price drops)
- Trending products (most wishlisted / most viewed)
- Similar product recommendations (by color, brand, category)

### Phase 3 — Admin & Analytics
- Admin dashboard: product CRUD, user management
- Analytics: top brands, popular colors, average discount by category

---

## Key Features

| Feature | Description |
|---|---|
| 🔐 Auth | JWT-based register/login/logout with refresh tokens |
| 🔍 Search & Filter | Full-text search + filter by brand, color, gender, price range |
| 🛍️ Wishlist | Add/remove products, view wishlist, share wishlist link |
| 🔔 Price Alerts | Set target price; get notified when product hits it |
| 📊 Trending | Most wishlisted and most viewed products |
| 🤝 Recommendations | Similar products by brand/color/category |
| 🛠️ Admin Panel | CRUD for products, user management, analytics dashboard |
| 📦 Bulk Import | CSV ingestion pipeline for product data |

---

## Tech Stack

### Backend (75% weight — primary focus)
| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| Database | PostgreSQL (primary) |
| ORM | Prisma |
| Auth | JWT + bcrypt |
| Caching | Redis (trending, sessions) |
| Queue | Bull (price-alert jobs) |
| Email | Nodemailer |
| Validation | Zod |
| Testing | Jest + Supertest |

### Frontend (25% weight)
| Layer | Technology |
|---|---|
| Framework | React (Vite) |
| Styling | Tailwind CSS |
| State | Zustand |
| HTTP | Axios |

---

## Architecture Style

- **Layered Architecture**: Routes → Controllers → Services → Repositories → Database
- **OOP Principles**: Classes for services, repositories, and domain models
- **Design Patterns Used**:
  - **Repository Pattern** — abstract data access layer
  - **Strategy Pattern** — pluggable recommendation strategies
  - **Observer Pattern** — price-drop alert subscriptions
  - **Factory Pattern** — notification channel creation (email, in-app)
  - **Singleton Pattern** — DB connection, Redis client

---

## Dataset

- **Source**: `genz.csv` — AJIO product listings
- **Size**: ~367,000 rows
- **Columns**: `Product_URL`, `Brand`, `Description`, `Id_Product`, `URL_image`, `Category_by_gender`, `Discount Price (in Rs.)`, `Original Price (in Rs.)`, `Color`
- **Categories**: Men, Women
- **Price Range**: ₹125 – ₹14,999
- **Top Brands**: Netplay, DNMX, The Indian Garage Co., Teamspirit, Performax, Levi's, U.S. Polo Assn., Superdry
