# Sequence Diagram — GenZ Fashion Hub (Main Flow End-to-End)

## Flow 1: User Registration & Login

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend (React)
    participant AuthCtrl as AuthController
    participant AuthSvc as AuthService
    participant UserRepo as UserRepository
    participant DB as PostgreSQL
    participant Redis as Redis Cache

    User->>FE: Fill register form (name, email, password)
    FE->>AuthCtrl: POST /api/auth/register
    AuthCtrl->>AuthSvc: register(dto)
    AuthSvc->>UserRepo: findByEmail(email)
    UserRepo->>DB: SELECT * FROM users WHERE email=?
    DB-->>UserRepo: null (not found)
    UserRepo-->>AuthSvc: null
    AuthSvc->>AuthSvc: hashPassword(password)
    AuthSvc->>UserRepo: create(user)
    UserRepo->>DB: INSERT INTO users ...
    DB-->>UserRepo: user record
    AuthSvc->>AuthSvc: generateJWT(userId)
    AuthSvc-->>AuthCtrl: { accessToken, refreshToken }
    AuthCtrl-->>FE: 201 { accessToken, refreshToken }
    FE->>FE: Store tokens in localStorage
    FE-->>User: Redirect to Home
```

---

## Flow 2: Browse & Filter Products

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend (React)
    participant ProdCtrl as ProductController
    participant ProdSvc as ProductService
    participant ProdRepo as ProductRepository
    participant Redis as Redis Cache
    participant DB as PostgreSQL

    User->>FE: Select filters (brand=levis, color=blue, gender=Men, price=500-2000)
    FE->>ProdCtrl: GET /api/products?brand=levis&color=blue&gender=Men&minPrice=500&maxPrice=2000&page=1
    ProdCtrl->>ProdSvc: getProducts(filters, pagination)
    ProdSvc->>Redis: GET cache key (filters hash)
    Redis-->>ProdSvc: null (cache miss)
    ProdSvc->>ProdRepo: findAll(filters, pagination)
    ProdRepo->>DB: SELECT * FROM products WHERE brand=? AND color=? ... LIMIT 20 OFFSET 0
    DB-->>ProdRepo: [product rows]
    ProdRepo-->>ProdSvc: Product[]
    ProdSvc->>Redis: SET cache key → products (TTL 5min)
    ProdSvc-->>ProdCtrl: { products, total, page }
    ProdCtrl-->>FE: 200 { products[], meta }
    FE-->>User: Render product grid
```

---

## Flow 3: View Product Detail & Add to Wishlist

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend (React)
    participant ProdCtrl as ProductController
    participant WishCtrl as WishlistController
    participant ProdSvc as ProductService
    participant WishSvc as WishlistService
    participant ProdRepo as ProductRepository
    participant WishRepo as WishlistRepository
    participant DB as PostgreSQL

    User->>FE: Click on product card
    FE->>ProdCtrl: GET /api/products/:id
    ProdCtrl->>ProdSvc: getProductById(id)
    ProdSvc->>ProdRepo: findById(id)
    ProdRepo->>DB: SELECT * FROM products WHERE id=?
    DB-->>ProdRepo: product row
    ProdSvc->>ProdRepo: incrementViewCount(id)
    ProdRepo->>DB: UPDATE products SET view_count = view_count + 1
    ProdSvc-->>ProdCtrl: Product
    ProdCtrl-->>FE: 200 { product }
    FE-->>User: Render product detail page

    User->>FE: Click "Add to Wishlist"
    FE->>WishCtrl: POST /api/wishlist (Authorization: Bearer token)
    WishCtrl->>WishSvc: addToWishlist(userId, productId)
    WishSvc->>WishRepo: findByUserAndProduct(userId, productId)
    WishRepo->>DB: SELECT * FROM wishlists WHERE user_id=? AND product_id=?
    DB-->>WishRepo: null
    WishSvc->>WishRepo: create(userId, productId)
    WishRepo->>DB: INSERT INTO wishlists ...
    WishSvc-->>WishCtrl: WishlistItem
    WishCtrl-->>FE: 201 { wishlistItem }
    FE-->>User: Heart icon turns red ❤️
```

---

## Flow 4: Set Price Alert & Background Notification

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend (React)
    participant AlertCtrl as AlertController
    participant AlertSvc as AlertService
    participant AlertRepo as AlertRepository
    participant DB as PostgreSQL
    participant Queue as Bull Queue (Redis)
    participant Worker as PriceAlertWorker
    participant Mailer as NotificationService (Nodemailer)

    User->>FE: Set target price ₹499 for product
    FE->>AlertCtrl: POST /api/alerts { productId, targetPrice }
    AlertCtrl->>AlertSvc: createAlert(userId, productId, targetPrice)
    AlertSvc->>AlertRepo: create(alert)
    AlertRepo->>DB: INSERT INTO price_alerts ...
    AlertSvc-->>AlertCtrl: Alert
    AlertCtrl-->>FE: 201 { alert }
    FE-->>User: "Alert set! We'll notify you."

    Note over Worker: Runs every hour (cron job)
    Worker->>AlertRepo: findPendingAlerts()
    AlertRepo->>DB: SELECT alerts JOIN products WHERE discount_price <= target_price
    DB-->>AlertRepo: [triggered alerts]
    Worker->>Queue: Add notification jobs to Bull Queue
    Queue->>Mailer: process job → sendEmail(user.email, product)
    Mailer-->>User: 📧 "Price dropped! Product now ₹499"
    Worker->>AlertRepo: markAsTriggered(alertId)
    AlertRepo->>DB: UPDATE price_alerts SET triggered=true
```

---

## Flow 5: Admin CSV Import

```mermaid
sequenceDiagram
    actor Admin
    participant FE as Admin Frontend
    participant AdminCtrl as AdminController
    participant ImportSvc as ImportService
    participant ProdRepo as ProductRepository
    participant DB as PostgreSQL

    Admin->>FE: Upload genz.csv
    FE->>AdminCtrl: POST /api/admin/import (multipart/form-data)
    AdminCtrl->>ImportSvc: importFromCSV(filePath)
    ImportSvc->>ImportSvc: parseCSV(filePath) → rows[]
    loop For each batch of 500 rows
        ImportSvc->>ProdRepo: upsertMany(batch)
        ProdRepo->>DB: INSERT INTO products ... ON CONFLICT DO UPDATE
        DB-->>ProdRepo: inserted count
    end
    ImportSvc-->>AdminCtrl: { total, inserted, updated, failed }
    AdminCtrl-->>FE: 200 { importSummary }
    FE-->>Admin: "Import complete: 367,000 products loaded"
```
