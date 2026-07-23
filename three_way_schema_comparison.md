# 3-Way Database Schema Comparison

This document provides a side-by-side comparison between **three versions** of the schema for the medical scrubs e-commerce platform:

1. **Version 1 — The Initial Plan (`db_schema_plan.md`)**: Designed specifically around your initial requirements (minimal user input: phone & full name only, strict Syrian governorates enum, straightforward customization flag).
2. **Version 2 — The Provided Code Snippet ("Scrubs Co.")**: A rich, feature-complete Drizzle ORM schema featuring product lines, pattern designs, color palettes, pre-order discounts, payment proof tracking, and audit logging.
3. **Version 3 — Currently Implemented (`src/lib/server/db/schema.ts`)**: The active database schema in your codebase (currently loaded with Version 2).

---

## 1. Side-by-Side Comparison Matrix

| Feature / Aspect | 1. Initial Plan (`db_schema_plan.md`) | 2. Provided Code Snippet | 3. Currently Implemented (`schema.ts`) | Comparison & Notes |
| :--- | :--- | :--- | :--- | :--- |
| **User Sign-up Info** | Minimal: `full_name`, `phone_number` only. | `fullName`, `phone`, **`email` (required & unique)**. | `fullName`, `phone`, **`email` (required & unique)**. | **Mismatch with Plan:** Version 2/3 requires an email. If users in Syria sign up by phone only, `email` should be made optional (`nullable`). |
| **Admin Accounts** | Single `users` table with `role` (`ADMIN`/`CUSTOMER`). | Separate `admins` table with hashed passwords and active flags. | Separate `admins` table with hashed passwords and active flags. | **Improvement in V2/V3:** Isolates security credentials for admins from standard customer accounts. |
| **Billing Address** | Strict **14 Syrian Governorates Enum** (`Damascus`, `Aleppo`, `Homs`, etc.) + `detailed_address`. | Freeform `city` (varchar) + `address` text string. | Freeform `city` (varchar) + `address` text string. | **Mismatch with Plan:** Version 1 enforced Syrian governorates. Version 2/3 uses freeform city text. |
| **Product Structure** | `products` (base scrub) + `product_variants` (size + stock). | `productLines` -> `designs` + `colors` -> `productVariants` (SKU, size, stock, reserved stock). | `productLines` -> `designs` + `colors` -> `productVariants` (SKU, size, stock, reserved stock). | **Major Expansion in V2/V3:** Supports product lines (e.g. *Mountain Vibe*), print patterns, reusable color palettes, and stock reservation. |
| **Pre-Orders** | Conceptual requirement. | Formal `orderTypeEnum` + `preorderDiscounts` rules table. | Formal `orderTypeEnum` + `preorderDiscounts` rules table. | **Improvement in V2/V3:** Automatically calculates pre-order tier discounts and promotional dates. |
| **Customizations** | Simple `customization_text` column on `order_items`. | Dedicated `customizations` table (type, text, placement, extra fee, approval status, admin notes). | Dedicated `customizations` table (type, text, placement, extra fee, approval status, admin notes). | **Major Expansion in V2/V3:** Handles multi-item custom embroidery, placement fees, and individual review states. |
| **Payment Flow** | Conceptual logic for `PENDING_MANUAL_PAYMENT`. | Dedicated `manualPayments` table (`channel`, `referenceNumber`, `proofImageUrl`, `isVerified`, `verifiedAt`). | Dedicated `manualPayments` table (`channel`, `referenceNumber`, `proofImageUrl`, `isVerified`, `verifiedAt`). | **Improvement in V2/V3:** Provides complete tracking for manual transfers (Syriatel Cash, Haram Transfer, Bank Transfer) with receipt image uploads. |
| **Order Lifecycle** | 5 high-level statuses. | 10 fine-grained `orderStatusEnum` states + 7 `paymentStatusEnum` states. | 10 fine-grained `orderStatusEnum` states + 7 `paymentStatusEnum` states. | **Improvement in V2/V3:** Decouples physical fulfillment status from payment verification status. |
| **Audit Trail** | None. | `orderStatusHistory` table tracking every status change and admin note. | `orderStatusHistory` table tracking every status change and admin note. | **Improvement in V2/V3:** Essential for auditing orders pulled out of automated processing. |
| **Drizzle Relations** | N/A (conceptual SQL). | Complete TypeScript Drizzle `relations` definitions. | Complete TypeScript Drizzle `relations` definitions. | **Fully Functional:** Ready for SvelteKit server queries using `db.query`. |

---

## 2. Key Differences & Alignment Recommendations

If you want the **Currently Implemented Schema (Version 3)** to perfectly reflect the **Syria-specific requirements from the Initial Plan (Version 1)**, we recommend making two minor adjustments:

1. **Make `email` optional in `users`**:
   * Change `email: varchar("email", { length: 255 }).notNull()` to `email: varchar("email", { length: 255 })` so customers without an email can check out using only their phone number.
2. **Add Syrian Governorates Enum for Addresses**:
   * Define a `syrianGovernorateEnum` containing all 14 Syrian governorates (`Damascus`, `Rif Dimashq`, `Aleppo`, `Homs`, `Hama`, `Latakia`, `Tartus`, `Idlib`, `Raqqa`, `Deir ez-Zor`, `Al-Hasakah`, `Daraa`, `As-Suwayda`, `Quneitra`) to ensure clean location data for shipping.
