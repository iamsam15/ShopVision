-- CreateTable
CREATE TABLE "public"."Checkout" (
    "id" BIGINT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "email" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Checkout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Checkout_id_tenantId_key" ON "public"."Checkout"("id", "tenantId");

-- AddForeignKey
ALTER TABLE "public"."Checkout" ADD CONSTRAINT "Checkout_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
