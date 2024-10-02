/*
  Warnings:

  - You are about to drop the column `receiverId` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `History` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "History" DROP COLUMN "receiverId",
DROP COLUMN "senderId",
ADD COLUMN     "receivername" TEXT,
ADD COLUMN     "sendername" TEXT;
