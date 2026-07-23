import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	console.error('DATABASE_URL is not set in .env');
	process.exit(1);
}

const sql = neon(databaseUrl);

async function reset() {
	console.log('Dropping all tables...');
	try {
		// Drop in correct order with CASCADE to avoid FK issues
		await sql`DROP TABLE IF EXISTS "order_status_history" CASCADE`;
		await sql`DROP TABLE IF EXISTS "manual_payments" CASCADE`;
		await sql`DROP TABLE IF EXISTS "customizations" CASCADE`;
		await sql`DROP TABLE IF EXISTS "order_items" CASCADE`;
		await sql`DROP TABLE IF EXISTS "orders" CASCADE`;
		await sql`DROP TABLE IF EXISTS "sessions" CASCADE`;
		await sql`DROP TABLE IF EXISTS "product_variants" CASCADE`;
		await sql`DROP TABLE IF EXISTS "preorder_discounts" CASCADE`;
		await sql`DROP TABLE IF EXISTS "designs" CASCADE`;
		await sql`DROP TABLE IF EXISTS "product_lines" CASCADE`;
		await sql`DROP TABLE IF EXISTS "colors" CASCADE`;
		await sql`DROP TABLE IF EXISTS "users" CASCADE`;
		await sql`DROP TABLE IF EXISTS "role_permissions" CASCADE`;
		await sql`DROP TABLE IF EXISTS "permissions" CASCADE`;
		await sql`DROP TABLE IF EXISTS "roles" CASCADE`;
		await sql`DROP TABLE IF EXISTS "__drizzle_migrations" CASCADE`;
		console.log('All tables dropped successfully.');
	} catch (error) {
		console.error('Error dropping tables:', error);
		process.exit(1);
	}
}

reset();
