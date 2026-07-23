# Database Schema Comparison and Change Log

This document compares the new Drizzle ORM PostgreSQL schema currently active in [`src/lib/server/db/schema.ts`](file:///home/xxskullxx/Documents/saevo/src/lib/server/db/schema.ts) against the initial template placeholder and the original conceptual plan ([`db_schema_plan.md`](file:///home/xxskullxx/Documents/saevo/db_schema_plan.md)).

---

## 1. Summary of Changes Made to `src/lib/server/db/schema.ts`

- **Before:** The file contained an 8-line SvelteKit default placeholder schema with a single `task` table:
  ```typescript
  export const task = pgTable('task', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    priority: integer('priority').notNull().default(1)
  });
  ```
- **After:** Replaced the placeholder entirely with the comprehensive, production-ready Drizzle ORM PostgreSQL schema for **Scrubs Co.**

---

## 2. Detailed Comparison: Conceptual Plan vs. Active Drizzle ORM Schema

| Area / Feature        | Original Conceptual Plan (`db_schema_plan.md`)                  | New Active Drizzle Schema (`src/lib/server/db/schema.ts`)                                                                                | Key Benefit / Difference                                                                                                  |
| :-------------------- | :-------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| **Users & Admins**    | Single `users` table with a `role` enum (`ADMIN` / `CUSTOMER`). | Separate `users` and `admins` tables. `admins` includes `passwordHash`, `role`, and `isActive`.                                          | Improves security isolation between administrative staff and customer accounts.                                           |
| **Addresses**         | Explicit `addresses` table with strict Syrian governorate enum. | `address` and `city` fields directly on `users` and snapshotted onto `orders` (`shippingAddress`, `shippingCity`).                       | Simplifies checkout while preserving shipping location data per order.                                                    |
| **Product Structure** | Flat `products` table + `product_variants` (size & stock).      | Multi-tiered catalog: `productLines` -> `designs` + `colors` -> `productVariants` (SKU, size, stock, reserved stock).                    | Supports brand "Lines" (e.g. _Mountain Vibe_) with shared colors/prints and tracks reserved vs. available stock.          |
| **Pre-orders**        | Mentioned in workflow notes.                                    | Formal `orderTypeEnum` (`regular` vs `pre_order`) + dedicated `preorderDiscounts` rules table.                                           | Enables automated promotional pricing and tier discounts for pre-order campaigns.                                         |
| **Order Lifecycle**   | Basic status enum (`PENDING`, `PROCESSING`, etc.).              | Fine-grained 10-stage `orderStatusEnum` + separate `paymentStatusEnum` (7 states) & `paymentMethodEnum`.                                 | Separates physical order fulfillment status from payment verification status.                                             |
| **Customizations**    | Single `customization_text` column on `order_items`.            | Dedicated `customizations` table (tracks `customizationType`, `customText`, `placement`, `additionalFee`, `status`, admin review notes). | Allows multi-item customizations per order with individual fee additions and review states.                               |
| **Manual Payments**   | Described conceptually for admin approval.                      | Dedicated `manualPayments` table (`channel`, `referenceNumber`, `proofImageUrl`, `isVerified`, `verifiedAt`).                            | Provides audit tracking and proof-of-payment storage (e.g., bank receipts / e-wallet screenshots) for admin verification. |
| **Audit Trail**       | None.                                                           | `orderStatusHistory` table logging `fromStatus`, `toStatus`, `changedByAdminId`, `note`, and timestamp.                                  | Full traceability for orders pulled into manual review.                                                                   |
| **Drizzle Relations** | None.                                                           | Fully defined `relations` helpers (`usersRelations`, `ordersRelations`, `productVariantsRelations`, etc.).                               | Enables type-safe nested queries in SvelteKit via `db.query.orders.findMany({ with: { items: true } })`.                  |

---

## 3. Verification & Compatibility Status

- **TypeScript Type Checking:** Verified via `pnpm check` (`svelte-check`) with **0 errors and 0 warnings**.
- **Database Client Connection:** Fully integrated with [`src/lib/server/db/index.ts`](file:///home/xxskullxx/Documents/saevo/src/lib/server/db/index.ts).

---

## 4. Recommended Next Step

Run Drizzle Kit to sync this schema with your PostgreSQL database:

```bash
pnpm drizzle-kit push
```
