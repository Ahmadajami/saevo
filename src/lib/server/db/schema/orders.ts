import {
  pgTable,
  serial,
  uuid,
  varchar,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import {
  syrianGovernorateEnum,
  paymentMethodEnum,
  paymentStatusEnum,
  orderTypeEnum,
  orderStatusEnum,
  customizationStatusEnum,
} from "./enums";
import { users } from "./users";
import { productVariants } from "./products";

/* -----------------------------------------------------------------------------
 * ORDERS & ORDER MANAGEMENT
 * ---------------------------------------------------------------------------*/

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderNumber: varchar("order_number", { length: 30 }).notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),

    orderType: orderTypeEnum("order_type").default("regular").notNull(),
    status: orderStatusEnum("status").default("pending").notNull(),

    paymentMethod: paymentMethodEnum("payment_method")
      .default("cash_on_delivery")
      .notNull(),
    paymentStatus: paymentStatusEnum("payment_status")
      .default("unpaid")
      .notNull(),

    subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
    discountAmount: numeric("discount_amount", { precision: 10, scale: 2 })
      .default("0")
      .notNull(),
    shippingFee: numeric("shipping_fee", { precision: 10, scale: 2 })
      .default("0")
      .notNull(),
    totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),

    shippingAddress: text("shipping_address").notNull(),
    shippingCity: syrianGovernorateEnum("shipping_city").notNull(),
    contactPhone: varchar("contact_phone", { length: 30 }).notNull(),

    hasCustomization: boolean("has_customization").default(false).notNull(),
    requiresManualReview: boolean("requires_manual_review")
      .default(false)
      .notNull(),
    assignedUserId: uuid("assigned_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    adminNotes: text("admin_notes"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("orders_order_number_idx").on(table.orderNumber),
    index("orders_user_idx").on(table.userId),
    index("orders_status_idx").on(table.status),
    index("orders_payment_status_idx").on(table.paymentStatus),
    index("orders_order_type_idx").on(table.orderType),
    index("orders_assigned_user_idx").on(table.assignedUserId),
    index("orders_manual_review_idx").on(table.requiresManualReview),
  ]
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .references(() => orders.id, { onDelete: "cascade" })
      .notNull(),
    productVariantId: uuid("product_variant_id")
      .references(() => productVariants.id, { onDelete: "restrict" })
      .notNull(),
    quantity: integer("quantity").default(1).notNull(),
    unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
    isPreorderItem: boolean("is_preorder_item").default(false).notNull(),
    lineTotal: numeric("line_total", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("order_items_order_idx").on(table.orderId),
    index("order_items_variant_idx").on(table.productVariantId),
  ]
);

export const customizations = pgTable(
  "customizations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderItemId: uuid("order_item_id")
      .references(() => orderItems.id, { onDelete: "cascade" })
      .notNull(),
    customizationType: varchar("customization_type", { length: 100 })
      .default("embroidery_name")
      .notNull(),
    customText: varchar("custom_text", { length: 100 }),
    placement: varchar("placement", { length: 100 }).default("chest"),
    instructions: text("instructions"),
    additionalFee: numeric("additional_fee", { precision: 10, scale: 2 })
      .default("0")
      .notNull(),
    status: customizationStatusEnum("status").default("requested").notNull(),
    reviewedByUserId: uuid("reviewed_by_user_id").references(
      () => users.id,
      { onDelete: "set null" }
    ),
    reviewNotes: text("review_notes"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("customizations_order_item_idx").on(table.orderItemId),
    index("customizations_status_idx").on(table.status),
    index("customizations_reviewed_by_idx").on(table.reviewedByUserId),
  ]
);

export const manualPayments = pgTable(
  "manual_payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .references(() => orders.id, { onDelete: "cascade" })
      .notNull(),
    recordedByUserId: uuid("recorded_by_user_id").references(
      () => users.id,
      { onDelete: "set null" }
    ),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    channel: varchar("channel", { length: 100 }).notNull(),
    referenceNumber: varchar("reference_number", { length: 150 }),
    proofImageUrl: text("proof_image_url"),
    isVerified: boolean("is_verified").default(false).notNull(),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    notes: text("notes"),
    paidAt: timestamp("paid_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("manual_payments_order_idx").on(table.orderId),
    index("manual_payments_verified_idx").on(table.isVerified),
    index("manual_payments_recorded_by_idx").on(table.recordedByUserId),
  ]
);

export const orderStatusHistory = pgTable(
  "order_status_history",
  {
    id: serial("id").primaryKey(),
    orderId: uuid("order_id")
      .references(() => orders.id, { onDelete: "cascade" })
      .notNull(),
    fromStatus: orderStatusEnum("from_status"),
    toStatus: orderStatusEnum("to_status").notNull(),
    changedByUserId: uuid("changed_by_user_id").references(
      () => users.id,
      { onDelete: "set null" }
    ),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("order_status_history_order_idx").on(table.orderId),
    index("order_status_history_to_status_idx").on(table.toStatus),
  ]
);

/* -----------------------------------------------------------------------------
 * RELATIONS
 * ---------------------------------------------------------------------------*/

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
    relationName: "customerOrders",
  }),
  assignedStaff: one(users, {
    fields: [orders.assignedUserId],
    references: [users.id],
    relationName: "assignedStaffOrders",
  }),
  items: many(orderItems),
  manualPayments: many(manualPayments),
  statusHistory: many(orderStatusHistory),
}));

export const orderItemsRelations = relations(orderItems, ({ one, many }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  productVariant: one(productVariants, {
    fields: [orderItems.productVariantId],
    references: [productVariants.id],
  }),
  customizations: many(customizations),
}));

export const customizationsRelations = relations(customizations, ({ one }) => ({
  orderItem: one(orderItems, {
    fields: [customizations.orderItemId],
    references: [orderItems.id],
  }),
  reviewedByUser: one(users, {
    fields: [customizations.reviewedByUserId],
    references: [users.id],
  }),
}));

export const manualPaymentsRelations = relations(manualPayments, ({ one }) => ({
  order: one(orders, {
    fields: [manualPayments.orderId],
    references: [orders.id],
  }),
  recordedByUser: one(users, {
    fields: [manualPayments.recordedByUserId],
    references: [users.id],
  }),
}));

export const orderStatusHistoryRelations = relations(
  orderStatusHistory,
  ({ one }) => ({
    order: one(orders, {
      fields: [orderStatusHistory.orderId],
      references: [orders.id],
    }),
    changedByUser: one(users, {
      fields: [orderStatusHistory.changedByUserId],
      references: [users.id],
    }),
  })
);
