/*
  Warnings:

  - You are about to drop the column `catagory` on the `Condition` table. All the data in the column will be lost.
  - Added the required column `category` to the `Condition` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('CHOKING', 'BURNS');

-- AlterTable
ALTER TABLE "Condition" DROP COLUMN "catagory",
ADD COLUMN     "category" "Category" NOT NULL;

-- DropEnum
DROP TYPE "Catagory";
