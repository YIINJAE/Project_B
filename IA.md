# IA - Brand Store MVP

Last updated: 2026-02-25
Source references: planning docs in `docs/` (site architecture plan and TODO schedule).

## 1. IA Principles
- Keep top navigation shallow and predictable.
- Preserve direct path to purchase: list -> detail -> cart -> checkout.
- Keep content and CS discoverable without cluttering shopping flow.

## 2. Global Navigation (GNB)
- SHOP
- LOOKBOOK
- JOURNAL
- ABOUT
- CS
- Utilities: Search, Login, Cart, MyPage

## 3. Navigation Breakdown
### 3.1 SHOP
- All Products
- New
- Outer
- Top
- Pants
- Accessories
- (Optional post-MVP) Season Off / Sale

### 3.2 LOOKBOOK
- Lookbook List
- Lookbook Detail

### 3.3 JOURNAL
- Journal List
- Journal Detail

### 3.4 ABOUT
- Brand Story
- (Optional post-MVP) Store Info

### 3.5 CS
- Notice
- FAQ
- Q&A
- Shipping / Exchange / Return Guide

### 3.6 Utilities
- Search
- Login / Join
- Cart
- MyPage (Order List, Order Detail)

## 4. Page Tree (MVP)
- Home
- Shop List (by category)
- Product Detail
- Cart
- Checkout
- Order Complete
- Login
- Join
- MyPage Order List
- MyPage Order Detail
- Lookbook List
- Lookbook Detail
- Journal List
- Journal Detail
- Notice
- FAQ
- Q&A
- About

## 5. Flow Mapping
### 5.1 Purchase Flow
- Home/Shop List -> Product Detail -> Cart -> Checkout -> Order Complete

### 5.2 Post-purchase Flow
- MyPage -> Order List -> Order Detail

### 5.3 Content Discovery Flow
- Home/GNB -> Lookbook or Journal List -> Detail -> Related Product entry

### 5.4 CS Flow
- GNB CS -> Notice/FAQ/Q&A -> Resolution or escalation path

## 6. Out of Scope for MVP IA
- Dedicated review community hubs.
- Multi-region site trees (language/currency split navigation).
- Offline store booking flows.
- Deep campaign microsites with separate nav architecture.

## 7. IA Acceptance Criteria
- All GNB items map to implemented MVP pages with no dead links.
- Purchase flow requires no more than 5 page transitions from list to order complete.
- CS pages are reachable from any primary template via GNB within 1 click.
- Lookbook and Journal each support list and detail structure.
- MyPage includes at minimum order list and order detail pages.
- Mobile menu preserves same IA hierarchy as desktop.
