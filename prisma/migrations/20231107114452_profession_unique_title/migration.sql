/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Profession` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Profession_title_key" ON "Profession"("title");
