import {
  pgTable,
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
import { sizeEnum, discountTypeEnum } from "./enums";
import { orderItems } from "./orders";

/* -----------------------------------------------------------------------------
 * PRODUCT CATALOG: LINES -> DESIGNS / COLORS -> VARIANTS
 * ---------------------------------------------------------------------------*/

export const productLines = pgTable(
  "product_lines",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 150 }).notNull(),
    slug: varchar("slug", { length: 160 }).notNull(),
    description: text("description"),
    basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),
    isPreorderActive: boolean("is_preorder_active").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("product_lines_slug_idx").on(table.slug),
    index("product_lines_active_idx").on(table.isActive),
  ]
);

export const designs = pgTable(
  "designs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productLineId: uuid("product_line_id")
      .references(() => productLines.id, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 150 }).notNull(),
    slug: varchar("slug", { length: 160 }).notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("designs_slug_idx").on(table.productLineId, table.slug),
    index("designs_product_line_idx").on(table.productLineId),
  ]
);

export const colors = pgTable(
  "colors",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 110 }).notNull(),
    hexCode: varchar("hex_code", { length: 7 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("colors_name_idx").on(table.name),
    uniqueIndex("colors_slug_idx").on(table.slug),
  ]
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productLineId: uuid("product_line_id")
      .references(() => productLines.id, { onDelete: "cascade" })
      .notNull(),
    designId: uuid("design_id")
      .references(() => designs.id, { onDelete: "cascade" })
      .notNull(),
    colorId: uuid("color_id")
      .references(() => colors.id, { onDelete: "restrict" })
      .notNull(),
    size: sizeEnum("size").notNull(),
    sku: varchar("sku", { length: 100 }).notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    preorderPrice: numeric("preorder_price", { precision: 10, scale: 2 }),
    isPreorderOnly: boolean("is_preorder_only").default(false).notNull(),
    stockQuantity: integer("stock_quantity").default(0).notNull(),
    reservedQuantity: integer("reserved_quantity").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("product_variants_sku_idx").on(table.sku),
    uniqueIndex("product_variants_unique_combo_idx").on(
      table.designId,
      table.colorId,
      table.size
    ),
    index("product_variants_line_idx").on(table.productLineId),
    index("product_variants_design_idx").on(table.designId),
    index("product_variants_color_idx").on(table.colorId),
    index("product_variants_stock_idx").on(table.stockQuantity),
  ]
);

export const preorderDiscounts = pgTable(
  "preorder_discounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productLineId: uuid("product_line_id")
      .references(() => productLines.id, { onDelete: "cascade" })
      .notNull(),
    discountType: discountTypeEnum("discount_type").notNull(),
    discountValue: numeric("discount_value", {
      precision: 10,
      scale: 2,
    }).notNull(),
    minQuantity: integer("min_quantity").default(1).notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("preorder_discounts_line_idx").on(table.productLineId),
    index("preorder_discounts_active_idx").on(table.isActive),
  ]
);

/* -----------------------------------------------------------------------------
 * RELATIONS
 * ---------------------------------------------------------------------------*/

export const productLinesRelations = relations(
  productLines,
  ({ many }) => ({
    designs: many(designs),
    variants: many(productVariants),
    preorderDiscounts: many(preorderDiscounts),
  })
);

export const designsRelations = relations(designs, ({ one, many }) => ({
  productLine: one(productLines, {
    fields: [designs.productLineId],
    references: [productLines.id],
  }),
  variants: many(productVariants),
}));

export const colorsRelations = relations(colors, ({ many }) => ({
  variants: many(productVariants),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    productLine: one(productLines, {
      fields: [productVariants.productLineId],
      references: [productLines.id],
    }),
    design: one(designs, {
      fields: [productVariants.designId],
      references: [designs.id],
    }),
    color: one(colors, {
      fields: [productVariants.colorId],
      references: [colors.id],
    }),
    orderItems: many(orderItems),
  })
);

export const preorderDiscountsRelations = relations(
  preorderDiscounts,
  ({ one }) => ({
    productLine: one(productLines, {
      fields: [preorderDiscounts.productLineId],
      references: [productLines.id],
    }),
  })
);
