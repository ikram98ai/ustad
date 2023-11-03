-- CreateEnum
CREATE TYPE "Profession" AS ENUM ('ELECTRICIAN', 'PLUMBER', 'MECHANIC', 'TUTOR', 'BARBER', 'LABOUR');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FIX', 'HOURLY', 'DAILY', 'MONTHLY');

-- CreateTable
CREATE TABLE "Gig" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "availability_range" DOUBLE PRECISION NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "job_type" "JobType" NOT NULL DEFAULT 'FIX',
    "profession" "Profession" NOT NULL,

    CONSTRAINT "Gig_pkey" PRIMARY KEY ("id")
);
