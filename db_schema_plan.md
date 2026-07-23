# Database Schema Plan for Medical Scrubs E-Commerce

This document outlines the database schema design and business logic to support your medical scrubs e-commerce platform. It addresses your specific requirements: minimal user info, Syrian governorate billing addresses, inventory management for sizes, and the custom purchase flow.

## 1. Core Entities and Relationships

We will need the following main entities in our relational database (e.g., PostgreSQL or MySQL):

- **Users**: Stores minimal customer information and admin accounts.
- **Addresses**: Stores billing addresses restricted to Syrian governorates.
- **Products**: Stores the base information for medical scrubs.
- **Product Variants (Inventory)**: Stores specific sizes for each scrub and tracks stock.
- **Orders**: Tracks user purchases, overall status, and total price.
- **Order Items**: Tracks individual items within an order, including any customization details.

---

## 2. Table Definitions

### `users`
Only collects the essential information required.
* `id` (Primary Key, UUID/Int)
* `full_name` (String)
* `phone_number` (String, Unique) - *Used for login/communication.*
* `role` (Enum: `ADMIN`, `CUSTOMER`) - *To separate admin access for inventory.*
* `created_at` (Timestamp)

### `addresses`
Handles billing and delivery information.
* `id` (Primary Key, UUID/Int)
* `user_id` (Foreign Key -> `users.id`)
* `governorate` (Enum: `Damascus`, `Rif Dimashq`, `Aleppo`, `Homs`, `Hama`, `Latakia`, `Tartus`, `Idlib`, `Raqqa`, `Deir ez-Zor`, `Al-Hasakah`, `Daraa`, `As-Suwayda`, `Quneitra`)
* `detailed_address` (Text) - *Specific neighborhood, street, building, etc.*

### `products`
The base catalog for scrubs.
* `id` (Primary Key, UUID/Int)
* `name` (String) - *e.g., "Classic Blue V-Neck Scrub"*
* `description` (Text)
* `base_price` (Decimal)

### `product_variants`
Handles the inventory management for different sizes of the same scrub.
* `id` (Primary Key, UUID/Int)
* `product_id` (Foreign Key -> `products.id`)
* `size` (String/Enum: `XS`, `S`, `M`, `L`, `XL`, `XXL`, etc.)
* `stock_quantity` (Integer) - *Admins will update this to manage inventory.*

### `orders`
Tracks the overall purchase.
* `id` (Primary Key, UUID/Int)
* `user_id` (Foreign Key -> `users.id`)
* `address_id` (Foreign Key -> `addresses.id`)
* `total_price` (Decimal)
* `status` (Enum: `PENDING_MANUAL_PAYMENT`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`)
* `is_customized` (Boolean) - *Flag to easily filter custom orders.*
* `created_at` (Timestamp)

### `order_items`
Links an order to specific product variants and captures customization details.
* `id` (Primary Key, UUID/Int)
* `order_id` (Foreign Key -> `orders.id`)
* `product_variant_id` (Foreign Key -> `product_variants.id`)
* `quantity` (Integer)
* `unit_price` (Decimal) - *Price locked in at the time of purchase.*
* `customization_text` (Text, Nullable) - *e.g., "Embroider Dr. Ahmed on chest". If NULL, item is standard.*

---

## 3. Business Logic & Purchasing Workflow

### Normal Purchases vs. Customized Purchases
When a user adds items to their cart and proceeds to checkout, the system will evaluate the items in the cart:

1. **Check for Customization:** The backend checks if any `order_items` in the new order contain `customization_text`.
2. **Standard Flow (No Customization):**
   - The `orders.is_customized` flag is set to `false`.
   - The order `status` is set to `PROCESSING` (assuming Cash on Delivery is standard, or standard payment gateway rules apply).
   - Stock is immediately decremented from `product_variants.stock_quantity`.
3. **Customized Flow (Requires Manual Payment):**
   - The `orders.is_customized` flag is set to `true`.
   - The order `status` is set to `PENDING_MANUAL_PAYMENT`.
   - The user is notified (via UI or SMS) that they must transfer funds manually (e.g., via Syriatel Cash, MTN Cash, or Haram Transfer).
   - **Admin Action required:** The admin reviews the pending order on the admin dashboard. Once the admin verifies receipt of the manual payment, they click an "Approve Payment" button, which changes the order `status` to `PROCESSING`.

### Admin Inventory Management
- Admins will have a dashboard where they can see all `products`.
- Clicking into a product reveals its `product_variants`.
- The admin can easily adjust the `stock_quantity` for each size.
- If a `product_variant` stock hits `0`, it will be marked "Out of Stock" on the storefront for that specific size.
