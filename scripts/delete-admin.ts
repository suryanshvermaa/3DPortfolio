import { PrismaClient } from "@prisma/client";
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

async function deleteAdmin() {
  try {
    console.log("\n🗑️  Delete Admin User\n");

    // List all admins first
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    if (admins.length === 0) {
      console.log("❌ No admin users found in database");
      process.exit(0);
    }

    console.log("Current admin users:");
    console.log("=".repeat(80));
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. Email: ${admin.email}`);
      console.log(`   ID: ${admin.id}`);
      console.log(`   Created: ${admin.createdAt}`);
      console.log();
    });

    const email = await question("Enter admin email to delete: ");

    if (!email) {
      console.error("❌ Email is required");
      process.exit(1);
    }

    // Check if admin exists
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      console.error(`❌ Admin with email "${email}" not found`);
      process.exit(1);
    }

    // Confirm deletion
    const confirm = await question(
      `⚠️  Are you sure you want to delete admin "${email}"? (yes/no): `
    );

    if (confirm.toLowerCase() !== "yes") {
      console.log("❌ Deletion cancelled");
      process.exit(0);
    }

    // Delete admin
    await prisma.admin.delete({
      where: { email },
    });

    console.log(`\n✅ Admin user "${email}" deleted successfully!\n`);

    // Show remaining admins
    const remainingAdmins = await prisma.admin.count();
    console.log(`📊 Remaining admin users: ${remainingAdmins}\n`);

    if (remainingAdmins === 0) {
      console.log("⚠️  WARNING: No admin users left in database!");
      console.log("💡 Run 'npx tsx scripts/create-admin.ts' to create a new admin\n");
    }
  } catch (error: any) {
    console.error("❌ Error deleting admin:", error.message);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

deleteAdmin();
