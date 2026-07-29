-- AlterTable
ALTER TABLE "Gig" ADD COLUMN     "address" VARCHAR(255),
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "Gig_latitude_longitude_idx" ON "Gig"("latitude", "longitude");
