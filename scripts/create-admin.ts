import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createAdmin() {
  try {
    console.log("\n🔐 Create Admin User\n");

    const email = await question("Enter admin email: ");
    
    if (!email || !email.includes("@")) {
      console.error("❌ Invalid email address");
      process.exit(1);
    }

    // Check if admin already exists
    const existing = await prisma.admin.findUnique({
      where: { email },
    });

    if (existing) {
      console.error(`❌ Admin with email "${email}" already exists`);
      process.exit(1);
    }

    const password = await question("Enter password: ");

    if (!password || password.length < 6) {
      console.error("❌ Password must be at least 6 characters long");
      process.exit(1);
    }

    const confirmPassword = await question("Confirm password: ");

    if (password !== confirmPassword) {
      console.error("❌ Passwords do not match");
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    console.log("\n✅ Admin user created successfully!");
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🆔 ID: ${admin.id}`);
    console.log(`📅 Created: ${admin.createdAt}\n`);
  } catch (error: any) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createAdmin();
