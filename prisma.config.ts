import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Used by CLI commands (migrate, studio); the app itself connects
    // through the driver adapter in prisma/client.ts.
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed-demo.ts",
  },
});
