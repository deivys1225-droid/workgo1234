import { PrismaClient } from "@prisma/client";
import { seedDatabase } from "../src/lib/seed-database";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");
  const result = await seedDatabase(prisma);
  console.log("✅ Seed completed!");
  console.log("\n📧 Demo accounts:");
  console.log(`  Empleador: ${result.accounts.employer}`);
  console.log(`  Candidato: ${result.accounts.candidate}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
