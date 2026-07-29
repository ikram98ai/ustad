// Browser-safe Prisma exports: model types, enums, and input types only.
// Import the PrismaClient instance from "@/prisma/client" (server-side only);
// importing that file in client components would drag the pg driver into
// browser bundles.
export * from "./generated/browser";
