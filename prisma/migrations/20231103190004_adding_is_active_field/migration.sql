/*
  Warnings:

  - You are about to drop the column `availability_staus` on the `Gig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Gig" DROP COLUMN "availability_staus",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- DropEnum
DROP TYPE "AvailabilityStatus";
