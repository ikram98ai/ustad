/*
  Warnings:

  - You are about to drop the column `available` on the `Gig` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('ONWORK', 'OFLINE', 'ONLINE');

-- AlterTable
ALTER TABLE "Gig" DROP COLUMN "available",
ADD COLUMN     "availability_staus" "AvailabilityStatus" NOT NULL DEFAULT 'ONLINE';
