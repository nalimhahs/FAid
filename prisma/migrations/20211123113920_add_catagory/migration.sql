/*
  Warnings:

  - Added the required column `catagory` to the `Condition` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Catagory" AS ENUM ('CHOKING', 'BURNS');

-- AlterTable
ALTER TABLE "Condition" ADD COLUMN     "catagory" "Catagory" NOT NULL;
