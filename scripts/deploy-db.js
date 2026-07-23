import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load and parse .env manually
const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
	console.error('Error: .env file not found.');
	process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split(/\r?\n/).forEach((line) => {
	const trimmed = line.trim();
	// Skip comments and empty lines
	if (!trimmed || trimmed.startsWith('#')) return;
	const match = trimmed.match(/^([\w.-]+)\s*=\s*(.*)?$/);
	if (match) {
		const key = match[1];
		let value = match[2] || '';
		// Strip wrapping quotes
		if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
		if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
		env[key] = value;
	}
});

// 2. Validate args
const target = process.argv[2];
if (target !== 'dev' && target !== 'prod') {
	console.error('Usage: node scripts/deploy-db.js <dev|prod>');
	process.exit(1);
}

const dbUrl = (target === 'dev' ? env.DEV_DATABASE_URL : env.DATABASE_URL) || env.DATABASE_URL;

if (!dbUrl) {
	console.error(
		`Error: ${target === 'dev' ? 'DEV_DATABASE_URL' : 'DATABASE_URL'} is not defined in your .env file.`
	);
	process.exit(1);
}

console.log(`========================================`);
console.log(`Starting DB deployment to: ${target.toUpperCase()}`);
console.log(`Target URL: ${dbUrl.split('@')[1] || 'hidden'}`); // Hide credentials in logs
console.log(`========================================`);

try {
	console.log(`Pushing schema changes...`);
	execSync('npx drizzle-kit push --force', {
		env: { ...process.env, DATABASE_URL: dbUrl },
		stdio: 'inherit'
	});
	console.log(`Schema pushed successfully.`);

	// If dev, offer to seed the database
	if (target === 'dev') {
		console.log(`Seeding dev database...`);
		execSync('node scripts/seed-db.js', {
			env: { ...process.env, DATABASE_URL: dbUrl },
			stdio: 'inherit'
		});
		console.log(`Dev database seeded successfully.`);
	}

	console.log(`\n========================================`);
	console.log(`Deployment to ${target.toUpperCase()} completed successfully!`);
	console.log(`========================================`);
} catch (error) {
	console.error(`\nDeployment failed:`, error.message);
	process.exit(1);
}
