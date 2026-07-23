import { pgEnum } from 'drizzle-orm/pg-core';

/* -----------------------------------------------------------------------------
 * ENUMS
 * ---------------------------------------------------------------------------*/

export const syrianGovernorateEnum = pgEnum('syrian_governorate', [
	'Damascus',
	'Rif Dimashq',
	'Aleppo',
	'Homs',
	'Hama',
	'Latakia',
	'Tartus',
	'Idlib',
	'Raqqa',
	'Deir ez-Zor',
	'Al-Hasakah',
	'Daraa',
	'As-Suwayda',
	'Quneitra'
]);

// Standard clothing sizes for scrubs
export const sizeEnum = pgEnum('size', ['xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl']);

// How the order will be / was paid for
export const paymentMethodEnum = pgEnum('payment_method', [
	'cash_on_delivery',
	'manual_prepayment'
]);

// Fine-grained payment status, independent of order fulfillment status.
export const paymentStatusEnum = pgEnum('payment_status', [
	'unpaid',
	'awaiting_proof',
	'pending_verification',
	'partially_paid',
	'paid',
	'failed',
	'refunded'
]);

// Whether the order is a normal purchase or a pre-order against future stock
export const orderTypeEnum = pgEnum('order_type', ['regular', 'pre_order']);

// Overall order lifecycle status
export const orderStatusEnum = pgEnum('order_status', [
	'pending',
	'confirmed',
	'pending_custom_approval',
	'manual_review',
	'awaiting_prepayment',
	'processing',
	'shipped',
	'delivered',
	'completed',
	'cancelled'
]);

// Status of an individual customization request
export const customizationStatusEnum = pgEnum('customization_status', [
	'requested',
	'pending_approval',
	'approved',
	'rejected',
	'in_progress',
	'completed'
]);

// Type of discount applied (used for pre-order discounts/pricing rules)
export const discountTypeEnum = pgEnum('discount_type', ['percentage', 'fixed_amount']);
