/*
  Warnings:

  - You are about to drop the column `userId` on the `admins` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "admins_userId_key";

-- AlterTable
ALTER TABLE "admins" DROP COLUMN "userId";
