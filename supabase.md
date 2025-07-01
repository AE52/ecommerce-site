# Supabase Schema Overview

This document describes the database schema, row-level security (RLS) policies, storage buckets, and seed data that were provisioned for the **ecommerce-site** Supabase project.

---

## 1. Authentication

| Table | Notes |
|-------|-------|
| `auth.users` | Managed by Supabase Auth. Email/password sign-up is enabled. 3 demo users were pre-seeded (`admin@example.com`, `jane@example.com`, `john@example.com`). |
| `public.profiles` | 1-to-1 with `auth.users` (PK/FK: `id`). Stores user profile fields. Trigger **`handle_new_user`** automatically creates a blank profile row when a new auth user registers. |

### Profile Columns

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` PK → `auth.users.id` | User UID. |
| `username` | `text UNIQUE` | Public handle. |
| `full_name` | `text` | Display name. |
| `avatar_url` | `text` | External or Storage URL of avatar. |
| `role` | `text` | `customer` (default) or `admin`. |
| `created_at` | `timestamptz` | Row creation time. |
| `updated_at` | `timestamptz` | Auto-updated via `set_updated_at()` trigger. |

**RLS**: `manage_own_profile` – authenticated users can `SELECT/INSERT/UPDATE/DELETE` only their own profile (`auth.uid() = id`).

---

## 2. Catalog

### 2.1 `categories`

Product categories.

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `uuid` PK | Default `uuid_generate_v4()` |
| `name` | `text` | `UNIQUE NOT NULL` |
| `description` | `text` | — |
| `created_at` | `timestamptz` | Default `now()` |

**RLS**: `public_read_categories` – Anyone can `SELECT` rows.

### 2.2 `products`

Products for sale.

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `uuid` PK | Default `uuid_generate_v4()` |
| `name` | `text` | `NOT NULL` |
| `description` | `text` | — |
| `price` | `numeric(10,2)` | `NOT NULL` |
| `image_url` | `text` | External link *or* Storage path. |
| `category_id` | `uuid` FK → `categories.id` | — |
| `stock_quantity` | `int` | Default **0** |
| `is_active` | `boolean` | Default **true** |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Auto-updated via trigger |

**RLS**: `public_read_products` – Anyone can `SELECT` rows.

---

## 3. Commerce

| Table | Purpose |
|-------|---------|
| `orders` | Customer orders (header) |
| `order_items` | Items per order |
| `carts` | Active shopping cart per user |
| `cart_items` | Items in cart |

### 3.1 `orders`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK |
| `user_id` | `uuid` FK → `auth.users.id` |
| `status` | `text` (`pending`, `paid`, `shipped`, …) |
| `total_amount` | `numeric(10,2)` |
| `created_at` | `timestamptz` |
| `updated_at` | `timestamptz` (trigger) |

### 3.2 `order_items`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK |
| `order_id` | `uuid` FK → `orders.id` (cascade delete) |
| `product_id` | `uuid` FK → `products.id` |
| `quantity` | `int` |
| `unit_price` | `numeric(10,2)` |
| `total_price` | `numeric(10,2)` **generated** column (`quantity * unit_price`) |
| `created_at` | `timestamptz` |

### 3.3 `carts` & `cart_items`

Self-explanatory tables used prior to checkout.

---

## 4. Storage

A **public** bucket called **`product-images`** is available for uploading product photos. Example upload in JavaScript:

```ts
const { data, error } = await supabase.storage
  .from('product-images')
  .upload(`products/${productId}.jpg`, file, { upsert: true });
```

Returned public URL:

```ts
const url = supabase.storage
  .from('product-images')
  .getPublicUrl(`products/${productId}.jpg`).data.publicUrl;
```

---

## 5. Seed Data

| Type | Records |
|------|---------|
| Users | 3 (admin@example.com, jane@example.com, john@example.com) |
| Categories | 3 (Electronics, Furniture, Food & Beverage) |
| Products | 5 demo items with Unsplash image links |

> **Admin credentials**: email `admin@example.com`, password `Admin123!` (development only – change in production!)

---

## 6. Helpers

### 6.1 Triggers & Functions

* `set_updated_at()` – updates `updated_at` on any table that attaches it.
* `handle_new_user()` – after-insert trigger on `auth.users` to create a blank `profiles` row.

---

## 7. Future Work

* RLS policies for **write** access (admins) on catalog tables.
* Payment integration (Stripe, Paddle, etc.).
* Webhooks to update stock after purchase.

---

Enjoy building! 🚀 