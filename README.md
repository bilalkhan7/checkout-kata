# Checkout Kata – Angular 20 (Standalone Components + Signals + Playwright)

This project is an implementation of the **Supermarket Checkout Kata**, built using **Angular 20**, **standalone components**, **signals**, **RxJS**, **unit tests**, and **Playwright E2E tests**.

---

# Problem Statement

Implement a supermarket checkout that calculates the total price of scanned items:

- Every item has a **unit price** which can change frequently.
- Some items have **weekly offers** (e.g., “Apple: 30 each OR 2 for 45”).
- Items can be scanned **in any order**, and the discount must be applied if the required quantity is reached.

Example:

| Item   | Unit Price | Offer         |
|--------|------------|----------------|
| Apple  | 30         | 2 for 45       |
| Banana | 50         | 3 for 130      |
| Peach  | 60         | —              |
| Kiwi   | 20         | —              |

Scanning **Apple → Banana → Apple** should apply the **2 for 45€** offer automatically.

---

# Tech Stack

- **Angular 20** (Standalone components + Signals)
- **TypeScript**
- **RxJS**
- **Karma + Jasmine** for unit testing
- **Playwright** for E2E testing
- **MockAPI.io** for product + offer APIs (selected and setup for showcasing the ability to consume real APIs)

---

# Project Structure

```
src/
├── app/
│   ├── app.component.*                    # App shell + navigation
│   ├── app.routes.ts                      # Standalone routing
│   │
│   ├── features/
│   │   ├── products/                      # Product listing page
│   │   ├── checkout/components            # Checkout page with summary
│   │   └── cart/                          # CartService + cart logic
│   │
│   ├── shared/
│       ├── models/                        # PricingRule, Offer, CartRow
│       ├── services/                      # ProductService, OfferService, PricingService
│       └── utils/                         # Offer validators
│
├── e2e/                                   # Playwright tests
└── styles.scss                            # Global styling
├── screenshots/                           # Screenshots of the Checkout Kata

```

---

# Data Loading (Optimistic + Cached)

The system loads:

### Products  
`ProductService.loadProducts()`

### Offers  
`OfferService.loadOffers()`

### Combined Pricing Table  
`PricingService.loadPricing()`

All services:

- Use **fallbacks** to `DEFAULT_PRICING_TABLE` when the API is down
- Use **shareReplay** for caching

---

# UI Features

## Products Page
- Cards showing name, price, and offer state
- Offer badges:
  - **Active this week**
  - **Upcoming**
  - **Recently expired**
- “Add to cart”
- Quantity dropdown
- Client-side pagination
- Sorting filters
- Disabled “Proceed to Cart” when cart is empty

## Checkout Page
- Basket grouped by SKU
- Quantity increment/decrement
- Remove item button
- Offer indicator in totals
- Final summary (subtotal, discount, total)
- Mock “Proceed to payment” → success message

---

## Screenshots

### Products Page
<img src="./screenshots/products.png" width="700"/>

### Products — Active & Upcoming Offers
<img src="./screenshots/products-with-offer.png" width="700"/>

### Checkout Summary
<img src="./screenshots/checkout-summary.png" width="700"/>

### Unit Tests Running
<img src="./screenshots/unit-tests.png" width="700"/>

### E2E Tests Running (Playwright)
<img src="./screenshots/e2e-tests.png" width="700"/>

---

# Testing Overview

## Unit Tests (Jasmine + Karma)

Location:
```
src/app/**/*.spec.ts
```

---

## Playwright E2E Tests

Location:
```
e2e/example.spec.ts
```

Run tests:

```bash
npx playwright install
npm run e2e
```

---

# Running the Project

### Install dependencies

```bash
npm install
```

### Start dev server

```bash
npm start
```

Navigate to:

```
http://localhost:4200
```

### Run Unit Tests

```bash
npm test
```

### Run E2E Tests

```bash
npm run e2e
```

---


