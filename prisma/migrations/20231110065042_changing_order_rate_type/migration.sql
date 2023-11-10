/*
  Warnings:

  - You are about to alter the column `rate` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "rate" SET DATA TYPE DOUBLE PRECISION;
