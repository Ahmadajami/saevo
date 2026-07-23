import { neon } from '@neondatabase/serverless';
import crypto from 'node:crypto';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
	console.error('DATABASE_URL is not set');
	process.exit(1);
}

const sql = neon(databaseUrl);

// Standard bcrypt hash for seed password ("Password123!")
const defaultPasswordHash = '$2b$10$p7C.Bmmq6oNEKK0yTTy6ROtSo6f/krqJ.9mG1Stfx313.Zz1iXWPC';

async function seed() {
	console.log('Seeding Scrubs Co. database...');

	try {
		// 0. Truncate existing database tables
		console.log('Cleaning up existing records...');
		await sql`
			TRUNCATE TABLE 
				"order_status_history", 
				"manual_payments", 
				"customizations", 
				"order_items", 
				"orders", 
				"sessions", 
				"product_variants", 
				"preorder_discounts", 
				"designs", 
				"product_lines", 
				"colors", 
				"users", 
				"role_permissions", 
				"permissions", 
				"roles" 
			CASCADE
		`;

		// 1. Create Roles
		console.log('Creating Roles...');
		const superAdminRoleId = crypto.randomUUID();
		const customerRoleId = crypto.randomUUID();

		await sql`
			INSERT INTO "roles" ("id", "name", "description")
			VALUES 
				(${superAdminRoleId}, 'Super Admin', 'Full administrative access to all systems and settings'),
				(${customerRoleId}, 'Customer', 'Default role for scrub buyers and website users')
		`;

		// 2. Create Permissions
		console.log('Creating Permissions...');
		const permManageOrdersId = crypto.randomUUID();
		const permManageInventoryId = crypto.randomUUID();
		const permManageUsersId = crypto.randomUUID();
		const permViewAdminId = crypto.randomUUID();

		await sql`
			INSERT INTO "permissions" ("id", "name", "description")
			VALUES 
				(${permManageOrdersId}, 'manage_orders', 'Review and update order statuses and customizations'),
				(${permManageInventoryId}, 'manage_inventory', 'Create and modify product lines, designs, and stock'),
				(${permManageUsersId}, 'manage_users', 'Manage user accounts and roles'),
				(${permViewAdminId}, 'view_admin', 'Access internal admin portal')
		`;

		// 3. Assign Role Permissions
		console.log('Assigning Role Permissions...');
		await sql`
			INSERT INTO "role_permissions" ("role_id", "permission_id")
			VALUES 
				(${superAdminRoleId}, ${permManageOrdersId}),
				(${superAdminRoleId}, ${permManageInventoryId}),
				(${superAdminRoleId}, ${permManageUsersId}),
				(${superAdminRoleId}, ${permViewAdminId})
		`;

		// 4. Create Users (1 Super Admin, 1 Customer with NO order, 1 Customer WITH order)
		console.log('Creating Users...');
		const adminUserId = crypto.randomUUID();
		const customerNoOrderId = crypto.randomUUID();
		const customerWithOrderId = crypto.randomUUID();

		await sql`
			INSERT INTO "users" ("id", "full_name", "email", "phone", "password_hash", "address", "city", "role_id", "is_active")
			VALUES 
				(${adminUserId}, 'System Admin', 'admin@scrubsco.sy', '+963964931260', ${defaultPasswordHash}, 'Admin HQ Building', 'Damascus', ${superAdminRoleId}, true),
				(${customerNoOrderId}, 'Dr. Maya Al-Hassan', 'maya@example.com', '+963999111222', ${defaultPasswordHash}, 'Baghdad Street, Villa 8', 'Aleppo', ${customerRoleId}, true),
				(${customerWithOrderId}, 'Dr. Ahmad Ajami', 'ahmad@example.com', '+963999888777', ${defaultPasswordHash}, 'Al-Hamra Street, Bldg 14', 'Damascus', ${customerRoleId}, true)
		`;

		// 5. Create Colors
		console.log('Creating Colors...');
		const colorNavyId = crypto.randomUUID();
		const colorWineId = crypto.randomUUID();

		await sql`
			INSERT INTO "colors" ("id", "name", "slug", "hex_code")
			VALUES 
				(${colorNavyId}, 'Navy Blue', 'navy-blue', '#1B263B'),
				(${colorWineId}, 'Wine Red', 'wine-red', '#7209B7')
		`;

		// 6. Create Product Line
		console.log('Creating Product Line...');
		const lineMountainId = crypto.randomUUID();

		await sql`
			INSERT INTO "product_lines" ("id", "name", "slug", "description", "base_price", "is_preorder_active", "is_active")
			VALUES 
				(${lineMountainId}, 'Mountain Vibe', 'mountain-vibe', 'Breathable, ultra-soft medical scrubs crafted for mountain climate shifts.', 125000.00, false, true)
		`;

		// 7. Create Design
		console.log('Creating Design...');
		const designPineId = crypto.randomUUID();

		await sql`
			INSERT INTO "designs" ("id", "product_line_id", "name", "slug", "description", "image_url")
			VALUES 
				(${designPineId}, ${lineMountainId}, 'Pine Trees Print', 'pine-trees-print', 'Subtle pine embroidery and leaf print pattern.', 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf')
		`;

		// 8. Create Product Variant
		console.log('Creating Product Variant...');
		const variantId = crypto.randomUUID();

		await sql`
			INSERT INTO "product_variants" (
				"id", "product_line_id", "design_id", "color_id", "size", "sku", "price", "preorder_price", "is_preorder_only", "stock_quantity", "reserved_quantity", "is_active"
			)
			VALUES 
				(${variantId}, ${lineMountainId}, ${designPineId}, ${colorNavyId}, 'm', 'MTN-PINE-NVY-M', 125000.00, 110000.00, false, 50, 2, true)
		`;

		// 9. Create Order for Customer WITH order
		console.log('Creating Order for Customer WITH order...');
		const orderId = crypto.randomUUID();
		const orderItemId = crypto.randomUUID();

		await sql`
			INSERT INTO "orders" (
				"id", "order_number", "user_id", "order_type", "status", "payment_method", "payment_status", "subtotal", "discount_amount", "shipping_fee", "total_amount", "shipping_address", "shipping_city", "contact_phone", "has_customization", "requires_manual_review", "assigned_user_id", "admin_notes"
			)
			VALUES (
				${orderId}, 'ORD-2026-0001', ${customerWithOrderId}, 'regular', 'pending_custom_approval', 'cash_on_delivery', 'unpaid', 250000.00, 0.00, 10000.00, 275000.00, 'Al-Hamra Street, Bldg 14', 'Damascus', '+963999888777', true, true, ${adminUserId}, 'Customer requested custom embroidery on chest pocket.'
			)
		`;

		await sql`
			INSERT INTO "order_items" (
				"id", "order_id", "product_variant_id", "quantity", "unit_price", "is_preorder_item", "line_total"
			)
			VALUES (
				${orderItemId}, ${orderId}, ${variantId}, 2, 125000.00, false, 250000.00
			)
		`;

		await sql`
			INSERT INTO "customizations" (
				"id", "order_item_id", "customization_type", "custom_text", "placement", "instructions", "additional_fee", "status"
			)
			VALUES (
				${crypto.randomUUID()}, ${orderItemId}, 'embroidery_name', 'Dr. Ahmad Ajami', 'chest', 'Embroider name in white silk thread on left chest pocket.', 15000.00, 'requested'
			)
		`;

		await sql`
			INSERT INTO "order_status_history" (
				"order_id", "from_status", "to_status", "changed_by_user_id", "note"
			)
			VALUES (
				${orderId}, null, 'pending_custom_approval', ${customerWithOrderId}, 'Order placed with custom embroidery request.'
			)
		`;

		console.log('Seeding completed successfully!');
	} catch (error) {
		console.error('Error seeding database:', error);
		process.exit(1);
	}
}

seed();
