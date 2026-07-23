# Seeded Users & Test Credentials

This document provides a quick reference for the seeded test accounts in the **Scrubs Co.** e-commerce database.

---

## 🔑 Account Credentials Summary

Default password for all test accounts: **`Password123!`**

| Role | Full Name | Email | Phone Number | Password | Syrian Governorate | Orders Attached |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | System Admin | `admin@scrubsco.sy` | `+963964931260` | `Password123!` | Damascus | N/A (Admin) |
| **Customer (No Orders)** | Dr. Maya Al-Hassan | `maya@example.com` | `+963999111222` | `Password123!` | Aleppo | 0 Orders |
| **Customer (With Order)** | Dr. Ahmad Ajami | `ahmad@example.com` | `+963999888777` | `Password123!` | Damascus | 1 Active Order (`ORD-2026-0001`) |

---

## 📦 Attached Order Breakdown (`ORD-2026-0001`)

For **Dr. Ahmad Ajami** (`+963999888777`):

* **Order Number:** `ORD-2026-0001`
* **Order Status:** `pending_custom_approval` *(Pulled out of automated COD flow for admin review)*
* **Payment Status:** `unpaid` *(Awaiting manual/offline pre-payment verification)*
* **Payment Method:** `cash_on_delivery` (Manual Prepayment for Specialty Customization)
* **Items:**
  * **Product:** Mountain Vibe — Pine Trees Print (`MTN-PINE-NVY-M`)
  * **Size:** Medium (`m`)
  * **Color:** Navy Blue (`#1B263B`)
  * **Quantity:** 2
  * **Unit Price:** 125,000.00 SYP
  * **Subtotal:** 250,000.00 SYP
* **Specialty Customization:**
  * **Type:** `embroidery_name`
  * **Custom Text:** `Dr. Ahmad Ajami`
  * **Placement:** Chest Pocket
  * **Instructions:** *"Embroider name in white silk thread on left chest pocket."*
  * **Additional Fee:** 15,000.00 SYP
* **Total Amount:** **275,000.00 SYP** (Subtotal + 10,000 SYP Shipping + Customization)
