/*
  Warnings:

  - You are about to drop the column `reciverId` on the `Chat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[receiverId,senderId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `receiverId` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_reciverId_fkey";

-- DropIndex
DROP INDEX "Chat_reciverId_senderId_key";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "reciverId",
ADD COLUMN     "receiverId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Chat_receiverId_senderId_key" ON "Chat"("receiverId", "senderId");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
