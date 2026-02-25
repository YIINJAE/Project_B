# PRD - Brand Store MVP

Last updated: 2026-02-25
Source references: planning docs in `docs/` (site architecture plan and TODO schedule).

## 1. Product Goal
- Build a brand-first ecommerce site with simple purchase flow and editorial content.
- Enable one operator to manage products, orders, and core content without extra staff.

## 2. Target Users
- Shoppers who browse by visual style and category before purchase.
- Returning customers who need order lookup and delivery status.
- Store operator who manages catalog, inventory, and basic CS content.

## 3. MVP Scope
### 3.1 Customer-facing
- Home with brand/editorial highlights and entry points to shopping.
- Shop list by category (ALL, NEW, OUTER, TOP, PANTS, ACC) with sorting.
- Product detail with gallery, core product info, size guide, shipping/return summary.
- Cart and checkout flow (list -> detail -> cart -> payment -> order complete).
- Auth basics (login/join) and MyPage order lookup.
- CS pages: Notice, FAQ, Q&A.
- Content pages: Lookbook and Journal list/detail.

### 3.2 Operator-facing
- Product CRUD.
- Category management.
- Option-level inventory management (size/color).
- Order status update and shipment tracking input.
- Content CRUD for Lookbook, Journal, Notice, FAQ.

## 4. Out of Scope for MVP
- Advanced personalization/recommendation engine.
- Full review/community features beyond basic Q&A.
- Multi-language and multi-currency support.
- Full overseas shipping workflow.
- Deep BI dashboards beyond simple sales/order summary.
- Native mobile apps.

## 5. Functional Requirements
### 5.1 Catalog and Product
- Category browsing and sorting (newest, low price, high price, popularity).
- Product options (size/color) and option-level stock tracking.
- Sold-out state must be visible on list/detail pages.

### 5.2 Order and Payment
- Support card/bank transfer/simple pay in sandbox then production.
- Track order lifecycle: paid, preparing shipment, in transit, delivered, canceled, returned.

### 5.3 Account and MyPage
- User sign-up/login.
- Order list and order detail lookup.

### 5.4 Content and CS
- Operator can publish/edit/remove Lookbook/Journal.
- Notice/FAQ pages are editable by operator.
- Q&A submission and lookup are available to users.

## 6. Non-Functional Requirements
- Mobile and desktop responsive behavior.
- SEO-ready page metadata on key templates (home, shop list, product detail, content detail).
- Image-first performance baseline (optimized formats and dimensions).
- Accessibility baseline for navigation, forms, and keyboard flow.

## 7. Milestones
- M1 (2026-03-06): IA, design system, basic routing complete.
- M2 (2026-03-20): Product -> cart -> order MVP complete.
- M3 (2026-03-27): Content/CS MVP complete.
- M4 (2026-04-10): Stabilization and release readiness.

## 8. MVP Acceptance Criteria
- Shopper can complete end-to-end flow from category list to order complete without blockers.
- Product option selection updates purchasable state correctly (including sold-out behavior).
- Operator can create/edit product and see storefront changes reflected.
- Operator can update order status and add shipment tracking.
- Operator can publish one Lookbook and one Journal post, each visible on public pages.
- Notice/FAQ/Q&A flows are reachable and functional from global navigation.
- Core pages render and function on mobile and desktop breakpoints.
- Basic QA checklist passes for functional flow, responsive behavior, and accessibility sanity checks.

## 9. Risks and Dependencies
- Payment provider integration and webhook reliability can delay order-state completion.
- Content quality depends on image asset readiness.
- Single-operator throughput may bottleneck data entry and QA during late MVP.
