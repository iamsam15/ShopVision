/*
  Warnings:

  - Added the required column `orderCount` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Customer" ADD COLUMN     "orderCount" INTEGER NOT NULL;
