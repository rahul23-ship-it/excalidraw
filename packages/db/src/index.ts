import path from "path";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config({ path: path.join(__dirname, "..", ".env") });

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set");
}

export const prismaClient = new PrismaClient({
	adapter: new PrismaPg({
		connectionString: process.env.DATABASE_URL,
		ssl: { rejectUnauthorized: false },
		connectionTimeoutMillis: 10_000,
	}),
});

export const prisma = prismaClient;

export { PrismaClient };
