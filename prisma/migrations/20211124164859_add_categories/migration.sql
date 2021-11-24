/*
  Warnings:

  - The values [CHOKING] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('RESPIRATORY_FALIURE', 'ANIMAL_BITE', 'ELECTRIC_SHOCK', 'EYE_DAMAGE', 'ACCIDENT', 'CUTS_WOUNDS', 'BURNS', 'FRACTURES');
ALTER TABLE "Condition" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "Category_old";
COMMIT;
