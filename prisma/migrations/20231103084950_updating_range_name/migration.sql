/*
  Warnings:

  - You are about to drop the column `availability_range` on the `Gig` table. All the data in the column will be lost.
  - Added the required column `range` to the `Gig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gig" DROP COLUMN "availability_range",
ADD COLUMN     "range" DOUBLE PRECISION NOT NULL;
