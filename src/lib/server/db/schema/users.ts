import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { syrianGovernorateEnum } from "./enums";
import { roles } from "./rbac";
import { orders, customizations, manualPayments, orderStatusHistory } from "./orders";
import { sessions } from "./auth";

/* -----------------------------------------------------------------------------
 * UNIFIED USERS TABLE (CUSTOMERS & ADMINS/STAFF)
 * ---------------------------------------------------------------------------*/

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    fullName: varchar("full_name", { length: 150 }).notNull(),
    email: varchar("email", { length: 255 }), // Optional for customers, required for password-login admins
    phone: varchar("phone", { length: 30 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    address: text("address"),
    city: syrianGovernorateEnum("city"), // Enforce Syrian Governorates
    roleId: uuid("role_id").references(() => roles.id, { onDelete: "restrict" }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("users_email_idx").on(table.email),
    index("users_phone_idx").on(table.phone),
    index("users_role_idx").on(table.roleId),
  ]
);

/* -----------------------------------------------------------------------------
 * RELATIONS
 * ---------------------------------------------------------------------------*/

export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  orders: many(orders, { relationName: "customerOrders" }),
  assignedOrders: many(orders, { relationName: "assignedStaffOrders" }),
  reviewedCustomizations: many(customizations),
  recordedManualPayments: many(manualPayments),
  statusChanges: many(orderStatusHistory),
  sessions: many(sessions),
}));
